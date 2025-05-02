import { Schema, model, Types } from "mongoose";

export interface Slot {
  advisorId: Types.ObjectId;
  date: string;
  startTime: string;
  fee: number;
  duration: number;  
  maxBookings: number;
  status: 'Available' | 'Booked' | 'Cancelled';
  bookedBy: Types.ObjectId | null;
  location: 'Virtual' | 'Physical';
  locationDetails: string;
  description: string;
}

const SlotSchema: Schema = new Schema(
  {
    advisorId: { type: Schema.Types.ObjectId, ref: 'Advisor'},
    date: { type: String}, 
    startTime: { type: String},
    fee: { type: Number},
    duration: { type: Number},
    maxBookings: { type: Number},
    status: {
      type: String,
      enum: ['Available', 'Booked', 'Cancelled'],
      default: 'Available'
    },
    bookedBy: { type: Schema.Types.ObjectId, ref: 'User', default: null },
    location: { type: String, enum: ['Virtual', 'Physical']},
    locationDetails: { type: String},
    description: { type: String}
  },
  { timestamps: true }
);

export default model<Slot>('Slot', SlotSchema);
