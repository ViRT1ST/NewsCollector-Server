// Don't import this file into client components

export const IS_DEV_MODE = process.env.NEXT_PUBLIC_IS_DEVELOPMENT_MODE === 'true';

export const PG_DEV_CONFIG = {
  host: process.env.PG_DEV_HOST,
  port: 5432,
  user: process.env.PG_DEV_USER,
  password: process.env.PG_DEV_PASSWORD,
  database: process.env.PG_DEV_DATABASE,
};
