import { Router } from 'express';
import { loanTypeController } from '../controllers/loanTypeController.js';
import { token } from '../controllers/tokenController.js';

const router = Router();

router.post('/', token.getAuthorization, loanTypeController.createLoanType); // protected
router.get('/', loanTypeController.getAllLoanTypes); // public
router.get(
  '/:loan_type',
  token.getAuthorization,
  loanTypeController.getSpecificLoanType
);
router.put(
  '/:loan_type_id',
  token.getAuthorization,
  loanTypeController.updateLoanTypeData
);
export default router;
