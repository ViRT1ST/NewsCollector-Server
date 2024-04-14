import { headers } from 'next/headers';

import { successResponse, errorResponse } from '@/lib/backend/responses';
import validator from '@/lib/backend/validator';
import pg from '@/lib/backend/postgres';

export const dynamic = 'force-dynamic';

/* =============================================================
Endpoint     : PATCH /api/articles/:id/hide
Query Params : none
Headers:     : authorization
Body         : none
============================================================= */

export const PATCH = async (req: Request, { params }: { params: { id: string } }) => {
  try {
    const authToken = headers().get('authorization');
    const user = await pg.getUserByToken(authToken);

    const articleUuid = validator.assertString(params.id);
    const userUuid = user.uuid;

    await pg.hideArticleFromUser(userUuid, articleUuid);

    return successResponse(200, null);

  } catch (error) {
    return errorResponse(error);
  }
};
