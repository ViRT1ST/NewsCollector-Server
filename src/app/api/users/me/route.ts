import { headers } from 'next/headers';

import { successResponse, errorResponse } from '@/utils/api';
import { ERRORS, ExtendedError } from '@/utils/errors';
import { UpdateUserSchema, UpdateUserData } from '@/types';
import { convertZodErrorsToMsgArray } from '@/utils/zod';
import pg from '@/lib/postgres/queries';

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

    if (!user) {
      throw new ExtendedError(...ERRORS.invalidToken);
    }

    const { uuid, email, subscriptions } = user;

    const sources = await pg.getSourcesList();

    const dataToReturn = {
      uuid,
      email,
      sources: sources.map(({ uuid: source_uuid, site, section }) => {
        return {
          uuid: source_uuid,
          site,
          section,
          is_user_subscribed: subscriptions.includes(source_uuid) 
        };
      })
    };

    return successResponse(200, dataToReturn);

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

    if (!user) {
      throw new ExtendedError(...ERRORS.invalidToken);
    }

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

    if (!user) {
      throw new ExtendedError(...ERRORS.invalidToken);
    }

    const body: Omit<UpdateUserData, 'uuid'> = await req.json();

    const result = UpdateUserSchema.safeParse({
      uuid: user.uuid,
      new_email: body.new_email,
      new_password: body.new_password,
      new_subscriptions: body.new_subscriptions
    });

    if (!result.success) {
      const errorMessages = convertZodErrorsToMsgArray(result);
      throw new ExtendedError(400, errorMessages.join(' | '));
    }

    const updateUserData: UpdateUserData = {
      uuid: user.uuid
    };

    const { new_email, new_password, new_subscriptions } = result.data;

    // new_email is valid -> add it to update data 
    if (new_email) {
      const isEmailDifferent = new_email.toLowerCase() !== user.email.toLowerCase();

      if (isEmailDifferent) {
        const userWithSameEmail = await pg.getUserByEmail(new_email);

        if (userWithSameEmail) {
          throw new ExtendedError(...ERRORS.notAllowedNewEmail);
        } else {
          updateUserData.new_email = new_email;
        }
      }
    }

    // new_password is valid -> add it to update data
    if (new_password) {
      updateUserData.new_password = new_password; 
    }

    // new_subscriptions is valid -> add it to update data
    if (new_subscriptions && new_subscriptions.length > 0) {
      updateUserData.new_subscriptions = new_subscriptions;
    }

    await pg.updateUser(updateUserData);

    return successResponse(200, null);

  } catch (error) {
    return errorResponse(error);
  }
};