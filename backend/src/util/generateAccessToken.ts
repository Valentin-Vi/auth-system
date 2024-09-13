import { User } from '../types/user';
const jwt = require('jsonwebtoken');

export const generateAccessToken = (
    user: User
): string => {
    return jwt.sign(
        { user },
        process.env.ACCESS_JWT_SECRET,
        { expiresIn: process.env.ACCESS_JWT_LIFE });
};

export const verifyAccessToken = (
    access_token: string
): any => {
    return jwt.verify(access_token, process.env.ACCESS_JWT_SECRET);
};