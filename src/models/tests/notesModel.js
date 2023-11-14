import { calculateEndTermDate } from '../notesModel.js';

export const calculateEndTermDate = (date, loanTerm) => {
  let endTermDate = new Date(date);
  endTermDate.setMonth(endTermDate.getMonth() + loanTerm);
  return endTermDate;
};
