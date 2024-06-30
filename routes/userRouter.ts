import { Router } from 'express';
import userController from '../controller/userController';
import { userValidator } from '../validator/userValidator';
import { restrictByRole, restrictByUserId, verifyToken } from '../middleware';
import { Roles } from '../helper/enums';

const router = Router();

router.post('/auth/register', userValidator, userController.registerUser);
router.post('/auth/login', userController.loginUser);
router.post('/auth/logout', userController.logoutUser);
router.post('/auth/reset-password', userController.resetPassword);
router.get(
    '/users/:userId/appointments',
    verifyToken,
    restrictByRole([Roles.USER, Roles.ADMIN]),
    restrictByUserId,
    userController.getAllApointmentsByPsychologistId
);

export default router;