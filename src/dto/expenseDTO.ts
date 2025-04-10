import {Types} from 'mongoose'

export interface Split {
    userId: Types.ObjectId;
    amountOwed: number;
    percentage?: number;
    customAmount?: number;
    status: "pending" | "paid";
}