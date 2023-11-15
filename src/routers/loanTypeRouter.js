import { Router } from 'express';
import { loanTypeController } from '../controllers/loanTypeController.js';
import { token } from '../../utils/tokenController.js';
import {roleAdmin} from '../middlewere/checkRole.js';

const router = Router();

router.post(
  '/',
  token.getAuthorization,
  roleAdmin.validateUserRole,
  loanTypeController.createLoanType
); // protected
router.get('/:loan_type/', loanTypeController.getSpecificLoanType); // public
router.get('/', loanTypeController.getAllLoanTypes); // public

router.put(
  '/:loan_type_id',
  token.getAuthorization,
  roleAdmin.validateUserRole,
  loanTypeController.updateLoanTypeData
); // protected

router.delete(
  '/:loan_type_id',
  token.getAuthorization,
  loanTypeController.deleteLoanType
); // protected

export default router;
