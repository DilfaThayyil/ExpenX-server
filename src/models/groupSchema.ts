import mongoose, { Schema } from 'mongoose';
import { IGroup } from '../entities/groupEntities';

const GroupSchema = new Schema<IGroup>(
  {
    name: { type: String},
    createdBy: {type: String},
    members: { type: [{
      id: {type: String},
      name: {type: String},
      email: {type: String},
      avatar: {type: String},
      paid: {type: Number},
      owed: {type: Number}
    }]},
    expenses: { type: [{ 
      groupId: String,
      date: String,
      title: String, 
      totalAmount: Number, 
      paidBy: String, 
      splitMethod: String,
      splits: [
        {
          user: { type:String},
          amountOwed: { type: Number},
          percentage: { type: Number},
          customAmount: { type: Number},
          status: { type: String, enum: ["pending", "paid"]},
        },
      ]
    }]},
  },
    { timestamps: true }
)

export default mongoose.model<IGroup>('Group', GroupSchema);