import { headers } from 'next/headers';

import { successResponse, errorResponse } from '@/lib/api/responses';
import { UserUpdateData } from '@/lib/types';
import validator from '@/lib/validator';
import pg from '@/lib/db/queries';

export const dynamic = 'force-dynamic';

/* =============================================================
Endpoint     : GET /api/users/me
Query Params : none
Headers:     : authorization
Body         : none
============================================================= */

export const GET = async () => {
  try {
    const authToken = headers().get('authorization');
    const user = await pg.getUserByToken(authToken);

    const { uuid, email, subscriptions } = user;

    const sources = await pg.getSourcesList();

    const data = {
      uuid,
      email,
      sources: sources.map(({ uuid: source_uuid, site, section }) => ({
        uuid: source_uuid,
        site,
        section,
        is_user_subscribed: subscriptions.includes(source_uuid) 
      }))
    };

    return successResponse(200, data);

  } catch (error) {
    return errorResponse(error);
  }
};

/* =============================================================
Endpoint     : DELETE /api/users/me
Query Params : none
Headers:     : authorization
Body         : none
============================================================= */

export const DELETE = async () => {
  try {
    const authToken = headers().get('authorization');
    const user = await pg.getUserByToken(authToken);

    await pg.deleteUser(user.uuid);

    return successResponse(200, null);

  } catch (error) {
    return errorResponse(error);
  }
};

/* =============================================================
Endpoint     : PATCH /api/users/me
Query Params : none
Headers:     : authorization
Body         : none
============================================================= */

export const PATCH = async (req: Request) => {
  try {
    const authToken = headers().get('authorization');
    const user = await pg.getUserByToken(authToken);

    const { new_email, new_password, new_subscriptions } = await req.json();

    const updateData: UserUpdateData = { uuid: user.uuid };

    if (new_email) {
      const validEmail = validator.assertEmail(new_email);
      const isEmailNeedsUpdate = validEmail.toLowerCase() !== user.email.toLowerCase();

      if (isEmailNeedsUpdate) {
        await pg.checkEmailIsNotExist(validEmail);
        updateData['new_email'] = validEmail;
      }
    }

    if (new_password) {
      const validPassword = validator.assertPassword(new_password);
      updateData['new_password'] = validPassword;
    }

    if (new_subscriptions) {
      const array = validator.assertArray(new_subscriptions);
      const validSubscriptions = array.map((item) => validator.assertString(item));
      updateData['new_subscriptions'] = validSubscriptions;
    }

    await pg.updateUser(updateData);

    return successResponse(200, null);

  } catch (error) {
    return errorResponse(error);
  }
};