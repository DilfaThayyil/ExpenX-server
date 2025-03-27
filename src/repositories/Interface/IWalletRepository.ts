import { IWallet } from "../../models/walletSchema";

export interface IWalletRepository{
    updateWallet(userId:string,amount:number):Promise<IWallet | null>
}