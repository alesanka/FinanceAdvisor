import { documentModel } from '../models/documentModel.js';
import { userModel } from '../models/userModel.js';

class DocumentController {
  createDocument = async (req, res) => {
    try {
      const docId = await documentModel.createDocument(req.body);

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
      const documents = await documentModel.findAllDocumentsByApplicationId(
        req.params.application_id
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
    try {
      await documentModel.deleteDocument(req.params.documentId);
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
