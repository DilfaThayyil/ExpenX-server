import mongoose, { Document, Schema } from "mongoose";

export interface INotification extends Document {
    senderId: string;
    receiverId: string;
    message: string;
    isRead: boolean;
    type: 'message' | 'payment' | 'Appointment' | 'other'
    createdAt: Date;
    updatedAt: Date
}

const NotificationSchema = new Schema<INotification>(
    {
        senderId: { type: String },
        receiverId: { type: String },
        message: { type: String },
        isRead: { type: Boolean, default: false },
        type: { type: String, enum: ['message', 'payment', 'Appointment', 'other'], default: 'message' }
    },
    { timestamps: true }
);

export default mongoose.model<INotification>("Notification", NotificationSchema);
