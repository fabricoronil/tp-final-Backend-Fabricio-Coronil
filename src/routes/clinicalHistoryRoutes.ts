import { Router } from 'express';
import { getHistories, getHistoryById, createHistory, updateHistory, deleteHistory } from '../controllers/clinicalHistoryController';
import auth from '../middlewares/auth';
import { clinicalHistoryValidator } from '../middlewares/validators/clinicalHistoryValidator';

const router = Router();

router.use(auth);

router.get('/', getHistories);
router.get('/:id', getHistoryById);
router.post('/', clinicalHistoryValidator, createHistory);
router.put('/:id', clinicalHistoryValidator, updateHistory);
router.delete('/:id', deleteHistory);

export default router;
