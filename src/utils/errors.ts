export class ExtendedError extends Error {
  public code: number | string;

  constructor(code: number | string, message: string) {
    super(message);
    this.name = this.constructor.name;
    this.code = code;
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, this.constructor);
    }
  }
}

export const ERRORS: Record<string, [number, string]> = {
  zodNotEmail: [
    404, 'Valid email is required'
  ],
  zodBadEmail: [
    400, 'Email must be at least 5 characters'
  ],
  zodBadPassword: [
    400, 'Password must be at least 8 characters'
  ],
  emailAlreadyExist: [
    400, 'User with this email already exist'
  ],
  emailNotFound: [
    404, 'User with this email not exist'
  ],
  invalidPassword: [
    400, 'Invalid password'
  ],
  invalidToken: [
    400, 'Invalid token. Please re-authenticate'
  ],
  notAdmin: [
    403, 'You do not have permission to this action'
  ],
  notAllowedNewEmail: [
    400, 'User with this email already exist'
  ],
  invalidArticles: [
    400, 'Invalid articles array'
  ],
  invalidParam: [
    400, 'Invalid param'
  ],
};



