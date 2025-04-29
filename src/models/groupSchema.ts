import mongoose, { Schema } from 'mongoose';
import { IGroup } from '../entities/groupEntities';

const GroupMemberSchema = new Schema(
  {
    id: { type: String },
    name: { type: String },
    email: { type: String },
    avatar: { type: String },
    paid: { type: Number, default: 0 },
    owed: { type: Number, default: 0 },
  }
);

const SplitSchema = new Schema(
  {
    user: { type: String },
    amountOwed: { type: Number },
    percentage: { type: Number },
    customAmount: { type: Number },
    status: { type: String, enum: ["pending", "paid"], default: "pending" },
  },
  { _id: false }
);

const GroupExpenseSchema = new Schema(
  {
    groupId: { type: Schema.Types.ObjectId, ref: "Group" },
    date: { type: String },
    title: { type: String },
    totalAmount: { type: Number },
    paidBy: { type: String },
    splitMethod: { type: String, enum: ["equal", "percentage", "custom"] },
    splits: [SplitSchema],
  },
  { _id: false }
);

const SettlementSchema = new Schema(
  {
    from: { type: String },
    to: { type: String },
    amount: { type: Number },
    date: { type: String },
  },
  { _id: false }
);

const GroupSchema = new Schema<IGroup>(
  {
    name: { type: String },
    createdBy: { type: String },
    pendingInvites: [GroupMemberSchema],
    members: [GroupMemberSchema],
    expenses: [GroupExpenseSchema],
    settlements: [SettlementSchema]
  },
  { timestamps: true }
)

export default mongoose.model<IGroup>('Group', GroupSchema);