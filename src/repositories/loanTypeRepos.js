import { pool } from '../../db/postgress/dbPool.js';
import { LoanTypeDTO } from '../dto/loanTypesDTO.js';

export class LoanTypeRepos {
  constructor(connection) {
    this.connection = connection;
  }
  async createLoanType(loanTypeDto) {
    try {
      const result = await this.connection.query(
        'INSERT INTO loanTypes (loan_type, interest_rate, loan_term, required_doc) VALUES ($1, $2, $3, $4) RETURNING loan_type_id',
        [
          loanTypeDto.loan_type,
          loanTypeDto.interest_rate,
          loanTypeDto.loan_term,
          loanTypeDto.required_doc,
        ]
      );

      return result.rows[0].loan_type_id;
    } catch (err) {
      throw new Error(`${err}`);
    }
  }
  async findLoanByType(loan_type) {
    try {
      const result = await this.connection.query(
        'SELECT * FROM loanTypes WHERE loan_type = $1;',
        [loan_type]
      );
      if (result.rows.length > 0) {
        const loan = result.rows[0];

        const loanTypeDTO = new LoanTypeDTO(
          loan.loan_type_id,
          loan.loan_type,
          loan.interest_rate,
          loan.loan_term,
          loan.required_doc
        );
        return loanTypeDTO;
      } else {
        return null;
      }
    } catch (err) {
      throw new Error(`${err}.`);
    }
  }
  async getAllLoanTypes() {
    try {
      const result = await this.connection.query('SELECT * FROM loanTypes');

      const loanTypeDTOs = result.rows.map(
        (loan) =>
          new LoanTypeDTO(
            loan.loan_type_id,
            loan.loan_type,
            loan.interest_rate,
            loan.loan_term,
            loan.required_doc
          )
      );

      return loanTypeDTOs;
    } catch (err) {
      throw new Error(`${err}`);
    }
  }

  async findLoanById(loan_id) {
    try {
      const result = await this.connection.query(
        'SELECT * FROM loanTypes WHERE loan_type_id = $1;',
        [loan_id]
      );

      if (result.rows.length > 0) {
        const loan = result.rows[0];

        const loanTypeDTO = new LoanTypeDTO(
          loan.loan_type_id,
          loan.loan_type,
          loan.interest_rate,
          loan.loan_term,
          loan.required_doc
        );
        return loanTypeDTO;
      } else {
        return null;
      }
    } catch (err) {
      throw new Error(`${err}`);
    }
  }

  async updateLoanTypeData(loanTypeId, data) {
    try {
      let query = 'UPDATE loanTypes SET ';
      let values = [];

      if (data.interest_rate) {
        query += `interest_rate = $${values.length + 1}, `;
        values.push(data.interest_rate);
      }

      if (data.loan_term) {
        query += `loan_term = $${values.length + 1}, `;
        values.push(data.loan_term);
      }

      if (data.required_doc) {
        query += `required_doc = $${values.length + 1}, `;
        values.push(data.required_doc);
      }

      query = query.trim().endsWith(',') ? (query = query.slice(0, -2)) : query;

      query += ` WHERE loan_type_id = $${values.length + 1}`;

      values.push(loanTypeId);
      await this.connection.query(query, values);
    } catch (err) {
      throw new Error(`${err}`);
    }
  }
}
export const loanTypeRepos = new LoanTypeRepos(pool);
