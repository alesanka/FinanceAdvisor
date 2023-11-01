import { Router } from 'express';
import { authenticationController } from '../controllers/userController.js';
import { token } from '../controllers/tokenController.js';

const router = Router();

router.post('/', authenticationController.authenticateUser, token.getToken);
router.post('/refresh_token', token.getToken);

export default router;
