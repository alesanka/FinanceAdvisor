import { LoanTypeController } from '../loanTypeController.js';

const reqMock1 = {
  body: {
    loan_type: 'personal_loan',
    interest_rate: 0.05,
    loan_term: 5,
    required_doc: 'passport',
  },
};
const reqMock2 = {
  params: {
    loan_type: 'personal_loan',
  },
};

const resMock1 = {
  status: (statusCode) => {
    resMock1.statusCode = statusCode;
    return resMock1;
  },
  send: (message) => {
    resMock1.body = message;
    return resMock1;
  },
  json: (data) => {
    resMock1.body = data;
    return resMock1;
  },
};
const resMock2 = {
  status: (statusCode) => {
    resMock2.statusCode = statusCode;
    return resMock2;
  },
  json: (data) => {
    resMock2.body = data;
    return resMock2;
  },
};

const mockLoanTypeModel = {
  createLoanType: async (loanType, interestRate, loanTerm, requiredDoc) => {
    return 1;
  },
  findLoanByType: async (loanType) => {
    return {
      loanType,
      interestRate: 0.05,
      loanTerm: 5,
      requiredDoc: 'passport',
    };
  },
};

const loanTypeController = new LoanTypeController(mockLoanTypeModel);

describe('LoanTypeController', () => {
  test('should create a new loan type and send a success response', async () => {
    await loanTypeController.createLoanType(reqMock1, resMock1);

    expect(resMock1.statusCode).toBe(201);

    expect(resMock1.body).toBe(
      'Loan type was created successfully. Loan type id - 1'
    );
  });

  test('should handle errors and send an error response', async () => {
    const mockLoanTypeModelWithError = {
      createLoanType: async () => {
        throw new Error('Some error');
      },
    };

    const loanTypeControllerWithError = new LoanTypeController(
      mockLoanTypeModelWithError
    );

    await loanTypeControllerWithError.createLoanType(reqMock1, resMock1);

    expect(resMock1.statusCode).toBe(500);

    expect(resMock1.body).toEqual({
      message: 'Something went wrong while creating new type loan.',
      error: 'Some error',
    });
  });

  test('should get specific loan type and send a success response', async () => {
    await loanTypeController.getSpecificLoanType(reqMock2, resMock2);

    expect(resMock2.statusCode).toBe(200);

    expect(resMock2.body).toEqual({
      loanType: 'personal_loan',
      interestRate: 0.05,
      loanTerm: 5,
      requiredDoc: 'passport',
    });
  });

  it('should handle errors and send an error response', async () => {
    const mockLoanTypeModelWithError = {
      findLoanByType: async () => {
        throw new Error('Some error');
      },
    };

    const loanTypeControllerWithError = new LoanTypeController(
      mockLoanTypeModelWithError
    );

    await loanTypeControllerWithError.getSpecificLoanType(reqMock2, resMock2);

    expect(resMock2.statusCode).toBe(500);

    expect(resMock2.body).toEqual({
      message: 'Something went wrong while getting loan type.',
      error: 'Some error',
    });
  });

  it('should handle missing loan_type parameter and send a bad request response', async () => {
    const reqMissingLoanType = {
      params: {},
    };

    await loanTypeController.getSpecificLoanType(reqMissingLoanType, resMock2);

    expect(resMock2.statusCode).toBe(500);
  });
});
