class ApiError extends Error {
  constructor(status, message) {
    super(message);
    this.status = status;
    this.message = message;
    Error.captureStackTrace(this, this.constructor);
  }

  static badRequest(message) {
    return new ApiError(400, message);
  }
  static forbidden(message) {
    return new ApiError(403, message);
  }
  static unauthorized(message) {
    return new ApiError(401, message);
  }
  static notFound(message) {
    return new ApiError(404, message);
  }
  static internal(message) {
    return new ApiError(500, message);
  }

  toJson() {
    return {
      status: this.status,
      message: this.message,
    };
  }
}

module.exports = ApiError;
