import { pool } from '../../db/postgress/dbPool.js';
import { RepaymentScheduleDTO } from '../dto/repaymentScheduleDTO.js';

export class RepaymentScheduleRepos {
  constructor(connection) {
    this.connection = connection;
  }
  async createRepaymentSchedule(repaymentScheduleDto) {
    try {
      const insertResult = await this.connection.query(
        `INSERT INTO RepaymentSchedules (application_id, monthly_payment, remaining_balance)
         VALUES ($1, $2, $3) RETURNING repayment_schedule_id;`,
        [
          repaymentScheduleDto.application_id,
          repaymentScheduleDto.monthly_payment,
          repaymentScheduleDto.remaining_balance,
        ]
      );

      return insertResult.rows[0].repayment_schedule_id;
    } catch (err) {
      throw new Error(`${err}`);
    }
  }
  async getRepaymentScheduleById(repaymentScheduleId) {
    try {
      const result = await this.connection.query(
        `SELECT * FROM RepaymentSchedules WHERE repayment_schedule_id = $1;`,
        [repaymentScheduleId]
      );

      const schedule = result.rows[0];

      const repaymentScheduleDTO = new RepaymentScheduleDTO(
        schedule.repayment_schedule_id,
        schedule.application_id,
        schedule.monthly_payment,
        schedule.remaining_balance
      );
      return repaymentScheduleDTO;
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
  async updateRemainBalance(sum, repayment_schedule_id) {
    try {
      await this.connection.query(
        `UPDATE RepaymentSchedules SET remaining_balance = $1 WHERE repayment_schedule_id = $2`,
        [sum, repayment_schedule_id]
      );

      return;
    } catch (err) {
      throw new Error(`${err}`);
    }
  }
}

export const repaymentScheduleRepos = new RepaymentScheduleRepos(pool);
