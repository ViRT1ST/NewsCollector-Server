import { headers } from 'next/headers';

import { successResponse, errorResponse } from '@/lib/backend/responses';
import jwt from '@/lib/backend/utils/jsonwebtoken';
import pg from '@/lib/backend/postgres';

export const dynamic = 'force-dynamic';

/* =============================================================
Endpoint     : POST /api/users/logout
Query Params : none
Headers:     : authorization
Body         : none
============================================================= */

export const POST = async () => {
  try {
    const authToken = headers().get('authorization');
    const user = await pg.getUserByToken(authToken);

    const token = jwt.sanitize(authToken);

    const updatedTokens = user.tokens.filter((item) => item !== token);
    await pg.updateUserTokens(user.uuid, updatedTokens);

    return successResponse(200, null);

  } catch (error: any) {
    return errorResponse(error);
  }
};
