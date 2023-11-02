import { pool } from '../db/dbPool.js';

class RepaymentScheduleModel {
  async createRepaymentSchedule(applicationId, loanTerm, annualRate, amount) {
    const monthlyRate = annualRate / 12 / 100;
    const loanTermMonths = loanTerm * 12;

    const monthlyPayment =
      (amount * (monthlyRate * Math.pow(1 + monthlyRate, loanTermMonths))) /
      (Math.pow(1 + monthlyRate, loanTermMonths) - 1);

    try {
      const insertResult = await pool.query(
        `INSERT INTO RepaymentSchedules (application_id, monthly_payment, remaining_balance)
         VALUES ($1, $2, $3) RETURNING *;`,
        [applicationId, monthlyPayment.toFixed(2), amount.toFixed(2)]
      );

      if (insertResult.rows.length === 0) {
        throw new Error('Failed to insert repayment schedule.');
      }

      return insertResult.rows[0];
    } catch (err) {
      console.error(`Unable to create repayment schedule: ${err}`);
      throw new Error(`Unable to create repayment schedule.`);
    }
  }
}

export const repaymentScheduleModel = new RepaymentScheduleModel();
