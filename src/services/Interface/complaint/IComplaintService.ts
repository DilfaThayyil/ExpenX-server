import { IReport } from "../../../models/reportSchema";

export interface IComplaintService{
    reportAdvisor(slotId:string,userId:string,advisorId:string,reason:string,customReason:string):Promise<IReport>
    fetchReports(page:number,limit:number):Promise<{reports:IReport[], totalReports:number}>

}