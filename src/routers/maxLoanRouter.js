import { Router } from 'express';
import { maxLoanAmountController } from '../controllers/maxLoanAmountController.js';
import { token } from '../../utils/tokenController.js';

const router = Router();

router.post('/', token.getAuthorization, maxLoanAmountController.saveMaxLoan); // protected

export default router;
