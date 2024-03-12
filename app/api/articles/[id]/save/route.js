import { headers } from 'next/headers';

import { successResponse, errorResponse } from '@/lib/backend/responses';
import getUserByAuthHeader from '@/lib/backend/auth/get-user';
import Article from '@/lib/backend/db/models/article';
import ExtendedError from '@/lib/backend/errors/extended-error';
import ET from '@/lib/backend/errors/thrower';

/* =============================================================
Endpoint     : PATCH /api/articles/:id/save
Body         : none
Route Params : id
Query Params : none
Headers:     : authorization
============================================================= */

export const PATCH = async (request, { params }) => {
  try {
    // await connectDB();

    const authHeader = headers().get('authorization');
    await ET.checkAuthorizationByAuthHeader(authHeader);

    const user = await getUserByAuthHeader(authHeader);

    const messageId = params.id;
    const userId = user._id;

    // remove user id from unreadedBy and add it to savedBy
    const update = {
      $pull: { unreadedBy: userId },
      $addToSet: { savedBy: userId }
    };
    const article = await Article.findByIdAndUpdate(messageId, update);

    if (!article) {
      throw new ExtendedError(404, 'Article not found');
    }
    
    return successResponse(200, null);

  } catch(error) {
    return errorResponse(error);
  }
};

