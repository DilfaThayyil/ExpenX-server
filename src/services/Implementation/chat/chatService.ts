import { inject, injectable } from "tsyringe";
import { IChatRepository } from "../../../repositories/Interface/IChatRepository";
import { IChatService } from "../../Interface/chat/IChatService";
import { IMessage } from "../../../models/messageSchema";
import IAdvisor from "../../../entities/advisorEntities";
import IUser from "../../../entities/userEntities";
import { IChat } from "../../../models/chatSchema";
import { INotification } from "../../../models/notificationSchema";
import { INotificationRepository } from "../../../repositories/Interface/INotificationRepository";



@injectable()
export default class ChatService implements IChatService {
  private _chatRepository: IChatRepository
  private _notificationRepository: INotificationRepository

  constructor(
    @inject('IChatRepository') chatRepository: IChatRepository,
    @inject('INotificationRepository') notificationRepository: INotificationRepository
  ) {
    this._chatRepository = chatRepository
    this._notificationRepository = notificationRepository
  } 

  async sendMessage(message: IMessage): Promise<IMessage> {
    const newMessage = await this._chatRepository.sendMessage(message)
    return newMessage
  }

  async fetchMessages(senderId: string, receiverId: string): Promise<IMessage[]> {
    console.log("fetchmsg-service : +++++++++++++++++++ ", senderId, receiverId)
    const messages = await this._chatRepository.fetchMessages(senderId, receiverId)
    return messages
  }

  async fetchUsers(id: string): Promise<IUser[]> {
    const users = await this._chatRepository.fetchUsers(id)
    return users
  }

  async fetchAdvisors(id: string): Promise<IAdvisor[]> {
    const advisors = await this._chatRepository.fetchAdvisors(id)
    console.log("advisors : ", advisors)
    return advisors
  }

  async createChat(chatData: Partial<IChat>): Promise<IChat> {
    const existingChat = await this._chatRepository.getChatByUsers(chatData.user1!, chatData.user2!);
    if (existingChat) {
      return existingChat;
    }
    return await this._chatRepository.createChat(chatData);
  }

  async getUserChats(userId: string): Promise<IChat[]> {
    return await this._chatRepository.getUserChats(userId);
  }

  async getAllChats(): Promise<IChat[]> {
    return await this._chatRepository.getAllChats();
  }

  // async createNotification(
  //   receiverId: string, 
  //   senderId: string, 
  //   message: string, 
  //   type: "message" | "payment" | "Appointment" | "other"
  // ): Promise<INotification> {
  //   const notification = await this._chatRepository.createNotification({
  //     receiverId,
  //     senderId,
  //     message,
  //     type,
  //     isRead: false,
  //     createdAt: new Date()
  //   });

  //   this._sendRealTimeNotification(notification);

  //   return notification;
  // }

  async getNotifications(userId: string): Promise<INotification[]> {
    return await this._notificationRepository.getNotificationsByUserId(userId);
  }

  async markAsRead(notificationId: string): Promise<INotification | null> {
    return await this._notificationRepository.markAsRead(notificationId);
  }

  async markAllAsRead(userId: string): Promise<boolean> {
    return await this._notificationRepository.markAllAsRead(userId);
  }

  async deleteNotification(notificationId: string): Promise<boolean> {
    return await this._notificationRepository.deleteNotification(notificationId);
  }

  // sendRealTimeNotification(notification: INotification): void {
  //   io.to(`user_${notification.receiverId}`).emit('new_notification', notification);
  // }

  // async findLists(id: string): Promise<IFriendsLists | null> {
  //     const lists = await this._chatRepository.findUsersConnections(id)
  //     return lists
  // }

  // async getMessages(id: string): Promise<IMessage[] | null> {
  //     const messages = await this._chatRepository.getMessages(id)
  //     return messages
  // }

}