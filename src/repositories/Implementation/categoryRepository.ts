import categorySchema, { ICategory } from "../../models/categorySchema";
import { ICategoryRepository } from "../Interface/ICategoryRepository";
import { BaseRepository } from "./baseRepository";

export default class CategoryRepository extends BaseRepository<ICategory> implements ICategoryRepository {

    constructor() {
        super(categorySchema)
    }

    async fetchCategories(page: number, limit: number, search: string): Promise<{ categories: ICategory[]; totalCategories: number }> {
        console.log("repo-category...");
        const skip = (page - 1) * limit;
        const query: any = {};
        if (search) {
          const searchRegex = new RegExp(search, "i"); 
          query.name = { $regex: searchRegex };
        }
        const [categories, totalCategories] = await Promise.all([
          this.model.find(query).sort({ createdAt: -1 }).skip(skip).limit(limit),
          this.model.countDocuments(query),
        ]);
        return { categories, totalCategories };
      }
      

    async addCategory(name: string): Promise<ICategory> {
        console.log("addCateg-repo...")
        return this.create({ name })
    }

    async updateCategory(id: string, name: string): Promise<ICategory | null> {
        console.log("updateCategory-repo... ")
        return this.update(id, { name });
    }

    async deleteCategory(id: string): Promise<ICategory | null> {
        console.log("deleteCategory-repo...")
        return this.model.findByIdAndDelete(id)
    }

    async findCategory(name: string): Promise<ICategory | null> {
        console.log("findingCateg...")
        return this.model.findOne({ name: name })
    }

    async getAllCategories(): Promise<ICategory[]> {
        return this.model.find()
    }
}