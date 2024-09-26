import { v4 as uuidv4 } from 'uuid';
import bcrypt from 'bcryptjs';

import type {
  DbUser,
  DbUserOrUndef,
  DbSource,
  UpdateUser,
  ArticleFromSpider,
} from '@/types';
import { defaultSources } from './populate/sources';
import { defaultUsers } from './populate/users';
import { defaultArticles } from './populate/articles';
import { createQueryToPopulateTable } from '@/utils/postgres';
import jwt from '@/lib/jwt';
import executeQuery from './executor';

/* =============================================================
Create or clear tables
============================================================= */

async function createUsersTable() {
  const query = `
    CREATE TABLE IF NOT EXISTS nc_users (
      id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
      uuid UUID UNIQUE NOT NULL DEFAULT gen_random_uuid(),
      email TEXT,
      password TEXT,
      is_admin BOOLEAN DEFAULT FALSE,
      subscriptions UUID[] DEFAULT '{}',
      keywords_black TEXT[] DEFAULT '{}',
      keywords_white TEXT[] DEFAULT '{}',
      tokens TEXT[] DEFAULT '{}',
      created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
    )
  `;

  await executeQuery(query);
}

async function clearUsersTable() {
  const query = `TRUNCATE nc_users;`;
  await executeQuery(query);
}

async function createSourcesTable() {
  const query = `
    CREATE TABLE IF NOT EXISTS nc_sources (
      id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
      uuid UUID UNIQUE NOT NULL DEFAULT gen_random_uuid(),
      site TEXT,
      section TEXT,
      url TEXT,
      parsing_method TEXT,
      regex TEXT,
      keywords_policy TEXT DEFAULT NULL,
      remove_in_title TEXT,
      translate_title BOOLEAN,
      enabled BOOLEAN
    )
  `;

  await executeQuery(query);
}

async function clearSourcesTable() {
  const query = `TRUNCATE nc_sources CASCADE;`;
  await executeQuery(query);
}

async function createArticlesTable() {
  const query = `
    CREATE TABLE IF NOT EXISTS nc_articles (
      id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
      uuid UUID UNIQUE NOT NULL DEFAULT gen_random_uuid(),
      site TEXT,
      section TEXT,
      title TEXT,
      url TEXT,
      source_uuid UUID REFERENCES nc_sources(uuid),
      unreaded_by UUID[] DEFAULT '{}',
      saved_by UUID[] DEFAULT '{}',
      created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
    )
  `;

  await executeQuery(query);
}

async function clearArticlesTable() {
  const query = `TRUNCATE nc_articles;`;
  await executeQuery(query);
}


/* =============================================================
Operations with users
============================================================= */

async function createUser(email: string, password: string) {
  const uuid = uuidv4();
  const token = jwt.generate(uuid);
  const hashedPassword = await bcrypt.hash(password, 8);

  const query = `
    INSERT INTO nc_users (uuid, email, password, tokens)
    VALUES ($1, $2, $3, ARRAY [$4])
    RETURNING *
  `;
  
   const { rows } = await executeQuery(query, [uuid, email, hashedPassword, token]);
   return rows[0] as DbUser;
}

async function getUserByEmail(email: string) {
  const query = `
    SELECT *
    FROM nc_users
    WHERE LOWER(email) = LOWER($1)
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

/* =============================================================
Operations with sources
============================================================= */

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

/* =============================================================
Operations with articles
============================================================= */

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
        AND NOT EXISTS (
            SELECT 1
            FROM unnest(keywords_black) AS keyword
            WHERE lower(title) LIKE '%' || lower(keyword) || '%'
        )
        AND NOT EXISTS (
            SELECT 1
            FROM unnest(keywords_black) AS keyword
            WHERE lower(url) LIKE '%' || lower(keyword) || '%'
        )
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

/* =============================================================
Reset tables for demo
============================================================= */

async function resetTables() {
  try {
    await createUsersTable();
    await clearUsersTable();
    await createSourcesTable();
    await clearSourcesTable();
    await createArticlesTable();
    await clearArticlesTable();

    const usersQuery = createQueryToPopulateTable(defaultUsers, 'nc_users');
    await executeQuery(usersQuery);
    const sourcesQuery = createQueryToPopulateTable(defaultSources, 'nc_sources');
    await executeQuery(sourcesQuery);
    const articlesQuery = createQueryToPopulateTable(defaultArticles, 'nc_articles');
    await executeQuery(articlesQuery);

  } catch (error: any) {
    console.log(error);
  }
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
  saveArticleForUser,
  resetTables
};

