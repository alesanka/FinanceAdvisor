import { loanTypeModel } from '../models/loanTypeModel.js';

export class LoanTypeController {
  constructor(loanTypeModel) {
    this.loanTypeModel = loanTypeModel;
  }

  createLoanType = async (req, res) => {
    try {
      const loanId = await this.loanTypeModel.createLoanType(
        req.body.loan_type,
        req.body.interest_rate,
        req.body.loan_term,
        req.body.required_doc
      );
      res
        .status(201)
        .send(`Loan type was created successfully. Loan type id - ${loanId}`);
    } catch (err) {
      console.error(err);
      res.status(500).json({
        message: `Something went wrong while creating new type loan.`,
        error: err.message,
      });
    }
  };
  getAllLoanTypes = async (req, res) => {
    try {
      const loanTypes = await this.loanTypeModel.getAllLoanTypes();
      res.status(200).json(loanTypes);
    } catch (err) {
      console.error(err);
      res.status(500).json({
        message: `Something went wrong while getting loan types.`,
        error: err.message,
      });
    }
  };
  getSpecificLoanType = async (req, res) => {
    try {
      const loanType = req.params.loan_type;

      if (!loanType) {
        return res.status(400).send(`No valid loan_type is provided`);
      }

      const loanData = await this.loanTypeModel.findLoanByType(loanType);
      res.status(200).json(loanData);
    } catch (err) {
      console.error(err);
      res.status(500).json({
        message: `Something went wrong while getting loan type.`,
        error: err.message,
      });
    }
  };
  updateLoanTypeData = async (req, res) => {
    try {
      await this.loanTypeModel.updateLoanTypeData(
        req.params.loan_type_id,
        req.body
      );

      res
        .status(200)
        .send(
          `Loan type's data with id - ${req.params.loan_type_id} was updated successfully.`
        );
    } catch (err) {
      console.error(err);
      res.status(500).json({
        message: `Something went wrong while updating loan type.`,
        error: err.message,
      });
    }
  };
}

export const loanTypeController = new LoanTypeController(loanTypeModel);
