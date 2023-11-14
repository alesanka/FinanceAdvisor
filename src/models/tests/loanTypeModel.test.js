import { checkDocType } from '../loanTypeModel.js';

describe('checkDocType', () => {
  it('should return true for valid document types', () => {
    expect(checkDocType('passport')).toBeTruthy();
    expect(checkDocType('student_verification')).toBeTruthy();
    expect(checkDocType('business_plan')).toBeTruthy();
    expect(checkDocType('purchase_agreement')).toBeTruthy();
  });

  it('should return false for invalid document types', () => {
    expect(checkDocType('id_card')).toBeFalsy();
  });

  it('should handle wrong inputs', () => {
    expect(checkDocType(123)).toBeFalsy();
    expect(checkDocType(null)).toBeFalsy();
  });
});
