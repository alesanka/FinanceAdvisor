// import { documentController } from '../path/to/DocumentController';
// import { documentModel } from '../path/to/models/documentModel';

// jest.mock('../path/to/models/documentModel');

// describe('DocumentController', () => {
//   describe('createDocument', () => {
//     it('should create a document and send a response', async () => {
//       // Настройка
//       const req = {
//         body: {/* данные документа */},
//       };
//       const res = {
//         status: jest.fn().mockReturnThis(),
//         send: jest.fn(),
//       };
//       documentModel.createDocument.mockResolvedValue('docId');

//       // Действие
//       await documentController.createDocument(req, res);

//       // Проверка
//       expect(documentModel.createDocument).toHaveBeenCalledWith(req.body);
//       expect(res.status).toHaveBeenCalledWith(201);
//       expect(res.send).toHaveBeenCalledWith('Document was added successfully. Document id - docId');
//     });

//     // Другие тесты для обработки ошибок и других сценариев...
//   });

//   // Тесты для других методов...
// });
