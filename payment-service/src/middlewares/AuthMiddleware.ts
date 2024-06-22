// authMiddleware.js
const jwt = require("jsonwebtoken");
import { Request, Response, NextFunction } from 'express';

const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
        return res.status(401).json({ message: 'Authorization header is missing' });
    }

    const token = authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({ message: 'Token is missing' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        if (decoded.service === 'product-service') {
            next();
        } else {
            return res.status(403).json({ message: 'Forbidden: Invalid service type' });
        }
    } catch (err) {
        return res.status(403).json({ message: 'Invalid token' });
    }
};

export default authMiddleware;
