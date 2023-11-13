import { documentRepos } from '../repositories/documentRepos.js';
import { DocDTO } from '../dto/docDTO.js';

export class DocumentModel {
  constructor(documentRepos) {
    this.documentRepos = documentRepos;
  }

  async createDocument(applicationId, documentName, documentType) {
    try {
      const docDTO = new DocDTO(
        null,
        applicationId,
        documentName,
        documentType
      );

      const docId = await this.documentRepos.createDocument(docDTO);

      return docId;
    } catch (err) {
      throw new Error(`Unable to create document: ${err}.`);
    }
  }
  async findAllDocumentsByApplicationId(applicationId) {
    try {
      const docs = await this.documentRepos.findAllDocumentsByApplicationId(
        applicationId
      );
      if (!docs) {
        throw new Error('Invalid application id.');
      }

      const docDTOs = docs.map((doc) => {
        const dto = new DocDTO(
          doc.document_id,
          doc.application_id,
          doc.document_name,
          doc.document_type
        );
        return {
          document_id: dto.document_id,
          document_name: dto.document_name,
          document_type: dto.document_type,
        };
      });

      return docDTOs;
    } catch (err) {
      throw new Error(`Unable to get documents by application_id: ${err}`);
    }
  }
  async deleteDocument(documentId) {
    try {
      const isDocExists = await this.documentRepos.checkDocumentById(
        documentId
      );

      if (!isDocExists) {
        throw new Error(`No document found with document id ${documentId}`);
      }

      await this.documentRepos.deleteDocument(documentId);
      return;
    } catch (err) {
      throw new Error(`Unable to delete document ${documentId}: ${err}.`);
    }
  }
}
export const documentModel = new DocumentModel(documentRepos);
