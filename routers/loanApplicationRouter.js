import { Router } from 'express';
import { loanApplicationController } from '../controllers/loanApplicationController.js';
import { token } from '../controllers/tokenController.js';

const router = Router();

router.post(
  '/',
  token.getAuthorization,
  loanApplicationController.createLoanApplication
); // protected

export default router;
