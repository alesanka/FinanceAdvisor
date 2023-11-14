import { LoanTypeDTO } from '../dto/loanTypesDTO.js';
import { loanTypeRepos } from '../repositories/loanTypeRepos.js';
import { assertValueExists } from '../../utils/helper.js';
import { z } from 'zod';

export const checkDocType = (doc) => {
  const DocSchema = z.enum([
    'passport',
    'student_verification',
    'business_plan',
    'purchase_agreement',
  ]);
  try {
    DocSchema.parse(doc);
    return true;
  } catch (e) {
    return false;
  }
};

export class LoanTypeModel {
  constructor(loanTypeRepos) {
    this.loanTypeRepos = loanTypeRepos;
  }
  async createLoanType(loanType, interestRate, loanTerm, requiredDoc) {
    try {
      const loanTypeDTO = new LoanTypeDTO(
        null,
        loanType,
        interestRate,
        loanTerm,
        requiredDoc
      );

      const isLoanTypeExists = await this.loanTypeRepos.findLoanByType(
        loanTypeDTO.loan_type
      );
      if (isLoanTypeExists) {
        throw new Error(`Loan type ${loanTypeDTO.loan_type} already exists`);
      }

      const loanTypeId = await this.loanTypeRepos.createLoanType(loanTypeDTO);

      return loanTypeId;
    } catch (err) {
      throw new Error(`Unable to create loan type: ${err}`);
    }
  }

  async getAllLoanTypes() {
    try {
      const loans = await this.loanTypeRepos.getAllLoanTypes();

      const loanDTOs = loans.map((loan) => {
        const dto = new LoanTypeDTO(
          loan.loan_type_id,
          loan.loan_type,
          loan.interest_rate,
          loan.loan_term,
          loan.required_doc
        );
        return {
          loan_type_id: dto.loan_type_id,
          loan_type: dto.loan_type,
          interest_rate: dto.interest_rate,
          loan_term: dto.loan_term,
          required_doc: dto.required_doc,
        };
      });

      return loanDTOs;
    } catch (err) {
      throw new Error(`Unable to get all loan types: ${err}`);
    }
  }

  async findLoanByType(loan_type) {
    try {
      const loan = await this.loanTypeRepos.findLoanByType(loan_type);
      if (!loan) {
        throw new Error('Invalid loan type');
      }

      const loanDTO = new LoanTypeDTO(
        loan.loan_type_id,
        loan.loan_type,
        loan.interest_rate,
        loan.loan_term,
        loan.required_doc
      );

      let result = {
        loan_type_id: loanDTO.loan_type_id,
        loan_type: loanDTO.loan_type,
        interest_rate: loanDTO.interest_rate,
        loan_term: loanDTO.loan_term,
        required_doc: loanDTO.required_doc,
      };
      return result;
    } catch (err) {
      throw new Error(`Unable to get loan type: ${err}`);
    }
  }

  async findLoanById(loan_id) {
    try {
      const loan = await this.loanTypeRepos.findLoanById(loan_id);
      if (!loan) {
        throw new Error('Invalid loan id');
      }

      const loanDTO = new LoanTypeDTO(
        loan.loan_type_id,
        loan.loan_type,
        loan.interest_rate,
        loan.loan_term,
        loan.required_doc
      );

      let result = {
        loan_type_id: loanDTO.loan_type_id,
        loan_type: loanDTO.loan_type,
        interest_rate: loanDTO.interest_rate,
        loan_term: loanDTO.loan_term,
        required_doc: loanDTO.required_doc,
      };
      return result;
    } catch (err) {
      throw new Error(`Unable to get loan type by loan_id: ${err}`);
    }
  }

  async updateLoanTypeData(loanTypeId, data) {
    try {
      const loan = await this.loanTypeRepos.findLoanById(loanTypeId);
      if (!loan) {
        throw new Error('Invalid loan id');
      }
      if (data.required_doc) {
        assertValueExists(checkDocType(data.required_doc), 'Invalid type id.');
      }

      await this.loanTypeRepos.updateLoanTypeData(loanTypeId, data);
    } catch (err) {
      throw new Error(`Unable to update loan type: ${err}.`);
    }
  }
  async deleteLoanType(loanTypeId) {
    try {
      const loanType = await this.loanTypeRepos.findLoanById(loanTypeId);
      assertValueExists(loanType, `No loan type found with id ${loanTypeId}`);

      await this.loanTypeRepos.deleteLoanType(loanTypeId);
      return;
    } catch (err) {
      throw new Error(
        `Unable to delete loan type with id ${loanTypeId}: ${err}.`
      );
    }
  }
}
export const loanTypeModel = new LoanTypeModel(loanTypeRepos);
