import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useCartStore, type CartItem } from '@/stores/cart.store';
import { toast } from 'sonner';

interface Product {
    id: number;
    name: string;
    description: string;
    price: number;
    imageUrl?: string;
    stock: number;
}

interface ProductCardProps {
    product: Product;
}

export const ProductCard = ({ product }: ProductCardProps) => {
    const addItem = useCartStore((state) => state.addItem);

    const handleAddToCart = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        const item: CartItem = {
            productId: product.id,
            name: product.name,
            price: product.price,
            quantity: 1,
            imageUrl: product.imageUrl,
        };
        addItem(item);
        toast.success(`¡${product.name} añadido al carrito!`);
    };

    return (
        <Card className="h-full flex flex-col group hover:shadow-xl transition-all duration-300 border-slate-200 overflow-hidden">
            <Link to={`/products/${product.id}`} className="block aspect-square relative overflow-hidden bg-slate-50 border-b">
                <img
                    src={product.imageUrl || '/placeholder-image.jpg'}
                    alt={product.name}
                    className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-110"
                />
                {product.stock <= 5 && product.stock > 0 && (
                    <span className="absolute top-2 right-2 bg-orange-500 text-white text-[10px] font-bold px-2 py-1 rounded-full uppercase tracking-tighter">
                        ¡Últimas {product.stock} unidades!
                    </span>
                )}
            </Link>
            <CardHeader className="p-4 pb-0">
                <CardTitle className="text-lg line-clamp-1 font-bold group-hover:text-primary transition-colors" title={product.name}>
                    <Link to={`/products/${product.id}`}>
                        {product.name}
                    </Link>
                </CardTitle>
            </CardHeader>
            <CardContent className="p-4 pt-2 flex-1 space-y-2">
                <div className="flex items-baseline gap-1">
                    <span className="text-2xl font-black text-slate-900">${product.price.toFixed(2)}</span>
                </div>
                <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
                    {product.description}
                </p>
            </CardContent>
            <CardFooter className="p-4 pt-0">
                <Button 
                    onClick={handleAddToCart} 
                    className="w-full h-10 font-bold shadow-md shadow-primary/10 transition-all active:scale-95" 
                    disabled={product.stock <= 0}
                    variant={product.stock > 0 ? "default" : "secondary"}
                >
                    {product.stock > 0 ? 'Agregar al carrito' : 'Agotado'}
                </Button>
            </CardFooter>
        </Card>
    );
};
