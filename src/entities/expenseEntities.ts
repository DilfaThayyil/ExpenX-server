export default interface IExpense{
    userId:string;
    title:string;
    amount:number;
    category:string;
    date:Date;
    createdAt:Date;
    updatedAt:Date;
}