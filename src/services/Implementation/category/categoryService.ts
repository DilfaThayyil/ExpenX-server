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
}