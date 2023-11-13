import { Router } from 'express';
import { token } from '../../utils/tokenController.js';
import { repaymentScheduleController } from '../controllers/repaymentScheduleController.js';
import checkUserRole from '../middlewere/checkRole.js';

const router = Router();

router.post(
  '/',
  token.getAuthorization,
  checkUserRole(['worker']),
  repaymentScheduleController.createRepaymentSchedule
); // protected
router.put(
  '/:repayment_schedule_id',
  token.getAuthorization,
  checkUserRole(['worker']),
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
