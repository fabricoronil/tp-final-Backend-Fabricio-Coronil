import { Request, Response, NextFunction } from 'express';
import ClinicalHistory from '../models/ClinicalHistory';
import { CreateClinicalHistoryDto, UpdateClinicalHistoryDto } from '../dtos/clinicalHistoryDto';

export const getHistories = async (_req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const historiales = await ClinicalHistory.find()
            .populate('pet', 'nombre especie raza')
            .populate('vet', 'nombre apellido especialidad');
        res.json(historiales);
    } catch (error) {
        next(error);
    }
};

export const getHistoryById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const historial = await ClinicalHistory.findById(req.params.id)
            .populate('pet', 'nombre especie raza')
            .populate('vet', 'nombre apellido especialidad');

        if (!historial) {
            res.status(404).json({ mensaje: 'Historial clinico no encontrado' });
            return;
        }

        res.json(historial);
    } catch (error) {
        next(error);
    }
};

export const createHistory = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const datos: CreateClinicalHistoryDto = req.body;
        const historial = await ClinicalHistory.create(datos);
        res.status(201).json(historial);
    } catch (error) {
        next(error);
    }
};

export const updateHistory = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const datos: UpdateClinicalHistoryDto = req.body;
        const historial = await ClinicalHistory.findByIdAndUpdate(req.params.id, datos, {
            new: true,
            runValidators: true
        });

        if (!historial) {
            res.status(404).json({ mensaje: 'Historial clinico no encontrado' });
            return;
        }

        res.json(historial);
    } catch (error) {
        next(error);
    }
};

export const deleteHistory = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const historial = await ClinicalHistory.findByIdAndDelete(req.params.id);

        if (!historial) {
            res.status(404).json({ mensaje: 'Historial clinico no encontrado' });
            return;
        }

        res.json({ mensaje: 'Historial clinico eliminado correctamente' });
    } catch (error) {
        next(error);
    }
};
