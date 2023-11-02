import { Router } from 'express';
import { token } from '../controllers/tokenController.js';
import { repaymentScheduleController } from '../controllers/repaymentScheduleController.js';

const router = Router();

router.post(
  '/',
  token.getAuthorization,
  repaymentScheduleController.createRepaymentSchedule
); // protected

export default router;
