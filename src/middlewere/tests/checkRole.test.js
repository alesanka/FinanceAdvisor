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
  it('should allow access for valid user role (admin)', async () => {
    const req = {
      body: {
        user_id: 1,
      },
    };

    const res = {
      status: jest.fn().mockReturnThis(),
      send: jest.fn(),
    };

    const next = jest.fn();

    await checkAdmin.validateUserRole(req, res, next);

    expect(next).toHaveBeenCalled();
    expect(res.status).not.toHaveBeenCalled();
    expect(res.send).not.toHaveBeenCalled();
  });

  it('should allow access for valid user role (worker)', async () => {
    const req = {
      body: {
        user_id: 2,
      },
    };

    const res = {
      status: jest.fn().mockReturnThis(),
      send: jest.fn(),
    };

    const next = jest.fn();

    checkWorker.validateUserRole(req, res, next);

    expect(next).toHaveBeenCalled();
    expect(res.status).not.toHaveBeenCalled();
    expect(res.send).not.toHaveBeenCalled();
  });

  it('should deny access for invalid user role', async () => {
    const req = {
      body: {
        user_id: 2,
      },
    };

    const res = {
      status: jest.fn().mockReturnThis(),
      send: jest.fn(),
    };

    const next = jest.fn();

    checkAdmin.validateUserRole(req, res, next);

    expect(next).not.toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(403);
    expect(res.send).toHaveBeenCalledWith('Access denied. Invalid user role.');
  });

  it('should handle missing user_id', async () => {
    const req = {
      body: {},
    };

    const res = {
      status: jest.fn().mockReturnThis(),
      send: jest.fn(),
    };

    const next = jest.fn();

    checkAdmin.validateUserRole(req, res, next);

    expect(next).not.toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.send).toHaveBeenCalledWith(
      'An error occurred while checking user role.'
    );
  });

  it('should handle invalid user_id', async () => {
    const req = {
      body: {
        user_id: 3,
      },
    };

    const res = {
      status: jest.fn().mockReturnThis(),
      send: jest.fn(),
    };

    const next = jest.fn();

    checkAdmin.validateUserRole(req, res, next);

    expect(next).not.toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.send).toHaveBeenCalledWith(
      'An error occurred while checking user role.'
    );
  });
});
