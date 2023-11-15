import { Router } from 'express';
import { loanApplicationController } from '../controllers/loanApplicationController.js';
import { token } from '../../utils/tokenController.js';
import { repaymentScheduleController } from '../controllers/repaymentScheduleController.js';
import { roleWorker } from '../middlewere/checkRole.js';

const router = Router();

router.post(
  '/',
  token.getAuthorization,
  roleWorker.validateUserRole,
  loanApplicationController.createLoanApplication
); // protected
router.put(
  '/:application_id/approved',
  token.getAuthorization,
  roleWorker.validateUserRole,
  loanApplicationController.changeApprovement
); // protected
router.delete(
  '/:application_id',
  token.getAuthorization,
  roleWorker.validateUserRole,
  loanApplicationController.deleteLoanApplication
); // protected
router.post(
  '/:application_id/repayment_schedule',
  token.getAuthorization,
  roleWorker.validateUserRole,
  repaymentScheduleController.createRepaymentSchedule
); // protected
router.get(
  '/',
  token.getAuthorization,
  loanApplicationController.getAllApplications
); // protected

export default router;
