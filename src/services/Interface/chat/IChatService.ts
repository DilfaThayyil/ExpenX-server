import IAdvisor from "../../../entities/advisorEntities";
import IUser from "../../../entities/userEntities";
import { IChat } from "../../../models/chatSchema";
import { IMessage } from "../../../models/messageSchema";
import { INotification } from "../../../models/notificationSchema";


export interface IChatService {
    sendMessage(message: IMessage): Promise<IMessage>
    fetchMessages(senderId: string, receiverId: string): Promise<IMessage[]>
    fetchUsers(id: string): Promise<IUser[]>
    fetchAdvisors(id: string): Promise<IAdvisor[]>
    createChat(chat: IChat): Promise<IChat>
    getUserChats(id: string): Promise<IChat[]>
    getAllChats(): Promise<IChat[]>
    // createNotification(userId: string, senderId: string, message: string, type?: "message" | "payment" | "Appointment" | "other"): Promise<INotification>;
    getNotifications(userId: string): Promise<INotification[]>;
    markAsRead(notificationId: string): Promise<INotification | null>;
    markAllAsRead(userId: string): Promise<boolean>;
    deleteNotification(notificationId: string): Promise<boolean>;
    // sendRealTimeNotification(notification: INotification): void;
}