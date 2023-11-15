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
    this.id_user = id_user;
    this.username = username;
    this.first_name = first_name;
    this.last_name = last_name;
    this.email = UserDTO.validateEmail(email);
    this.phone_number = UserDTO.validatePhone(phone_number);
    this.role = UserDTO.validateRole(role);
  }

  static validateEmail(email) {
    const emailSchema = z.string().email();
    try {
      return emailSchema.parse(email);
    } catch (e) {
      console.error(e);
      throw new Error('Invalid email format');
    }
  }

  static validatePhone(phone_number) {
    const phoneSchema = z.string().length(10);
    try {
      return phoneSchema.parse(phone_number);
    } catch (e) {
      throw new Error('Phone number must contain 10 digits');
    }
  }

  static validateRole(role) {
    try {
      return RoleSchema.parse(role);
    } catch (e) {
      throw new Error('Invalid role');
    }
  }
}
