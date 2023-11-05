import { loanApplicationModel } from '../services/loanApplicationModel.js';
import { userModel } from '../services/userModel.js';
import { loanTypeRepos } from '../repositories/loanTypeRepos.js';
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

      const loanId = await loanApplicationModel.createLoanApplication(
        id,
        desired_loan_amount,
        is_approved
      );
      res
        .status(201)
        .send(
          `Loan application was created successfully. Loan application id - ${loanId}`
        );
    } catch (err) {
      console.error(err);
      res.status(500).json({
        message: `Something went wrong while creating new loan application.`,
        error: err.message,
      });
    }
  };
  saveApplicationWithLoanType = async (req, res) => {
    try {
      const { loan_type_id, application_id } = req.query;

      const userId = req.body.user_id;
      if (!userId) {
        return res.status(400).send('User id is required for checking role.');
      }

      const isWorker = await userRepos.checkRoleByUserId(userId);

      if (isWorker !== 'worker') {
        return res
          .status(403)
          .send('Only workers can modificate loan applications.');
      }

      const isLoanTypeExists = await loanTypeRepos.findLoanById(loan_type_id);
      if (!isLoanTypeExists) {
        throw new Error('Loan type does not exist.');
      }
      const maxAvailableAmount =
        await loanApplicationRepos.saveApplicationWithLoanType(
          loan_type_id,
          application_id
        );
      res.status(200).json({ 'maxAvailableAmount id': maxAvailableAmount });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: err.message });
    }
  };

  changeApprovement = async (req, res) => {
    try {
      const application_id = req.params.application_id;
      const loan_type = req.query.loan_type;

      const userId = req.body.user_id;
      if (!userId) {
        return res.status(400).send('User id is required for checking role.');
      }

      const isWorker = await userRepos.checkRoleByUserId(userId);

      if (isWorker !== 'worker') {
        return res
          .status(403)
          .send('Only workers can modificate loan applications.');
      }

      const maxLoanAmountData =
        await maxLoanAmountRepos.getMaxLoanAmountByApplicationId(
          application_id
        );

      if (loan_type && loan_type !== maxLoanAmountData.loan_type) {
        return res
          .status(400)
          .send('The provided loan type does not match the application data.');
      }

      const isApproved = await loanApplicationRepos.changeApprovement(
        application_id
      );
      if (!isApproved) {
        return res
          .status(404)
          .send("Loan application not found or can't change status.");
      }

      res.status(200).send('Status changed on approved');
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: err.message });
    }
  };
}

export const loanApplicationController = new LoanApplicationController();
