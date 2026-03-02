import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useCartStore } from '@/stores/cart.store';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';

const checkoutSchema = z.object({
    fullName: z.string().min(1, 'Full name is required'),
    address: z.string().min(1, 'Address is required'),
    city: z.string().min(1, 'City is required'),
    zipCode: z.string().min(1, 'Zip code is required'),
    cardNumber: z.string().min(16, 'Card number must be 16 digits'),
    expiry: z.string().min(5, 'Expiry date is required (MM/YY)'),
    cvv: z.string().min(3, 'CVV is required'),
});

type CheckoutFormValues = z.infer<typeof checkoutSchema>;

export const CheckoutPage = () => {
    const { items, getTotal, clearCart } = useCartStore();
    const navigate = useNavigate();

    const { register, handleSubmit, formState: { errors } } = useForm<CheckoutFormValues>({
        resolver: zodResolver(checkoutSchema),
    });

    const onSubmit = async (data: CheckoutFormValues) => {
        // Here you would send the order to the backend
        console.log('Checkout Data:', data);
        console.log('Items:', items);

        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));

        toast.success('Order placed successfully!');
        clearCart();
        navigate('/');
    };

    if (items.length === 0) {
        navigate('/cart');
        return null;
    }

    return (
        <div className="container mx-auto py-8">
            <h1 className="text-3xl font-bold mb-8">Checkout</h1>

            <div className="grid lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2">
                    <Card>
                        <CardHeader>
                            <CardTitle>Shipping & Payment</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <form id="checkout-form" onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="fullName">Full Name</Label>
                                    <Input id="fullName" {...register('fullName')} />
                                    {errors.fullName && <p className="text-sm text-red-500">{errors.fullName.message}</p>}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="address">Address</Label>
                                    <Input id="address" {...register('address')} />
                                    {errors.address && <p className="text-sm text-red-500">{errors.address.message}</p>}
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="city">City</Label>
                                        <Input id="city" {...register('city')} />
                                        {errors.city && <p className="text-sm text-red-500">{errors.city.message}</p>}
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="zipCode">Zip Code</Label>
                                        <Input id="zipCode" {...register('zipCode')} />
                                        {errors.zipCode && <p className="text-sm text-red-500">{errors.zipCode.message}</p>}
                                    </div>
                                </div>

                                <div className="pt-4 border-t mt-4">
                                    <h3 className="font-semibold mb-4">Payment Details</h3>
                                    <div className="space-y-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="cardNumber">Card Number</Label>
                                            <Input id="cardNumber" {...register('cardNumber')} placeholder="0000 0000 0000 0000" />
                                            {errors.cardNumber && <p className="text-sm text-red-500">{errors.cardNumber.message}</p>}
                                        </div>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="space-y-2">
                                                <Label htmlFor="expiry">Expiry (MM/YY)</Label>
                                                <Input id="expiry" {...register('expiry')} placeholder="MM/YY" />
                                                {errors.expiry && <p className="text-sm text-red-500">{errors.expiry.message}</p>}
                                            </div>
                                            <div className="space-y-2">
                                                <Label htmlFor="cvv">CVV</Label>
                                                <Input id="cvv" {...register('cvv')} placeholder="123" />
                                                {errors.cvv && <p className="text-sm text-red-500">{errors.cvv.message}</p>}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </form>
                        </CardContent>
                    </Card>
                </div>

                <div className="lg:col-span-1">
                    <Card>
                        <CardHeader>
                            <CardTitle>Order Summary</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {items.map(item => (
                                <div key={item.productId} className="flex justify-between text-sm">
                                    <span>{item.name} x {item.quantity}</span>
                                    <span>${(item.price * item.quantity).toFixed(2)}</span>
                                </div>
                            ))}
                            <div className="border-t pt-4 flex justify-between font-bold text-lg">
                                <span>Total</span>
                                <span>${getTotal().toFixed(2)}</span>
                            </div>
                        </CardContent>
                        <CardFooter>
                            <Button type="submit" form="checkout-form" className="w-full" size="lg">Place Order</Button>
                        </CardFooter>
                    </Card>
                </div>
            </div>
        </div>
    );
};
