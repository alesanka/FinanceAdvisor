import { repaymentScheduleRepos } from '../repositories/repaymentScheduleRepos.js';
import { loanTypeMaxLoanAmountRepos } from '../repositories/loanType_MaxLoanAmountRepos.js';
import { loanApplicationRepos } from '../repositories/loanApplicationRepos.js';
import { loanTypeRepos } from '../repositories/loanTypeRepos.js';
import { notesRepos } from '../repositories/notesRepos.js';
import { userRepos } from '../repositories/userRepos.js';
import { NotesDTO } from '../dto/notesDTO.js';
import { createDate, toMyISOFormat } from './repaymentScheduleModel.js';
import { assertValueExists } from '../../utils/helper.js';

export const calculateEndTermDate = (date, loanTerm) => {
  let endTermDate = new Date(
    Date.UTC(date.getFullYear(), date.getMonth() + loanTerm, date.getDate())
  );
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
    notesRepos,
    loanTypeMaxLoanAmountRepos,
    loanApplicationRepos,
    loanTypeRepos,
    userRepos
  ) {
    this.repaymentScheduleRepos = repaymentScheduleRepos;
    this.notesRepos = notesRepos;
    this.loanTypeMaxLoanAmountRepos = loanTypeMaxLoanAmountRepos;
    this.loanApplicationRepos = loanApplicationRepos;
    this.loanTypeRepos = loanTypeRepos;
    this.userRepos = userRepos;
  }

  async createNotes(repaymentScheduleId, paymentDate) {
    try {
      const repaymentInfo =
        await this.repaymentScheduleRepos.getRepaymentScheduleById(
          repaymentScheduleId
        );
      assertValueExists(
        repaymentInfo,
        'Can not find repayment schedule by id.'
      );

      const applicationId = repaymentInfo.application_id;
      const monthlyPayment = repaymentInfo.monthly_payment;

      const application = await this.loanApplicationRepos.findApplicationById(
        applicationId
      );

      const applicationDate = createDate(application.application_date);

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
  async getAllNotesForRepaymentSchedule(repayment_schedule_id) {
    try {
      const repaymentSchedule =
        await this.repaymentScheduleRepos.getRepaymentScheduleById(
          repayment_schedule_id
        );

      assertValueExists(
        repaymentSchedule,
        'Can not find repayment schedule by id.'
      );

      const notes = await this.notesRepos.getAllNotesForRepaymentSchedule(
        repayment_schedule_id
      );
      const noteDTOs = notes.map(
        (note) =>
          new NotesDTO(
            note.repayment_schedule_id,
            note.payment_date,
            note.payment_amount,
            note.payment_received
          )
      );

      return noteDTOs;
    } catch (err) {
      throw new Error(`Unable to get payment notes: ${err}.`);
    }
  }

  async updatePaymentStatus(note_id) {
    try {
      const note = await this.notesRepos.getNoteById(note_id);

      assertValueExists(note, `No note was found by id ${note_id}`);

      await this.notesRepos.updatePaymentStatus(note_id);
      return;
    } catch (err) {
      throw new Error(`Unable to change note status ${note_id}: ${err}.`);
    }
  }

  async deleteNote(noteId) {
    try {
      const note = await this.notesRepos.getNoteById(noteId);
      assertValueExists(note, `No note found with id ${noteId}`);

      await this.notesRepos.deleteNote(noteId);
      return;
    } catch (err) {
      throw new Error(`Unable to delete note ${noteId}: ${err}.`);
    }
  }
}

export const notesModel = new NotesModel(
  repaymentScheduleRepos,
  notesRepos,
  loanTypeMaxLoanAmountRepos,
  loanApplicationRepos,
  loanTypeRepos,
  userRepos
);
