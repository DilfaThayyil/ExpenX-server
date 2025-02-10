import { IFriendsLists } from "../../entities/friendsEntities"
import {IMessage} from "../../models/messageSchema";



export interface IChatRepository{
    sendMessage(message: IMessage): Promise<IMessage>
    fetchMessages(senderId: string, receiverId: string): Promise<IMessage[]>

    
    //not below methods . so just keep it like that
    findUsersConnections(id:string):Promise<IFriendsLists|null>
    getMessages(id:string):Promise<IMessage[]|null>
    saveMessage(senderId:string,receiverId:string,message:string,initial?:boolean,messageId?:string):Promise<any|null>
    saveImage(file: string, senderId: string, receiverId: string, messageId: string): Promise<any>
}