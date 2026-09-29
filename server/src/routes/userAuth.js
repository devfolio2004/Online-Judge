import express from 'express';
const authRouter = express.Router();
import {register, login, logout, getProfile, promoteToAdmin, deleteMyProfile,} from '../controllers/userAuthent.js';
import authUserMiddleware from '../middleware/authUserMiddleware.js';
import authAdminMiddleware from '../middleware/authAdminMiddleware.js';


authRouter.post('/register', register);
authRouter.post('/login', login);
authRouter.get('/me', authUserMiddleware, getProfile);
authRouter.post('/logout', authUserMiddleware, logout);
authRouter.post('/admin/register', authAdminMiddleware, promoteToAdmin);
authRouter.delete('/deleteMyProfile', authUserMiddleware, deleteMyProfile);



export default authRouter;
