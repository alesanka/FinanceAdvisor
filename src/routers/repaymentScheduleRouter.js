import { Router } from 'express';
import { token } from '../../utils/tokenController.js';
import { repaymentScheduleController } from '../controllers/repaymentScheduleController.js';
import { roleWorker } from '../middlewere/checkRole.js';

const router = Router();

router.post(
  '/',
  token.getAuthorization,
  roleWorker.validateUserRole,
  repaymentScheduleController.createRepaymentSchedule
); // protected
router.put(
  '/:repayment_schedule_id',
  token.getAuthorization,
  roleWorker.validateUserRole,
  repaymentScheduleController.updateRemainBalance
); // protected
router.get(
  '/note',
  repaymentScheduleController.getPaymentAmountByScheduleIdAndMonthYear
); // public
router.delete(
  '/:repayment_schedule_id',
  token.getAuthorization,
  repaymentScheduleController.deleteSchedule
); // protected

export default router;
