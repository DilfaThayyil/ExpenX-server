import expenseSchema from "../../models/expenseSchema";
import paymentSchema from "../../models/paymentSchema";
import userSchema from "../../models/userSchema";
import { IAdminRepository } from "../Interface/IAdminRepository";

export interface MonthlyData {
    month: string;
    expenses: number;
    income: number;
    users: number;
}

export interface CategoryData {
    category: string;
    amount: number;
}

export interface DashboardStats {
    totalUsers: number;
    totalPayments: number;
    averageExpense: number;
    totalRevenue: number;
}

export interface UserGrowthData {
    month: string;
    count: number;
}

export default class AdminRepository implements IAdminRepository {
    async getMonthlyTrends(startDate?: Date, endDate?: Date): Promise<MonthlyData[]> {
        const dateFilter: any = {};
        if (startDate) dateFilter["date"] = { $gte: startDate };
        if (endDate) dateFilter["date"] = { ...dateFilter["date"], $lte: endDate };

        const monthlyExpenses = await expenseSchema.aggregate([
            { $match: dateFilter },
            {
                $group: {
                    _id: { $dateToString: { format: "%Y-%m", date: "$date" } },
                    expenses: { $sum: "$amount" },
                },
            },
            { $sort: { _id: 1 } },
        ]);

        const monthlyIncome = await paymentSchema.aggregate([
            { $match: { ...dateFilter, status: "completed" } },
            {
                $group: {
                    _id: { $dateToString: { format: "%Y-%m", date: "$createdAt" } },
                    income: { $sum: "$amount" },
                },
            },
            { $sort: { _id: 1 } },
        ]);

        const monthlyUsers = await userSchema.aggregate([
            { $match: dateFilter },
            {
                $group: {
                    _id: { $dateToString: { format: "%Y-%m", date: "$createdAt" } },
                    users: { $sum: 1 },
                },
            },
            { $sort: { _id: 1 } },
        ]);

        // Merge all data
        const monthsMap = new Map();

        monthlyExpenses.forEach(({ _id, expenses }) => {
            const monthName = new Date(_id + "-01").toLocaleString("default", { month: "short" });
            monthsMap.set(_id, { month: monthName, expenses: Math.round(expenses), income: 0, users: 0 });
        });

        monthlyIncome.forEach(({ _id, income }) => {
            if (monthsMap.has(_id)) {
                monthsMap.get(_id)!.income = Math.round(income);
            } else {
                const monthName = new Date(_id + "-01").toLocaleString("default", { month: "short" });
                monthsMap.set(_id, { month: monthName, expenses: 0, income: Math.round(income), users: 0 });
            }
        });

        monthlyUsers.forEach(({ _id, users }) => {
            if (monthsMap.has(_id)) {
                monthsMap.get(_id)!.users = users;
            } else {
                const monthName = new Date(_id + "-01").toLocaleString("default", { month: "short" });
                monthsMap.set(_id, { month: monthName, expenses: 0, income: 0, users });
            }
        });

        return Array.from(monthsMap.entries())
            .sort(([keyA], [keyB]) => keyA.localeCompare(keyB))
            .map(([_, value]) => value);
    }

    async getExpenseCategories(): Promise<CategoryData[]> {
        const expenses = await expenseSchema.aggregate([
            {
                $group: {
                    _id: "$category", amount: { $sum: "$amount" }
                }
            },
            {
                $project: {
                    _id: 0,
                    category: "$_id",
                    amount: 1
                }
            }
        ]);

        return expenses;
    }



    async getDashboardStats(): Promise<DashboardStats> {
        const totalUsers = await userSchema.countDocuments();
        const totalPayments = await paymentSchema.countDocuments({ status: "completed" });

        const expenseStats = await expenseSchema.aggregate([
            {
                $group: {
                    _id: null,
                    avgExpense: { $avg: "$amount" },
                    totalExpense: { $sum: "$amount" },
                },
            },
        ]);

        const revenueStats = await paymentSchema.aggregate([
            { $match: { status: "completed" } },
            {
                $group: {
                    _id: null,
                    totalRevenue: { $sum: "$amount" },
                },
            },
        ]);

        return {
            totalUsers,
            totalPayments,
            averageExpense: expenseStats.length > 0 ? Math.round(expenseStats[0].avgExpense) : 0,
            totalRevenue: revenueStats.length > 0 ? Math.round(revenueStats[0].totalRevenue) : 0,
        };

    }

    async getUserGrowth(): Promise<UserGrowthData[]> {
        const userGrowth = await userSchema.aggregate([
            {
                $group: {
                    _id: {
                        year: { $year: "$createdAt" },
                        month: { $month: "$createdAt" },
                    },
                    count: { $sum: 1 },
                },
            },
            { $sort: { "_id.year": 1, "_id.month": 1 } },
        ]);

        return userGrowth.map((data) => {
            const year = data._id?.year ?? 0;
            const month = data._id?.month ?? 1;

            return {
                month: `${year}-${month.toString().padStart(2, "0")}`,
                count: data.count ?? 0,
            };
        });
    }

}