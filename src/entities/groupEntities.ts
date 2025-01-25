// import IUser from "./userEntities"

// export default interface IGroup{
//     name: string
//     description: string
//     members: IUser[]
//     createdBy: string
//     createdAt: Date
//     updatedAt: Date
// }

export default interface IGroup {
    name: string;
    members: string[];
    splitMethod: string;
  }
  