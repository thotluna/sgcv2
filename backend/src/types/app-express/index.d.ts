import { Request } from 'express';

declare global {
    namespace Express {
        interface User {
            id: string;
            username: string;
            role: string;
            roles: string[];
        }

        interface Request {
            id: string;
        }
    }
}