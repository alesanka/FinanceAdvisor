import { Router } from 'express';
import { notesController } from '../controllers/notesController.js';
import { token } from '../../utils/tokenController.js';
import checkUserRole from '../middlewere/checkRole.js';

const router = Router();

router.post(
  '/',
  token.getAuthorization,
  checkUserRole(['worker']),
  notesController.createNotes
); // protected

export default router;
