import express from 'express';
import userRouter from './routers/userRouter.js';
import registerRouter from './routers/registrationRouter.js';
import authRouter from './routers/authRouter.js';
import loanTypeRouter from './routers/loanTypeRouter.js';
import loanApplicationRouter from './routers/loanApplicationRouter.js';
import documentRouter from './routers/documentRouter.js';
import repaymentScheduleRouter from './routers/repaymentScheduleRouter.js';
import repaymentNotesRouter from './routers/notesRouter.js';
import maxLoanAmountRouter from './routers/maxLoanRouter.js';

const router = express.Router();

router.use('/register', registerRouter);
router.use('/login', authRouter);
router.use('/users', userRouter);
router.use('/loan_types', loanTypeRouter);
router.use('/max_loan_amounts', maxLoanAmountRouter);
router.use('/applications', loanApplicationRouter);
router.use('/documents', documentRouter);
router.use('/repayment_schedule', repaymentScheduleRouter);
router.use('/repayment_notes', repaymentNotesRouter);

export default router;
