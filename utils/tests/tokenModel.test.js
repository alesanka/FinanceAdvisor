import { validateClient, getClient } from '../tokenModel.js';

describe('validateClient', () => {
  test('should return null for invalid client', () => {
    const clientData = null;
    const clientSecret = 'someSecret';
    const result = validateClient(clientData, clientSecret);
    expect(result).toBeNull();
  });

  test('should return null for incorrect client secret', () => {
    const clientData = {
      clientId: 'testClient',
      clientSecret: 'correctSecret',
    };
    const clientSecret = 'incorrectSecret';
    const result = validateClient(clientData, clientSecret);
    expect(result).toBeNull();
  });

  test('should return a valid client object for correct data', () => {
    const clientData = {
      clientId: 'testClient',
      clientSecret: 'correctSecret',
      grants: JSON.stringify(['admin']),
    };
    const clientSecret = 'correctSecret';
    const expectedClient = {
      clientId: 'testClient',
      clientSecret: 'correctSecret',
      grants: ['admin'],
    };
    const result = validateClient(clientData, clientSecret);
    expect(result).toEqual(expectedClient);
  });
});
