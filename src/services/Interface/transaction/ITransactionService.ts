import { ITransaction } from "../../../models/transactionSchema";

export interface ITransactionService{
    createTransaction(transaction:ITransaction):Promise<ITransaction>
}