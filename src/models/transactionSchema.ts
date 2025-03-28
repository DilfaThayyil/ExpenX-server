import { Schema, model } from 'mongoose';

export interface ITransaction {
    userId: string;
    walletId: string;
    type: 'credit' | 'debit';
    amount: number;
    status: 'pending' | 'completed' | 'failed';
    description?: string;
    createdAt?: Date;
    updatedAt?: Date;
}

const TransactionSchema = new Schema<ITransaction>({
    userId: { type: String },
    walletId: { type: String },
    type: { type: String, enum: ['credit', 'debit']},
    amount: { type: Number },
    status: { type: String, enum: ['pending', 'completed', 'failed'], default: 'completed' },
    description: { type: String }
}, { timestamps: true });

export default model<ITransaction>('Transaction', TransactionSchema);
