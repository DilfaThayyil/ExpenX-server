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
export interface CategoryData {
    category: string;
    amount: number;
    count: number;
    // color: string;
}
export interface TrendData {
    date: string;
    expenses: number;
    payments: number;
}
export interface Activity {
    id: string;
    date: Date;
    amount: number;
    description: string;
    category: string;
    type: 'expense' | 'payment';
}

export const CATEGORY_COLORS: Record<string, string> = {
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

export interface IUser {
    userId: string;
    socketId: string;
}