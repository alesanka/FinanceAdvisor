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
    this._loan_type_id = loan_type_id;
    this._loan_type = this.validateLoanType(loan_type);
    this._interest_rate = interest_rate;
    this._loan_term = this.validateTerm(loan_term);
    this._required_doc = this.validateDoc(required_doc);
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

  get loan_type_id() {
    return this._loan_type_id;
  }

  get loan_type() {
    return this._loan_type;
  }

  get interest_rate() {
    return this._interest_rate;
  }

  get loan_term() {
    return this._loan_term;
  }

  get required_doc() {
    return this._required_doc;
  }

  set loan_type_id(value) {
    this._loan_type_id = value;
  }

  set loan_type(value) {
    this._loan_type = this.validateLoanType(value);
  }

  set interest_rate(value) {
    this._interest_rate = value;
  }

  set loan_term(value) {
    this._loan_term = this.validateTerm(value);
  }

  set required_doc(value) {
    this._required_doc = this.validateDoc(value);
  }
}
