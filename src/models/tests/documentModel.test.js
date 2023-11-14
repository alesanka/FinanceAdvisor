import { DocumentModel } from '../documentModel.js';
import { DocDTO } from '../../dto/docDTO.js';

class DocumentReposMock {
  async createDocument() {
    return { doc_id: 1 };
  }
  async findAllDocumentsByApplicationId(id) {
    if (id) {
      const dto = new DocDTO(1, 1, 'passport', 'passport');
      let arrDTO = [];
      arrDTO.push(dto);
      return arrDTO;
    } else {
      return false;
    }
  }
}

const documentReposMock = new DocumentReposMock();

const documentModel = new DocumentModel(documentReposMock);

describe('Document model', () => {
  test('should get new doc id while creating document', async () => {
    const applicationId = 1;
    const documentName = 'Agreement';
    const documentType = 'student_verification';

    expect(
      await documentModel.createDocument(
        applicationId,
        documentName,
        documentType
      )
    ).toEqual({ doc_id: 1 });
  });
  test('should throw an error in case of wrong arguments', async () => {
    const applicationId = 1;
    const documentName = 'Agreement';
    const documentType = 'verification';

    await expect(
      documentModel.createDocument(applicationId, documentName, documentType)
    ).rejects.toThrow('Invalid document type');
  });

  test('should find documents by id', async () => {
    const appId = 1;
    const wrongAppId = null;

    expect(
      await documentModel.findAllDocumentsByApplicationId(appId)
    ).toBeTruthy();

    await expect(
      documentModel.findAllDocumentsByApplicationId(wrongAppId)
    ).rejects.toThrow('Invalid application id.');
  });
  test('should handle different document types correctly', async () => {
    const applicationId = 1;
    const documentTypes = [
      'passport',
      'student_verification',
      'business_plan',
      'purchase_agreement',
    ];

    for (const type of documentTypes) {
      await expect(
        documentModel.createDocument(applicationId, 'DocName', type)
      ).resolves.toBeDefined();
    }
  });
});
