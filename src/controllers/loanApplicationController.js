import { loanApplicationModel } from '../models/loanApplicationModel.js';
import { userModel } from '../models/userModel.js';

class LoanApplicationController {
  createLoanApplication = async (req, res) => {
    try {
      const { loanId, requiredDoc } =
        await loanApplicationModel.createLoanApplication(req.body);
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
      await loanApplicationModel.changeApprovement(req.params.application_id);

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
      await loanApplicationModel.deleteLoanApplication(
        req.params.application_id
      );

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
