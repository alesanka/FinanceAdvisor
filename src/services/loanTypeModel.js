import { LoanTypeDTO } from '../dto/loanTypesDTO.js';
import { loanTypeRepos } from '../repositories/loanTypeRepos.js';

class LoanTypeModel {
  async createLoanType(loanType, interestRate, loanTerm, requiredDoc) {
    try {
      const loanTypeDTO = new LoanTypeDTO(
        null,
        loanType,
        interestRate,
        loanTerm,
        requiredDoc
      );

      const isLoanTypeExists = await loanTypeRepos.findLoanByType(
        loanTypeDTO.loan_type
      );
      if (isLoanTypeExists) {
        throw new Error(`Loan type ${loanTypeDTO.loan_type} already exists`);
      }

      const loanTypeId = await loanTypeRepos.createLoanType(
        loanTypeDTO.loan_type,
        loanTypeDTO.interest_rate,
        loanTypeDTO.loan_term,
        loanTypeDTO.required_doc
      );

      return loanTypeId;
    } catch (err) {
      throw new Error(`Unable to create loan type: ${err}`);
    }
  }

  async findLoanById(loan_id) {
    try {
      const result = await pool.query(
        'SELECT * FROM loanTypes WHERE loan_type_id = $1;',
        [loan_id]
      );
      if (result.rows.length > 0) {
        return result.rows[0];
      }
    } catch (err) {
      console.error(`Unable to get loan type by loan_id: ${err}`);
      throw new Error(`Unable to get loan type by loan_id.`);
    }
    return null;
  }
  async getAllLoanTypes() {
    try {
      const result = await pool.query('SELECT * FROM loanTypes');

      return result.rows;
    } catch (err) {
      console.error(`Unable to get all loan types: ${err}`);
      throw new Error(`Unable to get all loan types.`);
    }
  }
  async updateLoanTypeData(loanTypeId, data) {
    try {
      const loanResult = await pool.query(
        'SELECT loan_type_id FROM loanTypes WHERE loan_type_id = $1',
        [loanTypeId]
      );

      if (loanResult.rows.length === 0) {
        throw new Error(
          `No loan type was found with provided loan_type_id ${userId}`
        );
      }

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
      await pool.query(query, values);
    } catch (err) {
      console.error(`Unable to update loan type: ${err}`);
      throw new Error(`Unable to update loan type.`);
    }
  }
}
export const loanTypeModel = new LoanTypeModel();
