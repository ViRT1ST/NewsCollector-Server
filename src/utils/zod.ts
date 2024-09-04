import { z } from 'zod';

export function convertZodErrorsToMsgArray(result: any) {
  let errorMessages: string[] = [];

  const errors = result.error.flatten().fieldErrors;

  for (const [fieldName, fieldErrors] of Object.entries(errors) as any) {
    if (Array.isArray(fieldErrors) && fieldErrors.length > 0) {
      errorMessages = [...errorMessages, ...fieldErrors];
    }
  }

  return errorMessages;
}

export function asOptionalField<T extends z.ZodTypeAny>(schema: T) {
  const emptyStringToUndefined = z.literal('').transform(() => undefined);
  return schema.optional().or(emptyStringToUndefined);
}

