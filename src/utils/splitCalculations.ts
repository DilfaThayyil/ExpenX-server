import { Types } from "mongoose";
import { Split } from "../dto/expenseDTO";


export const calculateSplits = (
    totalAmount: number,
    splitMethod: "equal" | "percentage" | "custom",
    members: Types.ObjectId[],
    customAmounts?: Record<string, number>
): Split[] => {
    if (splitMethod === "equal") {
        const amountPerPerson = totalAmount / members.length;
        return members.map((memberId) => ({
            userId: new Types.ObjectId(memberId),
            amountOwed: amountPerPerson,
            status: "pending",
        }));
    }

    if (splitMethod === "percentage" && customAmounts) {
        return members.map((memberId) => {
            const percentage = customAmounts[memberId.toString()] || 0;
            const amountOwed = (totalAmount * percentage) / 100;
            return {
                userId: new Types.ObjectId(memberId),
                amountOwed,
                percentage,
                status: "pending",
            };
        });
    }

    if (splitMethod === "custom" && customAmounts) {
        return members.map((memberId) => ({
            userId: new Types.ObjectId(memberId),
            amountOwed: customAmounts[memberId.toString()] || 0,
            customAmount: customAmounts[memberId.toString()] || 0,
            status: "pending",
        }));
    }

    throw new Error("Invalid split method or missing customAmounts data");
};
