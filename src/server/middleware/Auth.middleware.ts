import { Request, Response, NextFunction } from 'express';
import { verify } from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your_secret_key'; 

export const authenticateToken = (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // 'Bearer [token]'

    if (token == null) return res.sendStatus(401); // Unauthorized

    verify(token, JWT_SECRET, (err, user: JwtPayload | undefined) => {
        if (err) return res.sendStatus(403); // Forbidden
        req.user = user; // 사용자 정보 추가
        next();
    });
};
