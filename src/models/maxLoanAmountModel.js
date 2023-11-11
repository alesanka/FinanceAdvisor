import { maxLoanAmountRepos } from '../repositories/maxLoanAmountRepos.js';
import { userRepos } from '../repositories/userRepos.js';
import { loanTypeRepos } from '../repositories/loanTypeRepos.js';
import { loanTypeMaxLoanAmountRepos } from '../repositories/loanType_MaxLoanAmountRepos.js';
import { MaxLoanDTO } from '../dto/maxLoanDTO.js';
import { LoanTypeDTO } from '../dto/loanTypesDTO.js';

class MaxLoanAmountModel {
  async saveMaxLoan(client_id, loan_type_id) {
    try {
      const loanTypeDetails = await loanTypeRepos.findLoanById(loan_type_id);
      if (!loanTypeDetails) {
        throw new Error('Invalid loan type id.');
      }
      const rate = loanTypeDetails.interest_rate;
      const term = loanTypeDetails.loan_term;
      const clientDetails = await userRepos.findClientById(client_id);
      if (!clientDetails) {
        throw new Error('Invalid client id.');
      }
      const credit_story = clientDetails.credit_story;
      const salary = clientDetails.salary;

      const maxMonthlyPayment = salary * 0.5;
      const i = rate / 12 / 100;
      let max_loan_amount =
        maxMonthlyPayment *
        ((Math.pow(1 + i, term) - 1) / (i * Math.pow(1 + i, term)));

      // If client does not have a credit story - his max loan amount is decreased by 10%
      if (!credit_story) {
        max_loan_amount *= 0.9;
      }

      max_loan_amount = Math.round(max_loan_amount);

      const calculateTotalInterest = (
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

      const max_loan_amount_id = await maxLoanAmountRepos.saveMaxLoan(
        maxLoanDTO
      );

      await loanTypeMaxLoanAmountRepos.saveLoanTypeMaxLoan(
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
        await maxLoanAmountRepos.getMaxLoanAmountLoanType(maxLoanAmountId);
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

export const maxLoanAmountModel = new MaxLoanAmountModel();
