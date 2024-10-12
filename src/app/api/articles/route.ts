import { headers } from 'next/headers';
import { NextRequest } from 'next/server';

import { successResponse, errorResponse } from '@/utils/api';
import { ArticleFromSpiderArraySchema, PositiveNumberSchema } from '@/types';
import { ERRORS, FetchError } from '@/utils/errors';

import pg from '@/lib/postgres/queries';

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

    if (!user) {
      throw new FetchError(...ERRORS.invalidToken);
    }

    const isSavedBy = req.nextUrl.searchParams.get('find') === 'saved';
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

    if (!user) {
      throw new FetchError(...ERRORS.invalidToken);
    }

    if (!user.is_admin) {
      throw new FetchError(...ERRORS.notAdmin);
    }

    const articlesArray = await req.json();

    const result = ArticleFromSpiderArraySchema.safeParse(articlesArray);

    if (!result.success) {
      throw new FetchError(...ERRORS.invalidArticles);
    }

    await pg.insertArticles(result.data);

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

    if (!user) {
      throw new FetchError(...ERRORS.invalidToken);
    }

    const months = req.nextUrl.searchParams.get('months');
    const result = PositiveNumberSchema.safeParse(months);

    if (!result.success) {
      throw new FetchError(...ERRORS.invalidParam);
    }

    const count = await pg.deleteOldArticles(result.data);

    return successResponse(200, { deleted_count: count });

  } catch (error) {
    return errorResponse(error);
  }
};