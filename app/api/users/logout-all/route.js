import { headers } from 'next/headers';

import { successResponse, errorResponse } from '@/lib/backend/responses';
import getUserByAuthHeader from '@/lib/backend/auth/get-user';
import ET from '@/lib/backend/errors/thrower';

/* =============================================================
Endpoint     : POST /api/users/logout-all
Body         : none
Route Params : none
Query Params : none
Headers:     : authorization
============================================================= */

export const POST = async (request, { params }) => {
  try {
    // await connectDB();

    const authHeader = headers().get('authorization');
    await ET.checkAuthorizationByAuthHeader(authHeader);

    const user = await getUserByAuthHeader(authHeader);

    user.tokens = [];
    await user.save();
    
    return successResponse(200, null);

  } catch(error) {
    return errorResponse(error);
  }
};
