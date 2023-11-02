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
         LEFT JOIN loanApplication AS la ON la.application_id = $2 
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

      return resultConnect.rows[0].id;
    } catch (err) {
      console.error(`Unable to save application with loan type: ${err}`);
      throw new Error(`Unable to save application with loan type.`);
    }
  }

  async findLoanById(loan_id) {
    try {
      const result = await pool.query(
        'SELECT * FROM loanTypes WHERE loan_type_id = $1;',
        [loan_id]
      );
      if (result.rows.length > 0) {
        return result.rows[0];
      }
    } catch (err) {
      console.error(`Unable to get loan type by loan_id: ${err}`);
      throw new Error(`Unable to get loan type by loan_id.`);
    }
    return null;
  }
  async getAllLoanTypes() {
    try {
      const result = await pool.query('SELECT * FROM loanTypes');

      return result.rows;
    } catch (err) {
      console.error(`Unable to get all loan types: ${err}`);
      throw new Error(`Unable to get all loan types.`);
    }
  }
  async updateLoanTypeData(loanTypeId, data) {
    try {
      const loanResult = await pool.query(
        'SELECT loan_type_id FROM loanTypes WHERE loan_type_id = $1',
        [loanTypeId]
      );

      if (loanResult.rows.length === 0) {
        throw new Error(
          `No loan type was found with provided loan_type_id ${userId}`
        );
      }

      let query = 'UPDATE loanTypes SET ';
      let values = [];

      if (data.interest_rate) {
        query += `interest_rate = $${values.length + 1}, `;
        values.push(data.interest_rate);
      }

      if (data.loan_term) {
        query += `loan_term = $${values.length + 1}, `;
        values.push(data.loan_term);
      }

      if (data.required_doc) {
        query += `required_doc = $${values.length + 1}, `;
        values.push(data.required_doc);
      }

      query = query.trim().endsWith(',') ? (query = query.slice(0, -2)) : query;

      query += ` WHERE loan_type_id = $${values.length + 1}`;

      values.push(loanTypeId);
      await pool.query(query, values);
    } catch (err) {
      console.error(`Unable to update loan type: ${err}`);
      throw new Error(`Unable to update loan type.`);
    }
  }
}
export const loanApplicationModel = new LoanApplicationModel();
