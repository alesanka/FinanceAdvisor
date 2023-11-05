import { maxLoanAmountModel } from '../services/maxLoanAmountModel.js';
import { userModel } from '../services/userModel.js';

class MaxLoanAmountController {
  saveMaxLoan = async (req, res) => {
    try {
      const { user_id, client_id, loan_type_id } = req.body;

      const isWorker = await userModel.checkUserRoleById(user_id);
      if (isWorker !== 'worker') {
        return res
          .status(403)
          .send('Only workers can save max available loan amounts.');
      }

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

      if (!max_loan_amount_id) {
        return res
          .status(400)
          .json({ error: 'max_loan_amount_id is required' });
      }

      const maxAvailableAmount = await maxLoanAmountRepos.getMaxLoanAmount(
        max_loan_amount_id
      );

      res.status(200).json({
        'Max available amount of loan': maxAvailableAmount.max_loan_amount,
        'Loan type': maxAvailableAmount.loan_type,
        'Max interest amount': maxAvailableAmount.total_interest_amount,
      });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: err.message });
    }
  };
}

export const maxLoanAmountController = new MaxLoanAmountController();
