import { loanApplicationRepos } from '../repositories/loanApplicationRepos.js';
import { loanTypeMaxLoanAmountRepos } from '../repositories/loanType_MaxLoanAmountRepos.js';
import { loanTypeRepos } from '../repositories/loanTypeRepos.js';
import { repaymentScheduleRepos } from '../repositories/repaymentScheduleRepos.js';
import { notesRepos } from '../repositories/notesRepos.js';
import { RepaymentScheduleDTO } from '../dto/repaymentScheduleDTO.js';
import { NotesDTO } from '../dto/notesDTO.js';

export const createDate = (date) => {
  const createdDate = new Date(date);
  if (isNaN(createdDate)) {
    throw new Error(`Invalid application date: ${date}`);
  }
  return createdDate;
};

export const calculateMonthlyRate = (rate) => {
  const monthlyRate = rate / 12 / 100;
  return monthlyRate;
};

export const calculateMonthlyPayment = (loanAmount, monthlyRate, loanTerm) => {
  const monthlyPayment =
    (loanAmount * (monthlyRate * Math.pow(1 + monthlyRate, loanTerm))) /
    (Math.pow(1 + monthlyRate, loanTerm) - 1);
  return monthlyPayment;
};

export const calculateFirstPaymentDate = (date) => {
  const firstPaymentDate = new Date(
    date.getFullYear(),
    date.getMonth() + 1,
    date.getDate()
  );
  return firstPaymentDate;
};

export const toMyISOFormat = (date) => {
  const newDate = date.toISOString().split('T')[0];
  return newDate;
};

export class RepaymentScheduleModel {
  constructor(
    loanApplicationRepos,
    loanTypeMaxLoanAmountRepos,
    loanTypeRepos,
    repaymentScheduleRepos,
    notesRepos
  ) {
    (this.loanApplicationRepos = loanApplicationRepos),
      (this.loanTypeMaxLoanAmountRepos = loanTypeMaxLoanAmountRepos),
      (this.loanTypeRepos = loanTypeRepos),
      (this.repaymentScheduleRepos = repaymentScheduleRepos),
      (this.notesRepos = notesRepos);
  }

  async createRepaymentSchedule(applicationId) {
    try {
      const application = await this.loanApplicationRepos.findApplicationById(
        applicationId
      );

      if (!application) {
        throw new Error(`Application with id ${applicationId} does not exist.`);
      }

      if (!application.is_approved) {
        throw new Error(
          'Can not create repayment schedule for loan with is not approved yet.'
        );
      }

      const loanAmount = application.desired_loan_amount;
      const applicationDate = createDate(application.application_date);

      const loanTypeMaxAmount =
        await this.loanTypeMaxLoanAmountRepos.getLoanTypeMaxLoanId(
          application.id
        );
      const loanTypeId = loanTypeMaxAmount.loan_type_id;

      const loanTypeDetails = await this.loanTypeRepos.findLoanById(loanTypeId);

      const loanTerm = loanTypeDetails.loan_term;
      const interestRate = loanTypeDetails.interest_rate;

      const monthlyRate = calculateMonthlyRate(interestRate);

      const monthlyPayment = calculateMonthlyPayment(
        loanAmount,
        monthlyRate,
        loanTerm
      );

      const repaymentScheduleDTO = new RepaymentScheduleDTO(
        null,
        applicationId,
        monthlyPayment,
        loanAmount
      );

      const repaymentScheduleId =
        await this.repaymentScheduleRepos.createRepaymentSchedule(
          repaymentScheduleDTO
        );

      const firstPaymentDate = calculateFirstPaymentDate(applicationDate);

      const noteDTO = new NotesDTO(
        repaymentScheduleId,
        toMyISOFormat(firstPaymentDate),
        monthlyPayment,
        false
      );

      await this.notesRepos.createNotes(noteDTO);

      return { repaymentScheduleId, firstPaymentDate };
    } catch (err) {
      throw new Error(`Unable to create repayment schedule: ${err}`);
    }
  }

  async getByIdYearMonth(repaymentScheduleId, year, month) {
    try {
      const monthPayment =
        await this.repaymentScheduleRepos.getPaymentAmountByScheduleIdAndMonthYear(
          repaymentScheduleId,
          year,
          month
        );
      return monthPayment;
    } catch (err) {
      throw new Error(`Something went wrong by getting month payment: ${err}`);
    }
  }
}

export const repaymentScheduleModel = new RepaymentScheduleModel(
  loanApplicationRepos,
  loanTypeMaxLoanAmountRepos,
  loanTypeRepos,
  repaymentScheduleRepos,
  notesRepos
);
