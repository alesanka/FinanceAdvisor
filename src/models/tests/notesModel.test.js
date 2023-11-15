/* eslint-disable no-undef */
import {
  NotesModel,
  calculateEndTermDate,
  checkIsRightTerm,
} from '../notesModel.js';


class NotesReposMock {
  async createNotes() {
    return 1;
  }

  async getAllNotesForRepaymentSchedule() {
    return [
      {
        repayment_schedule_id: 1,
        payment_date: 'date',
        payment_amount: 5000,
        payment_received: false,
      },
    ];
  }

  async updatePaymentStatus() {
    return;
  }

  async getNoteById(noteId) {
    if (noteId === 1) {
      return {
        note_id: 1,
        repayment_schedule_id: 1,
        payment_date: 'date',
        payment_amount: 5000,
        payment_received: false,
      };
    } else {
      return null;
    }
  }

  async deleteNote(noteId) {
    if (noteId === 1) {
      // empty block
      return;
    } else {
      throw new Error(`Note with id ${noteId} does not exist.`);
    }
  }
}

class RepaymentReposMock {
  async getRepaymentScheduleById(id) {
    if (id) {
      return true;
    } else {
      return false;
    }
  }
}

const notesReposMock = new NotesReposMock();
const repaymentReposMock = new RepaymentReposMock();
const notesModel = new NotesModel(repaymentReposMock, notesReposMock);

describe('Note model', () => {
  test('calculateEndTermDate should correctly calculate the end term date', () => {
    const startDate = new Date('2023-01-01');
    const loanTerm = 6;
    const expectedEndDate = new Date('2023-07-01');
    const actualEndDate = calculateEndTermDate(startDate, loanTerm);

    expect(actualEndDate).toEqual(expectedEndDate);
  });

  test('calculateEndTermDate should handle leap years correctly', () => {
    const startDate = new Date('2024-01-01');
    const loanTerm = 2;
    const expectedEndDate = new Date('2024-03-01');
    const actualEndDate = calculateEndTermDate(startDate, loanTerm);

    expect(actualEndDate).toEqual(expectedEndDate);
  });

  describe('checkIsRightTerm', () => {
    const applicationDate = new Date('2023-01-01');
    const endTermDate = new Date('2023-12-31');

    test('should not throw an error for a valid payment date within the term', () => {
      const paymentDate = new Date('2023-06-15');

      expect(() =>
        checkIsRightTerm(paymentDate, applicationDate, endTermDate)
      ).not.toThrow();
    });

    test('should throw an error if the payment date is before the application date', () => {
      const paymentDate = new Date('2022-12-31');

      expect(() =>
        checkIsRightTerm(paymentDate, applicationDate, endTermDate)
      ).toThrow('Payment date is out of range.');
    });

    test('should throw an error if the payment date is after the end term date', () => {
      const paymentDate = new Date('2024-01-01');

      expect(() =>
        checkIsRightTerm(paymentDate, applicationDate, endTermDate)
      ).toThrow('Payment date is out of range.');
    });

    test('should not throw an error for a payment date exactly on the application date', () => {
      const paymentDate = new Date('2023-01-01');

      expect(() =>
        checkIsRightTerm(paymentDate, applicationDate, endTermDate)
      ).not.toThrow();
    });

    test('should not throw an error for a payment date exactly on the end term date', () => {
      const paymentDate = new Date('2023-12-31');

      expect(() =>
        checkIsRightTerm(paymentDate, applicationDate, endTermDate)
      ).not.toThrow();
    });
  });

  test('should return notes if valid note id', async () => {
    const validNoteId = 1;

    expect(
      await notesModel.getAllNotesForRepaymentSchedule(validNoteId)
    ).toEqual([
      {
        repayment_schedule_id: 1,
        payment_date: 'date',
        payment_amount: 5000,
        payment_received: false,
      },
    ]);
  });

  test('should not return notes if invalid note id', async () => {
    const inValidNoteId = null;

    await expect(() =>
      notesModel.getAllNotesForRepaymentSchedule(inValidNoteId)
    ).rejects.toThrow();
  });

  test('should update payment status for a note', async () => {
    const noteId = 1;
    
    await expect(() => notesModel.updatePaymentStatus(noteId)).not.toThrow();
  });

  test('should delete a note', async () => {
    const noteId = 1;

    await expect(() => notesModel.deleteNote(noteId)).not.toThrow();
  });
});
