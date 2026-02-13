import { Router } from 'express';
import { getOwners, getOwnerById, createOwner, updateOwner, deleteOwner } from '../controllers/ownerController';
import auth from '../middlewares/auth';

const router = Router();

router.use(auth);

router.get('/', getOwners);
router.get('/:id', getOwnerById);
router.post('/', createOwner);
router.put('/:id', updateOwner);
router.delete('/:id', deleteOwner);

export default router;
