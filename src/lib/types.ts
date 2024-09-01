import { z } from 'zod';

/* =============================================================
Database Full Schemas And Types
============================================================= */

export const DbUserSchema = z.object({
  id: z.number(),
  uuid: z.string(),
  email: z.string(),
  email_lowercase: z.string(),
  password: z.string(),
  is_admin: z.boolean(),
  subscriptions: z.array(z.string()),
  keywords_black: z.array(z.string()),
  keywords_white: z.array(z.string()),
  tokens: z.array(z.string()),
  created_at: z.date(),
  updated_at: z.date(),
});

export type DbUser = z.infer<typeof DbUserSchema>;

export const DbSourceSchema = z.object({
  id: z.number(),
  uuid: z.string(),
  site: z.string(),
  section: z.string(),
  url: z.string(),
  parsing_method: z.string(),
  regex: z.string(),
  remove_in_title: z.string(),
  translate_title: z.boolean(),
  enabled: z.boolean()
});

export type DbSource = z.infer<typeof DbSourceSchema>;

export const DbArticleSchema = z.object({
  id: z.number(),
  uuid: z.string(),
  site: z.string(),
  section: z.string(),
  title: z.string(),
  url: z.string(),
  source_uuid: z.string(),
  unreaded_by: z.array(z.string()),
  saved_by: z.array(z.string()),
  created_at: z.date()
});

export type DbArticle = z.infer<typeof DbArticleSchema>;

/* =============================================================
Other Types
============================================================= */

export const SpiderArticleSchema = z.object({
  url: z.string(),
  title: z.string(),
  site: z.string(),
  section: z.string(),
  source_uuid: z.string()
});

export type SpiderArticle = z.infer<typeof SpiderArticleSchema>;

export type ApiResponse = {
  success: boolean;
  code: number;
  data: object | null;
  message: string | null;
};

export type ArticleAtClient = {
  uuid: string;
  site: string;
  section: string;
  title: string;
  url: string;
  created_at: Date;
};

export type SourceAtClient = {
  uuid: string;
  site: string;
  section: string;
  is_user_subscribed: boolean;
};

export type UserUpdateData = {
  uuid: string;
  new_email?: string | undefined;
  new_password?: string | undefined;
  new_subscriptions?: string[] | undefined;
};

