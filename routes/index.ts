import { Router } from 'express';
import authRouter from './authRouter';
import psychologistRouter from './psychologistRouter';

const router = Router();

router.use('/auth', authRouter);
router.use('/psychologists', psychologistRouter);

export default router;