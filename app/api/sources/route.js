import { headers } from 'next/headers';

import { successResponse, errorResponse } from '@/lib/backend/responses';
import getUserByAuthHeader from '@/lib/backend/auth/get-user';
import Source from '@/lib/backend/db/models/source';
import ET from '@/lib/backend/errors/thrower';

/* =============================================================
Endpoint     : GET /api/sources
Body         : none
Route Params : none
Query Params : none
Headers:     : authorization
============================================================= */

export const GET = async (request, { params }) => {
  try {
    // await connectDB();

    const authHeader = headers().get('authorization');
    await ET.checkAuthorizationByAuthHeader(authHeader);

    const user = await getUserByAuthHeader(authHeader);

    ET.checkUserIsAdmin(user);

    const find = { enabled: true };
    const sort = { site: 'asc', section: 'asc' };
    const sources = await Source.find(find).sort(sort);

    return successResponse(200, sources);

  } catch(error) {
    return errorResponse(error);
  }
};