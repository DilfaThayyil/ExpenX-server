import { INotification } from "../../models/notificationSchema";

export interface INotificationRepository{
    createNotification(notification: Partial<INotification>): Promise<INotification>;
    getNotificationsByUserId(userId: string): Promise<INotification[]>;
    markAsRead(notificationId: string): Promise<INotification | null>;
    markAllAsRead(userId: string): Promise<boolean>;
    deleteNotification(notificationId: string): Promise<boolean>;
}