import { pool } from '../db/dbPool.js';

class LoanTypeModel {
  async createLoanType(admin_id, loan_type, interest_rate, loan_term) {
    try {
      const result = await pool.query(
        'INSERT INTO loanTypes (admin_id, loan_type, interest_rate, loan_term) VALUES ($1, $2, $3, $4) RETURNING loan_type_id',
        [admin_id, loan_type, interest_rate, loan_term]
      );

      return result.rows[0].loan_type_id;
    } catch (err) {
      throw new Error(`Unable to create loan type:${err}`);
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
      throw new Error(`Sorry, unable to get loan type by loan_type:${err}`);
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
      throw new Error(`Sorry, unable to get loan type by loan_id:${err}`);
    }
    return null;
  }
  async getAllLoanTypes() {
    try {
      const result = await pool.query('SELECT * FROM loanTypes');

      return result.rows;
    } catch (err) {
      throw new Error(`Unable to get loan types:${err}`);
    }
  }
}
export const loanTypeModel = new LoanTypeModel();
