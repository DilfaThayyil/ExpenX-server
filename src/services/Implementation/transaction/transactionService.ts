import { inject, injectable } from "tsyringe";
import { ITransactionService } from "../../Interface/transaction/ITransactionService";
import { ITransactionRepository } from "../../../repositories/Interface/ITransactionRepository";
import { ITransaction } from "../../../models/transactionSchema";


@injectable()
export default class TransactionService implements ITransactionService {
    private _transactionRepository: ITransactionRepository

    constructor(@inject('ITransactionRepository') transactionRepository: ITransactionRepository){
        this._transactionRepository = transactionRepository
    }

    async createTransaction(transaction:ITransaction):Promise<ITransaction>{
        return await this._transactionRepository.createTransaction(transaction)
    }

    async getTransactions(userId:string):Promise<ITransaction[]>{
        return await this._transactionRepository.getTransactions(userId)
    }
}