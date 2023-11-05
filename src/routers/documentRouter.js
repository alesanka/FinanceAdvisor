import { Router } from 'express';
import { documentController } from '../controllers/documentController.js';
import { token } from '../../utils/tokenController.js';

const router = Router();

router.post('/', token.getAuthorization, documentController.createDocument); // protected
router.get(
  '/:application_id',
  token.getAuthorization,
  documentController.findAllDocumentsByApplicationId
); // protected
router.delete(
  '/:documentId',
  token.getAuthorization,
  documentController.deleteDocument
); // protected

export default router;
