import { Router } from 'express';
import { loanApplicationController } from '../controllers/loanApplicationController.js';
import { maxLoanAmountController } from '../controllers/maxLoanAmountController.js';
import { token } from '../../utils/tokenController.js';
import { repaymentScheduleController } from '../controllers/repaymentScheduleController.js';

const router = Router();

router.post(
  '/save',
  token.getAuthorization,
  loanApplicationController.saveApplicationWithLoanType
); // protected
router.post(
  '/',
  token.getAuthorization,
  loanApplicationController.createLoanApplication
); // protected
router.get(
  '/:max_loan_amount_id/max_available_amount',
  maxLoanAmountController.getMaxLoanAmount
); // public
router.put(
  '/:application_id/approved',
  token.getAuthorization,
  loanApplicationController.changeApprovement
); // protected
router.post(
  '/:application_id/repayment_schedule',
  token.getAuthorization,
  repaymentScheduleController.createRepaymentSchedule
); // protected

export default router;
