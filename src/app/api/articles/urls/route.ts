import { headers } from 'next/headers';

import { successResponse, errorResponse } from '@/utils/api';
import { ERRORS, FetchError } from '@/utils/errors';
import pg from '@/lib/postgres/queries';

export const dynamic = 'force-dynamic';

/* =============================================================
Endpoint     : GET /api/articles/urls
Query Params : none
Headers:     : authorization
Body         : none
============================================================= */

export const GET = async () => {
  try {
    const authToken = headers().get('authorization');
    const user = await pg.getUserByToken(authToken);

    if (!user) {
      throw new FetchError(...ERRORS.invalidToken);
    }

    if (!user.is_admin) {
      throw new FetchError(...ERRORS.notAdmin);
    }

    const urls = await pg.getArticlesUrls();

    return successResponse(200, urls);

  } catch (error) {
    return errorResponse(error);
  }
};