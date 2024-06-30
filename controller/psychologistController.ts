import { firebase } from '../config/firebaseConfig';
import {
    getAuth,
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signOut,
    sendEmailVerification,
    sendPasswordResetEmail
} from "../config/firebaseConfig";
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
import { Response } from "express";
import { CustomRequest } from '../helper/types';
import { validationResult } from 'express-validator';
import Psychologist from '../models/psychologistModel';
import { Roles } from '../helper/enums';
import Appointment from '../models/appointmentModel';

const auth = getAuth();
const db = getFirestore(firebase);

class PsychologistController {
    /**
     * Registers a new psychologist with email and password.
     * Validates the request body using express-validator.
     * Creates a new user with createUserWithEmailAndPassword.
     * Sends a verification email to the user's email address.
     * Returns a success response with a message.
     * Returns an error response if an error occurred.
     *
     * @param {CustomRequest} req - The request object with the psychologist data in the body.
     * @param {Response} res - The response object.
     * @return {Promise<void>} - A promise that resolves when the psychologist is registered.
     */
    async registerPsychologist(req: CustomRequest, res: Response): Promise<void> {
        try {
            // Validate the request body
            const errors = validationResult(req);

            if (!errors.isEmpty()) {
                // If there are validation errors, return a 400 response with the errors array
                res.status(400).json({ errors: errors.array() });
            } else {
                // If there are no validation errors, extract the email, password, and role from the request body
                const { email, password }: { email: string, password: string } = req.body;

                // Create a new user with createUserWithEmailAndPassword
                const userCredential: any = await createUserWithEmailAndPassword(auth, email, password);
                // Send a verification email to the user's email address using sendEmailVerification
                // await sendEmailVerification(userCredential.user);

                // Create a new Psychologist object for the psychologist
                const psychologist: Psychologist = new Psychologist(userCredential.user.uid, email);

                await addDoc(collection(db, 'psychologists'), { ...psychologist });
                await addDoc(collection(db, 'roles'), { userId: userCredential.user.uid, role: Roles.PSYCHOLOGIST });

                // Return a success response with a message
                res.status(201).json({ message: "Verification email sent! Psychologist created successfully!" });
            }
        } catch (error) {
            // Send an error response if an error occurred
            console.log("[ERR]: " + error);
            res.status(500).json({ error: 'An error occurred while creating the psychologist' });
        }
    }

    /**
     * Retrieves all psychologists from the database.
     *
     * @param {CustomRequest} req - The request object.
     * @param {Response} res - The response object.
     * @return {Promise<void>} - A promise that resolves when the psychologists are retrieved successfully, or rejects with an error.
     */
    async getAllPsychologists(req: CustomRequest, res: Response): Promise<void> {
        try {
            // Get all documents from the 'psychologist' collection
            const querySnapshot = await getDocs(collection(db, 'psychologists'));

            // Create an array to store the psychologist data
            const psychologists: Psychologist[] = [];

            // Iterate over each document and extract the psychologist data
            querySnapshot.forEach((doc) => {
                // Extract the psychologist data from the document
                psychologists.push({
                    userId: doc.data().userId as string, // The user ID of the psychologist
                    email: doc.data().email as string, // The email of the psychologist
                    firstName: doc.data().firstName as string, // The first name of the psychologist
                    lastName: doc.data().lastName as string, // The last name of the psychologist
                    address: doc.data().address as string, // The address of the psychologist
                });
            });

            // Send a success response with the psychologist data
            res.status(200).json(psychologists);
        } catch (error) {
            // Send an error response if an error occurred
            res.status(500).json({ error: 'An error occurred while retrieving psychologists' });
        }
    }

    /**
     * Retrieves a psychologist from the database by their user ID.
     *
     * @param {CustomRequest} req - The request object.
     * @param {Response} res - The response object.
     * @return {Promise<void>} - A promise that resolves when the psychologist is retrieved successfully, or rejects with an error.
     */
    async getPsychologistById(req: CustomRequest, res: Response): Promise<void> {
        try {
            // Get the user ID from the request object
            const userId = req.params.userId;

            // Get one document from the 'psychologist' collection where the 'userId' field matches the user ID
            const querySnapshot = await getDocs(query(collection(db, 'psychologists'), where('userId', '==', userId)));

            // If no document is found, return a 404 error
            if (querySnapshot.empty) {
                res.status(404).json({ error: 'Psychologist not found' });
                return;
            }

            // Extract the psychologist data from the document
            const psychologist: Psychologist = {
                userId: querySnapshot.docs[0].data().userId as string, // The user ID of the psychologist
                email: querySnapshot.docs[0].data().email as string, // The email of the psychologist
                firstName: querySnapshot.docs[0].data().firstName as string, // The first name of the psychologist
                lastName: querySnapshot.docs[0].data().lastName as string, // The last name of the psychologist
                address: querySnapshot.docs[0].data().address as string, // The address of the psychologist
            };

            // Send a success response with the psychologist data
            res.status(200).json(psychologist);
        } catch (error) {
            // Send an error response if an error occurred
            res.status(500).json({ error: 'An error occurred while retrieving psychologist' });
        }
    }

    async updatePsychologist(req: CustomRequest, res: Response): Promise<void> {
        try {
            // Get the user ID from the request object
            const userId = req.params.userId;

            // Get the updated data from the request body
            const { firstName, lastName, address } = req.body;

            // Get one document from the 'psychologist' collection where the 'userId' field matches the user ID
            const querySnapshot = await getDocs(query(collection(db, 'psychologists'), where('userId', '==', userId)));

            // If no document is found, return a 404 error
            if (querySnapshot.empty) {
                res.status(404).json({ error: 'Psychologist not found' });
            }

            // Extract the psychologist data from the document
            const psychologist: Psychologist = {
                userId: querySnapshot.docs[0].data().userId as string, // The user ID of the psychologist
                email: querySnapshot.docs[0].data().email as string, // The email of the psychologist
                firstName, // The first name of the psychologist
                lastName, // The last name of the psychologist
                address, // The address of the psychologist
            };

            // Update the 'firstName', 'lastName', and 'address' fields of the psychologist document
            await updateDoc(querySnapshot.docs[0].ref, { ...psychologist });

            // Send a success response with the updated psychologist data
            res.status(200).json(psychologist);
        } catch (error) {
            // Send an error response if an error occurred
            res.status(500).json({ error: 'An error occurred while retrieving psychologist' });
        }
    }

    async getAllApointmentsByPsychologistId(req: CustomRequest, res: Response): Promise<void> {
        try {
            // Get the user ID from the request object
            const userId = req.params.userId;

            // Get all documents from the 'appointments' collection where the 'psychologistId' field matches the user ID
            const querySnapshot = await getDocs(query(collection(db, 'appointments'), where('psychologistId', '==', userId)));

            // If no document is found, return a 404 error
            if (querySnapshot.empty) {
                res.status(404).json({ error: 'Appointments not found' });
            }

            // Extract the appointments data from the documents
            const appointments: Appointment[] = [];
            querySnapshot.forEach((doc) => {
                const appointment: Appointment = {
                    userId: doc.data().userId as string, // The user ID of the appointment
                    psychologistId: doc.data().psychologistId as string, // The psychologist ID of the appointment
                    dateTime: doc.data().dateTime.toDate()
                };
                appointments.push(appointment);
            });

            // Send a success response with the appointments data
            res.status(200).json(appointments);
        } catch (error) {
            // Send an error response if an error occurred
            res.status(500).json({ error: 'An error occurred while retrieving appointments' });
        }
    }
}

export default new PsychologistController();