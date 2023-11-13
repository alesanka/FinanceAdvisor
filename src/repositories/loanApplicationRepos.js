import { pool } from '../../db/postgress/dbPool.js';
import { ApplicationDTO } from '../dto/applicationDTO.js';

export class LoanApplicationRepos {
  constructor(connection) {
    this.connection = connection;
  }
  async createLoanApplication(id, applicationDto) {
    try {
      const result = await this.connection.query(
        'INSERT INTO LoanApplications (id, desired_loan_amount, application_date, is_approved) VALUES ($1, $2, CURRENT_DATE, $3) RETURNING application_id',
        [id, applicationDto.desired_loan_amount, applicationDto.is_approved]
      );

      return result.rows[0].application_id;
    } catch (err) {
      throw new Error(`${err}`);
    }
  }
  async findApplicationById(applicationId) {
    try {
      const result = await this.connection.query(
        'SELECT * FROM loanapplications WHERE application_id = $1;',
        [applicationId]
      );
      if (result.rows.length > 0) {
        const app = result.rows[0];
        const applicationDTO = new ApplicationDTO(
          app.application_id,
          app.desired_loan_amount,
          app.application_date,
          app.is_approved
        );
        return {
          dto: applicationDTO,
          id: app.id,
        };
      } else {
        return null;
      }
    } catch (err) {
      throw new Error(`${err}`);
    }
  }
  async changeApprovement(applicationId) {
    try {
      const updateResult = await this.connection.query(
        'UPDATE loanapplications SET is_approved = true WHERE application_id = $1 RETURNING application_id;',
        [applicationId]
      );

      if (updateResult.rows[0]) {
        return true;
      } else {
        return false;
      }
    } catch (err) {
      throw new Error(`${err}`);
    }
  }
  async checkApprovement(applicationId) {
    try {
      const result = await this.connection.query(
        'SELECT is_approved FROM loanapplications WHERE application_id = $1;',
        [applicationId]
      );

      if (result.rows.length > 0) {
        return result.rows[0].is_approved;
      } else {
        return null;
      }
    } catch (err) {
      throw new Error(`${err}`);
    }
  }
  async deleteLoanApplication(applicationId) {
    try {
      await this.connection.query(
        'DELETE FROM loanapplications WHERE application_id = $1',
        [applicationId]
      );
      return;
    } catch (err) {
      throw new Error(`${err}`);
    }
  }
}
export const loanApplicationRepos = new LoanApplicationRepos(pool);
