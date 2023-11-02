import { documentModel } from '../services/documentModel.js';
import { userModel } from '../services/userModel.js';
import { loanApplicationModel } from '../services/loanApplicationModel.js';

class DocumentController {
  createDocument = async (req, res) => {
    try {
      const userId = req.body.user_id;
      if (!userId) {
        return res.status(400).send('User id is required for checking role.');
      }

      const isWorker = await userModel.checkRoleByUserId(userId);

      if (isWorker !== 'worker') {
        return res.status(403).send('Only workers can add documents.');
      }

      const { application_id, document_name, document_type } = req.body;

      const isApplication = await loanApplicationModel.findApplicationById(
        application_id
      );
      if (!isApplication) {
        return res.status(400).send('Invalid application id.');
      }

      const validDocs = [
        'passport',
        'student_verification',
        'business_plan',
        'purchase_agreement',
      ];
      if (!validDocs.includes(document_type)) {
        return res
          .status(400)
          .send(
            'Invalid required document. Accepted values are: passport, student_verification, business_plan, purchase_agreement'
          );
      }

      await documentModel.createDocument(
        application_id,
        document_name,
        document_type
      );
      res.status(201).send('Document was added successfully');
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: err.message });
    }
  };
  findDocumentsByApplicationId = async (req, res) => {
    try {
      const applicationId = req.params.application_id;
      const documents = await documentModel.findDocumentsByApplicationId(
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
      await documentModel.deleteDocument(documentId);
      res.status(204).end();
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: err.message });
    }
  };
}

export const documentController = new DocumentController();
