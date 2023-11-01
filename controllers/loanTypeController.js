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
      res.status(201).send({
        message: 'Loan type was created successfully',
      });
    } catch (err) {
      console.error(err);
      res.status(500).send(`Server error while creation loan type: ${err}`);
    }
  };
  getAllLoanTypes = async (req, res) => {
    try {
      const loanTypes = await loanTypeModel.getAllLoanTypes();
      res.status(200).json(loanTypes);
    } catch (err) {
      console.error(err);
      res.status(500).send(`Server error while getting loan types: ${err}`);
    }
  };
  getSpecificLoanType = async (req, res) => {
    try {
      const params = req.query;
      if (params.loan_type_id) {
        const loanType = await loanTypeModel.findLoanById(params.loan_type_id);
        res.status(200).json(loanType);
      }
      if (params.loan_type) {
        const loanType = await loanTypeModel.findLoanByType(params.loan_type);
        res.status(200).json(loanType);
      }
      res.status(400).send(`No valid loan_type_id or loan_type is provided`);
    } catch (err) {
      console.error(err);
      res
        .status(500)
        .send(
          `Server error while getting loan types by loan_type_id or loan_type: ${err}`
        );
    }
  };
}

export const loanTypeController = new LoanTypeController();
