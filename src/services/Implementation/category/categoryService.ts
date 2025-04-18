import { inject, injectable } from "tsyringe";
import { ICategoryRepository } from "../../../repositories/Interface/ICategoryRepository";
import { ICategory } from "../../../models/categorySchema";
import { ICategoryService } from "../../Interface/category/ICategoryService";

@injectable()
export default class CategoryService implements ICategoryService {
    private _categoryRepository: ICategoryRepository
    constructor(@inject('ICategoryRepository') categoryRepository: ICategoryRepository) {
        this._categoryRepository = categoryRepository
    }

    async getCategories(): Promise<ICategory[]> {
        return this._categoryRepository.getAllCategories()
    }

    async fetchCategories(page: number, limit: number,search:string): Promise<{ categories: ICategory[]; totalPages: number }> {
        const { categories, totalCategories } = await this._categoryRepository.fetchCategories(page, limit,search);
        const totalPages = Math.ceil(totalCategories / limit);
        return { categories, totalPages };
    }

    async addCategory(name: string): Promise<ICategory> {
        const existingCategory = await this._categoryRepository.findCategory(name);
        if (existingCategory) {
            throw new Error("CATEGORY_EXISTS");
        }
        const category = await this._categoryRepository.addCategory(name);
        return category;
    }
    
    async updateCategory(id: string, name: string): Promise<ICategory | null> {
        const updatedCategory = await this._categoryRepository.updateCategory(id, name)
        return updatedCategory
    }

    async deleteCategory(id: string): Promise<ICategory | null> {
        const deleteCategory = await this._categoryRepository.deleteCategory(id)
        return deleteCategory
    }
}