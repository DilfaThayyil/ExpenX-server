import { inject, injectable } from "tsyringe";
import { IWalletRepository } from "../../../repositories/Interface/IWalletRepository";
import { IWalletService } from "../../Interface/wallet/IWalletService";
import { IWallet } from "../../../models/walletSchema";

@injectable()
export default class WalletService implements IWalletService{

    private _walletRepository: IWalletRepository

    constructor(@inject('IWalletRepository') walletRepository: IWalletRepository){
        this._walletRepository = walletRepository
    }

    async updateWallet(userId:string,amount:number):Promise<IWallet | null>{
        const updatedWallet = await this._walletRepository.updateWallet(userId,amount)
        return updatedWallet
    }

    async getWallet(userId: string): Promise<IWallet | null> {
        const wallet = await this._walletRepository.getWallet(userId)
        return wallet
    }
}