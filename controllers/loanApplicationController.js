import { loanApplicationModel } from '../services/loanApplicationModel.js';
import { userModel } from '../services/userModel.js';
import { loanTypeModel } from '../services/loanTypeModel.js';
import { maxLoanAmountModel } from '../services/maxLoalAmountModel.js';
import { repaymentScheduleModel } from '../services/repaymentScheduleModel.js';

class LoanApplicationController {
  createLoanApplication = async (req, res) => {
    try {
      const userId = req.body.user_id;
      if (!userId) {
        return res.status(400).send('User id is required for checking role.');
      }

      const isWorker = await userModel.checkRoleByUserId(userId);

      if (isWorker !== 'worker') {
        return res
          .status(403)
          .send('Only workers can create loan applications.');
      }

      const { client_id, desired_loan_amount } = req.body;

      const isRealClient = await userModel.findClientById(client_id);
      if (!isRealClient) {
        return res.status(400).send('Invalid client id.');
      }

      await loanApplicationModel.createLoanApplication(
        client_id,
        desired_loan_amount
      );
      res.status(201).send('Loan application was created successfully');
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: err.message });
    }
  };
  saveApplicationWithLoanType = async (req, res) => {
    try {
      const { loan_type_id, application_id } = req.query;

      const userId = req.body.user_id;
      if (!userId) {
        return res.status(400).send('User id is required for checking role.');
      }

      const isWorker = await userModel.checkRoleByUserId(userId);

      if (isWorker !== 'worker') {
        return res
          .status(403)
          .send('Only workers can modificate loan applications.');
      }

      const isLoanTypeExists = await loanTypeModel.findLoanById(loan_type_id);
      if (!isLoanTypeExists) {
        throw new Error('Loan type does not exist.');
      }
      const maxAvailableAmount =
        await loanApplicationModel.saveApplicationWithLoanType(
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

      const isWorker = await userModel.checkRoleByUserId(userId);

      if (isWorker !== 'worker') {
        return res
          .status(403)
          .send('Only workers can modificate loan applications.');
      }

      const maxLoanAmountData =
        await maxLoanAmountModel.getMaxLoanAmountByApplicationId(
          application_id
        );

      if (loan_type && loan_type !== maxLoanAmountData.loan_type) {
        return res
          .status(400)
          .send('The provided loan type does not match the application data.');
      }

      const isApproved = await loanApplicationModel.changeApprovement(
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
