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
  async findLoanByType(loan_type) {
    try {
      const result = await pool.query(
        'SELECT * FROM loanTypes WHERE loan_type = $1;',
        [loan_type]
      );
      if (result.rows.length > 0) {
        return result.rows[0];
      }
    } catch (err) {
      console.error(`Unable to get loan type by loan_type: ${err}`);
      throw new Error(`Unable to get loan type by loan_type.`);
    }
    return null;
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
