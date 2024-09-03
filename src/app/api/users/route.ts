import { successResponse, errorResponse } from '@/lib/api/responses';
import { convertZodErrorsToMsgArray } from '@/lib/utils/zod';
import { ExtendedError } from '@/lib/errors';
import { AuthFormSchema } from '@/lib/types';
import pg from '@/lib/db/queries';

export const dynamic = 'force-dynamic';

/* =============================================================
Endpoint     : POST /api/users/
Query Params : none
Headers:     : none
Body         : { email, password }
============================================================= */

export const POST = async (req: Request) => {
  try {
    const { email, password } = await req.json();

    const result = AuthFormSchema.safeParse({ email, password });
    if (!result.success) {
      const errorMessages = convertZodErrorsToMsgArray(result);
      throw new ExtendedError(400, errorMessages.join(' | '));
    }

    const existingUser = await pg.getUserByEmail(result.data.email);
    if (existingUser) {
      throw new ExtendedError(400, 'User already exists');
    }

    const user = await pg.createUser(result.data.email, result.data.password);

    const data = {
      user: {
        uuid: user.uuid,
        email: user.email,
        subscriptions: user.subscriptions,
      },
      token: user.tokens[0],
    };

    return successResponse(200, data);

  } catch (error) {
    return errorResponse(error);
  }
};
