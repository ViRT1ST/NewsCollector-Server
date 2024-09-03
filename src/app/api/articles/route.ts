import { headers } from 'next/headers';
import { NextRequest } from 'next/server';

import { successResponse, errorResponse } from '@/lib/api/responses';
import { ArrayOfArticlesFromSpiderSchema, PositiveNumberSchema } from '@/lib/types';
import { ExtendedError } from '@/lib/errors';

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

    if (!user) {
      throw new ExtendedError(400, 'Invalid token. Please re-authenticate.');
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
      throw new ExtendedError(400, 'Invalid token. Please re-authenticate.');
    }

    if (!user.is_admin) {
      throw new ExtendedError(403, 'You do not have permission to this action.');
    }

    const articlesArray = await req.json();

    const result = ArrayOfArticlesFromSpiderSchema.safeParse(articlesArray);
    if (!result.success) {
      throw new ExtendedError(400, 'Invalid articles array received');
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
      throw new ExtendedError(400, 'Invalid token. Please re-authenticate.');
    }

    const monthsParam = req.nextUrl.searchParams.get('months');

    const result = PositiveNumberSchema.safeParse(monthsParam);

    if (!result.success) {
      throw new ExtendedError(400, 'Invalid months param received');
    }

    const count = await pg.deleteOldArticles(result.data);

    return successResponse(200, { deleted_count: count });

  } catch (error) {
    return errorResponse(error);
  }
};