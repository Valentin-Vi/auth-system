import { User, isUser } from '../types/user';
const jwt = require('jsonwebtoken');

export const generateRefreshToken = (
    user: User
): string => {
    return jwt.sign(
        { user },
        process.env.REFRESH_JWT_SECRET,
        { expiresIn: process.env.REFRESH_JWT_LIFE });
};

export const verifyRefreshToken = (
    refresh_token: string
): User | null => {
    return jwt.verify(refresh_token, process.env.REFRESH_JWT_SECRET)?.user;
};