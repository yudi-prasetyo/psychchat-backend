import { body } from 'express-validator';
import { Roles } from '../helper/enums';

export const psychologistValidator = [
    body('email', 'Email is required').exists(),
    body('email', 'Invalid email').isEmail(),
    body('password').exists(),
    body('password', 'Password must be at least 8 characters').isLength({ min: 8 }),
]