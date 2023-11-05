import { pool } from '../../db/postgress/dbPool.js';
import { documentRepos } from '../repositories/documentRepos.js';
import { DocDTO } from '../dto/docDTO.js';

class DocumentModel {
  async createDocument(applicationId, documentName, documentType) {
    try {
      const docDTO = new DocDTO(
        null,
        applicationId,
        documentName,
        documentType
      );

      const docId = await documentRepos.createDocument(
        docDTO.application_id,
        docDTO.document_name,
        docDTO.document_type
      );

      return docId;
    } catch (err) {
      throw new Error(`Unable to create document: ${err}.`);
    }
  }
  async findAllDocumentsByApplicationId(applicationId) {
    try {
      const docs = await documentRepos.findAllDocumentsByApplicationId(
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
      const result = await pool.query(
        'SELECT document_id FROM documents WHERE document_id = $1',
        [documentId]
      );

      if (result.rows.length === 0) {
        throw new Error(`No document found with documentId ${documentId}`);
      }

      await pool.query('DELETE FROM documents WHERE document_id = $1', [
        documentId,
      ]);

      return;
    } catch (err) {
      console.error(`Unable to delete document ${documentId}: ${err}`);
      throw new Error(`Unable to delete document ${documentId}.`);
    }
  }
}
export const documentModel = new DocumentModel();
