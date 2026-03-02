import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, Link } from 'react-router-dom';
import api from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';

export default function LoginPage() {
    const { register, handleSubmit, formState: { errors } } = useForm();
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const onSubmit = async (data: any) => {
        try {
            const response = await api.post('/auth/login', data);
            localStorage.setItem('token', response.data.token);
            navigate('/orders');
        } catch (err: any) {
            setError('Invalid email or password');
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900">
            <Card className="w-[350px]">
                <CardHeader>
                    <CardTitle>Login</CardTitle>
                    <CardDescription>Enter your email below to login to your account.</CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <div className="grid w-full items-center gap-4">
                            <div className="flex flex-col space-y-1.5">
                                <Label htmlFor="email">Email</Label>
                                <Input id="email" placeholder="name@example.com" {...register('email', { required: true })} />
                                {errors.email && <span className="text-red-500 text-sm">Email is required</span>}
                            </div>
                            <div className="flex flex-col space-y-1.5">
                                <Label htmlFor="password">Password</Label>
                                <Input id="password" type="password" {...register('password', { required: true })} />
                                {errors.password && <span className="text-red-500 text-sm">Password is required</span>}
                            </div>
                        </div>
                        {error && <div className="text-red-500 text-sm mt-2">{error}</div>}
                        <div className="mt-4">
                            <Button type="submit" className="w-full">Login</Button>
                        </div>
                    </form>
                </CardContent>
                <CardFooter className="flex justify-center">
                    <Link to="/register" className="text-sm text-blue-500 hover:underline">Don't have an account? Register</Link>
                </CardFooter>
            </Card>
        </div>
    );
}
