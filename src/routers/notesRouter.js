import { Router } from 'express';
import { notesController } from '../controllers/notesController.js';
import { token } from '../../utils/tokenController.js';
import { roleWorker } from '../middlewere/checkRole.js';

const router = Router();

router.post(
  '/',
  token.getAuthorization,
  roleWorker.validateUserRole,
  notesController.createNotes
); // protected

router.get(
  '/:repayment_schedule_id',
  notesController.getAllNotesForRepaymentSchedule
); // public

router.put(
  '/:note_id ',
  token.getAuthorization,
  roleWorker.validateUserRole,
  notesController.updatePaymentStatus
); // protected

router.delete('/:note_id ', token.getAuthorization, notesController.deleteNote); // protected

export default router;
