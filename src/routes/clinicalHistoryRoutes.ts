import { Router } from 'express';
import { getHistories, getHistoryById, createHistory, updateHistory, deleteHistory } from '../controllers/clinicalHistoryController';
import auth from '../middlewares/auth';

const router = Router();

router.use(auth);

router.get('/', getHistories);
router.get('/:id', getHistoryById);
router.post('/', createHistory);
router.put('/:id', updateHistory);
router.delete('/:id', deleteHistory);

export default router;
