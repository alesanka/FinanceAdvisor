import { Router } from 'express';
import { loanTypeController } from '../controllers/loanTypeController.js';
import { token } from '../../utils/tokenController.js';
import checkUserRole from '../middlewere/checkRole.js';

const router = Router();

router.post(
  '/',
  token.getAuthorization,
  checkUserRole(['admin']),
  loanTypeController.createLoanType
); // protected
router.get('/:loan_type/', loanTypeController.getSpecificLoanType); // public
router.get('/', loanTypeController.getAllLoanTypes); // public

router.put(
  '/:loan_type_id',
  token.getAuthorization,
  checkUserRole(['admin']),
  loanTypeController.updateLoanTypeData
); // protected
export default router;
