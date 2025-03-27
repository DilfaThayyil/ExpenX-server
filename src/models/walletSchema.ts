import { Document, Types } from 'mongoose';
import { Schema, model} from 'mongoose';

export interface IWallet extends Document{
    userId: string; 
    balance: number;  
    createdAt?: Date;
    updatedAt?: Date;
}
const WalletSchema: Schema = new Schema({
    userId: { type: String },
    balance: { type: Number, default: 0 }
}, { timestamps: true });

export default model<IWallet>('Wallet', WalletSchema);
