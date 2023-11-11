import { pool } from '../../db/postgress/dbPool.js';

class NotesRepos {
  async createNotes(notesDto) {
    try {
      const insertResult = await pool.query(
        `INSERT INTO PaymentNotes (repayment_schedule_id, payment_date, payment_amount)
         VALUES ($1, $2, $3) RETURNING note_id;`,
        [notesDto.repayment_schedule_id, notesDto.payment_date, notesDto.payment_amount]
      );

      return insertResult.rows[0].note_id;
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

export const notesRepos = new NotesRepos();
