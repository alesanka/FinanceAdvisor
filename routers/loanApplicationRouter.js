import { Router } from 'express';
import { loanApplicationController } from '../controllers/loanApplicationController.js';
import { maxLoanAmountController } from '../controllers/maxLoanAmountController.js';
import { token } from '../controllers/tokenController.js';

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

export default router;
