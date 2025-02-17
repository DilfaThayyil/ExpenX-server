import mongoose, { Document, Schema } from 'mongoose';

export interface IChat extends Document {
  user1: string
  user2: string
  createdAt: Date; 
  updatedAt: Date;  
  lastMessage?: string;
  lastSeen?: string
}

const ChatSchema: Schema = new Schema(
  {
    user1: { type: String, ref: 'Advisor', required: true },
    user2: { type: String, ref: 'User', required: true },
    lastMessage: { type: String, default: '' },
  },
  { 
    timestamps: true 
  }
)

ChatSchema.index({ user1: 1, user2: 1 }, { unique: true });

const Chat = mongoose.model<IChat>('Chat', ChatSchema);

export default Chat;
