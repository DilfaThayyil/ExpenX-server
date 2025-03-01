import {model, Schema, Document, Types } from "mongoose";

export interface Slot {
  advisorId: {
    _id:Types.ObjectId
    username:string
    email:string
    profilePic:string
  } | {};
  date: string;
  startTime: string;
  endTime: string;
  duration: number;  
  maxBookings: number;
  status: 'Available' | 'Booked' | 'Cancelled';
  bookedBy: {
    _id:Types.ObjectId
    username:string
    email:string
    profilePic:string
  } | {};
  location: "Virtual" | "Physical";
  locationDetails: string;
  description: string;
}

const SlotSchema: Schema = new Schema(
  {
    advisorId: {
      type: {
        _id:{type: Schema.Types.ObjectId,ref:'Advisor'},
        username:{type:String},
        email:{type:String},
        profilePic:{type:String}
      },
      default:{}
    },
    date: { type: String},
    startTime: { type: String},
    endTime: { type: String},
    duration: { type: Number},
    maxBookings: { type: Number},
    status: { 
      type: String, 
      enum: ['Available' , 'Booked' , 'Cancelled'], 
      default:"Available"
    },
    bookedBy: {
      type : {
        _id: {type: Schema.Types.ObjectId, ref:'User'},
        username: {type: String}, 
        email:{type: String},
        profilePic:{type: String}
      },
      default:{}
    },
    location: { type: String, enum: ["Virtual", "Physical"]},
    locationDetails: { type: String },
    description: { type: String },
  },
  { timestamps: true }
);

export default model<Slot>("Slot", SlotSchema);
