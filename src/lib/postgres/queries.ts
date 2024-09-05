import { v4 as uuidv4 } from 'uuid';
import bcrypt from 'bcryptjs';

import type {
  DbUser,
  DbUserOrUndef,
  DbSource,
  UpdateUser,
  ArticleFromSpider,
} from '@/types';
import jwt from '@/lib/jwt';
import executeQuery from './executor';

async function createUser(email: string, password: string) {
  const uuid = uuidv4();
  const token = jwt.generate(uuid);
  const hashedPassword = await bcrypt.hash(password, 8);

  const query = `
    INSERT INTO nc_users (uuid, email, email_lowercase, password, tokens)
    VALUES ($1, $2, LOWER($2), $3, ARRAY [$4])
    RETURNING *
  `;
  
   const { rows } = await executeQuery(query, [uuid, email, hashedPassword, token]);
   return rows[0] as DbUser;
}

async function getUserByEmail(email: string) {
  const query = `
    SELECT *
    FROM nc_users
    WHERE email_lowercase = LOWER($1)
    LIMIT 1
  `;

  const { rows } = await executeQuery(query, [email]);
  return rows[0] as DbUserOrUndef;
}

async function getUserByToken(token: unknown) {
  const strippedToken = jwt.stripToken(token);

  const { uuid } = jwt.verifyAndGetPayload(strippedToken);

  const query = `
    SELECT *
    FROM nc_users
    WHERE uuid = $1 AND $2 = ANY(tokens)
    LIMIT 1
  `;

  const { rows } = await executeQuery(query, [uuid, strippedToken]);
  return rows[0] as DbUserOrUndef;
}

async function updateUserTokens(userUuid: string, tokens: string[]) {
  let updatedTokens: string[];

  if (tokens.length > 10) {
    const beginIndex = tokens.length - 10;
    const endIndex = tokens.length;
    updatedTokens = tokens.slice(beginIndex, endIndex);
  } else {
    updatedTokens = tokens;
  }

  const query = `
    UPDATE nc_users
    SET updated_at = NOW(), tokens = $2
    WHERE uuid = $1
  `;

  await executeQuery(query, [userUuid, updatedTokens] as any);
}

async function updateUser(data: UpdateUser) {
  const { uuid, new_email, new_password, new_subscriptions = [] } = data;

  const paramsForSet: string[] = [];
  const paramsToPass: any[] = [uuid];

  const addParam = (field: string, value: any) => {
    paramsForSet.push(`${field} = $${paramsForSet.length + 2}`);
    paramsToPass.push(value);
  };

  new_email && addParam('email', new_email);
  new_email && addParam('email_lowercase', new_email.toLowerCase());
  new_password && addParam('password', await bcrypt.hash(new_password, 8));
  new_subscriptions && addParam('subscriptions', new_subscriptions);

  const query = `
    UPDATE nc_users
    SET updated_at = NOW(), ${paramsForSet.join(', ')}
    WHERE uuid = $1
  `;

  await executeQuery(query, paramsToPass);
}

async function deleteUser(userUuid: string) {
  const cleanArticlesQuery = `
    UPDATE nc_articles
    SET unreaded_by = ARRAY_REMOVE(unreaded_by, $1), saved_by = ARRAY_REMOVE(saved_by, $1)
  `;

  const deleteUserQuery = `
    DELETE FROM nc_users
    WHERE uuid = $1
  `;

  await executeQuery(cleanArticlesQuery, [userUuid]);
  await executeQuery(deleteUserQuery, [userUuid]);
}

async function getSourcesList() {
  const query = `
    SELECT uuid, site, section, url, parsing_method, regex, remove_in_title, translate_title
    FROM nc_sources
    WHERE enabled = TRUE
    ORDER BY site, section
  `;

  const { rows } = await executeQuery(query);
  return rows as DbSource[];
}

async function getArticlesUrls() {
  const query = `
    SELECT url
    FROM nc_articles
  `;

  const { rows } = await executeQuery(query);
  return rows.map((item: { url: string }) => item.url);
}

async function getArticlesForUser(userUuid: string, isSavedBy: boolean) {
  const query = `
    SELECT uuid, site, section, title, url, created_at 
    FROM nc_articles
    WHERE $1 = ANY(${isSavedBy ? 'saved_by' : 'unreaded_by'})
    ORDER BY site, section, title
    LIMIT 50;
  `;

  const { rows } = await executeQuery(query, [userUuid]);
  return rows as any[];  
}

async function insertArticles(array: ArticleFromSpider[]) {
  const query = `
    INSERT INTO nc_articles (url, title, site, section, source_uuid, unreaded_by)
    SELECT url, title, site, section, source_uuid, (
      SELECT ARRAY(
        SELECT uuid
        FROM nc_users
        WHERE source_uuid = ANY(subscriptions)
      )
    ) AS unreaded_by
    FROM json_populate_recordset(NULL::nc_articles, $1);
  `;

  await executeQuery(query, [JSON.stringify(array)]);
}

async function deleteOldArticles(olderThanMonths: number) {
  const query = `
    DELETE
    FROM nc_articles
    WHERE EXTRACT(EPOCH FROM created_at) < (EXTRACT(EPOCH FROM NOW()) - 2592000 * $1)
  `;

  const { rowCount } = await executeQuery(query, [olderThanMonths]);
  return rowCount;
}

async function hideArticleFromUser(userUuid: string, articleUuid: string) {
  const query = `
    UPDATE nc_articles
    SET unreaded_by = ARRAY_REMOVE(unreaded_by, $1), saved_by = ARRAY_REMOVE(saved_by, $1)
    WHERE uuid = $2
  `;

  await executeQuery(query, [userUuid, articleUuid]);
}

async function saveArticleForUser(userUuid: string, articleUuid: string) {
  const query = `
    UPDATE nc_articles
    SET unreaded_by = ARRAY_REMOVE(unreaded_by, $1), saved_by = ARRAY_APPEND(saved_by, $1)
    WHERE uuid = $2
  `;

  await executeQuery(query, [userUuid, articleUuid]);
}

export default {
  createUser,
  getUserByEmail,
  getUserByToken,
  updateUserTokens,
  updateUser,
  deleteUser,
  getSourcesList,
  getArticlesUrls,
  getArticlesForUser,
  insertArticles,
  deleteOldArticles,
  hideArticleFromUser,
  saveArticleForUser
};

