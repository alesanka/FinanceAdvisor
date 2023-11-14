import { Router } from 'express';
import { loanApplicationController } from '../controllers/loanApplicationController.js';
import { token } from '../../utils/tokenController.js';
import { repaymentScheduleController } from '../controllers/repaymentScheduleController.js';
import checkUserRole from '../middlewere/checkRole.js';

const router = Router();

router.post(
  '/',
  token.getAuthorization,
  checkUserRole(['worker']),
  loanApplicationController.createLoanApplication
); // protected
router.put(
  '/:application_id/approved',
  token.getAuthorization,
  checkUserRole(['worker']),
  loanApplicationController.changeApprovement
); // protected
router.delete(
  '/:application_id',
  token.getAuthorization,
  checkUserRole(['worker']),
  loanApplicationController.deleteLoanApplication
); // protected
router.post(
  '/:application_id/repayment_schedule',
  token.getAuthorization,
  checkUserRole(['worker']),
  repaymentScheduleController.createRepaymentSchedule
); // protected
router.get(
  '/',
  token.getAuthorization,
  loanApplicationController.getAllApplications
); // protected

export default router;
