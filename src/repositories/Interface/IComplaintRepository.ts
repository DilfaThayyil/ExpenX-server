import { IReport } from "../../models/reportSchema";

export interface IComplaintRepository{
    createReport(data:IReport):Promise<IReport>
    fetchReports(page:number,limit:number):Promise<{reports:IReport[], totalReports:number}>

}