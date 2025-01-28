import { Request, Response } from "express";
import { inject, injectable } from "tsyringe";
import { IAdminController } from "../../Interface/admin/IAdminController";
import { IAdminService } from "../../../services/Interface/admin/IAdminService";
import { HttpStatusCode } from "../../../utils/httpStatusCode";



@injectable()
export default class AdminController implements IAdminController{
  private adminService: IAdminService
  
  constructor(@inject('IAdminService')adminService:IAdminService){
    this.adminService = adminService
  }

  
  async adminLogin(req: Request, res: Response): Promise<Response> {
    try {
      console.log("req body : ",req.body)
      const {username, email, password } = req.body;
      const admin = await this.adminService.adminLogin(username, email, password);
      console.log("admin-controller : ",admin)
      res.cookie('accessToken', admin.accessToken, {
        httpOnly: true,  
        secure: process.env.NODE_ENV === 'production', 
        maxAge: 15 * 60 * 1000, 
        sameSite: 'lax',
      })
      res.cookie('refreshToken', admin.refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        maxAge: 30 * 24 * 60 * 60 * 1000, 
        sameSite: 'lax',
      })
      return res.status(HttpStatusCode.OK).json({ message: "Admin logged in successfully", admin });
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An unexpected error occurred';
      return res.status(HttpStatusCode.UNAUTHORIZED).json({ error: errorMessage });
    }
  }

  async fetchUsers(req: Request, res: Response): Promise<Response> {
    try {
      console.log("controler .....")
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      console.log("page: ",page)
      const { users, totalPages } = await this.adminService.fetchUsers(page, limit);
      console.log("users , totalPages : ", users," , ",totalPages)
      return res.status(HttpStatusCode.OK).json({ success: true, data: { users, totalPages } });
    } catch (error) {
      console.error(error)
      return res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({ error: "Internal server error" });
    }
  }
  async fetchAdvisors(req: Request, res: Response): Promise<Response> {
    try {
      console.log("********controler .....")
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      console.log("page: ",page)
      const { users, totalPages } = await this.adminService.fetchAdvisors(page, limit);
      console.log("users , totalPages : ", users," , ",totalPages)
      return res.status(HttpStatusCode.OK).json({ success: true, data: { users, totalPages } });
    } catch (error) {
      console.error(error)
      return res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({ error: "Internal server error" });
    }
  }


  async updateAdmin(req:Request, res:Response):Promise<void>{
    try{
      console.log("req body : ",req.body)
      const {name,email,password} = req.body
      if(!email || !password){
        res.status(HttpStatusCode.BAD_REQUEST).json({error: 'Email and password are required.'})
      }
      const updatedAdmin = await this.adminService.updateAdmin(name,email,password)
      console.log("updatedAdmin-contrllr : ",updatedAdmin)
      res.status(HttpStatusCode.OK).json(updatedAdmin)
    }catch(err){
      console.error(err)
    }
  }

  

  // async updateUserStatus(req: Request, res: Response): Promise<Response> {
  //   try {
  //     const { action, email } = req.body;
  //     const result = await this.adminService.updateUserStatus(action, email);
  //     if (result.error) {
  //       return res.status(HttpStatusCode.BAD_REQUEST).json({ error: result.error });
  //     }
  //     return res.status(HttpStatusCode.OK).json({ message: result.message });
  //   } catch (error) {
  //     return res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({ error: "Internal server error" });
  //   }
  // }

  // async getDashboardData(req: Request, res: Response): Promise<Response> {
  //   try {
  //     const dashboard = await this.adminService.getDashboardData();
  //     return res.status(HttpStatusCode.OK).json({ dashboard });
  //   } catch (error) {
  //     return res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({ error: "Internal server error" });
  //   }
  // }
}