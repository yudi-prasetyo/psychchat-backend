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
    doc,
    getDoc,
    Timestamp
} from 'firebase/firestore';
import { Response } from "express";
import { CustomRequest } from '../helper/types';
import { validationResult } from 'express-validator';
import Appointment from '../models/appointmentModel';
import { Roles } from '../helper/enums';

const auth = getAuth();
const db = getFirestore(firebase);

class AppointmentController {
    async createAppointment(req: CustomRequest, res: Response): Promise<void> {
        try {
            const { userId, psychologistId } = req.body;

            const appointment = new Appointment(userId, psychologistId);

            const docRef = await addDoc(collection(db, 'appointments'), { ...appointment });
            res.status(201).json({ message: 'Appointment with ID ' + docRef.id + ' created successfully', id: docRef.id });
        } catch (error) {
            console.log("[ERR]: " + error);
            res.status(500).json({ error: 'Failed to create appointment' });
        }
    }

    async getAppointmentById(req: CustomRequest, res: Response): Promise<void> {
        try {
            const { id } = req.params;

            const docRef = doc(db, 'appointments', id);
            const docSnap = await getDoc(docRef);

            if (docSnap.exists()) {
                if (req.user.uid === docSnap.data().userId) {
                    const appointment = new Appointment(
                        docSnap.data().userId,
                        docSnap.data().psychologistId,
                        docSnap.data().dateTime.toDate(),
                    );
                    res.status(200).json({ ...appointment });
                } else {
                    res.status(403).json({ error: 'Unauthorized' });
                }
            } else {
                res.status(404).json({ error: 'Appointment not found' });
            }
        } catch (error) {
            console.log("[ERR]: " + error);
            res.status(500).json({ error: 'Failed to get appointment' });
        }
    }
}

export default new AppointmentController();