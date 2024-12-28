
import { User } from "../../models/userSchema"
export interface user{
    create(user:User):Promise<user>,
    findEmail(email:string):Promise<string>|null
}