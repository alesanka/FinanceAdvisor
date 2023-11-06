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

      return result.rows[0];
    } catch (err) {
      throw new Error(`${err}`);
    }
  }
  async getPaymentAmountByScheduleIdAndMonthYear(
    repaymentScheduleId,
    year,
    month
  ) {
    try {
      const query = `
        SELECT payment_amount
        FROM PaymentNotes
        WHERE repayment_schedule_id = $1
        AND EXTRACT(YEAR FROM payment_date) = $2
        AND EXTRACT(MONTH FROM payment_date) = $3;
      `;
      const values = [repaymentScheduleId, year, month];
      const result = await pool.query(query, values);

      if (result.rows.length > 0) {
        return result.rows[0].payment_amount;
      } else {
        return null;
      }
    } catch (err) {
      throw new Error(`${err}`);
    }
  }
}

export const repaymentScheduleRepos = new RepaymentScheduleRepos();
