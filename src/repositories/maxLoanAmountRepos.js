import { pool } from '../../db/postgress/dbPool.js';

class MaxLoanAmountRepos {
  async saveMaxLoan(client_id, max_amount, total_interest_amount) {
    try {
      const result = await pool.query(
        'INSERT INTO MaximumLoanAmounts (client_id,  max_loan_amount,  total_interest_amount) VALUES ($1, $2, $3) RETURNING max_loan_amount_id',
        [client_id, max_amount, total_interest_amount]
      );
      return result.rows[0].max_loan_amount_id;
    } catch (err) {
      throw new Error(`${err}`);
    }
  }
  async getMaxLoanAmount(maxLoanamountId) {
    try {
      const result = await pool.query(
        `SELECT 
                m.max_loan_amount_id,
                m.application_id,  
                m.max_loan_amount, 
                m.total_interest_amount, 
                lta.loan_type_id,
                lt.loan_type
             FROM MaximumLoanAmounts AS m
             JOIN LoanTypes_LoanApplications AS lta ON m.loan_app_loan_type_id = lta.id
             JOIN LoanTypes AS lt ON lta.loan_type_id = lt.loan_type_id
             JOIN LoanApplications AS la ON lta.application_id = la.application_id
             WHERE m.max_loan_amount_id = $1;`,
        [maxLoanamountId]
      );

      if (result.rows.length === 0) {
        throw new Error('Data not found for the provided max loan amount ID.');
      }

      return result.rows[0];
    } catch (err) {
      console.error(`Unable to get max loan amount by id: ${err}`);
      throw new Error(`Unable to get max loan amount by id.`);
    }
  }

  async getMaxLoanAmountByApplicationId(applicationId) {
    try {
      const result = await pool.query(
        `SELECT 
          m.max_loan_amount_id,
          m.application_id,  
          m.max_loan_amount, 
          m.total_interest_amount, 
          lta.loan_type_id,
          lt.loan_type,
          lt.interest_rate,
          lt.loan_term
       FROM MaximumLoanAmounts AS m
       JOIN LoanTypes_LoanApplications AS lta ON m.loan_app_loan_type_id = lta.id
       JOIN LoanTypes AS lt ON lta.loan_type_id = lt.loan_type_id
       WHERE m.application_id = $1;`,
        [applicationId]
      );

      if (result.rows.length === 0) {
        throw new Error('Data not found for the provided application ID.');
      }

      return result.rows[0];
    } catch (err) {
      console.error(`Unable to get max loan amount by application id: ${err}`);
      throw new Error(`Unable to get max loan amount by application id.`);
    }
  }
}

export const maxLoanAmountRepos = new MaxLoanAmountRepos();
