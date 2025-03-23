import { Request, Response } from 'express'
import { inject, injectable } from "tsyringe";
import { ICategoryController } from "../../Interface/category/ICategoryController";
import { HttpStatusCode } from '../../../utils/httpStatusCode';
import { ICategoryService } from '../../../services/Interface/category/ICategoryService';

@injectable()
export default class CategoryController implements ICategoryController {
  private categoryService: ICategoryService
  constructor(@inject('ICategoryService') categoryService: ICategoryService) {
    this.categoryService = categoryService;
  }

  async getCategories(req: Request, res: Response): Promise<Response> {
    try {
      const categories = await this.categoryService.getCategories()
      return res.status(HttpStatusCode.OK).json(categories)
    } catch (err) {
      console.error(err)
      return res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({ messag: 'Error fetching categories' })
    }
  }
}