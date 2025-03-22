import IAdvisor from "../../entities/advisorEntities";
import { IFriendsLists } from "../../entities/friendsEntities"
import IUser from "../../entities/userEntities";
import { IChat } from "../../models/chatSchema";
import { IMessage } from "../../models/messageSchema";



export interface IChatRepository {
    sendMessage(message: IMessage): Promise<IMessage>
    fetchMessages(senderId: string, receiverId: string): Promise<IMessage[]>
    fetchUsers(id: string): Promise<IUser[]>
    fetchAdvisors(id: string): Promise<IAdvisor[]>
    getChatByUsers(senderId: string, receiverId: string): Promise<IChat | null>
    createChat(chatData: Partial<IChat>): Promise<IChat>
    getUserChats(id: string): Promise<IChat[]>
    getAllChats(): Promise<IChat[]>



    //not below methods . so just keep it like that
    findUsersConnections(id: string): Promise<IFriendsLists | null>
    getMessages(id: string): Promise<IMessage[] | null>
    saveMessage(senderId: string, receiverId: string, message: string, initial?: boolean, messageId?: string): Promise<any | null>
    // saveImage(file: string, senderId: string, receiverId: string, messageId: string): Promise<any>
}