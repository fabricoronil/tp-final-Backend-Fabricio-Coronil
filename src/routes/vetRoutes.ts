import { Router } from 'express';
import { getVets, getVetById, createVet, updateVet, deleteVet } from '../controllers/vetController';
import auth from '../middlewares/auth';

const router = Router();

router.use(auth);

router.get('/', getVets);
router.get('/:id', getVetById);
router.post('/', createVet);
router.put('/:id', updateVet);
router.delete('/:id', deleteVet);

export default router;
