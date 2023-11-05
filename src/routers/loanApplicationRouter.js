import { Router } from 'express';
import { loanApplicationController } from '../controllers/loanApplicationController.js';
import { token } from '../../utils/tokenController.js';
import { repaymentScheduleController } from '../controllers/repaymentScheduleController.js';

const router = Router();

router.post(
  '/',
  token.getAuthorization,
  loanApplicationController.createLoanApplication
); // protected
router.put(
  '/:application_id/approved',
  token.getAuthorization,
  loanApplicationController.changeApprovement
); // protected
router.delete(
  '/:application_id',
  token.getAuthorization,
  loanApplicationController.deleteLoanApplication
); // protected
router.post(
  '/:application_id/repayment_schedule',
  token.getAuthorization,
  repaymentScheduleController.createRepaymentSchedule
); // protected

export default router;
