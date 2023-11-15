import { checkUserRole } from '../checkRole.js';

class MockUserModel {
  async checkUserRoleById(userId) {
    if (userId === 1) {
      return 'admin';
    } else if (userId === 2) {
      return 'user';
    } else {
      throw new Error(`User with id ${userId} not found`);
    }
  }
}
const mockUserModel = new MockUserModel();


describe('checkUserRole middleware', () => {
  it('should allow access for valid user role', async () => {
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

    await checkUserRole(['admin'])(req, res, next);

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

    await checkUserRole(['admin'])(req, res, next);

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

    await checkUserRole(['admin'])(req, res, next);

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

    await checkUserRole(['admin'])(req, res, next);

    expect(next).not.toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.send).toHaveBeenCalledWith(
      'An error occurred while checking user role.'
    );
  });
});
