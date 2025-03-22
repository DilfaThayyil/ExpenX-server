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
  private chatRepository: IChatRepository
  private notificationRepository: INotificationRepository

  constructor(
    @inject('IChatRepository') chatRepository: IChatRepository,
    @inject('INotificationRepository') notificationRepository: INotificationRepository
  ) {
    this.chatRepository = chatRepository
    this.notificationRepository = notificationRepository
  } 

  async sendMessage(message: IMessage): Promise<IMessage> {
    const newMessage = await this.chatRepository.sendMessage(message)
    return newMessage
  }

  async fetchMessages(senderId: string, receiverId: string): Promise<IMessage[]> {
    console.log("fetchmsg-service : +++++++++++++++++++ ", senderId, receiverId)
    const messages = await this.chatRepository.fetchMessages(senderId, receiverId)
    return messages
  }

  async fetchUsers(id: string): Promise<IUser[]> {
    const users = await this.chatRepository.fetchUsers(id)
    return users
  }

  async fetchAdvisors(id: string): Promise<IAdvisor[]> {
    const advisors = await this.chatRepository.fetchAdvisors(id)
    console.log("advisors : ", advisors)
    return advisors
  }

  async createChat(chatData: Partial<IChat>): Promise<IChat> {
    const existingChat = await this.chatRepository.getChatByUsers(chatData.user1!, chatData.user2!);
    if (existingChat) {
      return existingChat;
    }
    return await this.chatRepository.createChat(chatData);
  }

  async getUserChats(userId: string): Promise<IChat[]> {
    return await this.chatRepository.getUserChats(userId);
  }

  async getAllChats(): Promise<IChat[]> {
    return await this.chatRepository.getAllChats();
  }

  // async createNotification(
  //   receiverId: string, 
  //   senderId: string, 
  //   message: string, 
  //   type: "message" | "payment" | "Appointment" | "other"
  // ): Promise<INotification> {
  //   const notification = await this.chatRepository.createNotification({
  //     receiverId,
  //     senderId,
  //     message,
  //     type,
  //     isRead: false,
  //     createdAt: new Date()
  //   });

  //   this.sendRealTimeNotification(notification);

  //   return notification;
  // }

  async getNotifications(userId: string): Promise<INotification[]> {
    return await this.notificationRepository.getNotificationsByUserId(userId);
  }

  async markAsRead(notificationId: string): Promise<INotification | null> {
    return await this.notificationRepository.markAsRead(notificationId);
  }

  async markAllAsRead(userId: string): Promise<boolean> {
    return await this.notificationRepository.markAllAsRead(userId);
  }

  async deleteNotification(notificationId: string): Promise<boolean> {
    return await this.notificationRepository.deleteNotification(notificationId);
  }

  // sendRealTimeNotification(notification: INotification): void {
  //   io.to(`user_${notification.receiverId}`).emit('new_notification', notification);
  // }

  // async findLists(id: string): Promise<IFriendsLists | null> {
  //     const lists = await this.chatRepository.findUsersConnections(id)
  //     return lists
  // }

  // async getMessages(id: string): Promise<IMessage[] | null> {
  //     const messages = await this.chatRepository.getMessages(id)
  //     return messages
  // }

}