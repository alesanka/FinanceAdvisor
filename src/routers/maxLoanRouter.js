import { Router } from 'express';
import { maxLoanAmountController } from '../controllers/maxLoanAmountController.js';
import { token } from '../../utils/tokenController.js';
import { roleWorker } from '../middlewere/checkRole.js';

const router = Router();

router.get('/:max_loan_amount_id', maxLoanAmountController.getMaxLoanAmount); // public
router.post(
  '/',
  token.getAuthorization,
  roleWorker.validateUserRole,
  maxLoanAmountController.saveMaxLoan
); // protected
router.delete(
  '/:max_loan_amount_id',
  maxLoanAmountController.deleteMaxLoanApplication
); // protected
export default router;
