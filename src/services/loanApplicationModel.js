import { pool } from '../../db/postgress/dbPool.js';
import { loanApplicationRepos } from '../repositories/loanApplicationRepos.js';
import { documentRepos } from '../repositories/documentRepos.js';
import { maxLoanAmountRepos } from '../repositories/maxLoanAmountRepos.js';
import { loanTypeRepos } from '../repositories/loanTypeRepos.js';
import { loanTypeMaxLoanAmountRepos } from '../repositories/loanType_MaxLoanAmountRepos.js';
import { ApplicationDTO } from '../dto/applicationDTO.js';

class LoanApplicationModel {
  async createLoanApplication(id, desiredLoanAmount, isApproved) {
    try {
      const applicationDTO = new ApplicationDTO(
        null,
        desiredLoanAmount,
        null,
        isApproved
      );

      const loanTypeMaxAmount =
        await loanTypeMaxLoanAmountRepos.getLoanTypeMaxLoanId(id);
      const maxLoanAmountId = loanTypeMaxAmount.max_loan_amount_id;

      const maxLoanAmountInfo =
        await maxLoanAmountRepos.getMaxLoanAmountByMaxAmountId(maxLoanAmountId);
      if (!maxLoanAmountInfo) {
        throw new Error('No max loan amount found with the given id.');
      }
      const maxLoanAmount = maxLoanAmountInfo.max_loan_amount;

      if (maxLoanAmount < applicationDTO.desired_loan_amount) {
        throw new Error(
          `Can't create new loan application because the amount of money desired by the client exceeds the maximum available loan amount ${maxLoanAmount}`
        );
      }

      const loanTypeId = loanTypeMaxAmount.loan_type_id;
      const loanTypeDetails = await loanTypeRepos.findLoanById(loanTypeId);
      if (!loanTypeDetails) {
        throw new Error('No loan type found with the given id.');
      }

      const requiredDoc = loanTypeDetails.required_doc;

      const loanId = await loanApplicationRepos.createLoanApplication(
        id,
        applicationDTO.desired_loan_amount,
        applicationDTO.is_approved
      );
      return { loanId, requiredDoc };
    } catch (err) {
      throw new Error(`Unable to create loan application: ${err}.`);
    }
  }

  async changeApprovement(applicationId) {
    try {
      const application = await loanApplicationRepos.findApplicationById(
        applicationId
      );
      if (!application) {
        throw new Error(`Application with id ${applicationId} does not exist.`);
      }

      const loanTypeMaxAmount =
        await loanTypeMaxLoanAmountRepos.getLoanTypeMaxLoanId(application.id);
      const loanTypeId = loanTypeMaxAmount.loan_type_id;
      const loanTypeDetails = await loanTypeRepos.findLoanById(loanTypeId);
      if (!loanTypeDetails) {
        throw new Error('No loan type found with the given id.');
      }
      const requiredDoc = loanTypeDetails.required_doc;

      const attachedDocs = await documentRepos.findAllDocumentsByApplicationId(
        applicationId
      );
      if (!attachedDocs) {
        throw new Error('No documents are atteched to application.');
      }

      const documentTypes = attachedDocs.map((doc) => doc.document_type);

      if (!documentTypes.includes(requiredDoc)) {
        throw new Error(
          'No documents with required type are atteched to application.'
        );
      }

      const updateApplication = await loanApplicationRepos.changeApprovement(
        applicationId
      );

      if (updateApplication) {
        return;
      } else {
        throw new Error(`Something went wrong.`);
      }
    } catch (err) {
      throw new Error(`Unable to change approvement status: ${err}`);
    }
  }

  async findApplicationById(applicationId) {
    try {
      const result = await pool.query(
        'SELECT * FROM loanapplications WHERE application_id = $1;',
        [applicationId]
      );
      if (result.rows.length > 0) {
        return result.rows[0];
      }
    } catch (err) {
      console.error(`Unable to get application by id: ${err}`);
      throw new Error(`Unable to get application by id.`);
    }
    return null;
  }

  async checkApprovement(applicationId) {
    try {
      const result = await pool.query(
        'SELECT is_approved FROM loanapplications WHERE application_id = $1;',
        [applicationId]
      );

      if (result.rows.length > 0) {
        return result.rows[0].is_approved;
      } else {
        throw new Error(`Application with ID ${applicationId} does not exist.`);
      }
    } catch (err) {
      console.error(`Unable to check approvement status: ${err}`);
      throw new Error(`Unable to check approvement status.`);
    }
  }
}
export const loanApplicationModel = new LoanApplicationModel();
