export class NotesDTO {
  constructor(
    repayment_schedule_id = null,
    payment_date,
    payment_amount,
    payment_received
  ) {
    this.repayment_schedule_id = repayment_schedule_id;
    this.payment_date = payment_date;
    this.payment_amount = payment_amount;
    this.payment_received = payment_received;
  }
}
