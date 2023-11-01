import { Router } from 'express';
import { userController } from '../controllers/userController.js';
import { token } from '../controllers/tokenController.js';

const router = Router();

router.get('/:userId', token.getAuthorization, userController.getUserById);
router.get('/', token.getAuthorization, userController.filterByParameter);
router.delete('/:userId', token.getAuthorization, userController.deleteUser);
router.put('/:userId', token.getAuthorization, userController.changeData);

export default router;