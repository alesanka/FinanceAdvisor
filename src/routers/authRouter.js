import { Router } from 'express';
import { authenticationController } from '../controllers/userController.js';
import { token } from '../../utils/tokenController.js';

const router = Router();

router.post('/', authenticationController.authenticateUser, token.getToken);
router.post('/refresh_token', token.getToken); // protected request

export default router;
