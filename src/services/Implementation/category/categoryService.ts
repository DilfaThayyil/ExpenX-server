import { inject, injectable } from "tsyringe";
import { ICategoryRepository } from "../../../repositories/Interface/ICategoryRepository";
import { ICategory } from "../../../models/categorySchema";
import { ICategoryService } from "../../Interface/category/ICategoryService";

@injectable()
export default class CategoryService implements ICategoryService {
    private categoryRepository: ICategoryRepository
    constructor(@inject('ICategoryRepository') categoryRepository: ICategoryRepository) {
        this.categoryRepository = categoryRepository
    }

    async getCategories(): Promise<ICategory[]> {
        return this.categoryRepository.getAllCategories()
    }

    async fetchCategories(page: number, limit: number): Promise<{ categories: ICategory[]; totalPages: number }> {
        console.log("service-category..")
        const { categories, totalCategories } = await this.categoryRepository.fetchCategories(page, limit);
        const totalPages = Math.ceil(totalCategories / limit);
        return { categories, totalPages };
    }

    async addCategory(name: string): Promise<ICategory> {
        const existingCategory = await this.categoryRepository.findCategory(name);
        if (existingCategory) {
            throw new Error("CATEGORY_EXISTS");
        }
        const category = await this.categoryRepository.addCategory(name);
        return category;
    }
    
    async updateCategory(id: string, name: string): Promise<ICategory | null> {
        const updatedCategory = await this.categoryRepository.updateCategory(id, name)
        console.log("updtCategry: ", updatedCategory)
        return updatedCategory
    }

    async deleteCategory(id: string): Promise<ICategory | null> {
        const deleteCategory = await this.categoryRepository.deleteCategory(id)
        console.log("deleteCategory-serv : ", deleteCategory)
        return deleteCategory
    }
}