import api from "./api";

export interface DashboardStats {
    activeUsers: number;
    stockAlerts: number;
    totalRevenue: number;
    totalOrders: number;
    salesHistory: { date: string; value: number }[];
    orderStatusDistribution: { name: string; value: number }[];
}

export const getDashboardStats = async (): Promise<DashboardStats> => {
    const { data } = await api.get<DashboardStats>('/stats');
    return data;
};