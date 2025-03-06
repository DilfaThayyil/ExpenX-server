import categorySchema, { ICategory } from "../../models/categorySchema";
import { ICategoryRepository } from "../Interface/ICategoryRepository";

export class CategoryRepository implements ICategoryRepository{

    async fetchCategories(page: number, limit: number): Promise<{ categories: ICategory[]; totalCategories: number }> {
        console.log("repo-category...")
        const skip = (page - 1) * limit;
        const [categories, totalCategories] = await Promise.all([
            categorySchema.find().skip(skip).limit(limit),
            categorySchema.countDocuments(),
        ]);
        console.log("skip :", skip)
        return { categories, totalCategories };
    }

    async addCategory(name:string):Promise<ICategory>{
        console.log("addCateg-repo...")
        return await categorySchema.create({name})
    }

    async updateCategory(id:string,name:string):Promise<ICategory | null>{
        console.log("updateCategory-repo... ")
        return await categorySchema.findByIdAndUpdate(id,{name},{new:true})
    }

    async deleteCategory(id:string):Promise<ICategory | null>{
        console.log("deleteCategory-repo...")
        return await categorySchema.findByIdAndDelete(id)
    }

    async findCategory(name:string):Promise<ICategory | null>{
        console.log("findingCateg...")
        return await categorySchema.findOne({name:name})
    }

    async getCategories():Promise<ICategory[]>{
        return await categorySchema.find()
    }
}