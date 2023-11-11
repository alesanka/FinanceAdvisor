import { Router } from 'express';
import { maxLoanAmountController } from '../controllers/maxLoanAmountController.js';
import { token } from '../../utils/tokenController.js';
import checkUserRole from '../middlewere/checkRole.js';

const router = Router();

router.post(
  '/',
  token.getAuthorization,
  checkUserRole(['worker']),
  maxLoanAmountController.saveMaxLoan
); // protected
router.get('/:max_loan_amount_id', maxLoanAmountController.getMaxLoanAmount); // public
export default router;
