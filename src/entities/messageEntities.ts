export interface IMessage{
    senderId:string
    receiverId:string
    text:string
    timestamp?:Date
    status: 'sent' | 'delivered' | 'read';
    messageId?:string
}