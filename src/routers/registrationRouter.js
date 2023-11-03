import { Router } from 'express';
import { authenticationController } from '../controllers/userController.js';

const router = Router();

router.post('/', authenticationController.registerUser);

export default router;
