/* eslint-disable no-undef */
import { assertValueExists } from '../helper.js';

describe('assertValueExists', () => {
  test('should not throw an error for valid values', () => {
    expect(() =>
      assertValueExists('some value', 'Value is required')
    ).not.toThrow();
    expect(() => assertValueExists(1, 'Value is required')).not.toThrow();
    expect(() => assertValueExists(true, 'Value is required')).not.toThrow();
  });

  test('should throw an error for invalid values', () => {
    expect(() => assertValueExists(undefined, 'Value is required')).toThrow(
      'Value is required'
    );
    expect(() => assertValueExists(null, 'Value is required')).toThrow(
      'Value is required'
    );
    expect(() => assertValueExists('', 'Value is required')).toThrow(
      'Value is required'
    );
    expect(() => assertValueExists(0, 'Value is required')).toThrow(
      'Value is required'
    );
    expect(() => assertValueExists(false, 'Value is required')).toThrow(
      'Value is required'
    );
  });
});
