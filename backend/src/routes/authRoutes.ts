import { Router } from 'express';

import { signup, login, logout, refresh } from '../services/authServices';

const authRouter = Router();

authRouter.post('/signup', signup);
authRouter.post('/login', login);
authRouter.post('/logout', logout);
authRouter.post('/refresh', refresh);

export default authRouter;