import { maxLoanAmountModel } from '../models/maxLoanAmountModel.js';

class MaxLoanAmountController {
  constructor(maxLoanAmountModel) {
    this.maxLoanAmountModel = maxLoanAmountModel;
  }
  saveMaxLoan = async (req, res) => {
    try {
      const id = await this.maxLoanAmountModel.saveMaxLoan(
        req.body.client_id,
        req.body.loan_type_id
      );

      res
        .status(200)
        .send(
          `Max avaiable loan amount with id - ${id} was saved successfully.`
        );
    } catch (err) {
      console.error(err);
      res.status(500).json({
        message: `Something went wrong while saving max available loan amount.`,
        error: err.message,
      });
    }
  };

  getMaxLoanAmount = async (req, res) => {
    try {
      const maxAvailableAmount = await this.maxLoanAmountModel.getMaxLoanAmount(
        req.params.max_loan_amount_id
      );

      res.status(200).json(maxAvailableAmount);
    } catch (err) {
      console.error(err);
      res.status(500).json({
        message: `Something went wrong while getting max available loan amount.`,
        error: err.message,
      });
    }
  };
}

export const maxLoanAmountController = new MaxLoanAmountController(
  maxLoanAmountModel
);
