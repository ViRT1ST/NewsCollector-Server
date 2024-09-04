import bcrypt from 'bcryptjs';

import { successResponse, errorResponse } from '@/utils/api';
import { convertZodErrorsToMsgArray } from '@/utils/zod';
import { ERRORS, ExtendedError } from '@/utils/errors';
import { AuthFormSchema } from '@/types';
import jwt from '@/lib/jwt';
import pg from '@/lib/postgres/queries';

export const dynamic = 'force-dynamic';

/* =============================================================
Endpoint     : POST /api/users/login
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
    
    const user = await pg.getUserByEmail(result.data.email);

    if (!user) {
      throw new ExtendedError(...ERRORS.emailNotFound);
    }
 
    const isPasswordMatches = bcrypt.compareSync(result.data.password, user.password);

    if (!isPasswordMatches) {
      throw new ExtendedError(...ERRORS.invalidPassword);
    }

    // all ok, logging in
    const newToken = jwt.generate(user.uuid);
    const updatedTokens = [...user.tokens, newToken];
    await pg.updateUserTokens(user.uuid, updatedTokens);

    const dataToReturn = {
      user: {
        uuid: user.uuid,
        email: user.email,
        subscriptions: user.subscriptions,
      },
      token: newToken
    };

    return successResponse(200, dataToReturn);

  } catch (error) {
    return errorResponse(error);
  }
};
