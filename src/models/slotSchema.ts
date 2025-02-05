import {model, Schema, Document } from "mongoose";

export interface Slot extends Document {
  advisorId: string;
  date: string;
  startTime: string;
  endTime: string;
  duration: number;
  maxBookings: number;
  status: 'Available' | 'Booked' | 'Cancelled';
  bookedBy: string;
  location: "Virtual" | "Physical";
  locationDetails: string;
  description: string;
}

const SlotSchema: Schema = new Schema(
  {
    advisorId: { type: String },
    date: { type: String},
    startTime: { type: String},
    endTime: { type: String},
    duration: { type: Number},
    maxBookings: { type: Number},
    status: { type: String, enum: ['Available' , 'Booked' , 'Cancelled'], default:"Available"},
    bookedBy: { type: String },
    location: { type: String, enum: ["Virtual", "Physical"]},
    locationDetails: { type: String },
    description: { type: String },
  },
  { timestamps: true }
);

export default model<Slot>("Slot", SlotSchema);
