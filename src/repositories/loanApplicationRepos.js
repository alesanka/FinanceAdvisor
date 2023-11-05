import { pool } from '../../db/postgress/dbPool.js';

class LoanApplicationRepos {
  async createLoanApplication(id, desiredLoanAmount, isApproved) {
    try {
      const result = await pool.query(
        'INSERT INTO LoanApplications (id, desired_loan_amount, application_date, is_approved) VALUES ($1, $2, CURRENT_DATE, $3) RETURNING application_id',
        [id, desiredLoanAmount, isApproved]
      );

      return result.rows[0].application_id;
    } catch (err) {
      throw new Error(`${err}`);
    }
  }
  async findApplicationById(applicationId) {
    try {
      const result = await pool.query(
        'SELECT * FROM loanapplications WHERE application_id = $1;',
        [applicationId]
      );
      if (result.rows.length > 0) {
        return result.rows[0];
      } else {
        return null;
      }
    } catch (err) {
      throw new Error(`${err}`);
    }
  }
  async changeApprovement(applicationId) {
    try {
      const updateResult = await pool.query(
        'UPDATE loanapplications SET is_approved = true WHERE application_id = $1 RETURNING application_id;',
        [applicationId]
      );

      if (updateResult.rows[0]) {
        return true;
      } else {
        return false;
      }
    } catch (err) {
      throw new Error(`${err}`);
    }
  }
  async checkApprovement(applicationId) {
    try {
      const result = await pool.query(
        'SELECT is_approved FROM loanapplications WHERE application_id = $1;',
        [applicationId]
      );

      if (result.rows.length > 0) {
        return result.rows[0].is_approved;
      } else {
        throw new Error(`Application with ID ${applicationId} does not exist.`);
      }
    } catch (err) {
      console.error(`Unable to check approvement status: ${err}`);
      throw new Error(`Unable to check approvement status.`);
    }
  }
}
export const loanApplicationRepos = new LoanApplicationRepos();
