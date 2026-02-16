import { body } from 'express-validator';
import { handleValidation } from './authValidator';

export const petValidator = [
    body('nombre')
        .notEmpty().withMessage('El nombre es obligatorio'),
    body('especie')
        .notEmpty().withMessage('La especie es obligatoria'),
    body('owner')
        .notEmpty().withMessage('El dueno es obligatorio')
        .isMongoId().withMessage('El ID del dueno no es valido'),
    handleValidation
];
