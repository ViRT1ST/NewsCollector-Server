import { headers } from 'next/headers';

import { successResponse, errorResponse } from '@/lib/backend/responses';
import { cleanToken } from '@/lib/backend/auth/jwt-utils';
import getUserByAuthHeader from '@/lib/backend/auth/get-user';
import ET from '@/lib/backend/errors/thrower';

/* =============================================================
Endpoint     : POST /api/users/logout
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

    const token = cleanToken(authHeader);

    const user = await getUserByAuthHeader(authHeader);

    user.tokens = user.tokens.filter((item) => item !== token);
    await user.save();
    
    return successResponse(200, null);

  } catch(error) {
    return errorResponse(error);
  }
};
