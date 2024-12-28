import { Request,Response } from "express";


export default interface IUserController{
    register(req:Request,res:Response):Promise<Response>
}