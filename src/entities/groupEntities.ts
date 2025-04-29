import { Types } from "mongoose";

export interface GroupMember {
    id: string;
    name: string;
    email: string;
    avatar: string;
    paid: number;
    owed: number;
  }
  export interface ISplit {
    user: String
    amountOwed: number
    percentage?: number
    customAmount?: number
    status: "pending" | "paid"
  }
  export interface IGroupExpense{
    groupId: Types.ObjectId
    date: String
    title: string
    totalAmount: number
    paidBy: string
    splitMethod: "equal" | "percentage" | "custom"
    splits?: ISplit[]
  }
  
  export interface ISettlement {
    _id?: string;
    from: string;
    to: string; 
    amount: number;
    date: string;
    createdAt?: Date;
    updatedAt?: Date;
  }
  export interface IGroup{
    _id?:string;
    name: string;
    createdBy: string;
    pendingInvites: GroupMember[]
    members: GroupMember[];
    expenses: IGroupExpense[]
    settlements: ISettlement[]
  }