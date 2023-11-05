export class MaxLoanDTO {
  constructor(
    max_loan_amount_id = null,
    client_id,
    max_loan_amount,
    total_interest_amount
  ) {
    this._max_loan_amount_id = max_loan_amount_id;
    this._client_id = client_id;
    this._max_loan_amount = max_loan_amount;
    this._total_interest_amount = total_interest_amount;
  }

  get max_loan_amount_id() {
    return this._max_loan_amount_id;
  }

  get client_id() {
    return this._client_id;
  }

  get max_loan_amount() {
    return this._max_loan_amount;
  }

  get total_interest_amount() {
    return this._total_interest_amount;
  }

  set max_loan_amount_id(value) {
    this._max_loan_amount_id = value;
  }

  set client_id(value) {
    this._client_id = value;
  }

  set max_loan_amount(value) {
    this._max_loan_amount = value;
  }

  set total_interest_amount(value) {
    this._total_interest_amount = value;
  }
}
