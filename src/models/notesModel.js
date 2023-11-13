import { repaymentScheduleRepos } from '../repositories/repaymentScheduleRepos.js';
import { loanTypeMaxLoanAmountRepos } from '../repositories/loanType_MaxLoanAmountRepos.js';
import { loanApplicationRepos } from '../repositories/loanApplicationRepos.js';
import { loanTypeRepos } from '../repositories/loanTypeRepos.js';
import { notesRepos } from '../repositories/notesRepos.js';
import { NotesDTO } from '../dto/notesDTO.js';
export { createDate, toMyISOFormat } from '../models/repaymentScheduleModel.js';

export const calculateEndTermDate = (date, loanTerm) => {
  let endTermDate = new Date(date);
  endTermDate.setMonth(endTermDate.getMonth() + loanTerm);
  return endTermDate;
};

export const checkIsRightTerm = (paymentDate, applicationDate, endTermDate) => {
  if (
    new Date(paymentDate) < applicationDate ||
    new Date(paymentDate) > endTermDate
  ) {
    throw new Error(`Payment date is out of range.`);
  }
};

export class NotesModel {
  constructor(
    repaymentScheduleRepos,
    loanTypeMaxLoanAmountRepos,
    loanApplicationRepos,
    loanTypeRepos,
    notesRepos
  ) {
    (this.repaymentScheduleRepos = repaymentScheduleRepos),
      (this.loanTypeMaxLoanAmountRepos = loanTypeMaxLoanAmountRepos),
      (this.loanApplicationRepos = loanApplicationRepos),
      (this.loanTypeRepos = loanTypeRepos),
      (this.notesRepos = notesRepos);
  }

  async createNotes(repaymentScheduleId, paymentDate) {
    try {
      const repaymentInfo =
        await this.repaymentScheduleRepos.getRepaymentScheduleById(
          repaymentScheduleId
        );

      if (!repaymentInfo) {
        throw new Error(' Can not find repayment schedule by id.');
      }

      const applicationId = repaymentInfo.application_id;
      const monthlyPayment = repaymentInfo.monthly_payment;

      const application = await this.loanApplicationRepos.findApplicationById(
        applicationId
      );

      const applicationDate = createDate(application.dto.application_date);

      const loanTypeMaxAmount =
        await this.loanTypeMaxLoanAmountRepos.getLoanTypeMaxLoanId(
          application.id
        );

      const loanTypeId = loanTypeMaxAmount.loan_type_id;

      const loanTypeDetails = await this.loanTypeRepos.findLoanById(loanTypeId);

      const loanTerm = loanTypeDetails.loan_term;

      const endTermDate = calculateEndTermDate(applicationDate, loanTerm);

      checkIsRightTerm(paymentDate, applicationDate, endTermDate);

      const formattedPaymentDate = new Date(toMyISOFormat(paymentDate));

      const notesDTO = new NotesDTO(
        repaymentScheduleId,
        formattedPaymentDate,
        monthlyPayment,
        false
      );

      const noteId = await this.notesRepos.createNotes(notesDTO);

      return noteId;
    } catch (err) {
      throw new Error(`Unable to create payment notes: ${err}.`);
    }
  }
}

export const notesModel = new NotesModel(
  repaymentScheduleRepos,
  loanTypeMaxLoanAmountRepos,
  loanApplicationRepos,
  loanTypeRepos,
  notesRepos
);
