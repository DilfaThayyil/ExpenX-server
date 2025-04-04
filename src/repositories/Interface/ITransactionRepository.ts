import { ITransaction } from "../../models/transactionSchema";

export interface ITransactionRepository{
    createTransaction(transaction:ITransaction):Promise<ITransaction>
    getTransactions(userId:string):Promise<ITransaction[]>
}