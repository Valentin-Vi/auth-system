import { User } from '../types/user';
import { PrismaClient } from '@prisma/client';

const bcrypt = require('bcrypt');
const prisma = new PrismaClient();

export const create = async (
    user: User
): Promise<User> => {
    return await prisma.user.create({
        data: {
            email: user?.email,
            password: await bcrypt.hash(user?.password, 10),
            firstname: user?.firstname,
            lastname: user?.lastname,
        },
    });
};

export const readById = async (
    user_id: number
): Promise<User | null> => {
    const user = await prisma.user.findFirst({
        where: {
            user_id: user_id
        },
    });

    if(!user) return null;

    return user;
};

export const readByEmail = async (
    email: string
): Promise<User | null> => {
    const user = await prisma.user.findFirst({
        where: {
            email: email
        },
    });

    if(!user) return null;

    return user;
}

export const readAll = async (
): Promise<User[]> => {
    return await prisma.user.findMany();
};

export const update = async (
    user: User
): Promise<User> => {
    return await prisma.user.update({
        where: {
            user_id: user.user_id
        }, 
        data: {
            email: user?.email,
            password: user?.password,
            firstname: user?.firstname,
            lastname: user?.lastname,
            role: user?.role
        },
    });
};

export const remove = async (
    user: User
): Promise<User> => {
    return await prisma.user.delete({
        where: {
            user_id: user.user_id
        },
    });
};