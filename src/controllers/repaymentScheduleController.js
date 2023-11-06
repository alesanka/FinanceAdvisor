import { userModel } from '../services/userModel.js';
import { repaymentScheduleModel } from '../services/repaymentScheduleModel.js';

class RepaymentScheduleController {
  createRepaymentSchedule = async (req, res) => {
    try {
      const { application_id, user_id } = req.body;

      if (!user_id) {
        return res.status(400).send('User id is required for checking role.');
      }

      const isWorker = await userModel.checkUserRoleById(user_id);

      if (isWorker !== 'worker') {
        return res
          .status(403)
          .send('Only workers can modify loan applications.');
      }

      const repaymentScheduleIdandDate =
        await repaymentScheduleModel.createRepaymentSchedule(application_id);

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
