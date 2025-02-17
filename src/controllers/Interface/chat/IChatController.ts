import { Request, Response } from "express"

export interface IChatController{
    sendMessage(req: Request, res: Response):Promise<Response>
    fetchMessages(req: Request, res: Response):Promise<Response>
    fetchUsers(req: Request, res: Response): Promise<Response>
    fetchAdvisors(req: Request, res: Response): Promise<Response>
    fetchChats(req: Request, res: Response): Promise<Response>
    fetchAllChats(req: Request, res: Response): Promise<Response>
    createChat(req: Request, res: Response): Promise<Response>
    // findMyFriends(req: Request, res: Response): Promise<void>
    // getMessage(req: Request, res: Response):Promise<void>
    // postImage(req: Request, res: Response):Promise<void>
}