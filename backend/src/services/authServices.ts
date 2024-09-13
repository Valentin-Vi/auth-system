import { Request, Response, NextFunction } from 'express';
import { create, readById, readByEmail } from '../dal/userDal';
import { generateAccessToken } from '../util/generateAccessToken';
import { generateRefreshToken, verifyRefreshToken } from '../util/generateRefreshToken';
import { createRefreshToken, readByUser_id, removeByUser_id, updateByUser_id } from '../dal/refreshDal';
import { User } from '../types/user';
const bcrypt = require('bcrypt');

// async function signup(Request, Response, NextFunction): any
// @params: Request, Response, NextFunction
// @output: any
// 
// Purpose:
// Validate Request.body signup information (email, password, firstname, lastname)
// to comply with conditions: email is unique, password & firstname & lastname not null.
// Then persist user information and redirect.
export const signup = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const email = req.body?.email;
    const password = req.body?.password;
    const firstname = req.body?.firstname;
    const lastname = req.body?.lastname;

    if(!email || !password || !firstname || !lastname) return res.sendStatus(400);

    if(await readByEmail(email)) return res.status(400).send('Email already in use.');

    const user = await create({
        user_id: NaN,
        email: req.body?.email,
        firstname: req.body?.firstname,
        lastname: req.body?.lastname,
        password: req.body?.password,
        role: NaN
    });

    if(!user) return res.status(400).send('User could not be created...');

    res.sendStatus(200);
};

// async function login(Request, Response, NextFunction): any
// @params: Request, Response, NextFunction
// @outputs: any
// 
// login function reads the user off the database using the users email.
// Then it compares the provided password to the one in the database.
// If a user is not found or the password is incorrect it returns a Response object with http status doe 404.
// If the user is found and the passwords match, it checks for an existing RefreshToken object assosiated to the user.
// If a user's RefreshToken is found it assigns the value within a cookie, and if it's not found it generates a new RefreshToken.
// Finally, a AccessToken string is generated and stored within a cookie and a JSON object is assigned to the response.
//
// In case of error, cookie values are cleared and a http status code of 500 is sent.
export const login = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const user = await readByEmail(req.body.email);

        if(!user || !await bcrypt.compareSync(req.body.password, user.password)) return res.sendStatus(404);

        const refresh_token = await readByUser_id(user.user_id);
        
        if(refresh_token) {
            res.cookie(
            'refresh_token',
            refresh_token.refresh_token,
                {
                    httpOnly: true,
                    sameSite: 'lax',
                    maxAge: 1000 * 60 * 60 * 24 * 365 * 10,
                }
            );    
        } else {
            const refresh_token = generateRefreshToken(user);
            res.cookie(
                'refresh_token',
                refresh_token,
                {
                    httpOnly: true,
                    sameSite: 'lax',
                    maxAge: 1000 * 60 * 60 * 24 * 30, // ~ 1 month
                }
            );
            createRefreshToken({
                refresh_token: refresh_token,
                user_id: user.user_id,
            });
        };
        
        res.cookie(
            'access_token',
            generateAccessToken(user),
            {
                httpOnly: true,
                sameSite: 'lax',
                maxAge: 1000 * 60 * 15, // 15 minutes
            }
        );
        
        res.cookie('user', user, {
            httpOnly: true,
            sameSite: 'lax',
            maxAge: 1000 * 60 * 60 * 24 * 365 * 10,
        });

        res.json({
            role: user.role,
            email: user.email,
            firstname: user.firstname,
            lastname: user.lastname,
        });

    } catch(err) {
        console.log(err);
        res.clearCookie('access_token');
        res.clearCookie('refresh_token');

        return res.sendStatus(500);
    }  
    return res;
};

export const logout = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    clearAuthCookies(res);
    removeByUser_id(req.cookies.user.user_id);
    return res.status(200).send('Cookies cleared. Logged out succesfully.');
};

// async function refresh(Request, Response, NextFunction)
// @params: Request, Response, NextFuntion
// @output: any
//
// Purpose:
// Provided a refresh_token string value withing a cookie of key 'refresh_token', validate refresh_token and then update to a
// newly genrated one within the databse.
// Then update cookies values of keys access_token and refresh_token.
export const refresh = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    // Validations
    // Check if cookie value for key refresh_token is provided;
    // Check if refresh_token is valid
    // Check if the user of the valid refresh_token is not falsey.
    // Read user off DB with email and check if it is equal.
    try {
        const provided_refresh_token = req.cookies.refresh_token;
        if(!provided_refresh_token) return res.status(200).send('No cookie value for key "refresh_token" provided.')

        const user: User | null = verifyRefreshToken(provided_refresh_token);
        if(!user) return res.status(400).send('RefreshToken value not of expected object shape.');      
        
        // ERROR IN USER COMPARISON.
        // Requirement: Check both provided user and read user are equal. As to verify identity.
        const read_user = await readByEmail(user.email);
        // 1. Check if read_user is null or undefined
        if (!read_user) {
            return res.status(404).send('User not found.1');
        }

        // 2. Check if emails don't match
        if (read_user.email != user.email) {
            return res.status(404).send('User not found.2');
        }

        // 3. Check if passwords don't match
        if (read_user.password !== user.password) {
            return res.status(404).send('User not found.3');
        }
        //

        // Assignations
        const new_refresh_token = generateRefreshToken(user);

        updateByUser_id({
            refresh_token: new_refresh_token,
            user_id: read_user.user_id
        });

        res.cookie('refresh_token', new_refresh_token, {
            httpOnly: true,
            sameSite: 'lax',
            path: '/',
        });

        const new_access_token = generateAccessToken(read_user);
        res.cookie('access_token', new_access_token, {
            httpOnly: true,
            sameSite: 'lax',
            path: '/',
        });

        res.cookie('user', read_user, {
            httpOnly: true,
            sameSite: 'lax',
            path: '/',
        });

        res.json({
            role: user.role,
            email: user.email,
            firstname: user.firstname,
            lastname: user.lastname,
        });
        
    } catch(err) {
        console.error(err);
        clearAuthCookies(res);
        res.status(500).send('Internal Server Error. Cleared cookies.');
    }
};

function clearAuthCookies(res: Response) {
    res.clearCookie('access_token', {
        httpOnly: true,
        sameSite: 'lax',
        path: '/',
    });

    res.clearCookie('refresh_token', {
        httpOnly: true,
        sameSite: 'lax',
        path: '/',
    });

    res.clearCookie('user', {
        httpOnly: true,
        sameSite: 'lax',
        path: '/',
    });
};