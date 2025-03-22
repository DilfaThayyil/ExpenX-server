import notificationSchema, { INotification } from "../../models/notificationSchema";
import { INotificationRepository } from "../Interface/INotificationRepository";
import { BaseRepository } from "./baseRepository";

export default class NotificationRepository extends BaseRepository<INotification> implements INotificationRepository{
    constructor(){
        super(notificationSchema)
    }

    async createNotification(notification: Partial<INotification>): Promise<INotification> {
        const newNotification = await notificationSchema.create(notification);
        return newNotification
      }
    
      async getNotificationsByUserId(receiverId: string): Promise<INotification[]> {
        return await notificationSchema.find({ receiverId,isRead:false }).sort({ createdAt: -1 })
      }
    
      async markAsRead(notificationId: string): Promise<INotification | null> {
        return await notificationSchema.findByIdAndUpdate(
          notificationId, 
          { read: true }, 
          { new: true }
        );
      }
    
      async markAllAsRead(receiverId: string): Promise<boolean> {
        const result = await notificationSchema.updateMany(
            { receiverId, isRead: false }, 
            { $set: { isRead: true } }     
        );
    
        return result.modifiedCount > 0;
    }
    
      async deleteNotification(notificationId: string): Promise<boolean> {
        const result = await notificationSchema.findByIdAndDelete(notificationId);
        return !!result;
      }
}