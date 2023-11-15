export class ClientDTO {
  constructor(client_id, user_id, salary, credit_story = false) {
    this.client_id = client_id;
    this.user_id = user_id;
    this.salary = salary;
    this.credit_story = credit_story;
  }
}

