import dotenv from 'dotenv';
dotenv.config();
import { Request, Response, ErrorRequestHandler, NextFunction } from 'express';
import { ErrorHandler, handleError, Unauthorized } from '../utils/error-handler';
import { validationResult } from 'express-validator';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || '';

/**
 * Проверить токен пользователя и Content type
 */
export const checkAuth = async (req: Request, res: Response, next: NextFunction) => {
  const token = req.header('authToken');
  try {
    if (!token) throw new Unauthorized('Нет токена, авторизация отклонена');
    const payload = jwt.verify(token, JWT_SECRET);
    req.user = payload;
    next();
  } catch (err) {
    let error;
    // проверяем что за ошибка
    switch (err.name) {
      case 'JsonWebTokenError': {
        error = new Unauthorized('Не корректный токен. Повторно авторизуйтесь в системе.');
        break;
      }
      case 'TokenExpiredError': {
        error = new Unauthorized('Срок жизни вашего токена истёк. Повторно авторизуйтесь в системе.');
        break;
      }
      default:
        error = err;
    }

    return handleError(error, next);
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
