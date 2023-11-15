import {
  LoanApplicationModel,
  checkIfLoanAmountAvailable,
} from '../loanApplicationModel.js';
import { ApplicationDTO } from '../../dto/applicationDTO.js';

class LoanApplicationReposMock {
  async createLoanApplication(id, applicationDTO) {
    return 1;
  }

  async findApplicationById(applicationId) {
    if (applicationId === 1) {
      return {
        application_id: 1,
        desired_loan_amount: 5000,
        application_date: '2023-11-14',
        is_approved: true,
      };
    } else {
      return null;
    }
  }
  async deleteLoanApplication(applicationId) {
    if (applicationId === 1) {
      return;
    } else {
      throw new Error(`Application with id ${applicationId} does not exist.`);
    }
  }
  async getAllApplications() {
    return [
      {
        application_id: 1,
        desired_loan_amount: 5000,
        application_date: '2023-11-14',
        is_approved: true,
      },
      {
        application_id: 2,
        desired_loan_amount: 10000,
        application_date: '2023-11-15',
        is_approved: false,
      },
    ];
  }
}

class MaxLoanAmountReposMock {
  async getMaxLoanAmountByMaxAmountId(id) {
    return true;
  }
}

class LoanTypeMaxLoanAmountReposMock {
  async getLoanTypeMaxLoanId(id) {
    return true;
  }
}

class LoanTypeReposMock {
  async findLoanById(id) {
    const requiredDoc = { required_doc: 'passport' };
    return requiredDoc;
  }
}

const loanTypeReposMock = new LoanTypeReposMock();
const loanTypeMaxLoanAmountReposMock = new LoanTypeMaxLoanAmountReposMock();
const maxLoanAmountReposMock = new MaxLoanAmountReposMock();
const loanApplicationReposMock = new LoanApplicationReposMock();
const loanApplicationModel = new LoanApplicationModel(
  loanApplicationReposMock,
  maxLoanAmountReposMock,
  loanTypeMaxLoanAmountReposMock,
  loanTypeReposMock
);

describe('checkIfLoanAmountAvailable', () => {
  test('should return true if desired amount is less than or equal to max loan amount', () => {
    const maxLoanAmount = 10000;
    const desiredAmount = 5000;
    const result = checkIfLoanAmountAvailable(maxLoanAmount, desiredAmount);
    expect(result).toBe(true);
  });

  test('should throw an error if desired amount exceeds max loan amount', () => {
    const maxLoanAmount = 10000;
    const desiredAmount = 15000;
    expect(() =>
      checkIfLoanAmountAvailable(maxLoanAmount, desiredAmount)
    ).toThrow(
      `Can't create new loan application because the amount of money desired by the client exceeds the maximum available loan amount ${maxLoanAmount}`
    );
  });

  test('should create a new loan application and return the loan id and required doc', async () => {
    const id = 1;
    const desiredLoanAmount = 5000;
    const isApproved = true;

    const dto = new ApplicationDTO(null, id, desiredLoanAmount, isApproved);

    expect(await loanApplicationModel.createLoanApplication(id, dto)).toEqual({
      appId: 1,
      requiredDoc: 'passport',
    });
  });

  test('should delete a loan application by id', async () => {
    const applicationId = 1;

    await expect(
      loanApplicationModel.deleteLoanApplication(applicationId)
    ).resolves.toBeUndefined();
  });

  test('should throw an error when deleting a loan application with an invalid id', async () => {
    const invalidApplicationId = 999;

    await expect(
      loanApplicationModel.deleteLoanApplication(invalidApplicationId)
    ).rejects.toThrow(
      `Application with id ${invalidApplicationId} does not exist.`
    );
  });

  test('should get all loan applications', async () => {
    const applications = await loanApplicationModel.getAllApplications();

    expect(applications.length).toBe(2);
    expect(applications[0]).toEqual({
      application_id: 1,
      desired_loan_amount: 5000,
      application_date: '2023-11-14',
      is_approved: true,
    });
    expect(applications[1]).toEqual({
      application_id: 2,
      desired_loan_amount: 10000,
      application_date: '2023-11-15',
      is_approved: false,
    });
  });
});
