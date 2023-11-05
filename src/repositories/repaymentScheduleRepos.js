import { pool } from '../../db/postgress/dbPool.js';

class RepaymentScheduleRepos {
  async createRepaymentSchedule(applicationId, monthlyPayment, loanAmount) {
    try {
      const insertResult = await pool.query(
        `INSERT INTO RepaymentSchedules (application_id, monthly_payment, remaining_balance)
         VALUES ($1, $2, $3) RETURNING repayment_schedule_id;`,
        [applicationId, monthlyPayment, loanAmount]
      );

      return insertResult.rows[0].repayment_schedule_id;
    } catch (err) {
      throw new Error(`${err}`);
    }
  }
  async getRepaymentScheduleById(repaymentScheduleId) {
    try {
      const result = await pool.query(
        `SELECT * FROM RepaymentSchedules WHERE repayment_schedule_id = $1;`,
        [repaymentScheduleId]
      );

      if (result.rows.length === 0) {
        throw new Error(
          `Repayment schedule with ID ${repaymentScheduleId} does not exist.`
        );
      }

      return result.rows[0];
    } catch (err) {
      console.error(`Unable to get repayment schedule by ID: ${err}`);
      throw new Error(`Unable to get repayment schedule by ID.`);
    }
  }
}

export const repaymentScheduleRepos = new RepaymentScheduleRepos();
