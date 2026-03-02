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

    const handleAddToCart = () => {
        const item: CartItem = {
            productId: product.id,
            name: product.name,
            price: product.price,
            quantity: 1,
            imageUrl: product.imageUrl,
        };
        addItem(item);
        toast.success('Added to cart');
    };

    return (
        <Card className="h-full flex flex-col">
            <div className="aspect-square relative overflow-hidden rounded-t-lg bg-gray-100 dark:bg-gray-800">
                <img
                    src={product.imageUrl || '/placeholder-image.jpg'}
                    alt={product.name}
                    className="object-cover w-full h-full transition-transform hover:scale-105"
                />
            </div>
            <CardHeader>
                <CardTitle className="line-clamp-1" title={product.name}>
                    <Link to={`/products/${product.id}`} className="hover:underline">
                        {product.name}
                    </Link>
                </CardTitle>
            </CardHeader>
            <CardContent className="flex-1">
                <p className="text-2xl font-bold">${product.price.toFixed(2)}</p>
                <p className="text-sm text-muted-foreground mt-2 line-clamp-2">
                    {product.description}
                </p>
            </CardContent>
            <CardFooter>
                <Button onClick={handleAddToCart} className="w-full" disabled={product.stock <= 0}>
                    {product.stock > 0 ? 'Add to Cart' : 'Out of Stock'}
                </Button>
            </CardFooter>
        </Card>
    );
};
