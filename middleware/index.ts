import { admin, firebase } from "../config/firebaseConfig";
import { Response, NextFunction } from 'express';
import { DecodedIdToken } from 'firebase-admin/auth';
import { CustomRequest } from "../helper/types";
import { collection, getDocs, getFirestore, query, where } from "firebase/firestore";
import { Roles } from "../helper/enums";

const db = getFirestore(firebase);

/**
 * Middleware function to verify the token in the request cookies.
 *
 * @param {CustomRequest} req - The request object.
 * @param {Response} res - The response object.
 * @param {NextFunction} next - The next middleware function.
 * @returns {Promise<void>} - A promise that resolves when the token is verified successfully.
 * @throws {Response} - A response with an error message if the token is not provided or if verification fails.
 */
const verifyToken = async (
    req: CustomRequest,
    res: Response,
    next: NextFunction
): Promise<void> => {
    const idToken: string | undefined = req.cookies.access_token;
    if (!idToken) {
        res.status(403).json({ error: 'No token provided' });
    }

    try {
        const decodedToken: DecodedIdToken = await admin.auth().verifyIdToken(idToken as string);
        req.user = decodedToken;
        const querySnapshot = await getDocs(query(collection(db, 'roles'), where('userId', '==', req.user.uid)));

        const role: Roles = querySnapshot.docs[0].data().role;
        req.user.role = role;
        next();
    } catch (error) {
        console.error('Error verifying token:', error);
        res.status(403).json({ error: 'Unauthorized' });
    }
};

const restrictByRole = (roles: Roles[]) => {
    return (req: CustomRequest, res: Response, next: NextFunction) => {
        if (roles.includes(req.user.role)) {
            next();
        } else {
            res.status(403).json({ error: "This user's role is not permitted to perform this action" });
        }
    };
};

const restrictByUserId = async (
    req: CustomRequest,
    res: Response,
    next: NextFunction
): Promise<void> => {
    if (req.user.uid === req.params.userId) {
        next();
    } else {
        res.status(403).json({ error: 'This user is not permitted to perform this action' });
    }
};


export { verifyToken, restrictByRole, restrictByUserId };