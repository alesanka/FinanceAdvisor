import { loanApplicationModel } from '../services/loanApplicationModel.js';
import { userModel } from '../services/userModel.js';

class LoanApplicationController {
  createLoanApplication = async (req, res) => {
    try {
      const userId = req.body.user_id;
      if (!userId) {
        return res.status(400).send('User id is required for checking role.');
      }

      const isWorker = await userModel.checkRoleByUserId(userId);

      if (isWorker !== 'worker') {
        return res
          .status(403)
          .send('Only workers can create loan applications.');
      }

      const { client_id, desired_loan_amount } = req.body;

      const isRealClient = await userModel.findClientById(client_id);
      if (!isRealClient) {
        return res.status(400).send('Invalid client id.');
      }

      await loanApplicationModel.createLoanApplication(
        client_id,
        desired_loan_amount
      );
      res.status(201).send('Loan application was created successfully');
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
      if (!req.body) {
        return res.status(400).send('No data provided in request body.');
      }
      const userId = req.body.user_id;
      if (!userId) {
        return res.status(400).send('User id is required for checking role.');
      }

      const isAdmin = await userModel.checkRoleByUserId(userId);

      if (!isAdmin) {
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

export const loanApplicationController = new LoanApplicationController();
