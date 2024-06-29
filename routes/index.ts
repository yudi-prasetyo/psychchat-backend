import { Router } from 'express';
import authRouter from './authRouter';
import psychologistRouter from './psychologistRouter';
import appointmentRouter from './appointmentRouter';

const router = Router();

router.use('/auth', authRouter);
router.use('/psychologists', psychologistRouter);
router.use('/appointments', appointmentRouter);

export default router;