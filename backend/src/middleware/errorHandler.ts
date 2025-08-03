import { Request, Response, NextFunction } from 'express';
import { ApiResponse } from '../types';

export const errorHandler = (
  error: any,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  console.error('Error:', error);

  let statusCode = 500;
  let message = 'Error interno del servidor';

  if (error.name === 'ValidationError') {
    statusCode = 400;
    message = 'Datos de entrada inválidos';
  } else if (error.name === 'MongoError' && error.code === 11000) {
    statusCode = 409;
    message = 'Recurso ya existe';
  } else if (error.name === 'JsonWebTokenError') {
    statusCode = 401;
    message = 'Token inválido';
  } else if (error.name === 'TokenExpiredError') {
    statusCode = 401;
    message = 'Token expirado';
  } else if (error.message) {
    message = error.message;
  }

  const response: ApiResponse = {
    success: false,
    message,
    error: process.env.NODE_ENV === 'development' ? error.stack : undefined
  };

  res.status(statusCode).json(response);
};

export const notFound = (req: Request, res: Response): void => {
  const response: ApiResponse = {
    success: false,
    message: `Ruta no encontrada: ${req.originalUrl}`
  };
  
  res.status(404).json(response);
};

export const asyncHandler = (fn: Function) => (req: Request, res: Response, next: NextFunction) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};
