import IAdvisor from "../../../entities/advisorEntities";
import IUser from "../../../entities/userEntities";
import { IChat } from "../../../models/chatSchema";
import {IMessage} from "../../../models/messageSchema";


export interface IChatService{
    sendMessage(message:IMessage):Promise<IMessage>
    fetchMessages(senderId:string,receiverId:string):Promise<IMessage[]>
    fetchUsers(id:string):Promise<IUser[]>
    fetchAdvisors(id:string):Promise<IAdvisor[]>
    createChat(chat:IChat):Promise<IChat>
    getUserChats(id:string):Promise<IChat[]>
    getAllChats():Promise<IChat[]>
    // findLists(id:string):Promise<IFriendsLists|null>
    // getMessages(id:string):Promise<IMessage[]|null>
}