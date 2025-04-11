import { IUserRepository } from '../Interface/IUserRepository';
import userSchema from '../../models/userSchema';
import expenseSchema from '../../models/expenseSchema';
import IUser from '../../entities/userEntities';
import { Types } from 'mongoose';
import paymentSchema from '../../models/paymentSchema';
import { BaseRepository } from './baseRepository';
import { CATEGORY_COLORS, DashboardData } from '../../dto/userDTO';



export default class UserRepository extends BaseRepository<IUser> implements IUserRepository {
    constructor() {
        super(userSchema);
    }

    async findUserByEmail(email: string): Promise<any> {
        return await userSchema.findOne({ email });
    }

    async createUser(userData: any): Promise<any> {
        return await userSchema.create(userData);
    }
    async updateUser(userData: any, email: string): Promise<any> {
        return await userSchema.findOneAndUpdate({ email }, userData, { new: true });
    }

    async fetchUsers(page: number, limit: number): Promise<{ users: IUser[]; totalUsers: number }> {
        const skip = (page - 1) * limit;
        const [users, totalUsers] = await Promise.all([
            userSchema.find({ isAdmin: false }).skip(skip).limit(limit),
            userSchema.countDocuments({ isAdmin: false }),
        ]);

        return { users, totalUsers };
    }
    async findAdmin(): Promise<any> {
        return await userSchema.findOne({ isAdmin: true })
    }
    async updateAdmin(admin: any): Promise<any> {
        return await userSchema.findOneAndUpdate({ isAdmin: true }, admin, { new: true });
    }
    async updateUserStatus(email: string, isBlock: boolean): Promise<void> {
        await userSchema.updateOne({ email }, { $set: { isBlocked: isBlock } })
    }


    async findByEmail(email: string): Promise<IUser | null> {
        const user = await userSchema.findOne({ email });
        return user
    }


    async findUserById(userId: string): Promise<IUser | null> {
        return await userSchema.findById(userId)
    }


    async getDashboardData(userId: string): Promise<DashboardData> {
        try {
            const userObjectId = new Types.ObjectId(userId);
            const [expenseTotal, paymentTotal] = await Promise.all([
                expenseSchema.aggregate([
                    { $match: { userId } },
                    { $group: { _id: null, total: { $sum: "$amount" } } }
                ]),
                paymentSchema.aggregate([
                    { $match: { userId: userObjectId } },
                    { $match: { status: 'completed' } },
                    { $group: { _id: null, total: { $sum: "$amount" } } }
                ])
            ]);
            const totalSpent = (expenseTotal[0]?.total || 0) + (paymentTotal[0]?.total || 0);
            const categoryData = await expenseSchema.aggregate([
                { $match: { userId } },
                {
                    $group: {
                        _id: "$category",
                        amount: { $sum: "$amount" },
                        count: { $sum: 1 }
                    }
                },
                { $sort: { amount: -1 } }
            ]);
            if (paymentTotal[0]?.total) {
                categoryData.push({
                    _id: 'advisor-payments',
                    amount: paymentTotal[0].total,
                    count: await paymentSchema.countDocuments({ userId: userObjectId, status: 'completed' })
                });
            }
            const sixMonthsAgo = new Date();
            sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
            const [expenseTrend, paymentTrend] = await Promise.all([
                expenseSchema.aggregate([
                    { $match: { userId, date: { $gte: sixMonthsAgo } } },
                    {
                        $group: {
                            _id: { year: { $year: "$date" }, month: { $month: "$date" } }, total: { $sum: "$amount" }
                        }
                    },
                    { $sort: { "_id.year": 1, "_id.month": 1 } }
                ]),
                paymentSchema.aggregate([
                    {
                        $match: {
                            userId: userObjectId,
                            status: 'completed',
                            createdAt: { $gte: sixMonthsAgo }
                        }
                    },
                    {
                        $group: {
                            _id: {
                                year: { $year: "$createdAt" },
                                month: { $month: "$createdAt" }
                            },
                            total: { $sum: "$amount" }
                        }
                    },
                    { $sort: { "_id.year": 1, "_id.month": 1 } }
                ])
            ]);
            const trendMap = new Map();
            for (let i = 0; i <= 6; i++) {
                const date = new Date();
                date.setMonth(date.getMonth() - i);
                const year = date.getFullYear();
                const month = date.getMonth() + 1;
                const key = `${year}-${month}`;
                const monthName = date.toLocaleString('default', { month: 'short' });
                trendMap.set(key, {
                    date: monthName,
                    expenses: 0,
                    payments: 0
                });
            }
            expenseTrend.forEach(item => {
                const key = `${item._id.year}-${item._id.month}`;
                if (trendMap.has(key)) {
                    trendMap.get(key).expenses = item.total;
                }
            });
            paymentTrend.forEach(item => {
                const key = `${item._id.year}-${item._id.month}`;
                if (trendMap.has(key)) {
                    trendMap.get(key).payments = item.total;
                }
            });
            const trendData = Array.from(trendMap.values()).reverse();
            const recentExpenses = await expenseSchema.find({ userId })
                .sort({ date: -1 })
                .limit(5)
                .lean();
            const recentPayments = await paymentSchema.find({
                userId: userObjectId,
                status: 'completed'
            })
                .sort({ createdAt: -1 })
                .limit(5)
                .populate('advisorId', 'name')
                .lean();
            const recentActivity = [
                ...recentExpenses.map(expense => ({
                    id: expense._id.toString(),
                    date: expense.date,
                    amount: expense.amount,
                    description: expense.description,
                    category: expense.category,
                    type: 'expense' as const
                })),
                ...recentPayments.map(payment => ({
                    id: payment._id.toString(),
                    date: payment.createdAt,
                    amount: payment.amount,
                    description: `Payment to advisor`,
                    category: 'advisor-payments',
                    type: 'payment' as const
                }))
            ].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                .slice(0, 5);
            const monthlyExpenses = categoryData.map(category => {
                const categoryKey = String(category._id).toLowerCase();
                return {
                    category: categoryKey,
                    amount: category.amount,
                    count: category.count,
                    color: CATEGORY_COLORS[categoryKey] || CATEGORY_COLORS.default
                };
            })
            // const sampleBudget = 2000; // This should come from a user's settings in the future
            // const budgetProgress = Math.min(Math.round((totalSpent / sampleBudget) * 100), 100);
            return {
                monthlyExpenses,
                trendData,
                recentActivity,
                budgetInfo: {
                    totalSpent,
                    // budget: sampleBudget,
                    // progress: budgetProgress
                }
            };
        } catch (error) {
            console.error('Error fetching dashboard data:', error);
            throw error;
        }
    }

    async findUsersByEmails(emails: string[]): Promise<IUser[]> {
        return await userSchema.find({ email: { $in: emails } });
    }

}