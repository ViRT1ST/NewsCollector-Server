import { successResponse, errorResponse } from '@/lib/backend/responses';
import { generateToken } from '@/lib/backend/auth/jwt-utils';
import User from '@/lib/backend/db/models/user';
import ET from '@/lib/backend/errors/thrower';

/* =============================================================
Endpoint     : POST /api/users/login
Body         : { email, password }
Route Params : none
Query Params : none
Headers:     : none
============================================================= */

export const POST = async (request, { params }) => {
  try {
    // await connectDB();

    const { email, password } = await request.json();

    ET.checkStringIsFitting('Password', password, 8);
    ET.checkEmailIsValid(email);
    await ET.checkUserIsExist(email);

    const emailLowercase = email.toLowerCase().trim();
    const user = await User.findOne({ emailLowercase });

    ET.checkPasswordIsCorrect(password, user.password);

    const newToken = generateToken(user._id);

    // remove oldest token if user have 10 tokens
    const oldTokens = user.tokens.length > 9
      ? user.tokens.slice(1)
      : user.tokens;

    user.tokens = [...oldTokens, newToken];
    await user.save();
  
    return successResponse(200, { user, token: newToken });

  } catch(error) {
    return errorResponse(error);
  }
};