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
    getDocs,
    query,
    where,
    updateDoc,
    Timestamp
} from 'firebase/firestore';
import { CustomRequest } from '../helper/types';
import Appointment from '../models/appointmentModel';

const auth = getAuth();
const db = getFirestore(firebase);

class ChatController {
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
    async initiateChat(req: Request, res: Response): Promise<void> {
        try {

        } catch (error) {
            // Send an error response if an error occurred
            res.status(500).json({ error: 'An error occurred while creating the post' });
        }
    }
}

export default new ChatController();