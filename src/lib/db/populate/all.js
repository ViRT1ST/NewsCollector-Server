require('dotenv').config();

const { Client } = require('pg');

const client = new Client({
  host: process.env.PG_HOST,
  port: 5432,
  user: process.env.PG_USER,
  password: process.env.PG_PASSWORD,
  database: process.env.PG_DATABASE,
});

const createUsersTableQuery = `
  CREATE TABLE nc_users (
    id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    uuid UUID UNIQUE NOT NULL DEFAULT gen_random_uuid(),
    email TEXT,
    email_lowercase TEXT,
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

const createSpiderAccountQuery = `
  INSERT INTO nc_users (
    uuid,
    email,
    email_lowercase,
    password,
    is_admin
  ) VALUES (
    '7742d292-9d2c-4caa-99c0-74e536f373b1',
    'grogu@gmail.com',
    'grogu@gmail.com',
    '$2b$08$ziTBl.Y9ir6ZX22jil3kSuknYgtumgbHbo9Vm/pPJ51VFjDRAuOXS',
    TRUE
  )
`;

const createSourcesTableQuery = `
  CREATE TABLE nc_sources (
    id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    uuid UUID UNIQUE NOT NULL DEFAULT gen_random_uuid(),
    site TEXT,
    section TEXT,
    url TEXT,
    parsing_method TEXT,
    regex TEXT,
    remove_in_title TEXT,
    translate_title BOOLEAN,
    enabled BOOLEAN
  )
`;

const createSourcesQuery = `
  INSERT INTO nc_sources (
    uuid,
    site,
    section,
    url,
    parsing_method,
    regex,
    remove_in_title,
    translate_title,
    enabled
  ) VALUES (
    'ea12cd10-be78-49f6-b10a-0e1640b8e40f',
    'Tengrinews',
    'Новости',
    'https://tengrinews.kz/',
    'html',
    '^.*?tengrinews.kz/.*?/.*?-\\d{6}/?$',
    '- новости на Tengrinews.kz',
    FALSE,
    TRUE
  ), (
    '749ce078-70c2-46e1-b5e6-98b1dad9a326',
    'Shazoo',
    'Новости',
    'https://shazoo.ru/feed/rss',
    'rss',
    '^.*?shazoo.ru/\\d{4}/\\d{2}/\\d{2}/\\d{6}/.*$',
    '- Shazoo',
    FALSE,
    TRUE
  ), (
    '9d0aee7c-9bb9-450c-b073-28c91289ec8a',
    'Wccftech',
    'News',
    'https://feeds2.feedburner.com/Wccftechcom',
    'rss',
    '^.*?wccftech.com/[a-zA-Z0-9-]{1,200}/$',
    '/ NONE',
    TRUE,
    TRUE
  ), (
    '55a2c33e-dd00-463f-aaaf-911036993274',
    'Kwork',
    'Разработка и IT',
    'https://kwork.ru/projects?c=11',
    'kwork',
    '^.*?kwork.ru/projects/\\d{7}/?$',
    '– Kwork',
    FALSE,
    TRUE
  ), (
    '16cf9dcf-08a9-47c0-a372-8a06b78ef167',
    'Freelancer',
    'Selected Skills',
    'https://www.freelancer.com/jobs/nodejs_windows_web-scraping_javascript_expressjs_api_mongodb/?results=100&languages=en,ru',
    'html',
    '^.*?freelancer.com/projects/.*?/.*?$',
    '| Freelancer',
    FALSE,
    TRUE
  )
`;

const createArticlesTableQuery = `
  CREATE TABLE nc_articles (
    id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    uuid UUID UNIQUE NOT NULL DEFAULT gen_random_uuid(),
    site TEXT,
    section TEXT,
    title TEXT,
    url TEXT,
    source_uuid UUID REFERENCES sources(uuid),
    unreaded_by UUID[] DEFAULT '{}',
    saved_by UUID[] DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
  )
`;

const createDummyArticlesQuery = `
  INSERT INTO nc_articles (
    uuid,
    site,
    section,
    title,
    url,
    source_uuid
  ) VALUES (
    'fafc0472-c90d-4944-92f1-665260fb0bea',
    'Tengrinews',
    'Новости',
    'Потопы и переливы: что происходит на трассах в Казахстане',
    'https://tengrinews.kz/kazakhstan_news/potopyi-i-perelivyi-chto-proishodit-na-trassah-v-kazahstane-531516/',
    'ea12cd10-be78-49f6-b10a-0e1640b8e40f'
  ), (
    'f6895ad7-051e-4aa6-9a37-3346ac97af47',
    'Wccftech',
    'News',
    'Sea of Thieves PS5 Version “Key Test” For Other Xbox Exclusives Coming to Rival Platforms, The Verge Says',
    'https://wccftech.com/sea-of-thieves-ps5-xbox-exclusives/',
    '9d0aee7c-9bb9-450c-b073-28c91289ec8a'
  )
`;

async function run() {
  await client.connect();

  await client.query(createUsersTableQuery);
  await client.query(createSpiderAccountQuery);

  await client.query(createSourcesTableQuery);
  await client.query(createSourcesQuery);

  await client.query(createArticlesTableQuery);
  await client.query(createDummyArticlesQuery);

  await client.end();
}

run();
