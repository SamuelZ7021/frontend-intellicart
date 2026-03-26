import { useQuery } from '@tanstack/react-query';
import { getDashboardStats } from '@/lib/stats';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, DollarSign, ShoppingBag, Users, AlertTriangle } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

export const AdminDashboardPage = () => {
    const { data: stats, isLoading } = useQuery({
        queryKey: ['admin-stats'],
        queryFn: getDashboardStats,
        refetchInterval: 30000, // Refrescar cada 30 segundos para "tiempo real"
    });

    if (isLoading) return <div className="flex justify-center py-20"><Loader2 className="animate-spin" /></div>;

    const COLORS = ['#10b981', '#f59e0b', '#ef4444'];

    return (
        <div className="container mx-auto py-8">
            <h1 className="text-3xl font-bold mb-8">Panel de Control</h1>

            {/* Tarjetas de Estadísticas */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                <StatCard title="Ingresos Totales" value={`$${stats?.totalRevenue}`} icon={<DollarSign />} color="text-green-600" />
                <StatCard title="Órdenes Totales" value={stats?.totalOrders} icon={<ShoppingBag />} color="text-blue-600" />
                <StatCard title="Usuarios Activos" value={stats?.activeUsers} icon={<Users />} color="text-purple-600" />
                <StatCard title="Alertas de Stock" value={stats?.stockAlerts} icon={<AlertTriangle />} color="text-red-600" />
            </div>

            <div className="grid lg:grid-cols-2 gap-8">
                {/* Gráfico de Ventas */}
                <Card>
                    <CardHeader><CardTitle>Tendencia de Ventas</CardTitle></CardHeader>
                    <CardContent className="h-80">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={stats?.salesHistory}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="date" />
                                <YAxis />
                                <Tooltip />
                                <Line type="monotone" dataKey="amount" stroke="#2563eb" strokeWidth={2} />
                            </LineChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>

                {/* Distribución de Órdenes */}
                <Card>
                    <CardHeader><CardTitle>Estado de Órdenes</CardTitle></CardHeader>
                    <CardContent className="h-80">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie data={stats?.orderStatusDistribution} innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value">
                                    {stats?.orderStatusDistribution.map((_, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip />
                            </PieChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

const StatCard = ({ title, value, icon, color }: any) => (
    <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">{title}</CardTitle>
            <div className={color}>{icon}</div>
        </CardHeader>
        <CardContent>
            <div className="text-2xl font-bold">{value}</div>
        </CardContent>
    </Card>
);