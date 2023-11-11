export class RepaymentScheduleDTO {
  constructor(
    repayment_schedule_id = null,
    application_id,
    monthly_payment,
    remaining_balance
  ) {
    this.repayment_schedule_id = repayment_schedule_id;
    this.application_id = application_id;
    this.monthly_payment = monthly_payment;
    this.remaining_balance = remaining_balance;
  }
}
