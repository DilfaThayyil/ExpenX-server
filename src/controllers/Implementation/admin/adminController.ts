import { Request, Response } from "express";
import { inject, injectable } from "tsyringe";
import { IAdminController } from "../../Interface/admin/IAdminController";
import { IAdminService } from "../../../services/Interface/admin/IAdminService";
import { HttpStatusCode } from "../../../utils/httpStatusCode";
import { ACCESSTOKEN_SECRET } from "../../../config/env";
import jwt from "jsonwebtoken";




@injectable()
export default class AdminController implements IAdminController{
  private adminService: IAdminService
  
  constructor(@inject('IAdminService')adminService:IAdminService){
    this.adminService = adminService
  }


  async adminLogin(req: Request, res: Response): Promise<Response> {
    try {
      const { email, password } = req.body;
      const isValid = this.adminService.validateCredentials(email, password);
      if (!isValid) {
        return res.status(HttpStatusCode.UNAUTHORIZED).json({ message: "Invalid admin credentials" });
      }
      const token = jwt.sign({ role: "admin" }, ACCESSTOKEN_SECRET as string, {
        expiresIn: "10m",
      });
      res.cookie("adminToken", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
      });
      return res.status(HttpStatusCode.OK).json({ message: "Admin logged in successfully",token });
    } catch (error) {
      return res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({ message: "Server error" });
    }
  }

 

  async updateAdmin(req:Request, res:Response):Promise<void>{
    try{
      const {name,email,password} = req.body
      if(!email || !password){
        res.status(HttpStatusCode.BAD_REQUEST).json({error: 'Email and password are required.'})
      }
      const updatedAdmin = await this.adminService.updateAdmin(name,email,password)
      res.status(HttpStatusCode.OK).json(updatedAdmin)
    }catch(err){
      console.error(err)
    }
  }


  

  async adminLogout(req: Request, res: Response): Promise<Response> {
    try{
      res.clearCookie("adminToken");
      return res.status(HttpStatusCode.OK).json({ message: "Admin logged out successfully" });
    }catch(err){
      console.error(err)
      return res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({error:"Error logging out the admin"})
    }
  }



  async getMonthlyTrends(req:Request,res:Response):Promise<Response>{
    try{
      const months = req.query.months ? parseInt(req.query.months as string) : 6
      const data = await this.adminService.getMonthlyTrends(months)
      return res.status(HttpStatusCode.OK).json(data)
    }catch(err){
      console.error(err)
      return res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({error:'Failed to get monthly trends'})
    }
  }

  async getExpenseCategories(req:Request,res:Response):Promise<Response>{
    try{
      const data = await this.adminService.getExpenseCategories()
      return res.status(HttpStatusCode.OK).json(data)
    }catch(err){
      console.error(err)
      return res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({error:'Failed to retrieve expense categories'})
    }
  }

  async getDashboardStats(req:Request,res:Response):Promise<Response>{
    try{
      const data = await this.adminService.getDashboardStats()
      return res.status(HttpStatusCode.OK).json(data)
    }catch(err){
      console.error(err)
      return res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({error:'Failed to retrieve dashboard stats'})
    }
  }

  async getUserGrowth(req:Request,res:Response):Promise<Response>{
    try{
      const data = await this.adminService.getUserGrowth()
      return res.status(HttpStatusCode.OK).json(data)
    }catch(err){
      console.error(err)
      return res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({error:'Failed to retrieve user growth stats'})
    }
  }
}