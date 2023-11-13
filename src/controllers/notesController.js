import { notesModel } from '../models/notesModel.js';

export class NotesController {
  constructor(notesModel) {
    this.notesModel = notesModel;
  }
  createNotes = async (req, res) => {
    try {
      const noteId = await this.notesModel.createNotes(req.body);

      res.status(201).send(`Payment note created successfully. Id - ${noteId}`);
    } catch (err) {
      console.error(err);
      res.status(500).json({
        message: 'Something went wrong during payment note creation.',
        error: err.message,
      });
    }
  };
}

export const notesController = new NotesController(notesModel);
