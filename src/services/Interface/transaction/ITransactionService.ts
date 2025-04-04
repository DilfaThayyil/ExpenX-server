import { ITransaction } from "../../../models/transactionSchema";

export interface ITransactionService{
    createTransaction(transaction:ITransaction):Promise<ITransaction>
    getTransactions(userId:string):Promise<ITransaction[]>
}