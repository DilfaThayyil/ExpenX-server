import { Request, Response } from 'express'
import { IComplaintController } from '../../Interface/complaint/IComplaintController';
import { IComplaintService } from '../../../services/Interface/complaint/IComplaintService';
import { inject, injectable } from 'tsyringe';
import { HttpStatusCode } from '../../../utils/httpStatusCode';

@injectable()
export default class ComplaintController implements IComplaintController {
  private _complaintService: IComplaintService

  constructor(@inject('IComplaintService') complaintService: IComplaintService) {
    this._complaintService = complaintService
  }

  async reportAdvisor(req: Request, res: Response): Promise<Response> {
    try {
      const { slotId } = req.params
      const { userId, advisorId, reason, customReason } = req.body
      const report = await this._complaintService.reportAdvisor(slotId, userId, advisorId, reason, customReason);
      return res.status(HttpStatusCode.CREATED).json({ message: "Report submitted successfully", report });
    } catch (error) {
      return res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({ message: "Error submitting report", error });
    }
  }

  async fetchReports(req: Request, res: Response): Promise<Response> {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      console.log("page,limit-controll : ", page, ",", limit)
      const reports = await this._complaintService.fetchReports(page, limit)
      return res.status(HttpStatusCode.OK).json({ success: true, data: { reports } })
    } catch (err) {
      console.error(err)
      return res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({ error: "Error fetching reports" })
    }
  }
}