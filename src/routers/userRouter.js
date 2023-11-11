import { Router } from 'express';
import { userController } from '../controllers/userController.js';
import { token } from '../../utils/tokenController.js';

const router = Router();

router.get(
  '/:userId(\\d+)',
  token.getAuthorization,
  userController.getUserById
); // protected
router.get(
  '/filter/filter',
  token.getAuthorization,
  userController.filterByParameter
); // protected
router.get('/', userController.getAllUsers); // public
router.put('/:userId', token.getAuthorization, userController.updateData); // protected
router.delete('/:userId', token.getAuthorization, userController.deleteUser); // protected

export default router;
