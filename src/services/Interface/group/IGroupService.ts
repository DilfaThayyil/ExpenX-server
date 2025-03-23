import { IGroup } from "../../../entities/groupEntities";

export interface IGroupService{
    createGroup(userId:string,name:string,members:[string]): Promise<IGroup>
    getUserGroups(userId:string): Promise<IGroup[]>;
    addMember(groupId:string,memberEmail:string):Promise<IGroup>
    addExpenseInGroup(groupId:string,expenseData:any):Promise<IGroup>
}