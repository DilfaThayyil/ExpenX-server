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