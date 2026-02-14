import { Router } from 'express';
import { getPets, getPetById, createPet, updatePet, deletePet } from '../controllers/petController';
import auth from '../middlewares/auth';

const router = Router();

router.use(auth);

router.get('/', getPets);
router.get('/:id', getPetById);
router.post('/', createPet);
router.put('/:id', updatePet);
router.delete('/:id', deletePet);

export default router;
