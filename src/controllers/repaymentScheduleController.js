import { userModel } from '../models/userModel.js';
import { repaymentScheduleModel } from '../models/repaymentScheduleModel.js';

class RepaymentScheduleController {
  createRepaymentSchedule = async (req, res) => {
    try {

      const repaymentScheduleIdandDate =
        await repaymentScheduleModel.createRepaymentSchedule(req.body);

      res
        .status(201)
        .send(
          `Repayment schedule was created successfully. Id - ${repaymentScheduleIdandDate.repaymentScheduleId}. First date for payment - ${repaymentScheduleIdandDate.firstPaymentDate}`
        );
    } catch (err) {
      console.error(err);
      res.status(500).json({
        message: 'Something went wrong during repayment schedule creation.',
        error: err.message,
      });
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

      const paymentAmount = await repaymentScheduleModel.getByIdYearMonth(
        repayment_schedule_id,
        year,
        month
      );

      res.status(200).send(`Month payment - ${paymentAmount}`);
    } catch (err) {
      console.error(err);
      res.status(500).json({
        message: 'Something went wrong during getting month payment.',
        error: err.message,
      });
    }
  };
}

export const repaymentScheduleController = new RepaymentScheduleController();
