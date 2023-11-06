import { maxLoanAmountModel } from '../services/maxLoanAmountModel.js';
import { userModel } from '../services/userModel.js';

class MaxLoanAmountController {
  saveMaxLoan = async (req, res) => {
    try {
      const { user_id, client_id, loan_type_id } = req.body;

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
      const { max_loan_amount_id } = req.params;

      const maxAvailableAmount = await maxLoanAmountModel.getMaxLoanAmount(
        max_loan_amount_id
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
