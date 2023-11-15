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
  getAllNotesForRepaymentSchedule = async (req, res) => {
    try {
      const notes = await this.notesModel.getAllNotesForRepaymentSchedule(
        req.params.repayment_schedule_id
      );

      res.status(200).json(notes);
    } catch (err) {
      console.error(err);
      res.status(500).json({
        message: 'Something went wrong while getting notes.',
        error: err.message,
      });
    }
  };

  updatePaymentStatus = async (req, res) => {
    try {
      await this.notesModel.updatePaymentStatus(req.params.note_id);

      res
        .status(200)
        .send(
          `Notes payment status with id - ${req.params.note_id} was updated successfully.`
        );
    } catch (err) {
      console.error(err);
      res.status(500).json({
        message: 'Something went wrong while updating note status.',
        error: err.message,
      });
    }
  };
  deleteNote = async (req, res) => {
    try {
      await this.notesModel.deleteNote(req.params.note_id);
      res.status(204).end();
    } catch (err) {
      console.error(err);
      res.status(500).json({
        message: `Something went wrong while deleting payment note.`,
        error: err.message,
      });
    }
  };
}

export const notesController = new NotesController(notesModel);
