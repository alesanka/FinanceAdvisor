import { checkIfLoanAmountAvailable } from '../loanApplicationModel.js';

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
});
