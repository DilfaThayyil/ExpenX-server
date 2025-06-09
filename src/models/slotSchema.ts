import { model, Schema, Types } from "mongoose";

export interface Slot {
  advisorId: Types.ObjectId;
  date: string;
  startTime: string;
  fee: number;
  duration: number;
  maxBookings: number;
  status: 'Available' | 'Booked' | 'Cancelled';
  bookedBy: Types.ObjectId | null; 
  location: "Virtual" | "Physical";
  locationDetails: string;
  description: string;
  startDateTime: Date;
  endDateTime: Date;
}

const SlotSchema: Schema = new Schema(
  {
    advisorId: {
      type: Schema.Types.ObjectId, ref: 'Advisor'
    },
    date: { type: String },
    startTime: { type: String },
    fee: { type: Number },
    duration: { type: Number },
    maxBookings: { type: Number },
    status: {
      type: String,
      enum: ['Available', 'Booked', 'Cancelled'],
      default: "Available"
    },
    bookedBy: { type: Schema.Types.ObjectId, ref: 'User', default: null },
    location: { type: String, enum: ["Virtual", "Physical"] },
    locationDetails: { type: String },
    description: { type: String },
    startDateTime: { type: Date },
    endDateTime: { type: Date },
  },
  { timestamps: true }
);

export default model<Slot>('Slot', SlotSchema);
