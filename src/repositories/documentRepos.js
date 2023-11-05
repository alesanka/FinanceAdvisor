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
  async findAllDocumentsByApplicationId(applicationId) {
    try {
      const result = await pool.query(
        'SELECT * FROM documents WHERE application_id = $1;',
        [applicationId]
      );
      if (result.rows.length > 0) {
        return result.rows;
      } else {
        return null;
      }
    } catch (err) {
      throw new Error(`${err}.`);
    }
  }
  async checkDocumentById(docId) {
    try {
      const result = await pool.query(
        'SELECT document_id FROM documents WHERE document_id = $1',
        [docId]
      );
      if (result.rows.length > 0) {
        return true;
      } else {
        return false;
      }
    } catch (err) {
      throw new Error(`${err}.`);
    }
  }

  async deleteDocument(documentId) {
    try {
      await pool.query('DELETE FROM documents WHERE document_id = $1', [
        documentId,
      ]);

      return;
    } catch (err) {
      throw new Error(`${err}`);
    }
  }
}
export const documentRepos = new DocumentRepos();
