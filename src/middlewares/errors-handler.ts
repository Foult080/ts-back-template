import { Request, Response, ErrorRequestHandler } from 'express';
import { ErrorHandler } from '../utils/error-handler';

export const errorHandler: ErrorRequestHandler = (error, _req: Request, res: Response) => {
  const { status, msg, errorType }: ErrorHandler = error;
  return res.status(status).json({ errorType, msg });
};
