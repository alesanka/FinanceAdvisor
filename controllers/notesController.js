import { notesModel } from '../services/notesModel.js';
import { userModel } from '../services/userModel.js';
import { maxLoanAmountModel } from '../services/maxLoanAmountModel.js';
import { repaymentScheduleModel } from '../services/repaymentScheduleModel.js';
import { loanApplicationModel } from '../services/loanApplicationModel.js';

class NotesController {
  createNotes = async (req, res) => {
    try {
      const { repayment_schedule_id, user_id } = req.body;

      if (!user_id) {
        return res.status(400).send('User id is required for checking role.');
      }

      const isWorker = await userModel.checkRoleByUserId(user_id);

      if (isWorker !== 'worker') {
        return res
          .status(403)
          .send('Only workers can modify loan applications.');
      }

      const repaymentSchedule =
        await repaymentScheduleModel.getRepaymentScheduleById(
          repayment_schedule_id
        );
      const applicationId = repaymentSchedule.application_id;
      const monthlyPayment = repaymentSchedule.monthly_payment;

      const maxLoanAmountData =
        await maxLoanAmountModel.getMaxLoanAmountByApplicationId(applicationId);
      const loanTerm = maxLoanAmountData.loan_term;

      const applicationData = await loanApplicationModel.findApplicationById(
        applicationId
      );

      if (!applicationData) {
        return res.status(404).json({ error: 'Application not found.' });
      }

      if (!applicationData.application_date) {
        return res.status(404).json({ error: 'Application date not found.' });
      }

      const applicationDateObj = new Date(applicationData.application_date);
      if (isNaN(applicationDateObj)) {
        throw new Error(
          `Invalid application date: ${applicationData.application_date}`
        );
      }

      const paymentNotes = [];

      for (let i = 0; i < loanTerm; i++) {
        const paymentDate = new Date(
          applicationDateObj.getFullYear(),
          applicationDateObj.getMonth() + i + 1,
          applicationDateObj.getDate()
        );
        if (isNaN(paymentDate)) {
          throw new Error(`Invalid payment date created for term ${i + 1}`);
        }
        paymentNotes.push({
          repayment_schedule_id,
          payment_date: paymentDate.toISOString().split('T')[0],
          payment_amount: monthlyPayment,
        });
      }

      for (const note of paymentNotes) {
        await notesModel.createNotes(
          note.repayment_schedule_id,
          note.payment_date,
          note.payment_amount
        );
      }

      res.status(201).send('Payment notes created successfully.');
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: error.message });
    }
  };

  getPaymentAmountByScheduleIdAndMonthYear = async (req, res) => {
    try {
      const { repayment_schedule_id, year, month } = req.query;

      if (!repayment_schedule_id || !year || !month) {
        return res
          .status(400)
          .send(
            'Missing required parameters: repayment_schedule_id, year, and month'
          );
      }

      const paymentAmounts =
        await notesModel.getPaymentAmountByScheduleIdAndMonthYear(
          repayment_schedule_id,
          year,
          month
        );

      if (!paymentAmounts) {
        return res.status(404).json({
          error: 'No payment found for the provided schedule ID and date.',
        });
      }

      res.status(200).json({ payment_amount: paymentAmounts });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: error.message });
    }
  };
}

export const notesController = new NotesController();
