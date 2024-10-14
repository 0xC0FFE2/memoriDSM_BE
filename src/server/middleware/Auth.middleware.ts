import { Request, Response, NextFunction } from 'express';
import axios from 'axios';

export const USER_PROTECT = async (req: Request, res: Response, next: NextFunction) => {
    const accessToken = req.headers['auth'] as string;
    if (accessToken) {
        const isExpired = await isTokenExpired(accessToken);
        if (!isExpired) {
            return next();
        }
    }

    res.status(403).json({ message: 'Forbidden: Access token is invalid or expired.' }); // 인증 실패 시 403 반환
}

async function isTokenExpired(token: string): Promise<boolean> {
    try {
        const response = await axios.post('https://auth.nanu.cc/api/mypage', {}, {
            headers: { 'Authorization': `Bearer ${token}` }
        });

        return response.status !== 200;
    } catch (error) {
        console.error('Error validating token:', error);
        return true; 
    }
}
