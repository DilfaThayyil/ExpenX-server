import reportSchema, { IReport } from "../../models/reportSchema";
import { IComplaintRepository } from "../Interface/IComplaintRepository";
import { BaseRepository } from "./baseRepository";

export default class ComplaintRepository extends BaseRepository<IReport> implements IComplaintRepository {

    constructor() {
        super(reportSchema)
    }

    async createReport(data: IReport): Promise<IReport> {
        const report = await reportSchema.create(data);
        return report;
    }

    async fetchReports(page: number, limit: number): Promise<{ reports: IReport[], totalReports: number }> {
        const skip = (page - 1) * limit;
        const [reports, totalReports] = await Promise.all([
            reportSchema.find()
                .populate("userId", "username email isBlocked")
                .populate("advisorId", "username email isBlocked")
                .sort({ createdAt: -1 }).skip(skip).limit(limit),
            reportSchema.countDocuments()
        ])
        return { reports, totalReports };
    }

}