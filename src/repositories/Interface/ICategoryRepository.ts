import { ICategory } from "../../models/categorySchema";

export interface ICategoryRepository{
    fetchCategories(page: number, limit: number): Promise<{ categories: ICategory[]; totalCategories: number }>;
    addCategory(name:string):Promise<ICategory>
    updateCategory(id:string,name:string):Promise<ICategory | null>
    deleteCategory(id:string):Promise<ICategory | null>
    findCategory(name:string):Promise<ICategory | null>
    getAllCategories():Promise<ICategory[]>
}