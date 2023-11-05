import { documentModel } from '../services/documentModel.js';
import { userModel } from '../services/userModel.js';
import { loanApplicationRepos } from '../repositories/loanApplicationRepos.js';

class DocumentController {
  createDocument = async (req, res) => {
    try {
      const { user_id, application_id, document_name, document_type } =
        req.body;

      if (!user_id) {
        return res.status(400).send('User id is required for checking role.');
      }

      const isWorker = await userModel.checkUserRoleById(user_id);

      if (isWorker !== 'worker') {
        return res.status(403).send('Only workers can add documents.');
      }

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
  findDocumentsByApplicationId = async (req, res) => {
    try {
      const applicationId = req.params.application_id;
      const documents = await documentRepos.findDocumentsByApplicationId(
        applicationId
      );
      res.status(200).json(documents);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: err.message });
    }
  };
  deleteDocument = async (req, res) => {
    const documentId = req.params.documentId;
    try {
      await documentRepos.deleteDocument(documentId);
      res.status(204).end();
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: err.message });
    }
  };
}

export const documentController = new DocumentController();
