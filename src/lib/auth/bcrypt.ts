import bcrypt from 'bcryptjs';

import validator from '@/lib/validator';

async function hashPassword(password: string): Promise<string> {
  return await bcrypt.hash(password, 8);
}

function checkPassword(plainPassword: string, hashedPassword: string): void | never {
  if (!bcrypt.compareSync(plainPassword, hashedPassword)) {
    validator.throwError(400, 'Invalid authentication data provided');
  }
}

export default {
  hashPassword,
  checkPassword
};