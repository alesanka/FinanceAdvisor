import { loanApplicationRepos } from '../repositories/loanApplicationRepos.js';
import { loanTypeMaxLoanAmountRepos } from '../repositories/loanType_MaxLoanAmountRepos.js';
import { loanTypeRepos } from '../repositories/loanTypeRepos.js';
import { repaymentScheduleRepos } from '../repositories/repaymentScheduleRepos.js';
import { notesRepos } from '../repositories/notesRepos.js';
import { RepaymentScheduleDTO } from '../dto/repaymentScheduleDTO.js';
import { NotesDTO } from '../dto/notesDTO.js';

class RepaymentScheduleModel {
  async createRepaymentSchedule(applicationId) {
    try {
      const application = await loanApplicationRepos.findApplicationById(
        applicationId
      );
      if (!application) {
        throw new Error(`Application with id ${applicationId} does not exist.`);
      }

      const isApproved = application.is_approved;
      if (!isApproved) {
        throw new Error(
          'Can not create repayment schedule for loan with is not approved yet.'
        );
      }

      const loanAmount = application.desired_loan_amount;

      const applicationDate = new Date(application.application_date);
      if (isNaN(applicationDate)) {
        throw new Error(
          `Invalid application date: ${application.application_date}`
        );
      }

      const loanTypeMaxAmount =
        await loanTypeMaxLoanAmountRepos.getLoanTypeMaxLoanId(application.id);
      const loanTypeId = loanTypeMaxAmount.loan_type_id;

      const loanTypeDetails = await loanTypeRepos.findLoanById(loanTypeId);

      const loanTerm = loanTypeDetails.loan_term;
      const interestRate = loanTypeDetails.interest_rate;

      const monthlyRate = interestRate / 12 / 100;

      const monthlyPayment =
        (loanAmount * (monthlyRate * Math.pow(1 + monthlyRate, loanTerm))) /
        (Math.pow(1 + monthlyRate, loanTerm) - 1);

      const repaymentScheduleDTO = new RepaymentScheduleDTO(
        null,
        applicationId,
        monthlyPayment,
        loanAmount
      );
      console.log('repaymentScheduleDTO', repaymentScheduleDTO);
      const repaymentScheduleId =
        await repaymentScheduleRepos.createRepaymentSchedule(
          repaymentScheduleDTO.application_id,
          repaymentScheduleDTO.monthly_payment,
          repaymentScheduleDTO.remaining_balance
        );

      const firstPaymentDate = new Date(
        applicationDate.getFullYear(),
        applicationDate.getMonth() + 1,
        applicationDate.getDate()
      );

      const noteDTO = new NotesDTO(
        repaymentScheduleId,
        firstPaymentDate.toISOString().split('T')[0],
        monthlyPayment,
        false
      );

      console.log('noteDTO', noteDTO);

      await notesRepos.createNotes(
        noteDTO.repayment_schedule_id,
        noteDTO.payment_date,
        noteDTO.payment_amount
      );

      return { repaymentScheduleId, firstPaymentDate };
    } catch (err) {
      throw new Error(`Unable to create repayment schedule: ${err}`);
    }
  }
}

export const repaymentScheduleModel = new RepaymentScheduleModel();
