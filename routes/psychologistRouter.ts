import { Router } from 'express';
import psychologistController from '../controller/psychologistController';
import { psychologistValidator } from '../validator/psychologistValidator';
import { verifyToken, restrictByRole, restrictByUserId } from '../middleware';
import { Roles } from '../helper/enums';

const router = Router();


router.post('/register',
    psychologistValidator,
    psychologistController.registerPsychologist
);
router.get('/', psychologistController.getAllPsychologists);
router.get('/:userId', psychologistController.getPsychologistById);
router.put(
    '/:userId',
    verifyToken,
    restrictByRole([Roles.PSYCHOLOGIST, Roles.ADMIN]),
    restrictByUserId,
    psychologistController.updatePsychologist
);
router.get(
    '/:userId/appointments',
    verifyToken,
    restrictByRole([Roles.PSYCHOLOGIST, Roles.ADMIN]),
    restrictByUserId,
    psychologistController.getAllApointmentsByPsychologistId)

export default router;