/* eslint-disable no-undef */
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

const res = {
  status: (statusCode) => {
    res.statusCode = statusCode;
    return res;
  },
  send: (message) => {
    res.body = message;
    return res;
  },
  json: (data) => {
    res.body = data;
    return res;
  },
  end: () => {
    return res;
  },
};

const mockLoanTypeModel = {
  createLoanType: async () => {
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
  updateLoanTypeData: async () => {
    return true;
  },
  deleteLoanType: async (i) => {
    return true;
  },
};

const loanTypeController = new LoanTypeController(mockLoanTypeModel);

describe('LoanTypeController', () => {
  test('should create a new loan type and send a success response', async () => {
    await loanTypeController.createLoanType(reqMock1, res);

    expect(res.statusCode).toBe(201);
    expect(res.body).toContain('Loan type was created successfully.');
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
    await loanTypeControllerWithError.createLoanType(reqMock1, res);

    expect(res.statusCode).toBe(500);
    expect(res.body).toEqual({
      message: 'Something went wrong while creating new type loan.',
      error: 'Some error',
    });
  });

  test('should get specific loan type and send a success response', async () => {
    await loanTypeController.getSpecificLoanType(reqMock2, res);

    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual({
      loanType: 'personal_loan',
      interestRate: 0.05,
      loanTerm: 5,
      requiredDoc: 'passport',
    });
  });

  test('should handle errors and send an error response', async () => {
    const mockLoanTypeModelWithError = {
      findLoanByType: async () => {
        throw new Error('Some error');
      },
    };
    const loanTypeControllerWithError = new LoanTypeController(
      mockLoanTypeModelWithError
    );
    await loanTypeControllerWithError.getSpecificLoanType(reqMock2, res);

    expect(res.statusCode).toBe(500);
    expect(res.body).toEqual({
      message: 'Something went wrong while getting loan type.',
      error: 'Some error',
    });
  });

  test('should handle missing loan_type parameter and send a bad request response', async () => {
    const reqMissingLoanType = {
      params: {},
    };

    await loanTypeController.getSpecificLoanType(reqMissingLoanType, res);
    expect(res.statusCode).toBe(500);
  });

  test('should update loan type data and send a success response', async () => {
    const reqMock3 = {
      params: {
        loan_type_id: 1,
      },
      body: {
        loan_type: 'new_loan_type',
        interest_rate: 0.1,
        loan_term: 10,
        required_doc: 'new_doc',
      },
    };

    await loanTypeController.updateLoanTypeData(reqMock3, res);

    expect(res.statusCode).toBe(200);
    expect(res.body).toContain(
      "Loan type's data with id - 1 was updated successfully."
    );
  });

  it('should handle errors while updating loan type data and send an error response', async () => {
    const reqMock4 = {
      params: {
        loan_type_id: 1,
      },
      body: {
        loan_type: 'new_loan_type',
        interest_rate: 0.1,
        loan_term: 10,
        required_doc: 'new_doc',
      },
    };
    const mockLoanTypeModelWithError = {
      updateLoanTypeData: async () => {
        throw new Error('Some error');
      },
    };
    const loanTypeControllerWithError = new LoanTypeController(
      mockLoanTypeModelWithError
    );
    await loanTypeControllerWithError.updateLoanTypeData(reqMock4, res);

    expect(res.statusCode).toBe(500);
    expect(res.body).toEqual({
      message: 'Something went wrong while updating loan type.',
      error: 'Some error',
    });
  });
});
