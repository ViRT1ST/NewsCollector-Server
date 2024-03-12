import User from '@/lib/backend/db/models/user';

import {
  cleanToken, verifyTokenAndGetPayload
} from '@/lib/backend/auth/jwt-utils';

const getUserByAuthHeader = async (authorizationHeader) => {
  const token = cleanToken(authorizationHeader);
  const { _id } = verifyTokenAndGetPayload(token);

  const condition = { _id, 'tokens': token };
  const user = await User.findOne(condition);

  return user;
};

export default getUserByAuthHeader;
