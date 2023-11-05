export class RepaymentScheduleDTO {
  constructor(
    repayment_schedule_id = null,
    application_id,
    monthly_payment,
    remaining_balance
  ) {
    this._repayment_schedule_id = repayment_schedule_id;
    this._application_id = application_id;
    this._monthly_payment = monthly_payment;
    this._remaining_balance = remaining_balance;
  }

  get repayment_schedule_id() {
    return this._repayment_schedule_id;
  }

  get application_id() {
    return this._desired_loan_amount;
  }

  get monthly_payment() {
    return this._monthly_payment;
  }

  get remaining_balance() {
    return this._remaining_balance;
  }

  set repayment_schedule_id(value) {
    this._repayment_schedule_id = value;
  }

  set application_id(value) {
    this._application_id = value;
  }

  set monthly_payment(value) {
    this._monthly_payment = value;
  }

  set remaining_balance(value) {
    this._remaining_balance = value;
  }
}
