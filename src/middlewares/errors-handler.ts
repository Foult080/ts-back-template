import dotenv from 'dotenv';
dotenv.config();
import { Request, Response, ErrorRequestHandler, NextFunction } from 'express';
import { ErrorHandler, handleError, InternalError, Unauthorized } from '../utils/error-handler';
import { validationResult } from 'express-validator';
import jwt, { JsonWebTokenError } from 'jsonwebtoken';
import { UserPayload } from '../types';

const JWT_SECRET = process.env.JWT_SECRET || '';

/**
 * Метод для проверки Bearer токена пользователя
 */
export const checkToken = async (req: Request, res: Response, next: NextFunction) => {
  const token = req.header('authorization')?.split(' ')[1];
  try {
    if (!token) throw new Unauthorized('Нет токена, авторизация отклонена');
    const user = jwt.verify(token, JWT_SECRET) as UserPayload;
    req.user = user;
    next();
  } catch (error: unknown) {
    if (error instanceof JsonWebTokenError) {
      switch (error.name) {
        case 'TokenExpiredError':
          return handleError(new Unauthorized('Срок жизни вашего токена истёк. Повторно авторизуйтесь в системе'), next);
        case 'JsonWebTokenError':
          return handleError(new Unauthorized('Некорректный токен. Повторно авторизуйтесь в системе'), next);
        default:
          return handleError(new InternalError('Ошибка обработки токена'), next);
      }
    }
    return handleError(error as Error | ErrorHandler, next);
  }
};

/**
 * Обработка ошиборк валидации запросов от express-validator
 */
export const validationErrors = (req: Request, res: Response, next: NextFunction) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errorType: 'Bad Request ', msg: 'В запросе обнаружены ошибки валидации', errors: errors.array({ onlyFirstError: false }) });
  }
  next();
};

/**
 * Обработчик ошибок для финала ответа сервиса
 */
export const errorHandler: ErrorRequestHandler = (error, _req: Request, res: Response) => {
  const { status, msg, errorType }: ErrorHandler = error;
  return res.status(status).json({ errorType, msg });
};
