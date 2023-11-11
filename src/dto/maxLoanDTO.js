export class MaxLoanDTO {
  constructor(
    max_loan_amount_id = null,
    client_id,
    max_loan_amount,
    total_interest_amount
  ) {
    this.max_loan_amount_id = max_loan_amount_id;
    this.client_id = client_id;
    this.max_loan_amount = max_loan_amount;
    this.total_interest_amount = total_interest_amount;
  }
}
