import { Request, Response, NextFunction } from 'express';
import Vet from '../models/Vet';
import { CreateVetDto, UpdateVetDto } from '../dtos/vetDto';

export const getVets = async (_req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const veterinarios = await Vet.find();
        res.json(veterinarios);
    } catch (error) {
        next(error);
    }
};

export const getVetById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const veterinario = await Vet.findById(req.params.id);

        if (!veterinario) {
            res.status(404).json({ mensaje: 'Veterinario no encontrado' });
            return;
        }

        res.json(veterinario);
    } catch (error) {
        next(error);
    }
};

export const createVet = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const datos: CreateVetDto = req.body;
        const veterinario = await Vet.create(datos);
        res.status(201).json(veterinario);
    } catch (error) {
        next(error);
    }
};

export const updateVet = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const datos: UpdateVetDto = req.body;
        const veterinario = await Vet.findByIdAndUpdate(req.params.id, datos, {
            new: true,
            runValidators: true
        });

        if (!veterinario) {
            res.status(404).json({ mensaje: 'Veterinario no encontrado' });
            return;
        }

        res.json(veterinario);
    } catch (error) {
        next(error);
    }
};

export const deleteVet = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const veterinario = await Vet.findByIdAndDelete(req.params.id);

        if (!veterinario) {
            res.status(404).json({ mensaje: 'Veterinario no encontrado' });
            return;
        }

        res.json({ mensaje: 'Veterinario eliminado correctamente' });
    } catch (error) {
        next(error);
    }
};
