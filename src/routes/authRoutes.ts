import { Router } from 'express';
import { register, login } from '../controllers/authController';
import { registerValidator, loginValidator } from '../middlewares/validators/authValidator';

const router = Router();

router.post('/register', registerValidator, register);
router.post('/login', loginValidator, login);

export default router;
