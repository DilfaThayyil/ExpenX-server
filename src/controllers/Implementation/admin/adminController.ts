import { Request, Response } from "express";
import { inject, injectable } from "tsyringe";
import { IAdminController } from "../../Interface/admin/IAdminController";
import { IAdminService } from "../../../services/Interface/admin/IAdminService";
import { HttpStatusCode } from "../../../utils/httpStatusCode";
import { IUserService } from "../../../services/Interface/user/IUserService";
import { ACCESSTOKEN_SECRET } from "../../../config/env";
import jwt from "jsonwebtoken";




@injectable()
export default class AdminController implements IAdminController{
  private adminService: IAdminService
  private userService: IUserService
  
  constructor(
    @inject('IAdminService')adminService:IAdminService,
    @inject('IUserService')userService:IUserService
  ){
    this.adminService = adminService
    this.userService = userService
  }


  async adminLogin(req: Request, res: Response): Promise<Response> {
    try {
      const { email, password } = req.body;
      const isValid = this.adminService.validateCredentials(email, password);
      if (!isValid) {
        return res.status(HttpStatusCode.UNAUTHORIZED).json({ message: "Invalid admin credentials" });
      }
      const token = jwt.sign({ role: "admin" }, ACCESSTOKEN_SECRET as string, {
        expiresIn: "50m",
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

  
  // async adminLogin(req: Request, res: Response): Promise<Response> {
  //   try {
  //     // console.log("req body : ",req.body)
  //     const {email, password } = req.body;
  //     const admin = await this.adminService.adminLogin(email, password);
  //     // console.log("admin-controller : ",admin)
  //     res.cookie('accessToken', admin.accessToken, {
  //       httpOnly: true,  
  //       secure: process.env.NODE_ENV === 'production', 
  //       maxAge: 15 * 60 * 1000, 
  //       sameSite: 'lax',
  //     })
  //     res.cookie('refreshToken', admin.refreshToken, {
  //       httpOnly: true,
  //       secure: process.env.NODE_ENV === 'production',
  //       maxAge: 30 * 24 * 60 * 60 * 1000, 
  //       sameSite: 'lax',
  //     })
  //     return res.status(HttpStatusCode.OK).json({ message: "Admin logged in successfully", admin });
  //   } catch (err) {
  //     const errorMessage = err instanceof Error ? err.message : 'An unexpected error occurred';
  //     return res.status(HttpStatusCode.UNAUTHORIZED).json({ error: errorMessage });
  //   }
  // }

  async fetchUsers(req: Request, res: Response): Promise<Response> {
    try {
      // console.log("controler .....")
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      // console.log("page: ",page)
      const { users, totalPages } = await this.adminService.fetchUsers(page, limit);
      // console.log("users , totalPages : ", users," , ",totalPages)
      return res.status(HttpStatusCode.OK).json({ success: true, data: { users, totalPages } });
    } catch (error) {
      console.error(error)
      return res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({ error: "Internal server error" });
    }
  }
  async fetchAdvisors(req: Request, res: Response): Promise<Response> {
    try {
      // console.log("********controler .....")
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      // console.log("page: ",page)
      const { users, totalPages } = await this.adminService.fetchAdvisors(page, limit);
      // console.log("users , totalPages : ", users," , ",totalPages)
      return res.status(HttpStatusCode.OK).json({ success: true, data: { users, totalPages } });
    } catch (error) {
      console.error(error)
      return res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({ error: "Internal server error" });
    }
  }


  async updateAdmin(req:Request, res:Response):Promise<void>{
    try{
      // console.log("req body : ",req.body)
      const {name,email,password} = req.body
      if(!email || !password){
        res.status(HttpStatusCode.BAD_REQUEST).json({error: 'Email and password are required.'})
      }
      const updatedAdmin = await this.adminService.updateAdmin(name,email,password)
      // console.log("updatedAdmin-contrllr : ",updatedAdmin)
      res.status(HttpStatusCode.OK).json(updatedAdmin)
    }catch(err){
      console.error(err)
    }
  }

  

  async updateUserBlockStatus(req: Request, res: Response): Promise<Response> {
    try {
      const { action, email } = req.body;
      const result = await this.adminService.updateUserBlockStatus(action, email);
      if (result.error) {
        return res.status(HttpStatusCode.BAD_REQUEST).json({ error: result.error });
      }
      return res.status(HttpStatusCode.OK).json({ message: result.message });
    } catch (error) {
      console.error(error)
      return res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({ error: "Internal server error" });
    }
  }

  async updateAdvisorBlockStatus(req:Request, res:Response):Promise<Response>{
    try{
      const {action,email} = req.body
      const result = await this.adminService.updateAdvisorBlockStatus(action,email)
      if(result.error){
        return res.status(HttpStatusCode.BAD_REQUEST).json({error: result.error})
      }
      return res.status(HttpStatusCode.OK).json({message:result.message})
    }catch(error){
      console.error(error)
      return res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({error: "Internal server error"})
    }
  }

  async fetchCategories(req: Request, res: Response): Promise<Response> {
    try {
      // console.log("controler-category")
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      // console.log("page: ",page)
      const { categories, totalPages } = await this.adminService.fetchCategories(page, limit);
      // console.log("categories , totalPages : ", categories," , ",totalPages)
      return res.status(HttpStatusCode.OK).json({ success: true, data: { categories, totalPages } });
    } catch (error) {
      console.error(error)
      return res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({ error: "Internal server error" });
    }
  }

  async addCategory(req: Request, res: Response): Promise<Response> {
    try {
        const { name } = req.body;
        const category = await this.adminService.addCategory(name);
        return res.status(HttpStatusCode.CREATED).json({ success: true, data: { category } });
    } catch (err: any) {
        console.error(err);
        if (err.message === "CATEGORY_EXISTS") {
            return res.status(HttpStatusCode.BAD_REQUEST).json({ success: false, error: "Category already exists" });
        }
        return res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({ success: false, error: "Internal server error" });
    }
}

  async updateCategory(req:Request,res:Response):Promise<Response>{
    try{
      const {id} = req.params
      const {name} = req.body
      // console.log("catgry-update (id , name) : ",id," ",name)
      const updatedCategory = await this.adminService.updateCategory(id,name)
      // console.log("categ-updat-contrll :",updatedCategory)
      return res.status(HttpStatusCode.OK).json({success:true,data:{updatedCategory}})
    }catch(err){
      console.error(err)
      return res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({error: "Internal server error"})
    }
  }

  async deleteCategory(req:Request, res:Response):Promise<Response>{
    try{
      const {id} = req.params
      const category = await this.adminService.deleteCategory(id)
      if(!category){
        return res.status(HttpStatusCode.NOT_FOUND).json({message:"category not found"})
      }
      return res.status(HttpStatusCode.OK).json({message:"category deleted successfully"})
    }catch(err){
      console.error(err)
      return res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({error:"Error deleting category"})
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

  async fetchReports(req:Request, res:Response):Promise<Response>{
    try{
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      console.log("page,limit-controll : ",page,",",limit)
      const reports = await this.adminService.fetchReports(page,limit)
      console.log("fetchReports-control : ",reports)
      return res.status(HttpStatusCode.OK).json({success:true,data:{reports}})
    }catch(err){
      console.error(err)
      return res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({error:"Error fetching reports"})
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
      console.log("data-expnxCatgry-contrll : ",data)
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