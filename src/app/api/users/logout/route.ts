import { headers } from 'next/headers';
import { NextRequest } from 'next/server';

import { successResponse, errorResponse } from '@/utils/api';
import { ERRORS, FetchError } from '@/utils/errors';
import jwt from '@/lib/jwt';
import pg from '@/lib/postgres/queries';

export const dynamic = 'force-dynamic';

/* =============================================================
Endpoint     : POST /api/users/logout
Query Params : all=true
Headers:     : authorization
Body         : none
============================================================= */

export const POST = async (req: NextRequest) => {
  try {
    const authToken = headers().get('authorization');
    const user = await pg.getUserByToken(authToken);

    if (!user) {
      throw new FetchError(...ERRORS.invalidToken);
    }

    const isNeedLogoutFromAllDevices = req.nextUrl.searchParams.get('all') === 'true';

    if (isNeedLogoutFromAllDevices) {
      await pg.updateUserTokens(user.uuid, []);

    } else {
      const currentToken = jwt.stripToken(authToken);
      const updatedTokens = user.tokens.filter((item) => item !== currentToken);
      
      await pg.updateUserTokens(user.uuid, updatedTokens);
    }

    return successResponse(200, null);

  } catch (error) {
    return errorResponse(error);
  }
};
