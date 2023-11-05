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

  async deleteLoanApplication(applicationId) {
    try {
      const application = await loanApplicationRepos.findApplicationById(
        applicationId
      );
      if (!application) {
        throw new Error(`Application with id ${applicationId} does not exist.`);
      }

      
      await loanApplicationRepos.deleteLoanApplication(applicationId);
      return;
    } catch (err) {
      throw new Error(`Unable to delete loan application: ${err}`);
    }
  }
}
export const loanApplicationModel = new LoanApplicationModel();
