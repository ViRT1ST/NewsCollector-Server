import validator from 'validator';
import bcrypt from 'bcrypt';

import ExtendedError from './extended-error';
import User from '../db/models/user';

import {
  cleanToken, verifyTokenAndGetPayload
} from '@/lib/backend/auth/jwt-utils';

const throwError = (code, message) => {
  throw new ExtendedError(code, message);
};

const isString = (string) => typeof string === 'string';
const isNumber = (number) => typeof number === 'number';
const isBoolean = (boolean) => typeof boolean === 'boolean';
const isArray = (array) => Array.isArray(array);

class ErrorThrower {
  static checkDataIsNotZeroLength(objectOrArray) {

    if (Array.isArray(objectOrArray)) {
      if (objectOrArray.length !== 0);
      return;
    }

    if (typeof objectOrArray === 'object') {
      if (Object.keys(objectOrArray).length !== 0);
      return;
    }

    throwError(400, 'No data provided');
  }

  static checkStringIsNotEmpty(name, string) {
    if (!isString(string) || string.trim().length === 0) {
      throwError(400, `${name} is empty`);
    }
  }

  static checkStringIsFitting(name, string, minLength) {
    if (!isString(string) || string.trim().length < minLength) {
      throwError(400, `Minimum length for ${name} is ${minLength}`);
    }
  }

  static checkNumberIsFitting(name, number, minLength) {
    if (!isNumber(number) || number < minLength) {
      throwError(400, `Minimum value for ${name} is ${minLength}`);
    }
  }

  static checkValueIsBoolean(name, value) {
    if (!isBoolean(value)) {
      throwError(400, `${name} must be boolean`);
    }
  }

  static checkArrayIsArray(array) {
    if (!isArray(array)) {
      throwError(400, 'Array is invalid');
    }
  }

  static checkUserIsAdmin(user) {
    if (!user || !user.admin) {
      throwError(403, 'You do not have permission to this action');
    }
  }

  static checkEmailIsValid(email) {
    if (!email || !validator.isEmail(email)) {
      throwError(400, 'Email is invalid');
    }
  }

  static checkIsEmailBelongToUser(email, user) {
    if (email.toLowerCase() !== user.emailLowercase) {
      throwError(400, 'Email is invalid');
    }
  }

  static async checkUserIsNotExist(email) {
    const condition = { emailLowercase: email.toLowerCase() };
    const count = await User.countDocuments(condition);

    if (count !== 0) {
      throwError(400, 'This email is already associated with an account');
    }
  }

  static async checkUserIsExist(email) {
    const condition = { emailLowercase: email.toLowerCase() };
    const count = await User.countDocuments(condition);

    if (count !== 1) {
      throwError(400, 'Account with this email is not exist');
    }
  }

  static checkPasswordIsCorrect(plainPassword, hashedPassword) {
    if (!bcrypt.compareSync(plainPassword, hashedPassword)) {
      throwError(400, 'Invalid authentication data provided');
    }
  }

  static checkAlowedFieldsAreProvided(allowedFields, providedFields) {
    if (!(providedFields.every((v) => allowedFields.includes(v)))) {
      throwError(400, 'Invalid data provided');
    }
  }

  static checkRequiredFieldsAreProvided(requiredFields, providedFields) {
    if (!(requiredFields.every((v) => providedFields.includes(v)))) {
      throwError(400, 'Invalid data provided');
    }
  }

  static async checkAuthorizationByAuthHeader(authHeader) {
    if (!isString(authHeader) || authHeader.trim().length === 0) {
      throwError(400, 'Token not found. Please relogin.');
    }

    const token = cleanToken(authHeader);

    const payload = verifyTokenAndGetPayload(token);

    const condition = { _id: payload._id, 'tokens': token };
    const user = await User.findOne(condition);

    if (!user) {
      throw new ExtendedError(401, 'Authenticate to continue');
    }
  }
}

export default ErrorThrower;




