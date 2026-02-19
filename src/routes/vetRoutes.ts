import { Router } from 'express';
import { getVets, getVetById, createVet, updateVet, deleteVet } from '../controllers/vetController';
import auth from '../middlewares/auth';
import { vetValidator } from '../middlewares/validators/vetValidator';

const router = Router();

router.use(auth);

router.get('/', getVets);
router.get('/:id', getVetById);
router.post('/', vetValidator, createVet);
router.put('/:id', vetValidator, updateVet);
router.delete('/:id', deleteVet);

export default router;
