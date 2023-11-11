import { repaymentScheduleRepos } from '../repositories/repaymentScheduleRepos.js';
import { loanTypeMaxLoanAmountRepos } from '../repositories/loanType_MaxLoanAmountRepos.js';
import { loanApplicationRepos } from '../repositories/loanApplicationRepos.js';
import { loanTypeRepos } from '../repositories/loanTypeRepos.js';
import { notesRepos } from '../repositories/notesRepos.js';
import { NotesDTO } from '../dto/notesDTO.js';

class NotesModel {
  async createNotes(repaymentScheduleId, paymentDate) {
    try {
      const repaymentInfo =
        await repaymentScheduleRepos.getRepaymentScheduleById(
          repaymentScheduleId
        );

      if (!repaymentInfo) {
        throw new Error(' Can not find repayment schedule by id.');
      }

      const applicationId = repaymentInfo.application_id;
      const monthlyPayment = repaymentInfo.monthly_payment;

      const application = await loanApplicationRepos.findApplicationById(
        applicationId
      );

      const applicationDate = new Date(application.dto.application_date);
      if (isNaN(applicationDate)) {
        throw new Error(
          `Invalid application date: ${application.dto.application_date}`
        );
      }

      const loanTypeMaxAmount =
        await loanTypeMaxLoanAmountRepos.getLoanTypeMaxLoanId(application.id);
      const loanTypeId = loanTypeMaxAmount.loan_type_id;

      const loanTypeDetails = await loanTypeRepos.findLoanById(loanTypeId);

      const loanTerm = loanTypeDetails.loan_term;

      const endTermDate = new Date(applicationDate);
      endTermDate.setMonth(endTermDate.getMonth() + loanTerm);

      if (
        new Date(paymentDate) < applicationDate ||
        new Date(paymentDate) > endTermDate
      ) {
        throw new Error(
          `Payment date ${formattedPaymentDate} is out of range.`
        );
      }

      const formattedPaymentDate = new Date(paymentDate)
        .toISOString()
        .split('T')[0];

      const notesDTO = new NotesDTO(
        repaymentScheduleId,
        formattedPaymentDate,
        monthlyPayment,
        false
      );

      const noteId = await notesRepos.createNotes(notesDTO);

      return noteId;
    } catch (err) {
      throw new Error(`Unable to create payment notes: ${err}.`);
    }
  }
}

export const notesModel = new NotesModel();
