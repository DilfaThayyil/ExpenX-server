  import { Model } from 'mongoose';
import {IBaseRepository} from '../Interface/IBaseRepository';

  export class BaseRepository<T> implements IBaseRepository<T> {
    protected model: Model<T>;
  
    constructor(model: Model<T>) {
      this.model = model;
    }

    async create(data: Partial<T>): Promise<T> {
        const createdData = await this.model.create(data);
        return createdData;
    }

    async findById(id: string): Promise<T | null> {
        return this.model.findById(id).exec();
    }

    async findAll(filter: any = {}): Promise<T[]> {
        return this.model.find(filter).exec();
    }

    async update(id: string, updateData: Partial<T>): Promise<T | null> {
        return this.model.findByIdAndUpdate(id, updateData, { new: true }).exec();
    }

    async delete(id: string): Promise<boolean> {
        const result = await this.model.findByIdAndDelete(id).exec();
        return result !== null;
    }
}
