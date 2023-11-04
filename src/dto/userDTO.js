import { z } from 'zod';

const RoleSchema = z.enum(['client', 'worker', 'admin']);

export class UserDTO {
  constructor(
    id_user = null,
    username,
    first_name,
    last_name,
    email,
    phone_number,
    role
  ) {
    this._id_user = id_user;
    this._username = username;
    this._first_name = first_name;
    this._last_name = last_name;
    this._email = this.validateEmail(email);
    this._phone_number = this.validatePhone(phone_number);
    this._role = this.validateRole(role);
  }

  validateEmail(email) {
    const emailSchema = z.string().email();

    try {
      return emailSchema.parse(email);
    } catch (e) {
      throw new Error('Invalid email format');
    }
  }

  validatePhone(phone_number) {
    const phoneSchema = z.string().length(10);
    try {
      return phoneSchema.parse(phone_number);
    } catch (e) {
      throw new Error('Phone number must contain 10 digits');
    }
  }

  validateRole(role) {
    try {
      return RoleSchema.parse(role);
    } catch (e) {
      throw new Error('Invalid role');
    }
  }

  get id_user() {
    return this._id_user;
  }

  get username() {
    return this._username;
  }

  get first_name() {
    return this._first_name;
  }

  get last_name() {
    return this._last_name;
  }

  get phone_number() {
    return this._phone_number;
  }

  get email() {
    return this._email;
  }

  get role() {
    return this._role;
  }

  set id_user(value) {
    this._id_user = value;
  }

  set first_name(value) {
    this._first_name = value;
  }

  set last_name(value) {
    this._last_name = value;
  }

  set phone_number(value) {
    this._phone_number = value;
  }

  set email(value) {
    this._email = this.validateEmail(value);
  }

  set role(value) {
    this._role = value;
  }
}
