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
  async findDocumentsByApplicationId(applicationId) {
    try {
      const result = await pool.query(
        'SELECT * FROM documents WHERE application_id = $1;',
        [applicationId]
      );
      if (result.rows.length > 0) {
        return result.rows;
      }
    } catch (err) {
      console.error(`Unable to get documents by application_id: ${err}`);
      throw new Error(`Unable to get documents by application_id.`);
    }
    return null;
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
