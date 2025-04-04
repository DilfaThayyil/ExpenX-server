import { inject, injectable } from "tsyringe";
import { ITransactionService } from "../../Interface/transaction/ITransactionService";
import { ITransactionRepository } from "../../../repositories/Interface/ITransactionRepository";
import { ITransaction } from "../../../models/transactionSchema";


@injectable()
export default class TransactionService implements ITransactionService {
    private transactionRepository: ITransactionRepository

    constructor(@inject('ITransactionRepository') transactionRepository: ITransactionRepository){
        this.transactionRepository = transactionRepository
    }

    async createTransaction(transaction:ITransaction):Promise<ITransaction>{
        return await this.transactionRepository.createTransaction(transaction)
    }

    async getTransactions(clientId:string):Promise<ITransaction[]>{
        return await this.transactionRepository.getTransactions(clientId)
    }
}