import { NextFunction } from 'express';

export class ErrorHandler extends Error {
  status: number;
  msg: string;
  errorType: string;

  constructor(status: number, msg: string, errorType: string) {
    super();
    this.msg = msg;
    this.status = status;
    this.errorType = errorType;
  }
}

export class InternalError extends ErrorHandler {
  constructor(msg: string) {
    super(500, msg, 'Internal error');
  }
}

export class Unauthorized extends ErrorHandler {
  constructor(msg: string) {
    super(401, msg, 'Unauthorized');
  }
}

export class Forbidden extends ErrorHandler {
  constructor(msg: string) {
    super(403, msg, 'Forbidden');
  }
}

export class BadRequest extends ErrorHandler {
  constructor(msg: string) {
    super(400, msg, 'Bad Request');
  }
}

export class NotFound extends ErrorHandler {
  constructor(msg: string) {
    super(404, msg, 'Not Found');
  }
}

export const handleError = (error: Error | ErrorHandler, next: NextFunction) => {
  if (error instanceof ErrorHandler) return next(error);
  console.error(error);
  return next(new InternalError(error.message));
};
