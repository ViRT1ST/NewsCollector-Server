import { headers } from 'next/headers';

import { successResponse, errorResponse } from '@/lib/api/responses';
import { ExtendedError } from '@/lib/errors';
import pg from '@/lib/db/queries';

export const dynamic = 'force-dynamic';

/* =============================================================
Endpoint     : POST /api/users/logout-all
Query Params : none
Headers:     : authorization
Body         : none
============================================================= */

export const POST = async () => {
  try {
    const authToken = headers().get('authorization');
    const user = await pg.getUserByToken(authToken);

    if (!user) {
      throw new ExtendedError(400, 'Invalid token. Please re-authenticate.');
    }

    await pg.updateUserTokens(user.uuid, []);

    return successResponse(200, null);

  } catch (error: any) {
    return errorResponse(error);
  }
};
