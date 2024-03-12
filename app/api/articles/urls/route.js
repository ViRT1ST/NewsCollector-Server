import { headers } from 'next/headers';

import { successResponse, errorResponse } from '@/lib/backend/responses';
import getUserByAuthHeader from '@/lib/backend/auth/get-user';
import Article from '@/lib/backend/db/models/article';
import ET from '@/lib/backend/errors/thrower';

/* =============================================================
Endpoint     : GET /api/articles/urls
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

    const articles = await Article.find({}).select('url');
    const urls = articles.map((article) => article.url);

    return successResponse(200, urls);

  } catch(error) {
    return errorResponse(error);
  }
};