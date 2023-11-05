export class ApplicationDTO {
  constructor(
    application_id = null,
    desired_loan_amount,
    application_date,
    is_approved
  ) {
    this._application_id = application_id;
    this._desired_loan_amount = desired_loan_amount;
    this._application_date = application_date;
    this._is_approved = is_approved;
  }

  get application_id() {
    return this._application_id;
  }

  get desired_loan_amount() {
    return this._desired_loan_amount;
  }

  get application_date() {
    return this._application_date;
  }

  get is_approved() {
    return this._is_approved;
  }

  set application_id(value) {
    this._application_id = value;
  }

  set desired_loan_amount(value) {
    this._desired_loan_amount = value;
  }

  set application_date(value) {
    this._application_date = value;
  }

  set is_approved(value) {
    this._is_approved = value;
  }
}
