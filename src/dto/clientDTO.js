export class ClientDTO {
  constructor(client_id, user_id, salary, credit_story = false) {
    this._client_id = client_id;
    this._user_id = user_id;
    this._salary = salary;
    this._credit_story = credit_story;
  }

  get client_id() {
    return this._client_id;
  }

  get user_id() {
    return this._user_id;
  }

  get salary() {
    return this._salary;
  }

  get credit_story() {
    return this._credit_story;
  }

  set user_id(value) {
    this._user_id = value;
  }

  set client_id(value) {
    this._client_id = value;
  }

  set salary(value) {
    this._salary = value;
  }

  set credit_story(value) {
    this._credit_story = value;
  }
}
