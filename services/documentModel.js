import { pool } from '../db/dbPool.js';

class DocumentModel {
  async createDocument(applicationId, documentName, documentType) {
    try {
      const result = await pool.query(
        'INSERT INTO Documents (application_id, document_name, document_type) VALUES ($1, $2, $3) RETURNING document_id',
        [applicationId, documentName, documentType]
      );

      return result.rows[0].document_id;
    } catch (err) {
      console.error(`Unable to create document: ${err}`);
      throw new Error(`Unable to create document.`);
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
}
export const documentModel = new DocumentModel();
