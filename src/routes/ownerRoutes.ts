import { Router } from 'express';
import { getOwners, getOwnerById, createOwner, updateOwner, deleteOwner } from '../controllers/ownerController';
import auth from '../middlewares/auth';
import { ownerValidator } from '../middlewares/validators/ownerValidator';

const router = Router();

router.use(auth);

router.get('/', getOwners);
router.get('/:id', getOwnerById);
router.post('/', ownerValidator, createOwner);
router.put('/:id', ownerValidator, updateOwner);
router.delete('/:id', deleteOwner);

export default router;
