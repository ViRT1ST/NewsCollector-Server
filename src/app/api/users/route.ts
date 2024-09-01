import { successResponse, errorResponse } from '@/lib/backend/responses';
import validator from '@/lib/backend/validator';
import pg from '@/lib/backend/postgres';

export const dynamic = 'force-dynamic';

/* =============================================================
Endpoint     : POST /api/users/
Query Params : none
Headers:     : none
Body         : { email, password }
============================================================= */

export const POST = async (req: Request) => {
  try {
    const { email, password } = await req.json();

    const validEmail = validator.assertEmail(email);
    const validPassword = validator.assertPassword(password);

    await pg.createUser(validEmail, validPassword);
    const user = await pg.getUserByEmail(validEmail);

    const data = {
      user: {
        uuid: user.uuid,
        email: user.email,
        subscriptions: user.subscriptions,
      },
      token: user.tokens[0],
    };

    return successResponse(200, data);

  } catch (error) {
    return errorResponse(error);
  }
};
