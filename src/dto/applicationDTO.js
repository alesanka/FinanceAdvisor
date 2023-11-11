export class ApplicationDTO {
  constructor(
    application_id = null,
    desired_loan_amount,
    application_date,
    is_approved
  ) {
    this.application_id = application_id;
    this.desired_loan_amount = desired_loan_amount;
    this.application_date = application_date;
    this.is_approved = is_approved;
  }
}
