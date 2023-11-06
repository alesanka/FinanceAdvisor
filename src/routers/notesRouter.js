import { Router } from 'express';
import { notesController } from '../controllers/notesController.js';
import { token } from '../../utils/tokenController.js';

const router = Router();

router.post('/', token.getAuthorization, notesController.createNotes); // protected

export default router;
