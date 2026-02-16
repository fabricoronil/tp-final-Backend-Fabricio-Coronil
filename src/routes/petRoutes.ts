import { Router } from 'express';
import { getPets, getPetById, createPet, updatePet, deletePet } from '../controllers/petController';
import auth from '../middlewares/auth';
import { petValidator } from '../middlewares/validators/petValidator';

const router = Router();

router.use(auth);

router.get('/', getPets);
router.get('/:id', getPetById);
router.post('/', petValidator, createPet);
router.put('/:id', petValidator, updatePet);
router.delete('/:id', deletePet);

export default router;
