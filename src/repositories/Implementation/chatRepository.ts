import mongoose, { Types } from "mongoose";
import { IChatRepository } from "../Interface/IChatRepository";
import { IFriendsLists } from "../../entities/friendsEntities";
import Conversation, { IChat } from "../../models/chatSchema";
import Message, { IMessage } from "../../models/messageSchema";
import userSchema from "../../models/userSchema";
import messageSchema from "../../models/messageSchema";
import IUser from "../../entities/userEntities";
import IAdvisor from "../../entities/advisorEntities";
import advisorSchema from "../../models/advisorSchema";
import chatSchema from "../../models/chatSchema";

const isValidObjectId = (id: string): boolean => {
    return mongoose.Types.ObjectId.isValid(id);
};


export default class ChatRepository implements IChatRepository {


    async sendMessage(message: IMessage): Promise<IMessage> {
        const newMessage = new messageSchema(message);
        return await newMessage.save();
    }

    async fetchMessages(senderId: string, receiverId: string): Promise<IMessage[]> {
        const messages = await messageSchema.find({
            $or: [
                { senderId: senderId, receiverId: receiverId },
                { senderId: receiverId, receiverId: senderId },
            ],
        }).sort({ createdAt: 1 });
        return messages
    }

    async fetchUsers(id: string): Promise<IUser[]> {
        console.log("senderId-repo : ", id)
        return await userSchema.find({ _id: id })
    }

    async fetchAdvisors(id: string): Promise<IAdvisor[]> {
        return await advisorSchema.find({ _id: id })
    }

    async getChatByUsers(user1: string, user2: string): Promise<IChat | null> {
        return await chatSchema.findOne({
            $or: [
                { user1, user2 },
                { user1: user2, user2: user1 },
            ],
        });
    }

    async getUserChats(userId: string): Promise<IChat[]> {
        return await chatSchema.find({
            $or: [{ user1: userId }, { user2: userId }],
        }).populate(["user1", "user2"]);
    }

    async getAllChats(): Promise<IChat[]> {
        return await chatSchema.find().populate(["user1", "user2"]);
    }

    async createChat(chatData: Partial<IChat>): Promise<IChat> {
        return await chatSchema.create(chatData);
      }


    async findUsersConnections(id: string): Promise<IFriendsLists | null> {
        try {
            const userId = new Types.ObjectId(id);

            const conversations = await Conversation.find({
                $or: [{ user1: userId }, { user2: userId }],
            }).sort({ updatedAt: -1 });

            if (!conversations.length) {
                return null;
            }

            const userIds = new Set(
                conversations.flatMap(conversation =>{
                    const user1 = new Types.ObjectId(conversation.user1);
                    const user2 = new Types.ObjectId(conversation.user2);
                    [user1, user2].filter(uid => !uid.equals(userId))
                })
            );

            const users = await userSchema.find({ _id: { $in: Array.from(userIds) } });
            const userMap = new Map(users.map(user => [user._id.toString(), user]));

            const friends = await Promise.all(conversations.map(async conversation => {
                const user1 = new Types.ObjectId(conversation.user1)
                const user2 = new Types.ObjectId(conversation.user2)
                const friendId = user1.equals(userId) ? user2 : conversation.user1;
                const friend = userMap.get(friendId.toString());

                const unseenMessagesCount = await Message.countDocuments({
                    conversationId: conversation._id,
                    sender: { $ne: userId },
                    status: { $ne: 'read' }
                });

                return {
                    id: friendId.toString(),
                    username: friend?.username || '',
                    //   lastName: friend?.secondName || '',
                    conversationId: conversation.id.toString(),
                    updatedAt: conversation.updatedAt,
                    lastMessage: conversation.lastMessage,
                    unseenMessagesCount
                };
            }));

            return { friends };
        } catch (err) {
            return null;
        }
    }


    async getMessages(conversationId: string): Promise<IMessage[] | null> {
        if (!isValidObjectId(conversationId)) {
            throw new Error(`Invalid conversation ID: ${conversationId}`);
        }
        return Message.find({ conversationId })
    }

    async saveMessage(senderId: string, receiverId: string, message: string, initial = false, messageId: string): Promise<any | null> {
        try {
            let conversation = await Conversation.findOne({
                $or: [
                    { user1: senderId, user2: receiverId },
                    { user1: receiverId, user2: senderId },
                ],
            });

            if (!conversation) {
                conversation = await Conversation.create({ user1: senderId, user2: receiverId });
            }
            if (conversation) {
                await Conversation.findOneAndUpdate({
                    $or: [
                        { user1: senderId, user2: receiverId },
                        { user1: receiverId, user2: senderId },
                    ]
                },
                    {
                        updatedAt: Date.now(),
                        lastMessage: message,
                    }
                )
            }
            const newMessage = await Message.create({
                conversationId: conversation._id,
                sender: senderId,
                text: message,
                timestamp: new Date(),
                messageId: messageId
            });
            if (initial == true) {

                return conversation
            }

            return newMessage;
        } catch (err) {
            return null
        }
    }

    async saveImage(file: string, senderId: string, receiverId: string, messageId: string): Promise<any> {
        try {
            let conversation = await Conversation.findOne({
                $or: [
                    { user1: senderId, user2: receiverId },
                    { user1: receiverId, user2: senderId },
                ],
            });

            if (!conversation) {
                conversation = await Conversation.create({ user1: senderId, user2: receiverId });
            }
            if (conversation) {
                await Conversation.findOneAndUpdate({
                    $or: [
                        { user1: senderId, user2: receiverId },
                        { user1: receiverId, user2: senderId },
                    ]
                },
                    {
                        updatedAt: Date.now(),
                        lastMessage: 'image',
                    }
                )
            }
            const newMessage = await Message.create({
                conversationId: conversation._id,
                sender: senderId,
                file: file,
                timestamp: new Date(),
                messageId: messageId
            });

            return newMessage;
        } catch (err) {
            return null
        }
    }

    // async saveNotification(senderId: string, receiverId: string, message: string, link: string, type: 'message' | 'payment' | 'job'): Promise<INotification> {
    //     return await Notification.create({ senderId, receiverId, message, link, type })
    // }

    // async changeNotificationStatus(notificationId: string, userId: string): Promise<void> {
    //     await Notification.updateOne(
    //         { _id: notificationId, receiverId: userId },
    //         { $set: { read: true } }
    //     );
    // }


    // async uploadAudio(audio: Buffer): Promise<string | null> {
    //     try {
    //       const fileName = `${uuidv4()}.wav`;
    //       const blob = bucket.file(`audio-messages/${fileName}`);

    //       return new Promise((resolve, reject) => {
    //         const blobStream = blob.createWriteStream({
    //           metadata: {
    //             contentType: 'audio/wav',
    //           },
    //         });

    //         blobStream.on('error', (err) => {
    //           console.error('Error uploading audio file:', err);
    //           reject(err);  
    //         });

    //         blobStream.on('finish', () => {
    //           const encodedFileName = encodeURIComponent(fileName);
    //           const publicUrl = `https://firebasestorage.googleapis.com/v0/b/${bucket.name}/o/audio-messages%2F${encodedFileName}?alt=media`;

    //           resolve(publicUrl);
    //         });

    //         blobStream.end(audio); 
    //       });

    //     } catch (err) {
    //       console.error('Error in uploadAudio function:', err);
    //       return null;
    //     }
    //   }

}