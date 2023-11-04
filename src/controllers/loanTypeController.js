import { loanTypeModel } from '../services/loanTypeModel.js';
import { userModel } from '../services/userModel.js';

class LoanTypeController {
  createLoanType = async (req, res) => {
    try {
      const { user_id, loan_type, interest_rate, loan_term, required_doc } =
        req.body;

      if (!user_id) {
        return res.status(400).send('User id is required for checking role.');
      }

      const isAdmin = await userModel.checkUserRoleById(user_id);
      if (isAdmin !== 'admin') {
        return res.status(403).send('Only admins can create loan types.');
      }

      const loanId = await loanTypeModel.createLoanType(
        loan_type,
        interest_rate,
        loan_term,
        required_doc
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
      const loanTypes = await loanTypeModel.getAllLoanTypes();
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

      const loanData = await loanTypeRepos.findLoanByType(loanType);
      res.status(200).json(loanData);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: err.message });
    }
  };
  updateLoanTypeData = async (req, res) => {
    try {
      const loanTypeId = req.params.loan_type_id;
      if (!req.body) {
        return res.status(400).send('No data provided in request body.');
      }
      const userId = req.body.user_id;
      if (!userId) {
        return res.status(400).send('User id is required for checking role.');
      }

      const isAdmin = await userRepos.checkRoleByUserId(userId);

      if (isAdmin !== 'admin') {
        return res.status(403).send('Only admins can update loan types.');
      }

      if (req.body.required_doc) {
        const validDocs = [
          'passport',
          'student_verification',
          'business_plan',
          'purchase_agreement',
        ];
        if (!validDocs.includes(req.body.required_doc)) {
          return res
            .status(400)
            .send(
              'Invalid required document. Accepted values are: passport, student_verification, business_plan, purchase_agreement'
            );
        }
      }

      await loanTypeRepos.updateLoanTypeData(loanTypeId, req.body);

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
