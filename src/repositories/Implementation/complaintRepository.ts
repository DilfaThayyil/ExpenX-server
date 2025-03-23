import reportSchema, { IReport } from "../../models/reportSchema";
import { IComplaintRepository } from "../Interface/IComplaintRepository";
import { BaseRepository } from "./baseRepository";

export default class ComplaintRepository extends BaseRepository<IReport> implements IComplaintRepository{

    constructor(){
        super(reportSchema)
    }
    
    async createReport(data: IReport): Promise<IReport> {
        const report = await reportSchema.create(data);
        return report;
    }

}