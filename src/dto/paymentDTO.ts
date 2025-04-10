import {Types} from 'mongoose'

export interface Payment {
    _id: Types.ObjectId;
    slotId: Types.ObjectId;
    userId: Types.ObjectId;
    advisorId: Types.ObjectId;
    amount: number;
    stripePaymentIntentId: string;
    stripeClientSecret: string;
}
