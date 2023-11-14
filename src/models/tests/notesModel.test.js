import { calculateEndTermDate } from '../notesModel.js';

describe('calculateEndTermDate', () => {
  test('should correctly calculate the end term date', () => {
    const startDate = new Date('2023-01-01');
    const loanTerm = 6;
    const expectedEndDate = new Date('2023-07-01');
    const actualEndDate = calculateEndTermDate(startDate, loanTerm);

    expect(actualEndDate).toEqual(expectedEndDate);
  });

  test('should handle leap years correctly', () => {
    const startDate = new Date('2024-01-01');
    const loanTerm = 2;

    const expectedEndDate = new Date('2024-03-01');
    const actualEndDate = calculateEndTermDate(startDate, loanTerm);

    expect(actualEndDate).toEqual(expectedEndDate);
  });
});
