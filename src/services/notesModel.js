import { pool } from '../../db/postgress/dbPool.js';

class NotesModel {
  async createNotes(repaymentScheduleId, paymentDate, paymentAmount) {
    try {
      const insertResult = await pool.query(
        `INSERT INTO PaymentNotes (repayment_schedule_id, payment_date, payment_amount)
         VALUES ($1, $2, $3) RETURNING *;`,
        [repaymentScheduleId, paymentDate, paymentAmount]
      );

      if (insertResult.rows.length === 0) {
        throw new Error('Failed to insert payment notes.');
      }

      return insertResult.rows[0];
    } catch (err) {
      console.error(`Unable to create payment notes: ${err}`);
      throw new Error(`Unable to create payment notes.`);
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
        throw new Error('Failed to find payment note with provided date.');
      }
    } catch (error) {
      console.error(
        `Error in getPaymentAmountByScheduleIdAndMonthYear: ${error}`
      );
      throw new Error('Unable to get payment amount.');
    }
  }
}

export const notesModel = new NotesModel();
