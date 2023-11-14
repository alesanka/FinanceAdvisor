import { Router } from 'express';
import { documentController } from '../controllers/documentController.js';
import { token } from '../../utils/tokenController.js';
import checkUserRole from '../middlewere/checkRole.js';

const router = Router();

router.post(
  '/',
  token.getAuthorization,
  checkUserRole(['worker']),
  documentController.createDocument
); // protected
router.put(
  '/:documentId',
  token.getAuthorization,
  checkUserRole(['worker']),
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
