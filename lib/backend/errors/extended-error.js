export default class ExtendedError extends Error {
  // base constructor only accepts string message as an argument
  // we extend it here to accept other values, allowing us to pass other data
  constructor(code, message) {
    super(message);
    this.code = code;
  }
}
