import { Router } from 'express';
import { notesController } from '../controllers/notesController.js';
import { token } from '../../utils/tokenController.js';

const router = Router();

router.post('/', token.getAuthorization, notesController.createNotes); // protected
router.get('/note', notesController.getPaymentAmountByScheduleIdAndMonthYear); // public

export default router;
