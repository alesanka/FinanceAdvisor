import { loanApplicationModel } from '../services/loanApplicationModel.js';
import { userModel } from '../services/userModel.js';

class LoanApplicationController {
  createLoanApplication = async (req, res) => {
    try {
      const { user_id, id, desired_loan_amount, is_approved } = req.body;
   
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
  deleteLoanApplication = async (req, res) => {
    try {
      const application_id = req.params.application_id;

      await loanApplicationModel.deleteLoanApplication(application_id);

      res.status(204).end();
    } catch (err) {
      console.error(err);
      res.status(500).json({
        message: `Something went wrong while deleting loan application.`,
        error: err.message,
      });
    }
  };
}

export const loanApplicationController = new LoanApplicationController();
