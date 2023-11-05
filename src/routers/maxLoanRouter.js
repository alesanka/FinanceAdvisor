import { Router } from 'express';
import { maxLoanAmountController } from '../controllers/maxLoanAmountController.js';
import { token } from '../../utils/tokenController.js';

const router = Router();

router.post('/', token.getAuthorization, maxLoanAmountController.saveMaxLoan); // protected
router.get('/:max_loan_amount_id', maxLoanAmountController.getMaxLoanAmount); // public
export default router;
