import { maxLoanAmountRepos } from '../repositories/maxLoanAmountRepos.js';
import { userRepos } from '../repositories/userRepos.js';
import { loanTypeRepos } from '../repositories/loanTypeRepos.js';
import { loanTypeMaxLoanAmountRepos } from '../repositories/loanType_MaxLoanAmountRepos.js';
import { MaxLoanDTO } from '../dto/maxLoanDTO.js';
import { LoanTypeDTO } from '../dto/loanTypesDTO.js';

export const calculateMaxMonthlyPayment = (salary) => {
  const payment = salary * 0.5;
  return payment;
};

export const calculateInterestRate = (rate) => {
  const i = rate / 12 / 100;
  return i;
};

export const decreeseMaxLoanAmount = (max_loan_amount) => {
  const newMaxLoanAmount = max_loan_amount * 0.9;
  return Math.round(newMaxLoanAmount);
};

export const calculateMaxLoanAmount = (maxMonthlyPayment, interest, term) => {
  const maxLoan =
    maxMonthlyPayment *
    ((Math.pow(1 + interest, term) - 1) /
      (interest * Math.pow(1 + interest, term)));
  return Math.round(maxLoan);
};

export const calculateTotalInterest = (
  principalAmount,
  interestRate,
  numberOfMonths
) => {
  const monthlyRate = interestRate / 12 / 100;
  const annuityCoefficient =
    (monthlyRate * Math.pow(1 + monthlyRate, numberOfMonths)) /
    (Math.pow(1 + monthlyRate, numberOfMonths) - 1);
  const monthlyPayment = principalAmount * annuityCoefficient;
  const totalPayments = monthlyPayment * numberOfMonths;
  const totalInterest = totalPayments - principalAmount;
  return totalInterest;
};

export class MaxLoanAmountModel {
  constructor(
    maxLoanAmountRepos,
    userRepos,
    loanTypeRepos,
    loanTypeMaxLoanAmountRepos
  ) {
    (this.maxLoanAmountRepos = maxLoanAmountRepos),
      (this.userRepos = userRepos),
      (this.loanTypeRepos = loanTypeRepos),
      (this.loanTypeMaxLoanAmountRepos = loanTypeMaxLoanAmountRepos);
  }
  async saveMaxLoan(client_id, loan_type_id) {
    try {
      const loanTypeDetails = await this.loanTypeRepos.findLoanById(
        loan_type_id
      );
      if (!loanTypeDetails) {
        throw new Error('Invalid loan type id.');
      }
      const rate = loanTypeDetails.interest_rate;
      const term = loanTypeDetails.loan_term;
      const clientDetails = await this.userRepos.findClientById(client_id);
      if (!clientDetails) {
        throw new Error('Invalid client id.');
      }
      const credit_story = clientDetails.credit_story;
      const salary = clientDetails.salary;

      const maxMonthlyPayment = calculateMaxMonthlyPayment(salary);

      const interest = calculateInterestRate(rate);

      let max_loan_amount = calculateMaxLoanAmount(
        maxMonthlyPayment,
        interest,
        term
      );
      // If client does not have a credit story - his max loan amount is decreased by 10%
      if (!credit_story) {
        decreeseMaxLoanAmount(max_loan_amount);
      }

      const total_interest_amount = calculateTotalInterest(
        max_loan_amount,
        rate,
        term
      );

      const maxLoanDTO = new MaxLoanDTO(
        null,
        client_id,
        max_loan_amount,
        total_interest_amount
      );

      const max_loan_amount_id = await this.maxLoanAmountRepos.saveMaxLoan(
        maxLoanDTO
      );

      await this.loanTypeMaxLoanAmountRepos.saveLoanTypeMaxLoan(
        loan_type_id,
        max_loan_amount_id
      );

      return max_loan_amount_id;
    } catch (err) {
      throw new Error(`Unable to save max loan amount: ${err}`);
    }
  }
  async getMaxLoanAmount(maxLoanAmountId) {
    try {
      const maxAmountLoanType =
        await this.maxLoanAmountRepos.getMaxLoanAmountLoanType(maxLoanAmountId);
      if (!maxAmountLoanType) {
        throw new Error('Invalid max_loan_amount_id');
      }

      const maxLoanDTO = new MaxLoanDTO(
        maxAmountLoanType.max_loan_amount_id,
        maxAmountLoanType.client_id,
        maxAmountLoanType.max_loan_amount,
        maxAmountLoanType.total_interest_amount
      );

      const loanTypeDTO = new LoanTypeDTO(
        maxAmountLoanType.loan_type_id,
        maxAmountLoanType.loan_type,
        maxAmountLoanType.interest_rate,
        maxAmountLoanType.loan_term,
        maxAmountLoanType.required_doc
      );

      let result = {
        max_loan_amount: maxLoanDTO.max_loan_amount,
        total_interest_amount: maxLoanDTO.total_interest_amount,
        loan_type: loanTypeDTO.loan_type,
        interest_rate: loanTypeDTO.interest_rate,
        loan_term: loanTypeDTO.loan_term,
      };

      return result;
    } catch (err) {
      throw new Error(`Unable to get max loan amount by id: ${err}`);
    }
  }
}

export const maxLoanAmountModel = new MaxLoanAmountModel(
  maxLoanAmountRepos,
  userRepos,
  loanTypeRepos,
  loanTypeMaxLoanAmountRepos
);
