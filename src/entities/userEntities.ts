export default interface IUser{
    id: string;
    username: string
    email: string
    password: string;
    role:string
    isBlocked: boolean;
    isAdmin: boolean;
    profilePic:string;
    refreshToken: string;
    phone: string;
    description: string;
    country: string;

  }