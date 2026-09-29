import express from 'express';

import {getProblemSubmissions, saveSubmission,} from '../controllers/submissionControl.js';
import authUserMiddleware from '../middleware/authUserMiddleware.js';

const submissionRouter = express.Router();

submissionRouter.post('/save/:id', authUserMiddleware, saveSubmission);

submissionRouter.get('/problem/:id', authUserMiddleware, getProblemSubmissions);

export default submissionRouter;