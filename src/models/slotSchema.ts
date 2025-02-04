import {model, Schema, Document } from "mongoose";

export interface Slot extends Document {
  date: string;
  startTime: string;
  endTime: string;
  duration: number;
  maxBookings: number;
  status: "Active" | "Inactive";
  location: "Virtual" | "Physical";
  locationDetails?: string;
  description?: string;
}

const SlotSchema: Schema = new Schema(
  {
    date: { type: String, required: true },
    startTime: { type: String, required: true },
    endTime: { type: String, required: true },
    duration: { type: Number, required: true },
    maxBookings: { type: Number, required: true },
    status: { type: String, enum: ["Active", "Inactive"], required: true },
    location: { type: String, enum: ["Virtual", "Physical"], required: true },
    locationDetails: { type: String },
    description: { type: String },
  },
  { timestamps: true }
);

export default model<Slot>("Slot", SlotSchema);
