import cookieParser from 'cookie-parser';
import cors from 'cors';
import express from 'express';

import problemRouter from './routes/problemRoute.js';
import submissionRouter from './routes/submissionRoute.js';
import authRouter from './routes/userAuth.js';

const app = express();
app.use(cors({origin: 'http://localhost:5173', credentials: true}));

// Parse JSON request bodies
app.use(express.json());

// Parse cookies
app.use(cookieParser());
// Route for user authentication:
app.use('/auth', authRouter);

// Route for problems:
app.use('/problems', problemRouter);

// Route for submissions:
app.use('/submissions', submissionRouter);

export default app;
