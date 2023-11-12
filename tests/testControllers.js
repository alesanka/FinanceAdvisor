import { documentController } from '../src/controllers/documentController.js';
import { documentModel } from '../src/models/documentModel.js';

jest.mock('../path/to/models/documentModel');

describe('DocumentController', () => {
  describe('createDocument', () => {
    test('should create a document and send a response', async () => {
      const req = {
        body: {},
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        send: jest.fn(),
      };
      documentModel.createDocument.mockResolvedValue('docId');

      await documentController.createDocument(req, res);

      expect(documentModel.createDocument).toHaveBeenCalledWith(req.body);
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.send).toHaveBeenCalledWith(
        'Document was added successfully. Document id - docId'
      );
    });
  });
});
