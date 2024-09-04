// Don't import this file into client components

export const IS_DEV_MODE = process.env.NEXT_PUBLIC_IS_DEVELOPMENT_MODE === 'true';

export const PG_LOCAL_CONFIG = {
  host: process.env.PG_LOCAL_HOST,
  port: 5432,
  user: process.env.PG_LOCAL_USER,
  password: process.env.PG_LOCAL_PASSWORD,
  database: process.env.PG_LOCAL_DATABASE,
};

export const JWT_SECRET = process.env.JWT_SECRET as string;
export const JWT_EXP_SECONDS = process.env.JWT_EXP_SECONDS as string;
