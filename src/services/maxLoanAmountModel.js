import { maxLoanAmountRepos } from '../repositories/maxLoanAmountRepos.js';
import { userRepos } from '../repositories/userRepos.js';
import { MaxLoanDTO } from '../dto/maxLoanDTO.js';
import { loanTypeRepos } from '../repositories/loanTypeRepos.js';

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
        maxLoanDTO.client_id,
        maxLoanDTO.max_loan_amount,
        maxLoanDTO.total_interest_amount
      );

      return max_loan_amount_id;
    } catch (err) {
      throw new Error(`Unable to save max loan amount: ${err}`);
    }
  }
  async getMaxLoanAmount(maxLoanamountId) {
    try {
      const result = await pool.query(
        `SELECT 
                m.max_loan_amount_id,
                m.application_id,  
                m.max_loan_amount, 
                m.total_interest_amount, 
                lta.loan_type_id,
                lt.loan_type
             FROM MaximumLoanAmounts AS m
             JOIN LoanTypes_LoanApplications AS lta ON m.loan_app_loan_type_id = lta.id
             JOIN LoanTypes AS lt ON lta.loan_type_id = lt.loan_type_id
             JOIN LoanApplications AS la ON lta.application_id = la.application_id
             WHERE m.max_loan_amount_id = $1;`,
        [maxLoanamountId]
      );

      if (result.rows.length === 0) {
        throw new Error('Data not found for the provided max loan amount ID.');
      }

      return result.rows[0];
    } catch (err) {
      console.error(`Unable to get max loan amount by id: ${err}`);
      throw new Error(`Unable to get max loan amount by id.`);
    }
  }

  async getMaxLoanAmountByApplicationId(applicationId) {
    try {
      const result = await pool.query(
        `SELECT 
          m.max_loan_amount_id,
          m.application_id,  
          m.max_loan_amount, 
          m.total_interest_amount, 
          lta.loan_type_id,
          lt.loan_type,
          lt.interest_rate,
          lt.loan_term
       FROM MaximumLoanAmounts AS m
       JOIN LoanTypes_LoanApplications AS lta ON m.loan_app_loan_type_id = lta.id
       JOIN LoanTypes AS lt ON lta.loan_type_id = lt.loan_type_id
       WHERE m.application_id = $1;`,
        [applicationId]
      );

      if (result.rows.length === 0) {
        throw new Error('Data not found for the provided application ID.');
      }

      return result.rows[0];
    } catch (err) {
      console.error(`Unable to get max loan amount by application id: ${err}`);
      throw new Error(`Unable to get max loan amount by application id.`);
    }
  }
}

export const maxLoanAmountModel = new MaxLoanAmountModel();
