import { IReport } from "../../models/reportSchema";

export interface IComplaintRepository{
    createReport(data:IReport):Promise<IReport>

}