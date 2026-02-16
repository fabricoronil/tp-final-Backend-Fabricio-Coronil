import { Request, Response, NextFunction } from 'express';

interface AppError extends Error {
    statusCode?: number;
    code?: number;
    keyValue?: Record<string, any>;
    errors?: Record<string, any>;
    kind?: string;
}

const errorHandler = (err: AppError, _req: Request, res: Response, _next: NextFunction): void => {
    let statusCode = err.statusCode || 500;
    let mensaje = err.message || 'Error interno del servidor';

    if (err.name === 'CastError' && err.kind === 'ObjectId') {
        statusCode = 400;
        mensaje = 'ID no valido';
    }

    if (err.code === 11000) {
        statusCode = 400;
        const campo = err.keyValue ? Object.keys(err.keyValue).join(', ') : 'campo';
        mensaje = `El valor del campo '${campo}' ya existe`;
    }

    if (err.name === 'ValidationError' && err.errors) {
        statusCode = 400;
        const mensajes = Object.values(err.errors).map((e: any) => e.message);
        mensaje = mensajes.join(', ');
    }

    if (err.name === 'JsonWebTokenError') {
        statusCode = 401;
        mensaje = 'Token no valido';
    }

    if (err.name === 'TokenExpiredError') {
        statusCode = 401;
        mensaje = 'Token expirado';
    }

    res.status(statusCode).json({
        mensaje,
        stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
    });
};

export default errorHandler;
