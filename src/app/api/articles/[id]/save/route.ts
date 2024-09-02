import { headers } from 'next/headers';

import { successResponse, errorResponse } from '@/lib/api/responses';
import validator from '@/lib/validator';
import pg from '@/lib/db/queries';

export const dynamic = 'force-dynamic';

/* =============================================================
Endpoint     : PATCH /api/articles/:id/save
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

    await pg.saveArticleForUser(userUuid, articleUuid);

    return successResponse(200, null);

  } catch (error) {
    return errorResponse(error);
  }
};
