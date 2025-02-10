import { inject, injectable } from "tsyringe";
import { IChatRepository } from "../../../repositories/Interface/IChatRepository";
import { IChatService } from "../../Interface/chat/IChatService";
import {IMessage} from "../../../models/messageSchema";



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
        const messages = await this.chatRepository.fetchMessages(senderId, receiverId)
        return messages
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