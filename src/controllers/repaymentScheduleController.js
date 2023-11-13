import { repaymentScheduleModel } from '../models/repaymentScheduleModel.js';

export const checkIfAllRequiredParamsRepaymentSchedule = (params) => {
  if (!params.repayment_schedule_id || !params.year || !params.month) {
    return res
      .status(400)
      .send(
        'Missing required parameters: repayment_schedule_id, year, and month'
      );
  }
  return true;
};

class RepaymentScheduleController {
  constructor(repaymentScheduleModel) {
    this.repaymentScheduleModel = repaymentScheduleModel;
  }

  createRepaymentSchedule = async (req, res) => {
    try {
      const repaymentScheduleIdandDate =
        await this.repaymentScheduleModel.createRepaymentSchedule(req.body);

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
      checkIfAllRequiredParamsRepaymentSchedule(req.query);

      const paymentAmount = await this.repaymentScheduleModel.getByIdYearMonth(
        req.query.repayment_schedule_id,
        req.query.year,
        req.query.month
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

export const repaymentScheduleController = new RepaymentScheduleController(
  repaymentScheduleModel
);
