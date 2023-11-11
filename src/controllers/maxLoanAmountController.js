import { maxLoanAmountModel } from '../models/maxLoanAmountModel.js';
import { userModel } from '../models/userModel.js';

class MaxLoanAmountController {
  saveMaxLoan = async (req, res) => {
    try {
      const { client_id, loan_type_id } = req.body;

      const id = await maxLoanAmountModel.saveMaxLoan(client_id, loan_type_id);

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
      const maxAvailableAmount = await maxLoanAmountModel.getMaxLoanAmount(
        req.params
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

export const maxLoanAmountController = new MaxLoanAmountController();
