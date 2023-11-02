import { loanApplicationModel } from '../services/loanApplicationModel.js';
import { userModel } from '../services/userModel.js';
import { loanTypeModel } from '../services/loanTypeModel.js';

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
}

export const loanApplicationController = new LoanApplicationController();
