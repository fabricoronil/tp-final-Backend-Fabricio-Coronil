import { Request, Response, NextFunction } from 'express';
import Owner from '../models/Owner';
import { CreateOwnerDto, UpdateOwnerDto } from '../dtos/ownerDto';

export const getOwners = async (_req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const duenos = await Owner.find();
        res.json(duenos);
    } catch (error) {
        next(error);
    }
};

export const getOwnerById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const dueno = await Owner.findById(req.params.id);

        if (!dueno) {
            res.status(404).json({ mensaje: 'Dueno no encontrado' });
            return;
        }

        res.json(dueno);
    } catch (error) {
        next(error);
    }
};

export const createOwner = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const datos: CreateOwnerDto = req.body;
        const dueno = await Owner.create(datos);
        res.status(201).json(dueno);
    } catch (error) {
        next(error);
    }
};

export const updateOwner = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const datos: UpdateOwnerDto = req.body;
        const dueno = await Owner.findByIdAndUpdate(req.params.id, datos, {
            new: true,
            runValidators: true
        });

        if (!dueno) {
            res.status(404).json({ mensaje: 'Dueno no encontrado' });
            return;
        }

        res.json(dueno);
    } catch (error) {
        next(error);
    }
};

export const deleteOwner = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const dueno = await Owner.findByIdAndDelete(req.params.id);

        if (!dueno) {
            res.status(404).json({ mensaje: 'Dueno no encontrado' });
            return;
        }

        res.json({ mensaje: 'Dueno eliminado correctamente' });
    } catch (error) {
        next(error);
    }
};
