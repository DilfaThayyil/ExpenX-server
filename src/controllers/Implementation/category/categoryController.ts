import { Request, Response } from 'express'
import { inject, injectable } from "tsyringe";
import { ICategoryController } from "../../Interface/category/ICategoryController";
import { HttpStatusCode } from '../../../utils/httpStatusCode';
import { ICategoryService } from '../../../services/Interface/category/ICategoryService';
import { messageConstants } from '../../../utils/messageConstants';

@injectable()
export default class CategoryController implements ICategoryController {
  private _categoryService: ICategoryService
  constructor(@inject('ICategoryService') categoryService: ICategoryService) {
    this._categoryService = categoryService;
  }

  async getCategories(req: Request, res: Response): Promise<Response> {
    try {
      const categories = await this._categoryService.getCategories()
      return res.status(HttpStatusCode.OK).json(categories)
    } catch (err) {
      console.error(err)
      return res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({ messag: 'Error fetching categories' })
    }
  }

  async fetchCategories(req: Request, res: Response): Promise<Response> {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      const { categories, totalPages } = await this._categoryService.fetchCategories(page, limit);
      return res.status(HttpStatusCode.OK).json({ success: true, data: { categories, totalPages } });
    } catch (error) {
      console.error(error)
      return res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({ error: messageConstants.INTERNAL_ERROR    });
    }
  }

  async addCategory(req: Request, res: Response): Promise<Response> {
    try {
        const { name } = req.body;
        const category = await this._categoryService.addCategory(name);
        return res.status(HttpStatusCode.CREATED).json({ success: true, data: { category } });
    } catch (err: any) {
        console.error(err);
        if (err.message === "CATEGORY_EXISTS") {
            return res.status(HttpStatusCode.BAD_REQUEST).json({ success: false, error: "Category already exists" });
        }
        return res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({ success: false, error: messageConstants.INTERNAL_ERROR    });
    }
}

  async updateCategory(req:Request,res:Response):Promise<Response>{
    try{
      const {id} = req.params
      const {name} = req.body
      const updatedCategory = await this._categoryService.updateCategory(id,name)
      return res.status(HttpStatusCode.OK).json({success:true,data:{updatedCategory}})
    }catch(err){
      console.error(err)
      return res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({error: messageConstants.INTERNAL_ERROR   })
    }
  }

  async deleteCategory(req:Request, res:Response):Promise<Response>{
    try{
      const {id} = req.params
      const category = await this._categoryService.deleteCategory(id)
      if(!category){
        return res.status(HttpStatusCode.NOT_FOUND).json({message:"category not found"})
      }
      return res.status(HttpStatusCode.OK).json({message:"category deleted successfully"})
    }catch(err){
      console.error(err)
      return res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({error:"Error deleting category"})
    }
  }
}