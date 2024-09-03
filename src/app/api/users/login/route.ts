import bcrypt from 'bcryptjs';

import { successResponse, errorResponse } from '@/lib/api/responses';
import { convertZodErrorsToMsgArray } from '@/lib/utils/zod';
import { ExtendedError } from '@/lib/errors';
import { AuthFormSchema } from '@/lib/types';
import jwt from '@/lib/auth/jwt';
import pg from '@/lib/db/queries';

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
      throw new ExtendedError(404, 'User with this email not exist');
    }
 
    const isPasswordMatches = bcrypt.compareSync(result.data.password, user.password);
    if (!isPasswordMatches) {
      throw new ExtendedError(400, 'Invalid password');
    }

    // all ok, logging in
    const newToken = jwt.generate(user.uuid);
    const updatedTokens = [...user.tokens, newToken];
    await pg.updateUserTokens(user.uuid, updatedTokens);

    const data = {
      user: {
        uuid: user.uuid,
        email: user.email,
        subscriptions: user.subscriptions,
      },
      token: newToken
    };

    return successResponse(200, data);

  } catch (error) {
    return errorResponse(error);
  }
};
