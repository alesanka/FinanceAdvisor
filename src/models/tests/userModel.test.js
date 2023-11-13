import { passwordCheck } from '../userModel.js';
import { passwordHash } from '../userModel.js';
import { passwordValidation } from '../userModel.js';
import { emailCheck } from '../userModel.js';
import { phoneCheck } from '../userModel.js';
import bcrypt from 'bcrypt';
import * as dotenv from 'dotenv';

dotenv.config();
const SALTY = parseInt(process.env.SALT);

describe('User model', () => {
  test('should check password length', () => {
    const passwordRight = 'jekkiChan19++';
    const passwordWrong = 'jekki';

    expect(passwordCheck(passwordRight)).toBeTruthy();
    expect(passwordCheck(passwordWrong)).not.toBeTruthy();

    expect(passwordCheck(passwordRight)).toStrictEqual(true);
    expect(passwordCheck(passwordWrong)).toStrictEqual(false);
  });

  test('should hash password', async () => {
    const passwordRaw = '123456789';
    const hashedPassword = await passwordHash(passwordRaw);
    expect(passwordHash(passwordRaw)).toBeTruthy();
    expect(hashedPassword).not.toBe(passwordRaw);
  });

  test('should return true for matching passwords', async () => {
    const plainPassword = 'TestPassword123';
    const hashedPassword = await bcrypt.hash(plainPassword, SALTY);

    const isValid = await passwordValidation(plainPassword, hashedPassword);
    expect(isValid).toBeTruthy();
  });

  test('should return true for valid email addresses', () => {
    expect(emailCheck('test@example.com')).toBeTruthy();
  });

  test('should return false for invalid email addresses', () => {
    expect(emailCheck('test@example')).toBeFalsy();
    expect(emailCheck('justastring')).toBeFalsy();
    expect(emailCheck('user@.com')).toBeFalsy();
  });

  test('should return true for valid phone numbers', () => {
    expect(phoneCheck('1234567890')).toBeTruthy();
  });

  test('should return false for invalid phone numbers', () => {
    expect(phoneCheck('12345')).toBeFalsy();
    expect(phoneCheck('12345678901')).toBeFalsy();
    expect(phoneCheck('abcdefghij')).toBeFalsy();
  });
});
