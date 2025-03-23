import {Request,Response} from 'express'
import { IComplaintController } from '../../Interface/complaint/IComplaintController';
import { IComplaintService } from '../../../services/Interface/complaint/IComplaintService';
import { inject, injectable } from 'tsyringe';
import { HttpStatusCode } from '../../../utils/httpStatusCode';

@injectable()
export default class ComplaintController implements IComplaintController{
    private complaintService: IComplaintService

    constructor(@inject('IComplaintService') complaintService:IComplaintService){
        this.complaintService = complaintService
    }

    async reportAdvisor(req: Request, res: Response): Promise<Response> {
        try {
          const {slotId} = req.params
          const { userId, advisorId, reason, customReason } = req.body
          const report = await this.complaintService.reportAdvisor(slotId,userId, advisorId, reason, customReason);
          return res.status(HttpStatusCode.CREATED).json({ message: "Report submitted successfully", report });
        } catch (error) {
          return res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({ message: "Error submitting report", error });
        }
      }
}