import { documentModel } from '../services/documentModel.js';
import { userModel } from '../services/userModel.js';

class DocumentController {
  createDocument = async (req, res) => {
    try {
      const { user_id, application_id, document_name, document_type } =
        req.body;

      const docId = await documentModel.createDocument(
        application_id,
        document_name,
        document_type
      );

      res
        .status(201)
        .send(`Document was added successfully. Document id - ${docId}`);
    } catch (err) {
      console.error(err);
      res.status(500).json({
        message: `Something went wrong while adding document.`,
        error: err.message,
      });
    }
  };
  findAllDocumentsByApplicationId = async (req, res) => {
    try {
      const applicationId = req.params.application_id;
      const documents = await documentModel.findAllDocumentsByApplicationId(
        applicationId
      );
      res.status(200).json(documents);
    } catch (err) {
      console.error(err);
      res.status(500).json({
        message: `Something went wrong while finding documents by application id.`,
        error: err.message,
      });
    }
  };
  deleteDocument = async (req, res) => {
    const documentId = req.params.documentId;
    try {
      await documentModel.deleteDocument(documentId);
      res.status(204).end();
    } catch (err) {
      console.error(err);
      res.status(500).json({
        message: `Something went wrong while deleting document by id.`,
        error: err.message,
      });
    }
  };
}

export const documentController = new DocumentController();
