import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/User';

interface JwtPayload {
    id: string;
}

declare global {
    namespace Express {
        interface Request {
            usuario?: any;
        }
    }
}

const auth = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            res.status(401).json({ mensaje: 'No autorizado, token no proporcionado' });
            return;
        }

        const token = authHeader.split(' ')[1];

        const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as JwtPayload;

        const usuario = await User.findById(decoded.id).select('-password');

        if (!usuario) {
            res.status(401).json({ mensaje: 'No autorizado, usuario no encontrado' });
            return;
        }

        req.usuario = usuario;
        next();
    } catch (error) {
        res.status(401).json({ mensaje: 'No autorizado, token invalido' });
    }
};

export default auth;
