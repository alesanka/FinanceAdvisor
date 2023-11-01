import { loanTypeModel } from '../services/loanTypeModel.js';
import { userModel } from '../services/userModel.js';

class LoanTypeController {
  createLoanType = async (req, res) => {
    try {
      const admin_id = req.body.admin_id;
      if (!admin_id) {
        return res.status(400).send('admin_id is required.');
      }

      const adminExists = await userModel.findUserByRoleId(
        admin_id,
        'admin_id'
      );

      if (!adminExists) {
        return res.status(403).send('Only admins can create loan types.');
      }
      const { loan_type, interest_rate, loan_term } = req.body;

      const validLoanTypes = [
        'personal_loan',
        'mortgage',
        'student_loan',
        'business_loan',
      ];
      if (!validLoanTypes.includes(loan_type)) {
        return res
          .status(400)
          .send(
            'Invalid loan type. Accepted values are: personal_loan, mortgage, student_loan, business_loan'
          );
      }

      const existingLoanType = await loanTypeModel.findLoanByType(loan_type);
      if (existingLoanType) {
        return res.status(409).send(`Loan type ${loan_type} already exists`);
      }

      await loanTypeModel.createLoanType(
        admin_id,
        loan_type,
        interest_rate,
        loan_term
      );
      res.status(201).send('Loan type was created successfully');
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: err.message });
    }
  };
  getAllLoanTypes = async (req, res) => {
    try {
      const loanTypes = await loanTypeModel.getAllLoanTypes();
      res.status(200).json(loanTypes);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: err.message });
    }
  };
  getSpecificLoanType = async (req, res) => {
    try {
      const loanType = req.params.loan_type;

      if (!loanType) {
        return res.status(400).send(`No valid loan_type is provided`);
      }

      const loanData = await loanTypeModel.findLoanByType(loanType);
      res.status(200).json(loanData);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: err.message });
    }
  };
  updateLoanTypeData = async (req, res) => {
    try {
      const loanTypeId = req.params.loan_type_id;
      if (!loanTypeId) {
        return res.status(400).send(`No valid loan_type_id is provided`);
      }
      if (!req.body) {
        return res.status(400).send('No data provided in request body.');
      }
      if (!req.body.admin_id) {
        return res
          .status(400)
          .send(
            'Only admin can update loan type data, so admin_id is required.'
          );
      }
      await loanTypeModel.updateLoanTypeData(loanTypeId, req.body);

      res
        .status(200)
        .send(
          `Loan type's data with id - ${loanTypeId} was updated successfully.`
        );
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: err.message });
    }
  };
}

export const loanTypeController = new LoanTypeController();
