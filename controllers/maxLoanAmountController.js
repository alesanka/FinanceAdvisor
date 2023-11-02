import { maxLoanAmountModel } from '../services/maxLoanAmountModel.js';

class MaxLoanAmountController {
  getMaxLoanAmount = async (req, res) => {
    try {
      const { max_loan_amount_id } = req.params;

      if (!max_loan_amount_id) {
        return res
          .status(400)
          .json({ error: 'max_loan_amount_id is required' });
      }

      const maxAvailableAmount = await maxLoanAmountModel.getMaxLoanAmount(
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
