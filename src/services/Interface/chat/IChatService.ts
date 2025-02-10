import {IMessage} from "../../../models/messageSchema";


export interface IChatService{
    sendMessage(message:IMessage):Promise<IMessage>
    fetchMessages(senderId:string,receiverId:string):Promise<IMessage[]>

    // findLists(id:string):Promise<IFriendsLists|null>
    // getMessages(id:string):Promise<IMessage[]|null>
}