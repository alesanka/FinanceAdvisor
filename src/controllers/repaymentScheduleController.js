import { loanApplicationRepos } from '../repositories/loanApplicationRepos.js';
import { userRepos } from '../repositories/userRepos.js';
import { maxLoanAmountRepos } from '../repositories/maxLoanAmountRepos.js';
import { repaymentScheduleRepos } from '../repositories/repaymentScheduleRepos.js';

class RepaymentScheduleController {
  createRepaymentSchedule = async (req, res) => {
    try {
      const { application_id, user_id } = req.body;

      if (!user_id) {
        return res.status(400).send('User id is required for checking role.');
      }

      const isWorker = await userRepos.checkRoleByUserId(user_id);

      if (isWorker !== 'worker') {
        return res
          .status(403)
          .send('Only workers can modify loan applications.');
      }

      const maxLoanAmountData =
        await maxLoanAmountRepos.getMaxLoanAmountByApplicationId(
          application_id
        );

      const isApproved = await loanApplicationRepos.checkApprovement(
        application_id
      );

      if (!isApproved) {
        return res.status(404).send('Loan application not found.');
      }

      const repaymentSchedule =
        await repaymentScheduleRepos.createRepaymentSchedule(
          application_id,
          maxLoanAmountData.loan_term,
          maxLoanAmountData.interest_rate,
          maxLoanAmountData.max_loan_amount
        );

      res.status(200).json({
        repaymentSchedule: repaymentSchedule,
      });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: err.message });
    }
  };
}

export const repaymentScheduleController = new RepaymentScheduleController();
