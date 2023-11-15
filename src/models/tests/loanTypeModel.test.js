/* eslint-disable no-undef */
import { LoanTypeDTO } from '../../dto/loanTypesDTO.js';
import { LoanTypeModel, checkDocType } from '../loanTypeModel.js';

class LoanTypeReposMock {
  async createLoanType(loanTypeDTO) {
    return 1;
  }

  async getAllLoanTypes() {
    return [
      {
        loan_type_id: 1,
        loan_type: 'personal_loan',
        interest_rate: 5,
        loan_term: 12,
        required_doc: 'passport',
      },
      {
        loan_type_id: 2,
        loan_type: 'business_loan',
        interest_rate: 6,
        loan_term: 24,
        required_doc: 'business_plan',
      },
    ];
  }

  async findLoanByType(loanType) {
    return {
      loan_type_id: 1,
      loan_type: loanType,
      interest_rate: 5,
      loan_term: 12,
      required_doc: 'passport',
    };
  }

  async findLoanById(loanTypeId) {
    return {
      loan_type_id: loanTypeId,
      loan_type: 'personal_loan',
      interest_rate: 5,
      loan_term: 12,
      required_doc: 'passport',
    };
  }

  async updateLoanTypeData(loanTypeId, data) {
    return true;
  }

  async deleteLoanType(loanTypeId) {
    return true;
  }
}

const loanTypeReposMock = new LoanTypeReposMock();
const loanTypeModel = new LoanTypeModel(loanTypeReposMock);

describe('checkDocType', () => {
  it('should return true for valid document types', () => {
    expect(checkDocType('passport')).toBeTruthy();
    expect(checkDocType('student_verification')).toBeTruthy();
    expect(checkDocType('business_plan')).toBeTruthy();
    expect(checkDocType('purchase_agreement')).toBeTruthy();
  });

  it('should return false for invalid document types', () => {
    expect(checkDocType('id_card')).toBeFalsy();
  });

  it('should handle wrong inputs', () => {
    expect(checkDocType(123)).toBeFalsy();
    expect(checkDocType(null)).toBeFalsy();
  });

  test('should create a new loan type', async () => {
    const loanType = 'business_loan';
    const interestRate = 5;
    const loanTerm = 12;
    const requiredDoc = 'passport';

    const dto = new LoanTypeDTO(
      null,
      loanType,
      interestRate,
      loanTerm,
      requiredDoc
    );

    await expect(async () => {
      await loanTypeModel.createLoanType(
        dto.loan_type,
        dto.interest_rate,
        dto.loan_term,
        dto.required_doc
      );
    }).rejects.toThrow();
  });

  test('should get all loan types', async () => {
    const loanTypes = await loanTypeModel.getAllLoanTypes();

    expect(loanTypes).toBeDefined();
    expect(Array.isArray(loanTypes)).toBe(true);
  });

  test('should find a loan type by type', async () => {
    const loanType = 'personal_loan';

    const foundLoanType = await loanTypeModel.findLoanByType(loanType);

    expect(foundLoanType).toBeDefined();
    expect(foundLoanType.loan_type).toBe(loanType);
  });

  test('should find a loan type by id', async () => {
    const loanType = 'personal_loan';

    const loanTypeById = await loanTypeModel.findLoanByType(loanType);
    const foundLoanType = await loanTypeModel.findLoanById(
      loanTypeById.loan_type_id
    );

    expect(foundLoanType).toBeDefined();
    expect(foundLoanType.loan_type).toBe(loanType);
  });

  test('should update loan type data', async () => {
    const loanType = 'personal_loan';
    const updatedData = {
      interest_rate: 5,
      loan_term: 12,
    };

    const loanTypeById = await loanTypeModel.findLoanByType(loanType);
    await loanTypeModel.updateLoanTypeData(
      loanTypeById.loan_type_id,
      updatedData
    );
    const updatedLoanType = await loanTypeModel.findLoanById(
      loanTypeById.loan_type_id
    );

    expect(updatedLoanType.interest_rate).toBe(updatedData.interest_rate);
    expect(updatedLoanType.loan_term).toBe(updatedData.loan_term);
  });

  test('should delete a loan type', async () => {
    const loanType = 'personal_loan';

    const loanTypeById = await loanTypeModel.findLoanByType(loanType);
    await loanTypeModel.deleteLoanType(loanTypeById.loan_type_id);
    const deletedLoanType = await loanTypeModel.deleteLoanType(
      loanTypeById.loan_type_id
    );

    expect(deletedLoanType).toBeUndefined();
  });
});
