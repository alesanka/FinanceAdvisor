import { Router } from 'express';
import { documentController } from '../controllers/documentController.js';
import { token } from '../controllers/tokenController.js';

const router = Router();

router.post('/', token.getAuthorization, documentController.createDocument); // protected
router.get(
  '/:application_id',
  token.getAuthorization,
  documentController.findDocumentsByApplicationId
); // protected

export default router;
