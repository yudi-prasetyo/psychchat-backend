import { Router } from 'express';
import userRouter from './userRouter';
import psychologistRouter from './psychologistRouter';
import appointmentRouter from './appointmentRouter';

const router = Router();

router.use('/', userRouter);
router.use('/psychologists', psychologistRouter);
router.use('/appointments', appointmentRouter);

export default router;