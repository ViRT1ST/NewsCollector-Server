import { headers } from 'next/headers';

import { successResponse, errorResponse } from '@/lib/api/responses';
import { ExtendedError } from '@/lib/errors';
import { Uuid } from '@/lib/types';
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

    if (!user) {
      throw new ExtendedError(400, 'Invalid token. Please re-authenticate.');
    }

    const result = Uuid.safeParse(params.id);

    if (!result.success) {
      throw new ExtendedError(400, 'Invalid article id');
    }

    await pg.saveArticleForUser(user.uuid, result.data);

    return successResponse(200, null);

  } catch (error) {
    return errorResponse(error);
  }
};
