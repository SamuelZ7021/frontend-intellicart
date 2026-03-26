import { Link, useNavigate } from 'react-router-dom';
import { useCartStore } from '@/stores/cart.store';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Minus, Plus, Trash2, ArrowRight, ShoppingBag, ShoppingCart } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { toast } from 'sonner';

export const CartPage = () => {
    const { items, removeItem, updateQuantity, getTotal } = useCartStore();
    const navigate = useNavigate();

    if (items.length === 0) {
        return (
            <div className="container mx-auto py-24 px-4 text-center space-y-6">
                <div className="bg-slate-50 w-24 h-24 rounded-full flex items-center justify-center mx-auto border-2 border-dashed border-slate-200">
                    <ShoppingBag className="h-10 w-10 text-slate-300" />
                </div>
                <div className="space-y-2">
                    <h1 className="text-3xl font-black text-slate-900 tracking-tight">Tu carrito está vacío</h1>
                    <p className="text-muted-foreground text-lg max-w-md mx-auto">
                        Parece que aún no has añadido nada. Explora nuestros productos y encuentra algo increíble hoy mismo.
                    </p>
                </div>
                <Button size="lg" className="h-12 px-8 text-lg font-bold shadow-xl shadow-primary/20" onClick={() => navigate('/')}>
                    Empezar a comprar
                </Button>
            </div>
        );
    }

    const handleDelete = (productId: string | number, name: string) => {
        removeItem(productId);
        toast.info(`"${name}" eliminado del carrito`);
    };

    return (
        <div className="container mx-auto py-10 px-4 max-w-6xl">
            <div className="flex items-center gap-3 mb-8">
                <div className="p-2 bg-primary/10 rounded-lg">
                    <ShoppingCart className="h-6 w-6 text-primary" />
                </div>
                <h1 className="text-4xl font-black text-slate-900 tracking-tight italic">Carrito de Compras</h1>
            </div>

            <div className="grid lg:grid-cols-12 gap-10">
                <div className="lg:col-span-8 space-y-6">
                    {items.map((item) => {
                        // Usar una clave segura, si productId es NaN o nulo, usar un índice o algo
                        const safeKey = item.productId ? String(item.productId) : `temp-${item.name}`;
                        
                        return (
                            <Card key={safeKey} className="group hover:shadow-lg transition-all duration-300 border-slate-200 overflow-hidden">
                                <CardContent className="p-0">
                                    <div className="flex flex-col sm:flex-row items-stretch sm:items-center p-4 gap-6">
                                        <div className="h-28 w-full sm:h-28 sm:w-28 bg-slate-50 rounded-xl overflow-hidden border flex-shrink-0 group-hover:scale-105 transition-transform duration-500">
                                            <img
                                                src={item.imageUrl || '/placeholder-image.jpg'}
                                                alt={item.name}
                                                className="h-full w-full object-cover"
                                            />
                                        </div>

                                        <div className="flex-1 min-w-0">
                                            <h3 className="font-bold text-xl text-slate-900 truncate mb-1" title={item.name}>
                                                {item.name}
                                            </h3>
                                            <p className="text-primary font-black text-lg">${item.price.toFixed(2)}</p>
                                        </div>

                                        <div className="flex flex-row sm:flex-col items-center justify-between sm:justify-center gap-4 border-t sm:border-t-0 pt-4 sm:pt-0">
                                            <div className="flex items-center bg-slate-100 rounded-full p-1 border border-slate-200 shadow-inner">
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="h-8 w-8 rounded-full hover:bg-white transition-colors"
                                                    onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                                                    disabled={item.quantity <= 1}
                                                >
                                                    <Minus className="h-4 w-4" />
                                                </Button>
                                                <span className="w-10 text-center font-black text-lg">{item.quantity}</span>
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="h-8 w-8 rounded-full hover:bg-white transition-colors"
                                                    onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                                                >
                                                    <Plus className="h-4 w-4" />
                                                </Button>
                                            </div>
                                            
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                className="text-destructive hover:text-destructive hover:bg-destructive/10 h-10 w-10 sm:w-full p-0 sm:px-2 transition-colors rounded-full sm:rounded-md"
                                                onClick={() => handleDelete(item.productId, item.name)}
                                                title="Eliminar producto"
                                            >
                                                <Trash2 className="h-5 w-5 sm:mr-2" /> 
                                                <span className="hidden sm:inline font-bold">Quitar</span>
                                            </Button>
                                        </div>

                                        <div className="hidden sm:block text-right min-w-[110px]">
                                            <p className="text-xs text-muted-foreground uppercase font-black tracking-widest mb-1">Subtotal</p>
                                            <p className="font-black text-xl text-slate-900">${(item.price * item.quantity).toFixed(2)}</p>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        );
                    })}
                </div>

                <div className="lg:col-span-4">
                    <Card className="sticky top-24 border-none shadow-2xl bg-slate-50 overflow-hidden ring-1 ring-slate-200">
                        <div className="h-2 bg-primary w-full" />
                        <CardHeader>
                            <CardTitle className="text-2xl font-black tracking-tight italic">Resumen del Pedido</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="space-y-3">
                                <div className="flex justify-between text-slate-600">
                                    <span className="font-medium text-lg">Subtotal</span>
                                    <span className="font-bold text-lg">${getTotal().toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between text-slate-600 items-baseline">
                                    <span className="font-medium">Envío</span>
                                    <span className="text-green-600 font-black text-xs uppercase bg-green-50 px-3 py-1 rounded-full border border-green-100">Gratis</span>
                                </div>
                                <Separator className="my-4 bg-slate-200" />
                                <div className="flex justify-between items-baseline pt-2">
                                    <span className="text-xl font-black text-slate-900 uppercase italic tracking-tighter">Total Final</span>
                                    <div className="text-right">
                                        <p className="text-4xl font-black text-primary">${getTotal().toFixed(2)}</p>
                                        <p className="text-[10px] text-muted-foreground font-black uppercase tracking-tighter">IVA incluido</p>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                        <CardFooter className="flex-col gap-4 p-8 bg-white border-t">
                            <Button 
                                className="w-full h-14 text-xl font-black shadow-lg shadow-primary/20 hover:scale-[1.01] active:scale-[0.99] transition-all" 
                                size="lg"
                                onClick={() => navigate('/checkout')}
                            >
                                Proceder al Pago <ArrowRight className="ml-2 h-6 w-6" />
                            </Button>
                            <p className="text-[10px] text-center text-muted-foreground font-bold flex items-center gap-1 justify-center uppercase tracking-widest">
                                Pago 100% Seguro y Encriptado
                            </p>
                        </CardFooter>
                    </Card>
                </div>
            </div>
        </div>
    );
};
