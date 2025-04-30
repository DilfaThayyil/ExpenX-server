import { GroupMember, IGroup, IGroupExpense, ISettlement } from "../../entities/groupEntities";

export interface IGroupRepository{
    findById(groupId:string):Promise<IGroup | null>
    createGroup(groupData: IGroup):Promise<IGroup>
    addMember(groupId:string,newMember:GroupMember):Promise<IGroup>
    removeMember(groupId:string,email:string):Promise<IGroup|null>
    getUserGroups(email:string):Promise<IGroup[]>
    addExpenseInGroup(groupId:string,expense:IGroupExpense):Promise<IGroup>
    // removeMember(groupId:string,memberEmail:string):Promise<IGroup | null>
    // addSettlement(groupId:string,settlement:ISettlement):Promise<IGroup | null>
}