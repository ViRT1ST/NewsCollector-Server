import { headers } from 'next/headers';

import { successResponse, errorResponse } from '@/utils/api';
import { ERRORS, ExtendedError } from '@/utils/errors';
import pg from '@/lib/postgres/queries';

export const dynamic = 'force-dynamic';

/* =============================================================
Endpoint     : GET /api/sources
Query Params : none
Headers:     : authorization
Body         : none
============================================================= */

export const GET = async () => {
  try {
    const authToken = headers().get('authorization');
    const user = await pg.getUserByToken(authToken);

    if (!user) {
      throw new ExtendedError(...ERRORS.invalidToken);
    }

    if (!user.is_admin) {
      throw new ExtendedError(...ERRORS.notAdmin);
    }

    const sources = await pg.getSourcesList();

    return successResponse(200, sources);

  } catch (error) {
    return errorResponse(error);
  }
};
