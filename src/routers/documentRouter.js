import { Router } from 'express';
import { documentController } from '../controllers/documentController.js';
import { token } from '../../utils/tokenController.js';
import { roleWorker } from '../middlewere/checkRole.js';

const router = Router();

router.post(
  '/',
  token.getAuthorization,
  roleWorker.validateUserRole,
  documentController.createDocument
); // protected
router.put(
  '/:documentId',
  token.getAuthorization,
  roleWorker.validateUserRole,
  documentController.changeDocumentNameById
); // protected
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
