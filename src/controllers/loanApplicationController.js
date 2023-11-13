import { loanApplicationModel } from '../models/loanApplicationModel.js';

export class LoanApplicationController {
  constructor(loanApplicationModel) {
    this.loanApplicationModel = loanApplicationModel;
  }
  createLoanApplication = async (req, res) => {
    try {
      const { loanId, requiredDoc } =
        await this.loanApplicationModel.createLoanApplication(
          req.body.id,
          req.body.desired_loan_amount,
          req.body.is_approved
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
      await this.loanApplicationModel.changeApprovement(
        req.params.application_id
      );

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
      await this.loanApplicationModel.deleteLoanApplication(
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

export const loanApplicationController = new LoanApplicationController(
  loanApplicationModel
);
