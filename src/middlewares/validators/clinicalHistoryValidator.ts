import { body } from 'express-validator';
import { handleValidation } from './authValidator';

export const clinicalHistoryValidator = [
    body('diagnostico')
        .notEmpty().withMessage('El diagnostico es obligatorio'),
    body('tratamiento')
        .notEmpty().withMessage('El tratamiento es obligatorio'),
    body('pet')
        .notEmpty().withMessage('La mascota es obligatoria')
        .isMongoId().withMessage('El ID de la mascota no es valido'),
    body('vet')
        .notEmpty().withMessage('El veterinario es obligatorio')
        .isMongoId().withMessage('El ID del veterinario no es valido'),
    handleValidation
];
