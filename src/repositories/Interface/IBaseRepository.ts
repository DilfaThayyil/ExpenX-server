import { Model, Document, Types } from 'mongoose'

export interface IBaseRepository<T>{
    create(data:Partial<T>):Promise<T>
    findById(id:string):Promise<T | null>
    findAll(filter:any):Promise<T[]>
    update(id:string,updateData:Partial<T>):Promise<T | null>
    delete(id:string):Promise<boolean>
}