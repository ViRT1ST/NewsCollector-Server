import { v4 as uuidv4 } from 'uuid';
import { Pool } from 'pg';

import { DbSource, DbUser, UserUpdateData, SpiderArticle } from '@/lib/types';
import bcrypt from '@/lib/backend/utils/bcrypt';
import jwt from '@/lib/backend/utils/jsonwebtoken';
import validator from '@/lib/backend/validator';

const pool = new Pool({
  host: process.env.PG_HOST,
  port: 5432,
  user: process.env.PG_USER,
  password: process.env.PG_PASSWORD,
  database: process.env.PG_DATABASE,
});

async function createUser(email: string, password: string): Promise<void | never> {
  await checkEmailIsNotExist(email);

  const uuid = uuidv4();
  const token = jwt.generate(uuid);
  const hashedPassword = await bcrypt.hashPassword(password);

  const query = `
    INSERT INTO users (uuid, email, email_lowercase, password, tokens)
    VALUES ($1, $2, LOWER($2), $3, ARRAY [$4])
  `;
  
  await pool.query(query, [uuid, email, hashedPassword, token]);
}

async function getUserByEmail(email: string): Promise<DbUser | never> {
  const query = `
    SELECT *
    FROM users
    WHERE email_lowercase = LOWER($1)
    LIMIT 1
  `;

  const { rows } = await pool.query(query, [email]);
  const user = validator.assertUser(rows[0]);

  return user;
}

async function checkEmailIsNotExist(email: string): Promise<void | never> {
  const query = `
    SELECT email_lowercase
    FROM users
    WHERE email_lowercase = LOWER($1)
    LIMIT 1
  `;

  const { rows } = await pool.query(query, [email]);

  if (rows[0]) {
    validator.throwError(400, 'This email is already associated with an account.');
  }
}

async function getUserByToken(token: unknown): Promise<DbUser | never> {
  const sanitizedToken = jwt.sanitize(token);

  const { uuid } = jwt.verifyAndGetPayload(sanitizedToken);

  const query = `
    SELECT *
    FROM users
    WHERE uuid = $1 AND $2 = ANY(tokens)
    LIMIT 1
  `;

  const { rows } = await pool.query(query, [uuid, sanitizedToken]);

  if (rows.length === 0) {
    validator.throwError(400, 'Invalid token. Please re-authenticate.');
  }

  const user = validator.assertUser(rows[0]);

  return user;
}

async function updateUserTokens(userUuid: string, tokens: string[]): Promise<void> {
  let checkedTokens = tokens.filter((token) => jwt.isValid(token));

  if (checkedTokens.length > 10) {
    const beginIndex = checkedTokens.length - 10;
    const endIndex = checkedTokens.length;
    checkedTokens = checkedTokens.slice(beginIndex, endIndex);
  }

  const query = `
    UPDATE users
    SET updated_at = NOW(), tokens = $2
    WHERE uuid = $1
  `;

  await pool.query(query, [userUuid, checkedTokens] as any);
}

async function updateUser(data: UserUpdateData): Promise<void> {
  const { uuid, new_email, new_password, new_subscriptions } = data;

  const paramsForSet: string[] = [];
  const paramsToPass: any[] = [uuid];

  const addParam = (field: string, value: any) => {
    paramsForSet.push(`${field} = $${paramsForSet.length + 2}`);
    paramsToPass.push(value);
  };

  new_email && addParam('email', new_email);
  new_email && addParam('email_lowercase', new_email.toLowerCase());
  new_password && addParam('password', await bcrypt.hashPassword(new_password));
  new_subscriptions && addParam('subscriptions', new_subscriptions);

  const query = `
    UPDATE users
    SET updated_at = NOW(), ${paramsForSet.join(', ')}
    WHERE uuid = $1
  `;

  await pool.query(query, paramsToPass);
}

async function deleteUser(userUuid: string): Promise<void> {
  const cleanArticlesQuery = `
    UPDATE articles
    SET unreaded_by = ARRAY_REMOVE(unreaded_by, $1), saved_by = ARRAY_REMOVE(saved_by, $1);
  `;

  await pool.query(cleanArticlesQuery, [userUuid]);

  const deleteUserQuery = `
    DELETE FROM users
    WHERE uuid = $1
  `;

  await pool.query(deleteUserQuery, [userUuid]);
}

async function getSourcesList(): Promise<DbSource[] | never> {
  const query = `
    SELECT uuid, site, section, url, parsing_method, regex, remove_in_title, translate_title
    FROM sources
    WHERE enabled = TRUE
    ORDER BY site, section
  `;

  const { rows } = await pool.query(query);
  const sources = rows as DbSource[];

  return sources;
}

async function getArticlesUrls(): Promise<string[] | never> {
  const query = `
    SELECT url
    FROM articles
  `;

  const { rows } = await pool.query(query);
  const sources = rows.map((item) => item.url) as string[];

  return sources;
}

async function getArticlesForUser(userUuid: string, isSavedBy: boolean): Promise<any[] | never> {
  const query = `
    SELECT uuid, site, section, title, url, created_at 
    FROM articles
    WHERE $1 = ANY(${isSavedBy ? 'saved_by' : 'unreaded_by'})
    ORDER BY site, section, title
    LIMIT 100;
  `;

  const { rows } = await pool.query(query, [userUuid]);
  const articles = rows as any[];

  return articles;
}

async function insertArticles(array: SpiderArticle[]): Promise<void | never> {
  const query = `
    INSERT INTO articles (url, title, site, section, source_uuid, unreaded_by)
    SELECT url, title, site, section, source_uuid, (
      SELECT ARRAY(
        SELECT uuid
        FROM users
        WHERE source_uuid = ANY(subscriptions)
      )
    ) AS unreaded_by
    FROM json_populate_recordset(NULL::articles, $1);
  `;

  await pool.query(query, [JSON.stringify(array)]);
}

async function deleteOldArticles(olderThanMonths: number): Promise<any | never> {
  const query = `
    DELETE
    FROM articles
    WHERE EXTRACT(EPOCH FROM created_at) < (EXTRACT(EPOCH FROM NOW()) - 2592000 * $1)
  `;

  const { rowCount } = await pool.query(query, [olderThanMonths]);

  return rowCount;
}

async function hideArticleFromUser(userUuid: string, articleUuid: string): Promise<void | never> {
  const query = `
    UPDATE articles
    SET unreaded_by = ARRAY_REMOVE(unreaded_by, $1), saved_by = ARRAY_REMOVE(saved_by, $1)
    WHERE uuid = $2
  `;

  await pool.query(query, [userUuid, articleUuid]);
}

async function saveArticleForUser(userUuid: string, articleUuid: string): Promise<void | never> {
  const query = `
    UPDATE articles
    SET unreaded_by = ARRAY_REMOVE(unreaded_by, $1), saved_by = ARRAY_APPEND(saved_by, $1)
    WHERE uuid = $2
  `;

  await pool.query(query, [userUuid, articleUuid]);
}

export default {
  createUser,
  getUserByEmail,
  checkEmailIsNotExist,
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

