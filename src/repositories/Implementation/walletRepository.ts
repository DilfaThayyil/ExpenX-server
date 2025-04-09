import { Types } from "mongoose";
import walletSchema, { IWallet } from "../../models/walletSchema";
import { IWalletRepository } from "../Interface/IWalletRepository";
import { BaseRepository } from "./baseRepository";

export default class WalletRepository extends BaseRepository<IWallet> implements IWalletRepository {

    constructor() {
        super(walletSchema)
    }

    async updateWallet(userId: string, amount: number): Promise<IWallet | null> {
        const wallet = await this.model.findOne({ userId });
        if (!wallet) {
            return await this.create({ userId, balance: amount });
        }
        const walletId = wallet._id instanceof Types.ObjectId ? wallet._id.toString() : String(wallet._id);
        return await this.update(walletId, { balance: wallet.balance + amount });
    }

    async getWallet(userId: string): Promise<IWallet | null> {
        const wallet = await this.model.findOne({userId})
        return wallet
    }


}