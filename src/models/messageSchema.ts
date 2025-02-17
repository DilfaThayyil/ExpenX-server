import mongoose, { Document, Schema } from 'mongoose';

export interface IMessage extends Document {
  senderId: string;
  receiverId: string;
  roomId: string;
  text: string;
  status: 'sent' | 'delivered' | 'read'; 
  // time: Date;
}

const MessageSchema = new Schema<IMessage>(
  {
    senderId: { type: String},
    receiverId: { type: String},
    roomId: {type: String},
    text: { type: String},
    status: { type: String, enum: ['sent', 'delivered', 'read'], default: 'sent' }, 
    // time: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

export default mongoose.model<IMessage>("Message", MessageSchema);








// interface IMessage extends Document {
//   conversationId: mongoose.Types.ObjectId;
//   sender: mongoose.Types.ObjectId;
//   text?: string;
//   audio?:string
//   file?:string
//   timestamp: Date;
//   status: 'sent' | 'delivered' | 'read'; 
//   messageId:string
// }

// const MessageSchema: Schema = new Schema(
//   {
//     conversationId: { type: Schema.Types.ObjectId, ref: 'Conversation', required: true },
//     sender: { type: Schema.Types.ObjectId, ref: 'User', required: true },
//     text: { type: String },
//     audio:{type:String},
//     file:{type:String},
//     timestamp: { type: Date, default: Date.now },
//     status: { type: String, enum: ['sent', 'delivered', 'read'], default: 'sent' }, 
//     messageId:{type:String}
//   },
//   { timestamps: true }
// );

// const Message = mongoose.model<IMessage>('Message', MessageSchema);

// export default Message;