import { pool } from '../../db/postgress/dbPool.js';

class MaxLoanAmountModel {
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

export const maxLoanAmountModel = new MaxLoanAmountModel();
