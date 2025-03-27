import { IWallet } from "../../../models/walletSchema";

export interface IWalletService{
    updateWallet(userId:string,amount:number):Promise<IWallet | null>
}