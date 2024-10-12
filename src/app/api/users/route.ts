import { successResponse, errorResponse } from '@/utils/api';
import { convertZodErrorsToMsgArray } from '@/utils/zod';
import { ERRORS, FetchError } from '@/utils/errors';
import { AuthForm, AuthFormSchema } from '@/types';
import pg from '@/lib/postgres/queries';

export const dynamic = 'force-dynamic';

/* =============================================================
Endpoint     : POST /api/users/
Query Params : none
Headers:     : none
Body         : { email, password }
============================================================= */

export const POST = async (req: Request) => {
  try {
    const body: AuthForm = await req.json();

    const result = AuthFormSchema.safeParse(body);

    if (!result.success) {
      const errorMessages = convertZodErrorsToMsgArray(result);
      throw new FetchError(400, errorMessages.join(' | '));
    }

    const { email, password } = result.data;

    const existingUser = await pg.getUserByEmail(email);
    
    if (existingUser) {
      throw new FetchError(...ERRORS.userAlreadyExists);
    }

    const user = await pg.createUser(email, password);

    const dataToReturn = {
      user: {
        uuid: user.uuid,
        email: user.email,
        subscriptions: user.subscriptions,
      },
      token: user.tokens[0],
    };

    return successResponse(200, dataToReturn);

  } catch (error) {
    return errorResponse(error);
  }
};
