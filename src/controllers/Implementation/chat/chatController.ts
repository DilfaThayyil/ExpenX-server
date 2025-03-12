import { inject, injectable } from "tsyringe";
import { IChatController } from "../../Interface/chat/IChatController";
import cloudinary from "../../../config/cloudinaryConfig";
import { IChatService } from "../../../services/Interface/chat/IChatService";
import { HttpStatusCode } from "../../../utils/httpStatusCode";
import { Request, Response } from "express";

@injectable()
export default class ChatController implements IChatController {
  private chatService: IChatService

  constructor(@inject('IChatService') chatService: IChatService) {
    this.chatService = chatService
  }


  async sendMessage(req: Request, res: Response): Promise<Response> {
    try {
      const { sender, receiver, text } = req.body;

      if (!sender || !receiver || !text) {
        return res.status(HttpStatusCode.BAD_REQUEST).json({ message: "All fields are required" });
      }

      const message = await this.chatService.sendMessage({ sender, receiver, text } as any);
      return res.status(HttpStatusCode.CREATED).json(message);
    } catch (error) {
      return res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({ message: "Internal server error" });
    }
  }


  async fetchMessages(req: Request, res: Response): Promise<Response> {
    try {
      console.log("fetchMesg-controll : +++++++++++++ ", req.params)
      const { senderId, receiverId } = req.params;

      if (!senderId || !receiverId) {
        return res.status(HttpStatusCode.BAD_REQUEST).json({ message: "Sender and receiver IDs are required" });
      }

      const messages = await this.chatService.fetchMessages(senderId, receiverId);
      return res.status(HttpStatusCode.OK).json(messages);
    } catch (error) {
      return res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({ message: "Internal server error" });
    }
  }

  async fetchUsers(req: Request, res: Response): Promise<Response> {
    try {
      const { id } = req.params
      const users = await this.chatService.fetchUsers(id)
      console.log("users :", users)
      return res.status(HttpStatusCode.OK).json({ users })
    } catch (err) {
      return res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({ message: "Internal server error" });
    }
  }

  async fetchAdvisors(req: Request, res: Response): Promise<Response> {
    try {
      const { id } = req.params
      const users = await this.chatService.fetchAdvisors(id)
      console.log("Advisors :", users)
      return res.status(HttpStatusCode.OK).json({ users })
    } catch (err) {
      return res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({ message: "Internal server error" });
    }
  }


  async createChat(req: Request, res: Response): Promise<Response> {
    try {
      const chat = await this.chatService.createChat(req.body);
      return res.status(HttpStatusCode.CREATED).json({ success: true, result: chat });
    } catch (error) {
      return res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({ success: false, message: "Error creating chat", error });
    }
  }

  async fetchChats(req: Request, res: Response): Promise<Response> {
    try {
      const userId = req.params.userId;
      const chats = await this.chatService.getUserChats(userId);
      return res.status(HttpStatusCode.OK).json({ success: true, result: chats });
    } catch (error) {
      return res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({ success: false, message: "Error fetching chats", error });
    }
  }

  async fetchAllChats(req: Request, res: Response): Promise<Response> {
    try {
      const chats = await this.chatService.getAllChats();
      return res.status(HttpStatusCode.OK).json({ success: true, result: chats });
    } catch (error) {
      return res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({ success: false, message: "Error fetching all chats", error });
    }
  }

  async uploadChatFile(req: Request, res: Response): Promise<Response> {
    try {
      console.log("req : ", req.file)
      const file = req.file
      if (!file) {
        return res.status(HttpStatusCode.BAD_REQUEST).json({ error: 'No file uploaded' })
      }
      const fileUrl = file.path
      console.log("fileURL : ",fileUrl)
      return res.status(HttpStatusCode.OK).json({ url: fileUrl });
    } catch (err) {
      console.error(err)
      return res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({})
    }
  }

  async getNotifications(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.params.userId
      
      if (!userId) {
        res.status(HttpStatusCode.BAD_REQUEST).json({ message: 'User ID is required' });
        return;
      }
      
      const notifications = await this.chatService.getNotifications(userId);
      console.log("getNotifications-contrll : ",notifications)
      res.status(HttpStatusCode.OK).json(notifications);
    } catch (error) {
      console.error('Error fetching notifications:', error);
      res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({ message: 'Failed to fetch notifications' });
    }
  }

  async markAsRead(req: Request, res: Response): Promise<void> {
    try {
      const { notificationId } = req.params;
      
      if (!notificationId) {
        res.status(HttpStatusCode.BAD_REQUEST).json({ message: 'Notification ID is required' });
        return;
      }
      
      const updatedNotification = await this.chatService.markAsRead(notificationId);
      
      if (!updatedNotification) {
        res.status(HttpStatusCode.NOT_FOUND).json({ message: 'Notification not found' });
        return;
      }
      
      res.status(HttpStatusCode.OK).json(updatedNotification);
    } catch (error) {
      console.error('Error marking notification as read:', error);
      res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({ message: 'Failed to update notification' });
    }
  }

  async markAllAsRead(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.params.userId
      
      if (!userId) {
        res.status(HttpStatusCode.BAD_REQUEST).json({ message: 'User ID is required' });
        return;
      }
      
      const result = await this.chatService.markAllAsRead(userId);
      res.status(HttpStatusCode.OK).json({ success: result });
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
      res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({ message: 'Failed to update notifications' });
    }
  }

  async deleteNotification(req: Request, res: Response): Promise<void> {
    try {
      const { notificationId } = req.params;
      
      if (!notificationId) {
        res.status(HttpStatusCode.BAD_REQUEST).json({ message: 'Notification ID is required' });
        return;
      }
      
      const result = await this.chatService.deleteNotification(notificationId);
      
      if (!result) {
        res.status(HttpStatusCode.NOT_FOUND).json({ message: 'Notification not found' });
        return;
      }
      
      res.status(HttpStatusCode.OK).json({ success: true });
    } catch (error) {
      console.error('Error deleting notification:', error);
      res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({ message: 'Failed to delete notification' });
    }
  }


}