import { Router } from 'express';
import { loanTypeController } from '../controllers/loanTypeController.js';
import { token } from '../../utils/tokenController.js';

const router = Router();

router.post('/', token.getAuthorization, loanTypeController.createLoanType); // protected
router.get('/:loan_type/', loanTypeController.getSpecificLoanType); // public
router.get('/', loanTypeController.getAllLoanTypes); // public

router.put(
  '/:loan_type_id',
  token.getAuthorization,
  loanTypeController.updateLoanTypeData
); // protected
export default router;
