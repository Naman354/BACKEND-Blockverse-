class ApiError extends Error {
  constructor(
    statuscode,
    message = "The operatin has been failed.",
    errors = [],
    stack = ""
  ) {
    super(message);

    this.message = message;
    this.success = false;
    this.errors = errors;
    this.statuscode = statuscode;
    this.data = null;

    if (stack) {
      this.stack = stack;
    } else {
      this.stack = Error.captureStackTrace(this, this.constructor);
    }
  }
}

export default ApiError;
