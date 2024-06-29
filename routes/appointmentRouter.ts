import { Router } from 'express';
import appointmentController from '../controller/appointmentController';
import { verifyToken, restrictByRole, restrictByUserId } from '../middleware';
import { Roles } from '../helper/enums';

const router = Router();

router.post('/', verifyToken, restrictByUserId, appointmentController.createAppointment);
router.get('/:id', verifyToken, appointmentController.getAppointmentById);

export default router;