/* eslint-disable no-undef */
import {
  MaxLoanAmountModel,
  calculateMaxMonthlyPayment,
  calculateMaxLoanAmount,
  decreeseMaxLoanAmount,
  calculateInterestRate,
} from '../maxLoanAmountModel.js';
import { MaxLoanDTO } from '../../dto/maxLoanDTO.js';

class MockMaxLoanAmountRepos {
  async getMaxLoanAmountLoanType(maxLoanAmountId) {
    if (maxLoanAmountId === 1) {
      return {
        max_loan_amount_id: 1,
        client_id: 1,
        max_loan_amount: 5000,
        total_interest_amount: 1000,
        loan_type_id: 1,
        loan_type: 'business_loan',
        interest_rate: 5,
        loan_term: 12,
        required_doc: 'passport',
      };
    } else {
      return null;
    }
  }
  async getMaxLoanAmountByMaxAmountId(max_loan_amount_id) {
    if (max_loan_amount_id === 1) {
      return {
        max_loan_amount_id: 1,
        client_id: 1,
        max_loan_amount: 5000,
        total_interest_amount: 1000,
        loan_type_id: 1,
      };
    } else {
      return null;
    }
  }
  async deleteMaxLoanApplication(max_loan_amount_id) {
    if (max_loan_amount_id === 1) {
      // empty block
      return;
    } else {
      throw new Error(
        `Max loan application with id ${max_loan_amount_id} does not exist.`
      );
    }
  }
}

const maxLoanAmountReposMock = new MockMaxLoanAmountRepos();
const maxLoanAmountModel = new MaxLoanAmountModel(maxLoanAmountReposMock);

describe('Max loan amount model', () => {
  test('calculateMaxMonthlyPayment should return 50% of the salary', () => {
    expect(calculateMaxMonthlyPayment(1000)).toBe(500);
  });

  test('calculateMaxMonthlyPayment should handle zero', () => {
    expect(calculateMaxMonthlyPayment(0)).toBe(0);
  });

  test('calculateInterestRate should correctly calculate the monthly interest rate', () => {
    expect(calculateInterestRate(12)).toBe(0.01);
  });

  test('calculateInterestRate should handle zero interest rate', () => {
    expect(calculateInterestRate(0)).toBe(0);
  });

  test('decreeseMaxLoanAmount should correctly calculate max loan amount in case client does not have credit story', () => {
    expect(decreeseMaxLoanAmount(5000)).toBe(4500);
  });

  test('calculateMaxLoanAmount returns correct loan amount', () => {
    const maxMonthlyPayment = 1000;
    const interest = 0.05;
    const term = 12;
    const expectedLoanAmount = 8863;

    const loanAmount = calculateMaxLoanAmount(
      maxMonthlyPayment,
      interest,
      term
    );

    expect(loanAmount).toBe(expectedLoanAmount);
  });

  test('calculateMaxLoanAmount handles zero interest rate', () => {
    const maxMonthlyPayment = 1000;
    const interest = 0.05;
    const term = 0;

    expect(() => {
      calculateMaxLoanAmount(maxMonthlyPayment, interest, term);
    }).toThrow();
  });
  test('calculateMaxLoanAmount handles zero interest rate', () => {
    const maxMonthlyPayment = 1000;
    const interest = 0;
    const term = 12;

    expect(() => {
      calculateMaxLoanAmount(maxMonthlyPayment, interest, term);
    }).toThrow();
  });
  test('calculateMaxLoanAmount handles zero interest rate', () => {
    const maxMonthlyPayment = 0;
    const interest = 0.05;
    const term = 12;

    expect(() => {
      calculateMaxLoanAmount(maxMonthlyPayment, interest, term);
    }).toThrow();
  });

  test('should get max loan amount by id', async () => {
    const maxLoanAmountId = 1;
    const expectedMaxLoanAmount = {
      max_loan_amount: 5000,
      total_interest_amount: 1000,
      loan_type: 'business_loan',
      interest_rate: 5,
      loan_term: 12,
    };

    const maxLoanAmount = await maxLoanAmountModel.getMaxLoanAmount(
      maxLoanAmountId
    );

    const dto = new MaxLoanDTO(
      null,
      maxLoanAmount.client_id,
      maxLoanAmount.max_loan_amount,
      maxLoanAmount.total_interest_amount
    );
    expect(dto).toBeTruthy();
    expect(maxLoanAmount).toEqual(expectedMaxLoanAmount);
  });

  test('should delete max loan application by id', async () => {
    const maxLoanAmountId = 1;

    await expect(() =>
      maxLoanAmountModel.deleteMaxLoanApplication(maxLoanAmountId)
    ).not.toThrow();
  });
});
