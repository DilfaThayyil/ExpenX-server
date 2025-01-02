import UserRepository from "../repositories/userRepository";
import IUser from "../entities/userEntities";

export default class CheckuserExists{
    private userepository:UserRepository;

    constructor(userRepository:UserRepository){
        this.userepository=userRepository
    }

    async execute(email:string):Promise<IUser|undefined>{
        const user = await this.userepository.findUserByEmail(email)
        return user||undefined
    }

}