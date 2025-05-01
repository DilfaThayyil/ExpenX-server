import { IGroup, ISettlement } from "../../../entities/groupEntities";

export interface IGroupService{
    createGroup(userId:string,name:string,members:[string],creatorEmail:string): Promise<IGroup>
    getUserGroups(userId:string): Promise<IGroup[]>;
    addMember(groupId:string,memberEmail:string):Promise<IGroup>
    addExpenseInGroup(groupId:string,expenseData:any):Promise<IGroup>
    removeMember(groupId: string, memberEmail: string): Promise<{ success: boolean; message: string; group?: IGroup }>
    leaveGroup(groupId: string, userEmail: string,userId:string): Promise<{ success: boolean; message: string }>
    // settleDebt(groupId: string, settlement: ISettlement): Promise<{ success: boolean; message: string; group?: IGroup }>
    groupInvite(groupId:string,email:string):Promise<void>
}