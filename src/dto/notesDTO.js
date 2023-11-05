export class NotesDTO {
  constructor(
    repayment_schedule_id = null,
    payment_date,
    payment_amount,
    payment_received
  ) {
    this._repayment_schedule_id = repayment_schedule_id;
    this._payment_date = payment_date;
    this._payment_amount = payment_amount;
    this._payment_received = payment_received;
  }

  get repayment_schedule_id() {
    return this._repayment_schedule_id;
  }

  get payment_date() {
    return this._payment_date;
  }

  get payment_amount() {
    return this._payment_amount;
  }

  get payment_received() {
    return this._payment_received;
  }

  set repayment_schedule_id(value) {
    this._repayment_schedule_id = value;
  }

  set payment_date(value) {
    this._payment_date = value;
  }

  set payment_amount(value) {
    this._payment_amount = value;
  }

  set payment_received(value) {
    this._payment_received = value;
  }
}
