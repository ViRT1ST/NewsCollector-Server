import { headers } from 'next/headers';

import { successResponse, errorResponse } from '@/lib/api/responses';
import { ExtendedError } from '@/lib/errors';
import pg from '@/lib/db/queries';

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
      throw new ExtendedError(400, 'Invalid token. Please re-authenticate.');
    }

    if (!user.is_admin) {
      throw new ExtendedError(403, 'You do not have permission to this action.');
    }

    const urls = await pg.getArticlesUrls();

    return successResponse(200, urls);

  } catch (error: any) {
    return errorResponse(error);
  }
};