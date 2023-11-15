import { repaymentScheduleModel } from '../models/repaymentScheduleModel.js';

export const checkIfAllRequiredParamsRepaymentSchedule = (params) => {
  if (!params.repayment_schedule_id || !params.year || !params.month) {
    throw new Error(
      'Missing required parameters: repayment_schedule_id, year, and month'
    );
  }
  return true;
};

export class RepaymentScheduleController {
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
  updateRemainBalance = async (req, res) => {
    try {
      await this.repaymentScheduleModel.updateRemainBalance(
        req.body.new_balance,
        req.params.repayment_schedule_id
      );

      res
        .status(200)
        .send(
          `Remaining balance in repayment shedule with id ${req.params.repayment_schedule_id} was updated.`
        );
    } catch (err) {
      console.error(err);
      res.status(500).json({
        message: 'Something went wrong while updating remaing balance.',
        error: err.message,
      });
    }
  };

  deleteSchedule = async (req, res) => {
    try {
      await this.repaymentScheduleModel.deleteSchedule(
        req.params.repayment_schedule_id
      );
      res.status(204).end();
    } catch (err) {
      console.error(err);
      res.status(500).json({
        message: `Something went wrong while deleting repayment schedule.`,
        error: err.message,
      });
    }
  };
}

export const repaymentScheduleController = new RepaymentScheduleController(
  repaymentScheduleModel
);
