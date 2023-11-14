import { loanApplicationRepos } from '../repositories/loanApplicationRepos.js';
import { documentRepos } from '../repositories/documentRepos.js';
import { maxLoanAmountRepos } from '../repositories/maxLoanAmountRepos.js';
import { loanTypeRepos } from '../repositories/loanTypeRepos.js';
import { loanTypeMaxLoanAmountRepos } from '../repositories/loanType_MaxLoanAmountRepos.js';
import { ApplicationDTO } from '../dto/applicationDTO.js';
import { assertValueExists } from '../../utils/helper.js';

export const checkIfLoanAmountAvailable = (maxLoanAmount, desiredAmount) => {
  if (maxLoanAmount < desiredAmount) {
    throw new Error(
      `Can't create new loan application because the amount of money desired by the client exceeds the maximum available loan amount ${maxLoanAmount}`
    );
  }
  return true;
};

export class LoanApplicationModel {
  constructor(
    loanApplicationRepos,
    documentRepos,
    maxLoanAmountRepos,
    loanTypeRepos,
    loanTypeMaxLoanAmountRepos
  ) {
    (this.loanApplicationRepos = loanApplicationRepos),
      (this.documentRepos = documentRepos),
      (this.maxLoanAmountRepos = maxLoanAmountRepos),
      (this.loanTypeRepos = loanTypeRepos),
      (this.loanTypeMaxLoanAmountRepos = loanTypeMaxLoanAmountRepos);
  }

  async createLoanApplication(id, desiredLoanAmount, isApproved) {
    try {
      const applicationDTO = new ApplicationDTO(
        null,
        desiredLoanAmount,
        null,
        isApproved
      );

      const loanTypeMaxAmount =
        await this.loanTypeMaxLoanAmountRepos.getLoanTypeMaxLoanId(id);
      const maxLoanAmountId = loanTypeMaxAmount.max_loan_amount_id;

      const maxLoanAmountInfo =
        await this.maxLoanAmountRepos.getMaxLoanAmountByMaxAmountId(
          maxLoanAmountId
        );

      assertValueExists(
        maxLoanAmountInfo,
        'No max loan amount found with the given id.'
      );

      const maxLoanAmount = maxLoanAmountInfo.max_loan_amount;

      checkIfLoanAmountAvailable(
        maxLoanAmount,
        applicationDTO.desired_loan_amount
      );

      const loanTypeId = loanTypeMaxAmount.loan_type_id;
      const loanTypeDetails = await this.loanTypeRepos.findLoanById(loanTypeId);

      assertValueExists(
        loanTypeDetails,
        'No loan type found with the given id.'
      );

      const requiredDoc = loanTypeDetails.required_doc;

      const loanId = await this.loanApplicationRepos.createLoanApplication(
        id,
        applicationDTO
      );
      return { loanId, requiredDoc };
    } catch (err) {
      throw new Error(`Unable to create loan application: ${err}.`);
    }
  }

  async changeApprovement(applicationId) {
    try {
      const application = await this.loanApplicationRepos.findApplicationById(
        applicationId
      );

      assertValueExists(
        application,
        `Application with id ${applicationId} does not exist.`
      );

      const loanTypeMaxAmount =
        await this.loanTypeMaxLoanAmountRepos.getLoanTypeMaxLoanId(
          application.id
        );
      const loanTypeId = loanTypeMaxAmount.loan_type_id;
      const loanTypeDetails = await this.loanTypeRepos.findLoanById(loanTypeId);
      assertValueExists(
        loanTypeDetails,
        'No loan type found with the given id.'
      );
      const requiredDoc = loanTypeDetails.required_doc;

      const attachedDocs =
        await this.documentRepos.findAllDocumentsByApplicationId(applicationId);

      assertValueExists(
        attachedDocs,
        'No documents are atteched to application.'
      );

      const documentTypes = attachedDocs.map((doc) => doc.document_type);

      if (!documentTypes.includes(requiredDoc)) {
        throw new Error(
          'No documents with required type are atteched to application.'
        );
      }

      const updateApplication =
        await this.loanApplicationRepos.changeApprovement(applicationId);

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
      const application = await this.loanApplicationRepos.findApplicationById(
        applicationId
      );

      assertValueExists(
        application,
        `Application with id ${applicationId} does not exist.`
      );

      await this.loanApplicationRepos.deleteLoanApplication(applicationId);
      return;
    } catch (err) {
      throw new Error(`Unable to delete loan application: ${err}`);
    }
  }
  async getAllApplications() {
    try {
      const applications = await this.loanApplicationRepos.getAllApplications();
      const applicationDTOs = applications.map((application) => {
        const dto = new ApplicationDTO(
          application.application_id,
          application.desired_loan_amount,
          application.application_date,
          application.is_approved
        );

        return dto;
      });
      return applicationDTOs;
    } catch (err) {
      throw new Error(`Unable to get all loan applications: ${err}`);
    }
  }
}

export const loanApplicationModel = new LoanApplicationModel(
  loanApplicationRepos,
  documentRepos,
  maxLoanAmountRepos,
  loanTypeRepos,
  loanTypeMaxLoanAmountRepos
);
