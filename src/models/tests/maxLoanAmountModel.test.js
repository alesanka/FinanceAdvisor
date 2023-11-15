import {
  calculateMaxMonthlyPayment,
  calculateMaxLoanAmount,
  decreeseMaxLoanAmount,
  calculateInterestRate,
} from '../maxLoanAmountModel.js';

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
});
