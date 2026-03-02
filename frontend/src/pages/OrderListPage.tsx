import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '@/lib/api';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus } from "lucide-react";

interface Order {
    id: number;
    totalAmount: number;
    status: string;
    createdAt: string;
    items: any[];
}

export default function OrderListPage() {
    const [orders, setOrders] = useState<Order[]>([]);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchOrders = async () => {
            const token = localStorage.getItem('token');
            if (!token) {
                navigate('/login');
                return;
            }

            try {
                // Fetch user profile using the token.
                // const decoded: any = jwtDecode(token);
                // Assuming the token has a 'sub' claim with email, or we need userId.
                // If the token doesn't have ID, we might need to fetch user profile first.
                // But let's assume for now we can get orders by user context or if token has ID.
                // User Service JWT generation:
                // user.getEmail() is subject.
                // Use user service to get ID? Or updated AuthService to include ID in token?
                // Let's assume we can fetch profile /api/users/me (not implemented yet).
                // Or fetch user by email.

                // Fetch user profile using the token.
                const userRes = await api.get('/users/me');
                const userId = userRes.data.id;

                const response = await api.get(`/orders/user/${userId}`);
                setOrders(response.data);
            } catch (error) {
                console.error('Failed to fetch orders', error);
                // navigate('/login');
            }
        };

        fetchOrders();
    }, [navigate]);

    return (
        <div className="container mx-auto p-4">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold">My Orders</h1>
                <Button>
                    <Plus className="mr-2 h-4 w-4" /> New Order
                </Button>
            </div>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {orders.map((order) => (
                    <Card key={order.id}>
                        <CardHeader>
                            <CardTitle>Order #{order.id}</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-2">
                                <div className="flex justify-between">
                                    <span className="text-muted-foreground">Status:</span>
                                    <span className="font-medium">{order.status}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-muted-foreground">Total:</span>
                                    <span className="font-bold">${order.totalAmount}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-muted-foreground">Date:</span>
                                    <span className="font-medium">{new Date(order.createdAt).toLocaleDateString()}</span>
                                </div>
                                <div className="mt-4">
                                    <h4 className="font-semibold mb-2">Items:</h4>
                                    <ul className="text-sm list-disc list-inside">
                                        {order.items.map((item: any) => (
                                            <li key={item.id}>{item.productName} (x{item.quantity})</li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                ))}
                {orders.length === 0 && (
                    <p className="text-gray-500">No orders found.</p>
                )}
            </div>
        </div>
    );
}
