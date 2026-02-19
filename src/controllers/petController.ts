import { Request, Response, NextFunction } from 'express';
import Pet from '../models/Pet';
import { CreatePetDto, UpdatePetDto } from '../dtos/petDto';

export const getPets = async (_req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const mascotas = await Pet.find().populate('owner', 'nombre apellido email');
        res.json(mascotas);
    } catch (error) {
        next(error);
    }
};

export const getPetById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const mascota = await Pet.findById(req.params.id).populate('owner', 'nombre apellido email');

        if (!mascota) {
            res.status(404).json({ mensaje: 'Mascota no encontrada' });
            return;
        }

        res.json(mascota);
    } catch (error) {
        next(error);
    }
};

export const createPet = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const datos: CreatePetDto = req.body;
        const mascota = await Pet.create(datos);
        res.status(201).json(mascota);
    } catch (error) {
        next(error);
    }
};

export const updatePet = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const datos: UpdatePetDto = req.body;
        const mascota = await Pet.findByIdAndUpdate(req.params.id, datos, {
            new: true,
            runValidators: true
        });

        if (!mascota) {
            res.status(404).json({ mensaje: 'Mascota no encontrada' });
            return;
        }

        res.json(mascota);
    } catch (error) {
        next(error);
    }
};

export const deletePet = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const mascota = await Pet.findByIdAndDelete(req.params.id);

        if (!mascota) {
            res.status(404).json({ mensaje: 'Mascota no encontrada' });
            return;
        }

        res.json({ mensaje: 'Mascota eliminada correctamente' });
    } catch (error) {
        next(error);
    }
};
