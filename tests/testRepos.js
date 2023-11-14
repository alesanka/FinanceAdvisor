import { userRepos } from '../src/repositories/userRepos.js';
import { documentRepos } from '../src/repositories/documentRepos.js';
import { loanApplicationRepos } from '../src/repositories/loanApplicationRepos.js';
import { loanTypeRepos } from '../src/repositories/loanTypeRepos.js';
import { maxLoanAmountRepos } from '../src/repositories/maxLoanAmountRepos.js';
import { notesRepos } from '../src/repositories/notesRepos.js';
import { repaymentScheduleRepos } from '../src/repositories/repaymentScheduleRepos.js';
import { loanTypeMaxLoanAmountRepos } from '../src/repositories/loanType_MaxLoanAmountRepos.js';
import { pool } from '../db/postgress/dbPool.js';
import { jest } from '@jest/globals';

// jest.mock('../db/redis/client', () => ({
//   initializeRedis: jest.fn().mockResolvedValue({}),
// }));
// jest.unstable_mockModule('../db/redis/redisConfig.js', () => ({
//   db: jest.fn().mockResolvedValue({}),
// }));
const mockPool = () => {
  jest.unstable_mockModule('../db/postgress/dbPool.js', () => {
    return {
      pool: {
        query: jest.fn(),
      },
    };
  });
};
let mockUserRepos;
mockUserRepos.createUser = (a, b) => {
  jest.unstable_mockModule('../src/repositories/userRepos.js', () => {
    return { userRepos: { createUser: jest.fn(a, b).mockResolvedValue(1) } };
  });
};

describe('User repository methods', () => {
  test('should be defined', () => {
    expect(userRepos.findClientById).toBeDefined();
    expect(userRepos.findUserById).toBeDefined();
    expect(userRepos.getAllUsers).toBeDefined();
    expect(userRepos.createUser).toBeDefined();
    expect(userRepos.createClient).toBeDefined();
    expect(userRepos.findClientByUserId).toBeDefined();
    expect(userRepos.findUserByUsername).toBeDefined();
    expect(userRepos.filterByParameter).toBeDefined();
    expect(userRepos.updateData).toBeDefined();
    expect(userRepos.deleteUser).toBeDefined();
  });

  test('should correctly insert user and return user id', async () => {
    const userDto = {
      username: 'testuser',
      first_name: 'Test',
      last_name: 'User',
      email: 'test@example.com',
      phone_number: '1234567890',
      role: 'admin',
    };
    const password = 'testpassword';
    const mockUserId = 1;

    const userId = mockUserRepos.createUser(userDto, password);

    expect(mockPool.query).toHaveBeenCalledWith(
      'INSERT INTO users (username, password, first_name, last_name, email, phone_number, role) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING user_id',
      [
        userDto.username,
        password,
        userDto.first_name,
        userDto.last_name,
        userDto.email,
        userDto.phone_number,
        userDto.role,
      ]
    );
    expect(userId).toBe(mockUserId);
  });

  // test('should handle errors', async () => {
  //   pool.query.mockRejectedValue(new Error('Database error'));

  //   const userDto = {
  //     username: 'testuser',
  //     first_name: 'Test',
  //     last_name: 'User',
  //     email: 'test@example.com',
  //     phone_number: '1234567890',
  //     role: 'admin',
  //   };
  //   const password = 'testpassword';

  //   await expect(userRepos.createUser(userDto, password)).rejects.toThrow(
  //     'Database error'
  //   );
  // });
});

describe('Documents repository methods', () => {
  test('should be defined', () => {
    expect(documentRepos.checkDocumentById).toBeDefined();
    expect(documentRepos.createDocument).toBeDefined();
    expect(documentRepos.deleteDocument).toBeDefined();
    expect(documentRepos.findAllDocumentsByApplicationId).toBeDefined();
  });
});

describe('Loan Application repository methods', () => {
  test('should be defined', () => {
    expect(loanApplicationRepos.changeApprovement).toBeDefined();
    expect(loanApplicationRepos.checkApprovement).toBeDefined();
    expect(loanApplicationRepos.createLoanApplication).toBeDefined();
    expect(loanApplicationRepos.deleteLoanApplication).toBeDefined();
    expect(loanApplicationRepos.findApplicationById).toBeDefined();
  });
});

describe('Loan Type with Maximum Loan Amount repository methods', () => {
  test('should be defined', () => {
    expect(loanTypeMaxLoanAmountRepos.saveLoanTypeMaxLoan).toBeDefined();
    expect(loanTypeMaxLoanAmountRepos.getLoanTypeMaxLoanId).toBeDefined();
  });
});

describe('Loan Type repository methods', () => {
  test('should be defined', () => {
    expect(loanTypeRepos.createLoanType).toBeDefined();
    expect(loanTypeRepos.findLoanById).toBeDefined();
    expect(loanTypeRepos.findLoanByType).toBeDefined();
    expect(loanTypeRepos.findLoanByType).toBeDefined();
    expect(loanTypeRepos.getAllLoanTypes).toBeDefined();
  });
});

describe('Max Loan Amount repository methods', () => {
  test('should be defined', () => {
    expect(maxLoanAmountRepos.getMaxLoanAmountByMaxAmountId).toBeDefined();
    expect(maxLoanAmountRepos.getMaxLoanAmountLoanType).toBeDefined();
    expect(maxLoanAmountRepos.saveMaxLoan).toBeDefined();
  });
});

describe('Notes repository methods', () => {
  test('should be defined', () => {
    expect(notesRepos.createNotes).toBeDefined();
    expect(notesRepos.getPaymentAmountByScheduleIdAndMonthYear).toBeDefined();
  });
});

describe('Repayment Schedule repository methods', () => {
  test('should be defined', () => {
    expect(repaymentScheduleRepos.createRepaymentSchedule).toBeDefined();
    expect(
      repaymentScheduleRepos.getPaymentAmountByScheduleIdAndMonthYear
    ).toBeDefined();
    expect(repaymentScheduleRepos.getRepaymentScheduleById).toBeDefined();
  });
});