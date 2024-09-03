import { headers } from 'next/headers';

import { successResponse, errorResponse } from '@/lib/api/responses';
import { ExtendedError } from '@/lib/errors';
import pg from '@/lib/db/queries';

export const dynamic = 'force-dynamic';

/* =============================================================
Endpoint     : GET /api/sources
Query Params : none
Headers:     : authorization
Body         : none
Comment      : routes for admins only (spider)
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

    const sources = await pg.getSourcesList();

    return successResponse(200, sources);

  } catch (error) {
    return errorResponse(error);
  }
};
