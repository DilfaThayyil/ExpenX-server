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
  
  export interface IGroup{
    name: string;
    createdBy: string;
    members: GroupMember[];
    expenses: IGroupExpense[]
  }