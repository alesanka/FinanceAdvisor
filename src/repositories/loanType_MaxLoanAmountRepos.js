import { pool } from '../../db/postgress/dbPool.js';

export class LoanTypeMaxLoanAmountRepos {
  constructor(connection) {
    this.connection = connection;
  }
  async saveLoanTypeMaxLoan(loan_type_id, max_loan_amount_id) {
    try {
      const result = await this.connection.query(
        'INSERT INTO LoanTypes_MaximumLoanAmounts (loan_type_id, max_loan_amount_id) VALUES ($1, $2) RETURNING id',
        [loan_type_id, max_loan_amount_id]
      );
      return result.rows[0].id;
    } catch (err) {
      throw new Error(`${err}`);
    }
  }

  async getLoanTypeMaxLoanId(id) {
    try {
      const result = await this.connection.query(
        'SELECT * FROM LoanTypes_MaximumLoanAmounts WHERE id = $1;',
        [id]
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
}

export const loanTypeMaxLoanAmountRepos = new LoanTypeMaxLoanAmountRepos(pool);
