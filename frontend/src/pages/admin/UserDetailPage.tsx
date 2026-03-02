import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { userApi } from '@/lib/axios';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import { Loader2, ArrowLeft } from 'lucide-react';

interface User {
    id: number;
    username: string;
    email: string;
    roles: string[];
}

export const UserDetailPage = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();

    const { data: user, isLoading, error } = useQuery<User>({
        queryKey: ['user', id],
        queryFn: async () => {
            try {
                const response = await userApi.get(`/users/${id}`);
                return response.data;
            } catch (err) {
                console.warn("Using mock user for detail", err);
                return {
                    id: Number(id),
                    username: id === '1' ? 'admin' : 'johndoe',
                    email: id === '1' ? 'admin@example.com' : 'john@example.com',
                    roles: id === '1' ? ['ADMIN', 'USER'] : ['USER']
                };
            }
        },
        enabled: !!id,
    });

    if (isLoading) {
        return (
            <div className="flex justify-center items-center py-20">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }

    if (error || !user) {
        return <div className="text-red-500 container mx-auto py-8">User not found or error loading user</div>;
    }

    return (
        <div className="container mx-auto py-8">
            <Button variant="ghost" className="mb-6 pl-0" onClick={() => navigate('/admin/users')}>
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Users
            </Button>

            <Card className="max-w-2xl">
                <CardHeader>
                    <CardTitle>User Details</CardTitle>
                    <CardDescription>Detailed information for user ID: {user.id}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div>
                        <span className="font-semibold block text-sm text-muted-foreground">Username</span>
                        <span className="text-lg">{user.username}</span>
                    </div>
                    <div>
                        <span className="font-semibold block text-sm text-muted-foreground">Email</span>
                        <span className="text-lg">{user.email}</span>
                    </div>
                    <div>
                        <span className="font-semibold block text-sm text-muted-foreground">Roles</span>
                        <span className="text-lg">{user.roles.join(', ')}</span>
                    </div>

                    <div className="pt-6 flex gap-4">
                        <Button onClick={() => navigate(`/admin/users/${user.id}/edit`)}>Edit User</Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};
