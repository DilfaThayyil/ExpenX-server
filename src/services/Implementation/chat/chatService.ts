import { inject, injectable } from "tsyringe";
import { IChatRepository } from "../../../repositories/Interface/IChatRepository";
import { IChatService } from "../../Interface/chat/IChatService";
import {IMessage} from "../../../models/messageSchema";
import IAdvisor from "../../../entities/advisorEntities";
import IUser from "../../../entities/userEntities";
import { IChat } from "../../../models/chatSchema";



@injectable()
export default class ChatService implements IChatService {
    private chatRepository: IChatRepository

    constructor(@inject('IChatRepository') chatRepository: IChatRepository) {
        this.chatRepository = chatRepository
    }

    async sendMessage(message: IMessage): Promise<IMessage> {
        const newMessage = await this.chatRepository.sendMessage(message)
        return newMessage
    }

    async fetchMessages(senderId: string, receiverId: string): Promise<IMessage[]> {
      console.log("fetchmsg-service : +++++++++++++++++++ ",senderId,receiverId)
        const messages = await this.chatRepository.fetchMessages(senderId, receiverId)
        return messages
    }

    async fetchUsers(id:string):Promise<IUser[]>{
        const users = await this.chatRepository.fetchUsers(id)
        return users
    }

    async fetchAdvisors(id: string): Promise<IAdvisor[]> {
        const advisors = await this.chatRepository.fetchAdvisors(id)
        console.log("advisors : ",advisors)
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

    // async findLists(id: string): Promise<IFriendsLists | null> {
    //     const lists = await this.chatRepository.findUsersConnections(id)
    //     return lists
    // }

    // async getMessages(id: string): Promise<IMessage[] | null> {
    //     const messages = await this.chatRepository.getMessages(id)
    //     return messages
    // }

}