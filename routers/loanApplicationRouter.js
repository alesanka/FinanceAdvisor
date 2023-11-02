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
  '/:max_loan_amount_id/loan-information',
  maxLoanAmountController.getMaxLoanAmount
); // public

export default router;
