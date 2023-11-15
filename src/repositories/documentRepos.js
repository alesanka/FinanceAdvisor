import { pool } from '../../db/postgress/dbPool.js';
import { DocDTO } from '../dto/docDTO.js';

export class DocumentRepos {
  constructor(connection) {
    this.connection = connection;
  }
  async createDocument(docDto) {
    try {
      const result = await this.connection.query(
        'INSERT INTO Documents (application_id, document_name, document_type) VALUES ($1, $2, $3) RETURNING document_id',
        [docDto.application_id, docDto.document_name, docDto.document_type]
      );

      return result.rows[0].document_id;
    } catch (err) {
      throw new Error(`${err}`);
    }
  }
  async findAllDocumentsByApplicationId(applicationId) {
    try {
      const result = await this.connection.query(
        'SELECT * FROM documents WHERE application_id = $1;',
        [applicationId]
      );
      if (result.rows.length > 0) {
        const documentsDTOs = result.rows.map((doc) => {
          return new DocDTO(
            doc.document_id,
            doc.application_id,
            doc.document_name,
            doc.document_type
          );
        });
        return documentsDTOs;
      } else {
        return null;
      }
    } catch (err) {
      throw new Error(`${err}.`);
    }
  }
  async changeDocumentNameById(docName, docId) {
    try {
      await this.connection.query(
        `UPDATE documents SET document_name = $1 WHERE document_id = $2`,
        [docName, docId]
      );
      return;
    } catch (err) {
      throw new Error(`${err}`);
    }
  }
  async checkDocumentById(docId) {
    try {
      const result = await this.connection.query(
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
      await this.connection.query(
        'DELETE FROM documents WHERE document_id = $1',
        [documentId]
      );

      return;
    } catch (err) {
      throw new Error(`${err}`);
    }
  }
}

export const documentRepos = new DocumentRepos(pool);
