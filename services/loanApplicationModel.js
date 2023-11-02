import { pool } from '../db/dbPool.js';

class LoanApplicationModel {
  async createLoanApplication(clientId, desiredLoanAmount) {
    try {
      const result = await pool.query(
        'INSERT INTO LoanApplications (client_id, desired_loan_amount, application_date) VALUES ($1, $2, CURRENT_DATE) RETURNING application_id',
        [clientId, desiredLoanAmount]
      );

      return result.rows[0].application_id;
    } catch (err) {
      console.error(`Unable to create loan application: ${err}`);
      throw new Error(`Unable to create loan application.`);
    }
  }
  async findApplicationById(applicationId) {
    try {
      const result = await pool.query(
        'SELECT application_id FROM loanapplications WHERE application_id = $1;',
        [applicationId]
      );
      if (result.rows.length > 0) {
        return result.rows[0];
      }
    } catch (err) {
      console.error(`Unable to get application by id: ${err}`);
      throw new Error(`Unable to get application by id.`);
    }
    return null;
  }

  async saveApplicationWithLoanType(loantypeId, applicationId) {
    try {
      const result = await pool.query(
        `SELECT lt.interest_rate, lt.loan_term, lt.required_doc, 
                d.document_type, 
                la.client_id, 
                c.salary, c.credit_story
         FROM LoanTypes AS lt 
         LEFT JOIN Documents AS d ON d.application_id = $2 
         LEFT JOIN loanApplications AS la ON la.application_id = $2 
         LEFT JOIN clients AS c ON c.client_id = la.client_id 
         WHERE lt.loan_type_id = $1;`,
        [loantypeId, applicationId]
      );

      if (!result.rows[0]) {
        throw new Error('Data not found.');
      }

      const {
        interest_rate: rate,
        loan_term: term,
        required_doc: docReq,
        document_type: docAvail,
        salary,
        credit_story,
        desired_loan_amount,
      } = result.rows[0];

      if (docAvail !== docReq) {
        throw new Error(
          `The loan application does not contain required doc ${docReq}`
        );
      }

      const maxMonthlyPayment = salary * 0.5;
      const i = rate / 12 / 100;
      let maxLoanAmount =
        maxMonthlyPayment *
        ((Math.pow(1 + i, term) - 1) / (i * Math.pow(1 + i, term)));

      // If client does not have a credit story - his max loan amount is decreased by 5%
      if (!credit_story) {
        maxLoanAmount *= 0.95;
      }

      maxLoanAmount = Math.round(maxLoanAmount);
      // Check if desired loan amount is greater than max loan amount
      if (desired_loan_amount > maxLoanAmount) {
        throw new Error(
          `Desired loan amount exceeds the maximum available loan amount.`
        );
      }
      const calculateTotalInterest = (
        principalAmount,
        interestRate,
        numberOfMonths
      ) => {
        const monthlyRate = interestRate / 12 / 100;
        const annuityCoefficient =
          (monthlyRate * Math.pow(1 + monthlyRate, numberOfMonths)) /
          (Math.pow(1 + monthlyRate, numberOfMonths) - 1);
        const monthlyPayment = principalAmount * annuityCoefficient;
        const totalPayments = monthlyPayment * numberOfMonths;
        const totalInterest = totalPayments - principalAmount;
        return totalInterest;
      };

      const totalInterest = calculateTotalInterest(maxLoanAmount, rate, term);

      const resultConnect = await pool.query(
        'INSERT INTO LoanTypes_LoanApplications (loan_type_id, application_id) VALUES ($1, $2) RETURNING id',
        [loantypeId, applicationId]
      );
      const id = resultConnect.rows[0].id;

      const resultMaximumLoanAmounts = await pool.query(
        'INSERT INTO MaximumLoanAmounts (application_id, max_loan_amount, total_interest_amount, loan_app_loan_type_id) VALUES ($1, $2, $3, $4) RETURNING max_loan_amount_id',
        [applicationId, maxLoanAmount, totalInterest, id]
      );

      return resultMaximumLoanAmounts.rows[0].max_loan_amount_id;
    } catch (err) {
      console.error(`Unable to save application with loan type: ${err}`);
      throw new Error(`Unable to save application with loan type.`);
    }
  }
}
export const loanApplicationModel = new LoanApplicationModel();
