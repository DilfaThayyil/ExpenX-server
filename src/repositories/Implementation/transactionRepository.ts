import transactionSchema, { ITransaction } from "../../models/transactionSchema";
import { ITransactionRepository } from "../Interface/ITransactionRepository";
import { BaseRepository } from "./baseRepository";

export default class TransactionRepository extends BaseRepository<ITransaction> implements ITransactionRepository {
    constructor() {
        super(transactionSchema)
    }

    async createTransaction(transaction: ITransaction): Promise<ITransaction> {
        return await this.create(transaction)
    }

    async getTransactions(clientId: string): Promise<ITransaction[]> {
        const transactions = await this.model.find({ userId: clientId }).exec();
        console.log("transctions-repo ; ",transactions)
        return transactions
    }
}