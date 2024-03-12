import mongoose from 'mongoose';

import { successResponse, errorResponse } from '@/lib/backend/responses';
import { generateToken } from '@/lib/backend/auth/jwt-utils';
import User from '@/lib/backend/db/models/user';
import ET from '@/lib/backend/errors/thrower';

/* =============================================================
Endpoint     : POST /api/users/
Body         : { email, password }
Route Params : none
Query Params : none
Headers:     : none
============================================================= */

export const POST = async (request, { params }) => {
  try {
    // await connectDB();

    const body = await request.json();

    const requiredFields = ['email', 'password'];
    const allowedFields = ['email', 'password'];
    const providedFields = Object.keys(body);
    ET.checkRequiredFieldsAreProvided(requiredFields, providedFields);
    ET.checkAlowedFieldsAreProvided(allowedFields, providedFields);

    const { email, password } = body;

    ET.checkStringIsFitting('Password', password, 8);
    ET.checkEmailIsValid(email);

    await ET.checkUserIsNotExist(email);

    const _id = new mongoose.Types.ObjectId();
    const token = generateToken(_id);

    const user = new User({ _id, email, password, tokens: [token] });
    await user.save();

    return successResponse(200, { user, token });

  } catch(error) {
    return errorResponse(error);
  }
};

