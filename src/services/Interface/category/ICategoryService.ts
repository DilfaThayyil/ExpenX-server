import { ICategory } from "../../../models/categorySchema";

export interface ICategoryService{
    getCategories():Promise<any[]>
    fetchCategories(page: number,limit: number): Promise<{ categories: ICategory[]; totalPages: number}>
    addCategory(name:string):Promise<ICategory>
    updateCategory(id:string,name:string):Promise<ICategory | null>
    deleteCategory(id:string):Promise<ICategory | null>
  
}