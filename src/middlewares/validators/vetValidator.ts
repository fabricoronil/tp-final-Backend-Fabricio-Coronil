import { body } from 'express-validator';
import { handleValidation } from './authValidator';

export const vetValidator = [
    body('nombre')
        .notEmpty().withMessage('El nombre es obligatorio')
        .isLength({ min: 2 }).withMessage('El nombre debe tener al menos 2 caracteres'),
    body('apellido')
        .notEmpty().withMessage('El apellido es obligatorio')
        .isLength({ min: 2 }).withMessage('El apellido debe tener al menos 2 caracteres'),
    body('especialidad')
        .notEmpty().withMessage('La especialidad es obligatoria'),
    body('email')
        .notEmpty().withMessage('El email es obligatorio')
        .isEmail().withMessage('Debe ser un email valido'),
    handleValidation
];
