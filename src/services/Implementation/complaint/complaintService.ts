import { inject, injectable } from "tsyringe";
import { IComplaintRepository } from "../../../repositories/Interface/IComplaintRepository";
import { IComplaintService } from "../../Interface/complaint/IComplaintService";
import { IReport } from "../../../models/reportSchema";
import { Types } from "mongoose";
import { ISlotRepository } from "../../../repositories/Interface/ISlotRepository";

@injectable()
export default class ComplaintService implements IComplaintService{
    private complaintRepository: IComplaintRepository
    private slotRepository: ISlotRepository

    constructor(
        @inject('IComplaintRepository') complaintRepository:IComplaintRepository,
        @inject('ISlotRepository') slotRepository:ISlotRepository
    ){
        this.complaintRepository = complaintRepository
        this.slotRepository = slotRepository
    }

    async reportAdvisor(slotId: string, userId: string, advisorId: string, reason: "Spam" | "Inappropriate Content" | "Harassment" | "Other", customReason?: string): Promise<IReport> {
        const data: IReport = { userId: new Types.ObjectId(userId), advisorId: new Types.ObjectId(advisorId), reason, customReason, status: "pending", createdAt: new Date() };
        const report = await this.complaintRepository.createReport(data);
        await this.slotRepository.updateSlot(slotId)
        return report;
      }
}