import { Router } from 'express';
import firebaseAuthController from '../controller/firebaseAuthController';
import { userValidator } from '../validator/userValidator';

const router = Router();

router.post('/register', userValidator, firebaseAuthController.registerUser);
router.post('/login', firebaseAuthController.loginUser);
router.post('/logout', firebaseAuthController.logoutUser);
router.post('/reset-password', firebaseAuthController.resetPassword);

export default router;