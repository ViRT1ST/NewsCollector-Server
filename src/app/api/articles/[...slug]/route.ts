import { headers } from 'next/headers';

import { successResponse, errorResponse } from '@/utils/api';
import { ERRORS, ExtendedError } from '@/utils/errors';
import { CatchAllSlug } from '@/types';
import pg from '@/lib/postgres/queries';

export const dynamic = 'force-dynamic';

/* =============================================================
Endpoint     : PATCH /api/articles/:id/:hide|save
Query Params : none
Headers:     : authorization
Body         : none
============================================================= */

export const PATCH = async (req: Request, { params }: CatchAllSlug) => {
  try {
    const authToken = headers().get('authorization');
    const user = await pg.getUserByToken(authToken);

    if (!user) {
      throw new ExtendedError(...ERRORS.invalidToken);
    }

    const [ articleUuid, articleAction ] = params.slug;

    if (articleAction === 'hide') {
      await pg.hideArticleFromUser(user.uuid, articleUuid);
    } else {
      await pg.saveArticleForUser(user.uuid, articleUuid);
    }

    return successResponse(200, null);

  } catch (error) {
    return errorResponse(error);
  }
};
