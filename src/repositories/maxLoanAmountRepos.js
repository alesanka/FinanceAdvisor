import { pool } from '../../db/postgress/dbPool.js';
import { MaxLoanDTO } from '../dto/maxLoanDTO.js';

export class MaxLoanAmountRepos {
  connection(connection) {
    this.connection = connection;
  }

  async saveMaxLoan(maxLoanDto) {
    try {
      const result = await this.connection.query(
        'INSERT INTO MaximumLoanAmounts (client_id, max_loan_amount, total_interest_amount) VALUES ($1, $2, $3) RETURNING max_loan_amount_id',
        [
          maxLoanDto.client_id,
          maxLoanDto.max_loan_amount,
          maxLoanDto.total_interest_amount,
        ]
      );
      return result.rows[0].max_loan_amount_id;
    } catch (err) {
      throw new Error(`${err}`);
    }
  }
  async getMaxLoanAmountLoanType(maxLoanAmountId) {
    try {
      const result = await this.connection.query(
        `SELECT *
             FROM MaximumLoanAmounts AS m
             JOIN LoanTypes_MaximumLoanAmounts AS lm ON m.max_loan_amount_id = lm.max_loan_amount_id
             JOIN LoanTypes AS lt ON lm.loan_type_id = lt.loan_type_id
             WHERE m.max_loan_amount_id = $1;`,
        [maxLoanAmountId]
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

  async getMaxLoanAmountByMaxAmountId(max_loan_amount_id) {
    try {
      const result = await this.connection.query(
        `SELECT * FROM MaximumLoanAmounts WHERE max_loan_amount_id = $1;`,
        [max_loan_amount_id]
      );

      if (result.rows.length > 0) {
        const maxLoan = result.rows[0];

        const maxLoanDTO = new MaxLoanDTO(
          maxLoan.max_loan_amount_id,
          maxLoan.client_id,
          maxLoan.max_loan_amount,
          maxLoan.total_interest_amount
        );
        return maxLoanDTO;
      } else {
        return null;
      }
    } catch (err) {
      throw new Error(`${err}`);
    }
  }
  async deleteMaxLoanApplication(max_loan_amount_id) {
    try {
      await this.connection.query(
        'DELETE FROM MaximumLoanAmounts WHERE max_loan_amount_id = $1',
        [max_loan_amount_id]
      );
      return;
    } catch (err) {
      throw new Error(`${err}`);
    }
  }
}

export const maxLoanAmountRepos = new MaxLoanAmountRepos(pool);
