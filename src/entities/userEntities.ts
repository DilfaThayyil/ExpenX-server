
export default interface IUser{
    username: string
    email: string
    password: string;
    isBlocked: boolean;
    isAdmin: boolean;
    refreshToken: string
  }  