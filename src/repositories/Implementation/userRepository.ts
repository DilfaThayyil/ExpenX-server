import { IUserRepository } from '../Interface/IUserRepository';
import userSchema from '../../models/userSchema';
import { IExpense } from '../../entities/expenseEntities';
import expenseSchema from '../../models/expenseSchema';
import groupSchema from '../../models/groupSchema';
import IUser from '../../entities/userEntities';
import slotSchema, { Slot } from '../../models/slotSchema';
import { Types } from 'mongoose';
import { GroupMember, IGroup, IGroupExpense } from '../../entities/groupEntities';
import reportSchema, { IReport } from '../../models/reportSchema';
import Report from '../../models/reportSchema';
import advisorSchema from '../../models/advisorSchema';
import IAdvisor from '../../entities/advisorEntities';
import reviewSchema, { IReview } from '../../models/reviewSchema';
import goalsSchema, { IGoal } from '../../models/goalsSchema';
import categorySchema, { ICategory } from '../../models/categorySchema';
import paymentSchema from '../../models/paymentSchema';

export interface DashboardData {
    monthlyExpenses: CategoryData[];
    trendData: TrendData[];
    recentActivity: Activity[];
    budgetInfo: {
        totalSpent: number;
        // budget: number;
        // progress: number;
    };
}
interface CategoryData {
    category: string;
    amount: number;
    count: number;
    // color: string;
}
interface TrendData {
    date: string;
    expenses: number;
    payments: number;
}
interface Activity {
    id: string;
    date: Date;
    amount: number;
    description: string;
    category: string;
    type: 'expense' | 'payment';
}
const CATEGORY_COLORS:Record<string,string> = {
    food: '#4CAF50',
    transport: '#2196F3',
    entertainment: '#9C27B0',
    shopping: '#F44336',
    housing: '#FF9800',
    utilities: '#607D8B',
    healthcare: '#00BCD4',
    education: '#795548',
    travel: '#FFEB3B',
    other: '#9E9E9E',
    payment: '#3F51B5',
    default: '#9E9E9E'
};



export default class UserRepository implements IUserRepository {

    async findUserByEmail(email: string): Promise<any> {
        return await userSchema.findOne({ email });
    }

    async createUser(userData: any): Promise<any> {
        return await userSchema.create(userData);
    }
    async updateUser(userData: any, email: string): Promise<any> {
        return await userSchema.findOneAndUpdate({ email }, userData, { new: true });
    }

    async getCategories(): Promise<ICategory[]> {
        return await categorySchema.find()
    }
    async createGroup(groupData: IGroup): Promise<IGroup> {
        return groupSchema.create(groupData)
    }
    async getUserGroups(email: string): Promise<IGroup[]> {
        const groups = await groupSchema.find({ members: { $elemMatch: { email } } });
        return groups
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
    async findById(groupId: string): Promise<IGroup | null> {
        return await groupSchema.findById(groupId).populate("expenses")
    }
    async addMember(groupId: string, newMember: GroupMember): Promise<IGroup> {
        const group = await groupSchema.findByIdAndUpdate(
            groupId,
            { $addToSet: { members: newMember } },
            { new: true }
        )
        if (!group) {
            throw new Error('group not found')
        }
        return group
    }
    async findByEmail(email: string): Promise<IUser | null> {
        const user = await userSchema.findOne({ email });
        return user
    }
    async addExpenseInGroup(groupId: string, expense: IGroupExpense): Promise<IGroup> {
        const updatedGroup = await groupSchema.findByIdAndUpdate(
            new Types.ObjectId(groupId),
            { $push: { expenses: expense } },
            { new: true }
        )
        if (!updatedGroup) {
            throw new Error('group not found')
        }
        return updatedGroup
    }
    async findSlot(slotId: string): Promise<Slot | null> {
        return await slotSchema.findById(slotId)
    }
    async findUserById(userId: string): Promise<IUser | null> {
        return await userSchema.findById(userId)
    }
    async bookSlot(slotId: string, slot: Slot): Promise<Slot | null> {
        const bookedSlot = await slotSchema.findOneAndUpdate({ _id: slotId }, slot, { new: true })
        return bookedSlot
    }
    async updateSlot(slotId: string): Promise<Slot | null> {
        return await slotSchema.findOneAndUpdate({ _id: slotId }, { status: "Cancelled" }, { new: true })
    }
    async createReport(data: IReport): Promise<IReport> {
        const report = await Report.create(data);
        return report;
    }
    async fetchSlotsByUser(userId: string, page: number, limit: number): Promise<{ slots: Slot[], totalPages: number }> {
        try {
            const userObjectId = new Types.ObjectId(userId);
            const filter = {
                $or: [{ "bookedBy._id": userObjectId }, { status: "Available" }],
            };
            const totalSlots = await slotSchema.countDocuments(filter);
            const totalPages = Math.ceil(totalSlots / limit);
            const slots = await slotSchema.find(filter)
                .skip((page - 1) * limit)
                .limit(limit)
                .sort({ date: 1 })
                .lean();
            return { slots, totalPages };
        } catch (error: any) {
            throw new Error(`Error fetching slots: ${error.message}`);
        }
    }
    async getAdvisors(): Promise<IAdvisor[]> {
        const advisors = await advisorSchema.find({ isBlocked: false })
        return advisors
    }
    async createReview(advisorId: string, userId: string, rating: number, review: string): Promise<IReview> {
        const newReview = await reviewSchema.create({
            advisorId: new Types.ObjectId(advisorId),
            userId: new Types.ObjectId(userId),
            rating,
            review
        });
        return newReview
    }
    async createGoal(goalData: Partial<IGoal>): Promise<IGoal> {
        const goal = await goalsSchema.create(goalData);
        return goal
    }
    async getGoalsById(userId: string): Promise<IGoal[]> {
        const goals = await goalsSchema.find({ userId }).sort({ deadline: 1 });
        return goals
    }
    async getGoalById(id: string): Promise<IGoal | null> {
        return await goalsSchema.findById(id)
    }
    async updateGoal(id: string, goalData: Partial<IGoal>): Promise<IGoal | null> {
        return await goalsSchema.findByIdAndUpdate(id, { ...goalData, updatedAt: new Date() }, { new: true })
    }
    async deleteGoal(id: string): Promise<boolean | null> {
        return await goalsSchema.findByIdAndDelete(id)
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
                    description: `Payment to advisor ${payment.advisorId}`,
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
                });
                
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
}