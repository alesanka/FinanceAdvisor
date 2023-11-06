import { userModel } from '../services/userModel.js';
import { notesModel } from '../services/notesModel.js';

class NotesController {
  createNotes = async (req, res) => {
    try {
      const { repayment_schedule_id, user_id, repayment_date } = req.body;

      const noteId = await notesModel.createNotes(
        repayment_schedule_id,
        repayment_date
      );

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

export const notesController = new NotesController();
