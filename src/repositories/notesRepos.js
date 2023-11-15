import { pool } from '../../db/postgress/dbPool.js';
import { NotesDTO } from '../dto/notesDTO.js';

export class NotesRepos {
  constructor(connection) {
    this.connection = connection;
  }
  async createNotes(notesDto) {
    try {
      const insertResult = await this.connection.query(
        `INSERT INTO PaymentNotes (repayment_schedule_id, payment_date, payment_amount)
         VALUES ($1, $2, $3) RETURNING note_id;`,
        [
          notesDto.repayment_schedule_id,
          notesDto.payment_date,
          notesDto.payment_amount,
        ]
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
      const result = await this.connection.query(query, values);

      if (result.rows.length > 0) {
        return result.rows[0].payment_amount;
      } else {
        return null;
      }
    } catch (err) {
      throw new Error(`${err}`);
    }
  }
  async getAllNotesForRepaymentSchedule(repayment_schedule_id) {
    try {
      const result = await this.connection.query(
        `SELECT * FROM PaymentNotes WHERE repayment_schedule_id = $1`,
        [repayment_schedule_id]
      );
      if (result.rows.length > 0) {
        const noteDTOs = result.rows.map(
          (note) =>
            new NotesDTO(
              note.repayment_schedule_id,
              note.payment_date,
              note.payment_amount,
              note.payment_received
            )
        );
        return noteDTOs;
      }
    } catch (err) {
      throw new Error(`${err}`);
    }
  }
  async getNoteById(noteId) {
    try {
      const result = await this.connection.query(
        `SELECT * FROM PaymentNotes WHERE note_id = $1`,
        [noteId]
      );
      if (result.rows.length > 0) {
        const noteDTO = new NotesDTO(
          result.rows[0].repayment_schedule_id,
          result.rows[0].payment_date,
          result.rows[0].payment_amount,
          result.rows[0].payment_received
        );

        return noteDTO;
      } else {
        return null;
      }
    } catch (err) {
      throw new Error(`${err}`);
    }
  }
  async updatePaymentStatus(note_id) {
    try {
      await this.connection.query(
        `UPDATE PaymentNotes SET payment_received = true WHERE note_id  = $1`,
        [note_id]
      );

      return;
    } catch (err) {
      throw new Error(`${err}`);
    }
  }
  async deleteNote(noteId) {
    try {
      await this.connection.query(
        'DELETE FROM PaymentNotes WHERE note_id  = $1',
        [noteId]
      );
      return;
    } catch (err) {
      throw new Error(`${err}`);
    }
  }
}

export const notesRepos = new NotesRepos(pool);
