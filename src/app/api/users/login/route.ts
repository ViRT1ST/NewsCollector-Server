import { successResponse, errorResponse } from '@/lib/api/responses';

import jwt from '@/lib/auth/jsonwebtoken';
import bcrypt from '@/lib/auth/bcrypt';
import validator from '@/lib/validator';
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

    const validEmail = validator.assertEmail(email);
    const validPassword = validator.assertPassword(password);

    const user = await pg.getUserByEmail(validEmail);

    bcrypt.checkPassword(validPassword, user.password);

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
