import { Router } from 'express';
import { userController } from '../controllers/userController.js';
import { token } from '../controllers/tokenController.js';

const router = Router();

router.get(
  '/:userId(\\d+)',
  token.getAuthorization,
  userController.getUserById
); // protected
router.get('/filter', token.getAuthorization, userController.filterByParameter); // protected
router.get('/', userController.filterByParameter); // public
router.delete('/:userId', token.getAuthorization, userController.deleteUser); // protected
router.put('/:userId', token.getAuthorization, userController.changeData); // protected

export default router;
