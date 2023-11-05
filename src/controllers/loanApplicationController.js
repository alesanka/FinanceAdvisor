import { loanApplicationModel } from '../services/loanApplicationModel.js';
import { userModel } from '../services/userModel.js';
import { maxLoanAmountRepos } from '../repositories/maxLoanAmountRepos.js';

class LoanApplicationController {
  createLoanApplication = async (req, res) => {
    try {
      const { user_id, id, desired_loan_amount, is_approved } = req.body;
      if (!user_id) {
        return res.status(400).send('User id is required for checking role.');
      }

      const isWorker = await userModel.checkUserRoleById(user_id);

      if (isWorker !== 'worker') {
        return res
          .status(403)
          .send('Only workers can create loan applications.');
      }

      const { loanId, requiredDoc } =
        await loanApplicationModel.createLoanApplication(
          id,
          desired_loan_amount,
          is_approved
        );
      res
        .status(201)
        .send(
          `Loan application was created successfully. Loan application id - ${loanId}. Required doc - ${requiredDoc}. `
        );
    } catch (err) {
      console.error(err);
      res.status(500).json({
        message: `Something went wrong while creating new loan application.`,
        error: err.message,
      });
    }
  };
  changeApprovement = async (req, res) => {
    try {
      const application_id = req.params.application_id;

      const userId = req.body.user_id;
      if (!userId) {
        return res.status(400).send('User id is required for checking role.');
      }

      const isWorker = await userModel.checkUserRoleById(userId);

      if (isWorker !== 'worker') {
        return res
          .status(403)
          .send('Only workers can create loan applications.');
      }

      await loanApplicationModel.changeApprovement(application_id);

      res.status(200).send('Loan application status changed on approved');
    } catch (err) {
      console.error(err);
      res.status(500).json({
        message: `Something went wrong while updating status on application.`,
        error: err.message,
      });
    }
  };
}

export const loanApplicationController = new LoanApplicationController();
