import { Router } from 'express';
import { loanTypeController } from '../controllers/loanTypeController.js';
import { token } from '../controllers/tokenController.js';

const router = Router();

router.post('/', token.getAuthorization, loanTypeController.createLoanType);
router.get('/', token.getAuthorization, loanTypeController.getAllLoanTypes);
router.get(
  '/:loan_type_id',
  token.getAuthorization,
  loanTypeController.getAllLoanTypes
);
export default router;
