/* eslint-disable no-undef */
import {
  RepaymentScheduleModel,
  createDate,
  calculateMonthlyRate,
  calculateMonthlyPayment,
  calculateFirstPaymentDate,
  toMyISOFormat,
} from '../repaymentScheduleModel.js';
import { RepaymentScheduleDTO } from '../../dto/repaymentScheduleDTO.js';

class RepaymentScheduleReposMock {
  async getPaymentAmountByScheduleIdAndMonthYear(
    repaymentScheduleId,
    year,
    month
  ) {
    return 1000;
  }
  async getRepaymentScheduleById(id) {
    return true;
  }

  async updateRemainBalance(sum, id) {
    return true;
  }

  async deleteSchedule(id) {
    return true;
  }
}

const repaymentScheduleReposMock = new RepaymentScheduleReposMock();
const repaymentScheduleModel = new RepaymentScheduleModel(
  repaymentScheduleReposMock
);

describe('Repayment schedule model', () => {
  test(' should create a valid date object from a valid date string', () => {
    const dateStr = '2023-01-01';
    const result = createDate(dateStr);

    expect(result).toBeInstanceOf(Date);
    expect(result.toISOString().startsWith(dateStr)).toBeTruthy();
  });

  test('should throw an error for an invalid date string', () => {
    const invalidDateStr = 'date';

    expect(() => createDate(invalidDateStr)).toThrow(
      'Invalid application date'
    );
  });

  test('calculate monthly rate', () => {
    const rate = 6;
    const result = calculateMonthlyRate(rate);

    expect(result).toBeLessThan(rate);
    expect(result).toBeCloseTo(0.005);
    expect(result).toBeTruthy();
  });

  test('throws an error for an invalid rate', () => {
    const rate = 0;

    expect(() => calculateMonthlyRate(rate)).toThrow();
  });

  test('calculates monthly payment correctly for a 5-year loan', () => {
    const loanAmount = 10000;
    const annualInterestRate = 0.06;
    const loanTerm = 5;
    const expectedMonthlyPayment = 193.33;
    const result = calculateMonthlyPayment(
      loanAmount,
      annualInterestRate,
      loanTerm
    );

    expect(result).toBeTruthy();
    expect(result).toBeCloseTo(expectedMonthlyPayment, 0);
  });

  test('calculates monthly payment correctly for a 10-year loan', () => {
    const loanAmount = 20000;
    const annualInterestRate = 0.05;
    const loanTerm = 10;
    const expectedMonthlyPayment = 212.47;
    const result = calculateMonthlyPayment(
      loanAmount,
      annualInterestRate,
      loanTerm
    );

    expect(result).toBeTruthy();
    expect(result).toBeCloseTo(expectedMonthlyPayment, 0);
  });

  test('calculates first payment date for the beginning of the next month', () => {
    const date = new Date('2023-11-14');
    const expectedDate = new Date('2023-12-01');
    const result = calculateFirstPaymentDate(date);

    expect(result.toDateString()).toEqual(expectedDate.toDateString());
  });

  test('calculates first payment date for the end of the month', () => {
    const date = new Date('2023-11-30');
    const expectedDate = new Date('2023-12-01');
    const result = calculateFirstPaymentDate(date);

    expect(result.toDateString()).toEqual(expectedDate.toDateString());
  });

  test('converts a date to "YYYY-MM-DD" format', () => {
    const date = new Date('2023-11-14T10:30:00');
    const expectedFormat = '2023-11-14';
    const result = toMyISOFormat(date);

    expect(result).toEqual(expectedFormat);
  });

  test('converts a date with zero-padded month and day', () => {
    const date = new Date('2023-02-05T10:30:00');
    const expectedFormat = '2023-02-05';
    const result = toMyISOFormat(date);

    expect(result).toEqual(expectedFormat);
  });

  test('converts a date from a different timezone', () => {
    const date = new Date('2023-11-14T10:30:00-05:00');
    const expectedFormat = '2023-11-14';
    const result = toMyISOFormat(date);

    expect(result).toEqual(expectedFormat);
  });

  test('should get repayment schedule by id, year, and month', async () => {
    const repaymentScheduleId = 1;
    const year = 2023;
    const month = 11;
    const expectedPayment = 1000;
    const dto = new RepaymentScheduleDTO(
      repaymentScheduleId,
      null,
      null,
      expectedPayment
    );
    const monthPayment = await repaymentScheduleModel.getByIdYearMonth(
      dto.repayment_schedule_id,
      year,
      month
    );

    expect(monthPayment).toBeTruthy();
    expect(monthPayment).toBe(expectedPayment);
  });

  test('should update remain balance', async () => {
    const sum = 500;
    const repaymentScheduleId = 1;

    expect(async () => {
      await repaymentScheduleModel
        .updateRemainBalance(sum, repaymentScheduleId)
        .not.toThrow();
    });
  });

  test('should delete schedule', async () => {
    const repaymentScheduleId = 1;
    await repaymentScheduleModel.deleteSchedule(repaymentScheduleId);

    expect(async () => {
      await repaymentScheduleModel
        .deleteSchedule(repaymentScheduleId)
        .not.toThrow();
    });
  });
});
