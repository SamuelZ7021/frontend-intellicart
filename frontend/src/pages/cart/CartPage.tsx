import { Link } from 'react-router-dom';
import { useCartStore } from '@/stores/cart.store';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Minus, Plus, Trash2, ArrowRight } from 'lucide-react';

export const CartPage = () => {
    const { items, removeItem, updateQuantity, getTotal } = useCartStore();

    if (items.length === 0) {
        return (
            <div className="container mx-auto py-16 text-center">
                <h1 className="text-3xl font-bold mb-4">Your Cart is Empty</h1>
                <p className="text-muted-foreground mb-8">
                    Looks like you haven't added anything to your cart yet.
                </p>
                <Link to="/">
                    <Button size="lg">Start Shopping</Button>
                </Link>
            </div>
        );
    }

    return (
        <div className="container mx-auto py-8">
            <h1 className="text-3xl font-bold mb-8">Shopping Cart</h1>

            <div className="grid lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-4">
                    {items.map((item) => (
                        <Card key={item.productId} className="flex flex-row items-center p-4 gap-4">
                            <div className="h-24 w-24 bg-gray-100 rounded-md overflow-hidden flex-shrink-0">
                                <img
                                    src={item.imageUrl || '/placeholder-image.jpg'}
                                    alt={item.name}
                                    className="h-full w-full object-cover"
                                />
                            </div>

                            <div className="flex-1">
                                <h3 className="font-semibold text-lg">{item.name}</h3>
                                <p className="text-muted-foreground">${item.price.toFixed(2)}</p>
                            </div>

                            <div className="flex items-center gap-2">
                                <Button
                                    variant="outline"
                                    size="icon"
                                    className="h-8 w-8"
                                    onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                                    disabled={item.quantity <= 1}
                                >
                                    <Minus className="h-3 w-3" />
                                </Button>
                                <span className="w-8 text-center">{item.quantity}</span>
                                <Button
                                    variant="outline"
                                    size="icon"
                                    className="h-8 w-8"
                                    onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                                >
                                    <Plus className="h-3 w-3" />
                                </Button>
                            </div>

                            <div className="text-right min-w-[80px]">
                                <p className="font-bold">${(item.price * item.quantity).toFixed(2)}</p>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    className="text-red-500 hover:text-red-700 hover:bg-red-50 mt-1 h-auto py-1 px-2"
                                    onClick={() => removeItem(item.productId)}
                                >
                                    <Trash2 className="h-4 w-4 mr-1" /> Remove
                                </Button>
                            </div>
                        </Card>
                    ))}
                </div>

                <div className="lg:col-span-1">
                    <Card>
                        <CardHeader>
                            <CardTitle>Order Summary</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex justify-between">
                                <span className="text-muted-foreground">Subtotal</span>
                                <span className="font-semibold">${getTotal().toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-muted-foreground">Shipping</span>
                                <span className="font-semibold">Calculated at checkout</span>
                            </div>
                            <div className="border-t pt-4 flex justify-between text-lg font-bold">
                                <span>Total</span>
                                <span>${getTotal().toFixed(2)}</span>
                            </div>
                        </CardContent>
                        <CardFooter>
                            <Link to="/checkout" className="w-full">
                                <Button className="w-full" size="lg">
                                    Proceed to Checkout <ArrowRight className="ml-2 h-4 w-4" />
                                </Button>
                            </Link>
                        </CardFooter>
                    </Card>
                </div>
            </div>
        </div>
    );
};
