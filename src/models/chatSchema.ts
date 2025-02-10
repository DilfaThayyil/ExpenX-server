import mongoose, { Document, Schema } from 'mongoose';

interface IChat extends Document {
  user1: mongoose.Types.ObjectId; 
  user2: mongoose.Types.ObjectId; 
  createdAt: Date; 
  updatedAt: Date;  
  lastMessage?: string;
  lastSeen?: string
}

const ChatSchema: Schema = new Schema(
  {
    user1: { type: Schema.Types.ObjectId, ref: 'Advisor', required: true },
    user2: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    lastMessage: { type: String, default: '' },
  },
  { 
    timestamps: true 
  }
)

ChatSchema.index({ user1: 1, user2: 1 }, { unique: true });

const Chat = mongoose.model<IChat>('Chat', ChatSchema);

export default Chat;
