import { firebase } from '../config/firebaseConfig';
import {
    getAuth,
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signOut,
    sendEmailVerification,
    sendPasswordResetEmail
} from "../config/firebaseConfig";
import { Request, Response } from "express";
import { validationResult } from 'express-validator';
import User from "../models/userModel";
import { Roles } from "../helper/enums";
import {
    getFirestore,
    collection,
    addDoc,
} from 'firebase/firestore';

const auth = getAuth();
const db = getFirestore(firebase);

class FirebaseAuthController {
    /**
     * Register a new user with email and password.
     *
     * @param {Request} req - The request object.
     * @param {Response} res - The response object.
     * @return {Promise<void>} - A promise that resolves when the user is registered.
     */
    /**
     * Registers a new user with email and password.
     * - Validates the request body using express-validator.
     * - Creates a new user with createUserWithEmailAndPassword.
     * - Sends a verification email to the user's email address.
     * - Returns a success response with a message.
     * - Returns an error response if an error occurred.
     */
    async registerUser(req: Request, res: Response): Promise<void> {
        try {
            // Validate the request body
            const errors = validationResult(req);

            if (!errors.isEmpty()) {
                // If there are validation errors, return a 400 response with the errors array
                res.status(400).json({ errors: errors.array() });
            } else {
                // If there are no validation errors, extract the email, password, and role from the request body
                const { email, password }: { email: string, password: string } = req.body;
                const role = req.body.role || Roles.USER;

                // Create a new user with createUserWithEmailAndPassword
                const userCredential: any = await createUserWithEmailAndPassword(auth, email, password);
                // Send a verification email to the user's email address using sendEmailVerification
                await sendEmailVerification(userCredential.user);

                // Create a new User object for the role
                const user: User = {
                    userId: userCredential.user.uid,
                    role: role,
                }

                const docRef = await addDoc(collection(db, 'roles'), user);

                // Return a success response with a message
                res.status(201).json({ message: "Verification email sent! User created successfully!" });
            }
        } catch (error) {
            // Send an error response if an error occurred
            res.status(500).json({ error: 'An error occurred while creating the post' });
        }
    }

    /**
     * Log in a user with email and password.
     *
     * @param {Request} req - The request object.
     * @param {Response} res - The response object.
     * @return {Promise<void>} - A promise that resolves when the user is logged in.
     */
    async loginUser(req: Request, res: Response): Promise<void> {
        const { email, password }: { email: string, password: string } = req.body;
        if (!email || !password) {
            res.status(422).json({
                email: "Email is required",
                password: "Password is required",
            });
        }
        try {
            const userCredential: any = await signInWithEmailAndPassword(auth, email, password);
            const idToken: string | null = userCredential._tokenResponse?.idToken;
            if (idToken) {
                res.cookie('access_token', idToken, {
                    httpOnly: true
                });
                res.status(200).json({ message: "User logged in successfully", userCredential });
            } else {
                res.status(500).json({ error: "Internal Server Error" });
            }
        } catch (error: any) {
            console.error(error);
            const errorMessage: string = error.message || "An error occurred while logging in";
            res.status(500).json({ error: errorMessage });
        }
    }

    /**
     * Log out the current user.
     *
     * @param {Request} req - The request object.
     * @param {Response} res - The response object.
     * @return {Promise<void>} - A promise that resolves when the user is logged out.
     */
    async logoutUser(req: Request, res: Response): Promise<void> {
        try {
            await signOut(auth);
            res.clearCookie('access_token');
            res.status(200).json({ message: "User logged out successfully" });
        } catch (error: any) {
            console.error(error);
            res.status(500).json({ error: "Internal Server Error" });
        }
    }

    /**
     * Send a password reset email to the specified email address.
     *
     * @param {Request<{ body: { email: string } }>} req - The request object with the email address in the body.
     * @param {Response} res - The response object.
     * @return {Promise<void>} - A promise that resolves when the password reset email is sent, or rejects with an error.
     */
    async resetPassword(req: Request<{ body: { email: string } }>, res: Response): Promise<void> {
        const { email } = req.body;
        if (!email) {
            res.status(422).json({
                email: "Email is required"
            });
        }
        try {
            await sendPasswordResetEmail(auth, email);
            res.status(200).json({ message: "Password reset email sent successfully!" });
        } catch (error: any) {
            console.error(error);
            res.status(500).json({ error: "Internal Server Error" });
        }
    }
}

export default new FirebaseAuthController();