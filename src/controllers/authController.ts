import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/User';

const generarToken = (id: string): string => {
    return jwt.sign({ id }, process.env.JWT_SECRET as string, {
        expiresIn: '24h'
    });
};

export const register = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const { username, email, password } = req.body;

        const existeUsuario = await User.findOne({
            $or: [{ email }, { username }]
        });

        if (existeUsuario) {
            res.status(400).json({ mensaje: 'El usuario o email ya existe' });
            return;
        }

        const usuario = await User.create({ username, email, password });

        const token = generarToken(usuario._id.toString());

        res.status(201).json({
            _id: usuario._id,
            username: usuario.username,
            email: usuario.email,
            token
        });
    } catch (error) {
        next(error);
    }
};

export const login = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const { email, password } = req.body;

        const usuario = await User.findOne({ email });

        if (!usuario) {
            res.status(401).json({ mensaje: 'Usuario no encontrado' });
            return;
        }

        const passwordValida = await usuario.comparePassword(password);

        if (!passwordValida) {
            res.status(401).json({ mensaje: 'Contraseña incorrecta' });
            return;
        }

        const token = generarToken(usuario._id.toString());

        res.json({
            _id: usuario._id,
            username: usuario.username,
            email: usuario.email,
            token
        });
    } catch (error) {
        next(error);
    }
};
