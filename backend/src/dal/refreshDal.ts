import { RefreshToken } from '../types/refreshToken';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const createRefreshToken = async (
    refresh_token: RefreshToken
): Promise<RefreshToken | null> => {
    const created_refresh_token: RefreshToken | null = await prisma.refreshToken.create({
        data: {
            user_id: refresh_token?.user_id,
            refresh_token: refresh_token?.refresh_token
        },
    });

    return created_refresh_token;
};

export const readByRefreshToken = async (
    refresh_token: string
): Promise<RefreshToken | null> => {
    const readRefreshToken: RefreshToken | null = await prisma.refreshToken.findUnique({
        where: {
            refresh_token: refresh_token
        },
    });

    return readRefreshToken;
};

export const readByUser_id = async (
    user_id: number
): Promise<RefreshToken | null> => {
    const readRefreshToken: RefreshToken | null = await prisma.refreshToken.findUnique({
        where: {
            user_id: user_id
        },
    });

    return readRefreshToken;
};

export const readAll = async (
): Promise<RefreshToken[] | null> => {
    const read_refresh_tokens: RefreshToken[] | null = await prisma.refreshToken.findMany();

    return read_refresh_tokens;
};

export const updateByUser_id = async (
    refresh_token: RefreshToken
): Promise<RefreshToken | null> => {
    const updated_refresh_token: RefreshToken | null = await prisma.refreshToken.update({
        where: {
            user_id: refresh_token.user_id
        }, 
        data: {
            refresh_token: refresh_token.refresh_token,
        },
    });

    return updated_refresh_token;
};

export const removeByUser_id = async (
    user_id: number
): Promise<RefreshToken | null> => {
    const refresh_token: RefreshToken | null = await prisma.refreshToken.delete({
        where: {
            user_id: user_id
        },
    });

    return refresh_token
};