import IUser from "./userEntities"

export default interface IGroup{
    name: string
    description: string
    members: IUser[]
    createdBy: string
    createdAt: Date
    updatedAt: Date
}