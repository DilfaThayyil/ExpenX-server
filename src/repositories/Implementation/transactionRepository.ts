import transactionSchema, { ITransaction } from "../../models/transactionSchema";
import { ITransactionRepository } from "../Interface/ITransactionRepository";
import { BaseRepository } from "./baseRepository";

export default class TransactionRepository extends BaseRepository<ITransaction> implements ITransactionRepository{
    constructor(){
        super(transactionSchema)
    }

    async createTransaction(transaction:ITransaction):Promise<ITransaction>{
        return await this.create(transaction)
    }
}