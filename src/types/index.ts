import { z } from 'zod';
import { asOptionalField } from '@/utils/zod';
import { ERRORS } from '@/utils/errors';

/* =============================================================
Database Tables Schemas & Types
============================================================= */

export type DbUser = {
  id: number;
  uuid: string;
  email: string;
  password: string;
  is_admin: string;
  subscriptions: string[];
  keywords_black: string[];
  keywords_white: string[];
  tokens: string[];
  created_at: Date;
  updated_at: Date;
}

export type DbUserOrUndef = DbUser | undefined;

export type DbSource = {
  id: number;
  uuid: string;
  site: string;
  section: string;
  url: string;
  parsing_method: string;
  regex: string;
  remove_in_title: string;
  translate_title: boolean;
  enabled: boolean;
};

// unused
export type DbArticle = {
  id: number,
  uuid: string,
  site: string,
  section: string,
  title: string,
  url: string,
  source_uuid: string,
  unreaded_by: string[],
  saved_by: string[],
  created_at: Date
};

/* =============================================================
Common
============================================================= */

export const PositiveNumberSchema = z.coerce.number().positive();
export const NonEmptyStringSchema = z.string().min(1);
export const UuidSchema = z.string().uuid();

export type Slug = {
  params: {
    'slug': string
  }
};

export type CatchAllSlug = {
  params: {
    'slug': string[]
  }
};

export type ObjectWithAnyData = {
  [key: string]: any;
};

/* =============================================================
Other
============================================================= */

export const AuthFormSchema = z.object({
  email: z
    .string()
    .trim()
    .email({ message: ERRORS.zodNotEmail[1] })
    .min(5, { message: ERRORS.zodBadEmail[1] }),
  password: z
    .string()
    .trim()
    .min(8, { message: ERRORS.zodBadPassword[1] })
});

export type authForm = z.infer<typeof AuthFormSchema>

export const ArticleFromSpiderSchema = z.object({
  url: z.string(),
  title: z.string(),
  site: z.string(),
  section: z.string(),
  source_uuid: z.string()
});

export const ArticleFromSpiderArraySchema = z.array(ArticleFromSpiderSchema);
export type ArticleFromSpider = z.infer<typeof ArticleFromSpiderSchema>;

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
  created_at: string;
};

export type ArticleAtClientWithDateObject = {
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

export const UpdateUserSchema = z.object({
  uuid: z
    .string(),
  new_email: asOptionalField(z
    .string()
    .trim()
    .email({ message: ERRORS.zodNotEmail[1] })
    .min(5, { message: ERRORS.zodBadEmail[1] })
  ),
  new_password: asOptionalField(z
    .string()
    .trim()
    .min(8, { message: ERRORS.zodBadPassword[1] })
  ),
  new_subscriptions:asOptionalField(z
    .array(z.string())
  )
});

export type UpdateUser = z.infer<typeof UpdateUserSchema>;


