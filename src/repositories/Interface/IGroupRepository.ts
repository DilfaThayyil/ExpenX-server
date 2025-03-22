import { GroupMember, IGroup, IGroupExpense } from "../../entities/groupEntities";

export interface IGroupRepository{
    findById(groupId:string):Promise<IGroup | null>
    createGroup(groupData: IGroup):Promise<IGroup>
    addMember(groupId:string,newMember:GroupMember):Promise<IGroup>
    getUserGroups(email:string):Promise<IGroup[]>
    addExpenseInGroup(groupId:string,expense:IGroupExpense):Promise<IGroup>

}