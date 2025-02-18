import mongoose, { Document, Schema } from 'mongoose';

export interface IMessage extends Document {
  senderId: string;
  receiverId: string;
  roomId: string;
  text?: string;
  // audio?:string;
  fileUrl?:string;
  fileType?:string;
  fileName?:string;
  status: 'sent' | 'delivered' | 'read'; 
  createdAt: Date;
  updatedAt: Date;
}

const MessageSchema = new Schema<IMessage>(
  {
    senderId: { type: String},
    receiverId: { type: String},
    roomId: {type: String},
    text: { type: String , default: ''},
    // audio: { type: String},
    fileUrl: { type: String , default: null},
    fileType: { type: String , enum: ["image", "video", "pdf", "document", null], default: null},
    fileName: { type: String , default: null},
    status: { type: String, enum: ['sent', 'delivered', 'read'], default: 'sent' }, 
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