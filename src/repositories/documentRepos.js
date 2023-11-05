import { pool } from '../../db/postgress/dbPool.js';

class DocumentRepos {
  async createDocument(applicationId, documentName, documentType) {
    try {
      const result = await pool.query(
        'INSERT INTO Documents (application_id, document_name, document_type) VALUES ($1, $2, $3) RETURNING document_id',
        [applicationId, documentName, documentType]
      );

      return result.rows[0].document_id;
    } catch (err) {
      throw new Error(`${err}`);
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
export const documentRepos = new DocumentRepos();
