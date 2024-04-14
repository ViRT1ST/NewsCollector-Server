import { headers } from 'next/headers';

import { successResponse, errorResponse } from '@/lib/backend/responses';
import validator from '@/lib/backend/validator';
import pg from '@/lib/backend/postgres';

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

    validator.checkUserIsAdmin(user);

    const urls = await pg.getArticlesUrls();

    return successResponse(200, urls);

  } catch (error: any) {
    return errorResponse(error);
  }
};