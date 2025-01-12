export default interface IUser{
    username: string
    email: string
    password: string;
    role:string
    isBlocked: boolean;
    isAdmin: boolean;
    profilePic:string;
    refreshToken: string;
  }  