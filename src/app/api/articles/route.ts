import { headers } from 'next/headers';
import { NextRequest } from 'next/server';

import { successResponse, errorResponse } from '@/lib/api/responses';
import validator from '@/lib/validator';
import pg from '@/lib/db/queries';

export const dynamic = 'force-dynamic';

/* =============================================================
Endpoint     : GET /api/articles
Query Params : find=unreaded|saved
Headers:     : authorization
Body         : none
============================================================= */

export const GET = async (req: NextRequest) => {
  try {
    const authToken = headers().get('authorization');
    const user = await pg.getUserByToken(authToken);

    const searchParams = req.nextUrl.searchParams;
    const isSavedBy = searchParams.get('find') === 'saved';
    
    const articles = await pg.getArticlesForUser(user.uuid, isSavedBy);
    
    return successResponse(200, articles);

  } catch (error) {
    return errorResponse(error);
  }
};

/* =============================================================
Endpoint     : POST /api/articles
Query Params : none
Headers:     : authorization
Body         : none
============================================================= */

export const POST = async (req: Request) => {
  try {
    const authToken = headers().get('authorization');
    const user = await pg.getUserByToken(authToken);

    validator.checkUserIsAdmin(user);

    const body = await req.json();

    const array = validator.assertArray(body);
    const articles = array.map((item) => validator.assertSpiderArticle(item));

    await pg.insertArticles(articles);

    return successResponse(201, null);

  } catch (error) {
    return errorResponse(error);
  }
};

/* =============================================================
Endpoint     : DELETE /api/articles
Query Params : months=number
Headers:     : authorization
Body         : none
============================================================= */

export const DELETE = async (req: NextRequest) => {
  try {
    const authToken = headers().get('authorization');
    const user = await pg.getUserByToken(authToken);

    validator.checkUserIsAdmin(user);

    const searchParams = req.nextUrl.searchParams;
    const monthsParam = searchParams.get('months');
    const months = validator.assertNumber(monthsParam);

    const count = await pg.deleteOldArticles(months);

    return successResponse(200, { deleted_count: count });

  } catch (error) {
    return errorResponse(error);
  }
};