import { Request } from 'express';

interface CustomRequest extends Request {
    user?: any
}

export { CustomRequest };