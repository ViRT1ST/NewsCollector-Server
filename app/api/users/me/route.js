import { headers } from 'next/headers';
import mongoose from 'mongoose';

import { successResponse, errorResponse } from '@/lib/backend/responses';
import getUserByAuthHeader from '@/lib/backend/auth/get-user';
import Article from '@/lib/backend/db/models/article';
import Source from '@/lib/backend/db/models/source';
import User from '@/lib/backend/db/models/user';
import ET from '@/lib/backend/errors/thrower';

/* =============================================================
Endpoint     : GET /api/users/me
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

    const { email, _id: userId, subscriptions: userSubscriptions } = user;

    const find = { enabled: true };
    const sort = { site: 'asc', section: 'asc' };
    const enabledSources = await Source.find(find).sort(sort);

    const sources = enabledSources.map(({ _id, site, section }) => ({
      _id,
      site,
      section,
      isUserSubscribed: userSubscriptions.includes(_id) 
    }));

    return successResponse(200, { _id: userId, email, sources });

  } catch(error) {
    return errorResponse(error);
  }
};

/* =============================================================
Endpoint     : PATCH /api/users/me
Body         : none
Route Params : none
Query Params : none
Headers:     : authorization
============================================================= */

export const PATCH = async (request, { params }) => {
  try {
    // await connectDB();

    const authHeader = headers().get('authorization');
    await ET.checkAuthorizationByAuthHeader(authHeader);

    const body = await request.json();

    const allowedFields = ['email', 'password', 'subscriptions'];
    const providedFields = Object.keys(body);
    await ET.checkAlowedFieldsAreProvided(allowedFields, providedFields);

    const { email, password, subscriptions } = body;
  
    email && ET.checkEmailIsValid(email);
    password && ET.checkStringIsFitting('Password', password, 8);
    subscriptions && ET.checkArrayIsArray(subscriptions);

    const newData = { ...body };

    if (subscriptions) {
      newData.subscriptions = subscriptions.map((item) => {
        return new mongoose.Types.ObjectId(`${item}`);
      });
    }

    const user = await getUserByAuthHeader(authHeader);

    providedFields.forEach((field) => {
      user[field] = newData[field];
    });

    await user.save();

    return successResponse(200, null);

  } catch(error) {
    return errorResponse(error);
  }
};

/* =============================================================
Endpoint     : DELETE /api/users/me
Body         : none
Route Params : none
Query Params : none
Headers:     : authorization
============================================================= */

export const DELETE = async (request, { params }) => {
  try {
    // await connectDB();

    const authHeader = headers().get('authorization');
    await ET.checkAuthorizationByAuthHeader(authHeader);

    const user = await getUserByAuthHeader(authHeader);
    const userId = user._id;

    const update = { $pull: { unreadedBy: userId, savedBy: userId } };
    await Article.updateMany({}, update);
    await User.findOneAndDelete({ _id: userId });

    return successResponse(200, null);

  } catch(error) {
    return errorResponse(error);
  }
};