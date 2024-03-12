import { headers } from 'next/headers';
import mongoose from 'mongoose';

import { successResponse, errorResponse } from '@/lib/backend/responses';
import getUserByAuthHeader from '@/lib/backend/auth/get-user';
import Article from '@/lib/backend/db/models/article';
import ET from '@/lib/backend/errors/thrower';

/* =============================================================
Endpoint     : GET /api/articles
Body         : none
Route Params : none
Query Params : find=unreaded|saved
Headers:     : authorization
============================================================= */

export const GET = async (request, { params }) => {
  try {
    // await connectDB();

    const authHeader = headers().get('authorization');
    await ET.checkAuthorizationByAuthHeader(authHeader);

    const user = await getUserByAuthHeader(authHeader);

    const searchParams = request.nextUrl.searchParams;
    const findQuery = searchParams.get('find');

    const arrField = findQuery === 'saved' ? 'savedBy' : 'unreadedBy';
 
    const find = { [arrField]: { $in: user._id } };
    const sort = { site: 'asc', section: 'asc', title: 'asc' };

    const articles = await Article.find(find).limit(100).sort(sort);
    
    return successResponse(200, articles);

  } catch(error) {
    return errorResponse(error);
  }
};

/* =============================================================
Endpoint     : POST /api/articles
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
    ET.checkUserIsAdmin(user);

    const articles = await request.json();

    const requiredFields = ['site', 'section', 'title', 'url', 'sourceId'];
    const allowedFields = ['site', 'section', 'title', 'url', 'sourceId'];

    articles.forEach((article) => {
      const providedFields = Object.keys(article);

      ET.checkRequiredFieldsAreProvided(requiredFields, providedFields);
      ET.checkAlowedFieldsAreProvided(allowedFields, providedFields);

      article.sourceId = new mongoose.Types.ObjectId(`${article.sourceId}`);
    });

    const result = await Article.create(articles);

    return successResponse(201, result);

  } catch(error) {
    return errorResponse(error);
  }
};

/* =============================================================
Endpoint     : DELETE /api/articles
Body         : none
Route Params : none
Query Params : months=number
Headers:     : authorization
============================================================= */

export const DELETE = async (request, { params }) => {
  try {
    // await connectDB();

    const searchParams = request.nextUrl.searchParams;
    const monthsQuery = searchParams.get('months');
    const months = parseInt(monthsQuery, 10);
    ET.checkNumberIsFitting('Number of months', months, 1);

    const authHeader = headers().get('authorization');
    await ET.checkAuthorizationByAuthHeader(authHeader);

    const user = await getUserByAuthHeader(authHeader);
    ET.checkUserIsAdmin(user);

    const unixDate = new Date().setMonth(new Date().getMonth() - months);
    const condition = { createdAt: { $lte: new Date(unixDate) } };
    const { deletedCount } = await Article.deleteMany(condition);

    return successResponse(200, { deletedCount });

  } catch(error) {
    return errorResponse(error);
  }
};