/* eslint-disable no-undef */
import { CheckUserRole } from '../checkRole.js';
import { jest } from '@jest/globals';

class MockUserModel {
  async checkUserRoleById(userId) {
    if (userId === 1) {
      return 'admin';
    } else if (userId === 2) {
      return 'worker';
    } else {
      throw new Error(`User with id ${userId} not found`);
    }
  }
}

const mockUserModel = new MockUserModel();
const checkAdmin = new CheckUserRole(mockUserModel, 'admin');
const checkWorker = new CheckUserRole(mockUserModel, 'worker');

describe('CheckUserRole class', () => {
  test('should allow access for valid user role (admin)', async () => {
    const req = {
      body: {
        user_id: 1,
      },
    };

    const res = {
      status: (statusCode) => {
        res.statusCode = statusCode;
        return res;
      },
      send: (message) => {
        res.body = message;
        return res;
      },
    };

    const nextMock = async () => {
      return;
    };

    const result = await checkAdmin.validateUserRole(req, res, nextMock);
    expect(result).toBeUndefined();
  });

  it('should allow access for valid user role (worker)', async () => {
    const req = {
      body: {
        user_id: 2,
      },
    };

    const res = {
      status: (statusCode) => {
        res.statusCode = statusCode;
        return res;
      },
      send: (message) => {
        res.body = message;
        return res;
      },
    };
    const nextMock = async () => {
      return;
    };
    const result = await checkWorker.validateUserRole(req, res, nextMock);

    expect(result).toBeUndefined();
  });

  it('should deny access for invalid user role', async () => {
    const req = {
      body: {
        user_id: 2,
      },
    };

    const res = {
      status: (statusCode) => {
        res.statusCode = statusCode;
        return res;
      },
      send: (message) => {
        res.body = message;
        return res;
      },
    };

    const next = jest.fn();
    await checkAdmin.validateUserRole(req, res, next);

    expect(res.statusCode).toBe(403);
    expect(res.body).toContain('Access denied. Invalid user role.');
  });

  test('should handle missing user_id', async () => {
    const req = {
      body: {},
    };

    const res = {
      status: (statusCode) => {
        res.statusCode = statusCode;
        return res;
      },
      send: (message) => {
        res.body = message;
        return res;
      },
    };

    const next = jest.fn();
    await checkAdmin.validateUserRole(req, res, next);
    expect(next).not.toHaveBeenCalled();
  });

  test('should handle invalid user_id', async () => {
    const req = {
      body: {
        user_id: 3,
      },
    };

    const res = {
      status: (statusCode) => {
        res.statusCode = statusCode;
        return res;
      },
      send: (message) => {
        res.body = message;
        return res;
      },
    };

    const next = jest.fn();
    await checkAdmin.validateUserRole(req, res, next);

    expect(next).not.toHaveBeenCalled();
  });
});
