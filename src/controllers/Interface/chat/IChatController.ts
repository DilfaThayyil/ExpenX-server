import { Request, Response } from "express"

export interface IChatController{
    sendMessage(req: Request, res: Response):Promise<Response>
    fetchMessages(req: Request, res: Response):Promise<Response>
    // findMyFriends(req: Request, res: Response): Promise<void>
    // getMessage(req: Request, res: Response):Promise<void>
    // postImage(req: Request, res: Response):Promise<void>
}