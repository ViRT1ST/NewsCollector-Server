import { z } from 'zod';

import {
  DbUserSchema,
  DbUser,
  DbSourceSchema,
  DbSource,
  // SpiderArticleSchema,
  // SpiderArticle
} from '@/lib/types';

import { ExtendedError } from '@/lib/errors';

function throwError(code: number, message: string): never {
  throw new ExtendedError(code, message);
}

function checkUserIsAdmin(user: DbUser): void | never {
  if (!user.is_admin) {
    throw new ExtendedError(403, 'You do not have permission to this action.');
  }
}

// refactor
function assertAuthData(email: string, password: string) {
  const authSchema = z.object({
    email: z
      .string()
      .trim()
      .email({ message: 'Valid email is required'})
      .min(5, { message: 'Email must be at least 5 characters'}),
    password: z
      .string()
      .trim()
      .min(8, { message: 'Password must be at least 8 characters'})
  });

  const result = authSchema.safeParse({ email, password });

  if (!result.success) {
    // const errorMessages = convertErrorZodResultToMsgArray(result);
    throw new ExtendedError(400, 'Auth data is invalid');
  } else {
    return result.data;
  }
}

function assertString(value: unknown, name: string = 'String'): string | never {
  const result = z.string().trim().safeParse(value);

  if (!result.success) {
    throw new ExtendedError(400, `${name} is invalid.`);
  }
  
  return result.data;
}

function assertNumber(value: unknown, name: string = 'Number'): number | never {
  const result = z.coerce.number().positive().safeParse(value);

  if (!result.success) {
    throw new ExtendedError(400, `${name} is invalid.`);
  }
  
  return result.data;
}

function assertEmail(value: unknown): string | never {
  const result = z.string().trim().email().safeParse(value);

  if (!result.success) {
    throw new ExtendedError(400, 'Email does not meet requirements.');
  }
  
  return result.data;
}

function assertPassword(value: unknown): string | never {
  const result = z.string().trim().min(8).safeParse(value);

  if (!result.success) {
    throw new ExtendedError(400, 'Password does not meet requirements.');
  }

  return result.data;
}

function assertUser(value: unknown): DbUser | never {
  const result = DbUserSchema.safeParse(value);

  if (!result.success) {
    throw new ExtendedError(400, 'User data is invalid.');
  } else {
    return result.data;
  }
}

function assertSource(value: unknown): DbSource | never {
  const result = DbSourceSchema.safeParse(value);

  if (!result.success) {
    throw new ExtendedError(500, 'Invalid source.');
  } else {
    return result.data;
  }
}

function assertArray(value: unknown): any[] | never {
  const result = z.array(z.any()).safeParse(value);

  if (!result.success) {
    throw new ExtendedError(500, 'Invalid array.');
  } else {
    return result.data;
  }
}

// function assertSpiderArticle(value: unknown): SpiderArticle | never {
//   const result = SpiderArticleSchema.safeParse(value);

//   if (!result.success) {
//     throw new ExtendedError(500, 'Invalid article data.');
//   } else {
//     return result.data;
//   }
// }

export default {
  throwError,
  checkUserIsAdmin,
  assertAuthData,
  assertString,
  assertNumber,
  assertEmail,
  assertPassword,
  assertUser,
  assertSource,
  assertArray,
};
