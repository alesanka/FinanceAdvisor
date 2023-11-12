import { documentController } from '../src/controllers/documentController.js';
import { documentModel } from '../src/models/documentModel.js';

jest.mock('../src/models/documentModel.js');

describe('DocumentController', () => {
  test('should create a document and send a response', async () => {
    const req = {
      body: {
        user_id: 1,
        application_id: 1,
        document_name: 'Client passport',
        document_type: 'passport',
      },
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

  it('should handle errors when creating a document', async () => {
    const req = {
      body: {
        document_name: 'Client passport',
        document_type: 'passport',
      },
    };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    const mockError = new Error('Failed to create document');
    documentModel.createDocument.mockRejectedValue(mockError);

    await documentController.createDocument(req, res);

    expect(documentModel.createDocument).toHaveBeenCalledWith(req.body);
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      message: 'Something went wrong while adding document.',
      error: mockError.message,
    });
  });

  test('should find all documents by application id and send a response', async () => {
    const req = {
      params: { application_id: 1 },
    };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    const mockDocuments = [
      {
        document_id: 1,
        document_name: 'Client passport',
        document_type: 'passport',
      },
    ];
    documentModel.findAllDocumentsByApplicationId.mockResolvedValue(
      mockDocuments
    );

    await documentController.findAllDocumentsByApplicationId(req, res);

    expect(documentModel.findAllDocumentsByApplicationId).toHaveBeenCalledWith(
      req.params.application_id
    );
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(mockDocuments);
  });

  test('should handle errors when finding documents', async () => {
    const req = {
      params: { application_id: '123' },
    };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    const mockError = new Error('Error finding documents');
    documentModel.findAllDocumentsByApplicationId.mockRejectedValue(mockError);

    await documentController.findAllDocumentsByApplicationId(req, res);

    expect(documentModel.findAllDocumentsByApplicationId).toHaveBeenCalledWith(
      req.params.application_id
    );
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      message:
        'Something went wrong while finding documents by application id.',
      error: mockError.message,
    });
  });

  test('should delete a document by id and send a response', async () => {
    const req = {
      params: { documentId: 1 },
    };
    const res = {
      status: jest.fn().mockReturnThis(),
      end: jest.fn(),
    };
    documentModel.deleteDocument.mockResolvedValue();

    await documentController.deleteDocument(req, res);

    expect(documentModel.deleteDocument).toHaveBeenCalledWith(
      req.params.documentId
    );
    expect(res.status).toHaveBeenCalledWith(204);
    expect(res.end).toHaveBeenCalled();
  });

  test('should handle errors when deleting a document', async () => {
    const req = {
      params: {},
    };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    const mockError = new Error('Error deleting document');
    documentModel.deleteDocument.mockRejectedValue(mockError);

    await documentController.deleteDocument(req, res);

    expect(documentModel.deleteDocument).toHaveBeenCalledWith(
      req.params.documentId
    );
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      message: 'Something went wrong while deleting document by id.',
      error: mockError.message,
    });
  });
});
