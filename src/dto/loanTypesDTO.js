import { z } from 'zod';

const LoanSchema = z.enum([
  'personal_loan',
  'mortgage',
  'student_loan',
  'business_loan',
]);

const DocSchema = z.enum([
  'passport',
  'student_verification',
  'business_plan',
  'purchase_agreement',
]);

export class LoanTypeDTO {
  constructor(
    loan_type_id = null,
    loan_type,
    interest_rate,
    loan_term,
    required_doc
  ) {
    this.loan_type_id = loan_type_id;
    this.loan_type = this.validateLoanType(loan_type);
    this.interest_rate = interest_rate;
    this.loan_term = this.validateTerm(loan_term);
    this.required_doc = this.validateDoc(required_doc);
  }

  validateTerm(loan_term) {
    const termSchema = z.number().positive();
    try {
      return termSchema.parse(loan_term);
    } catch (e) {
      throw new Error('Provide correct info about loan term.');
    }
  }

  validateLoanType(type) {
    try {
      return LoanSchema.parse(type);
    } catch (e) {
      throw new Error('Invalid loan type');
    }
  }

  validateDoc(doc) {
    try {
      return DocSchema.parse(doc);
    } catch (e) {
      throw new Error('Invalid document type');
    }
  }
}
