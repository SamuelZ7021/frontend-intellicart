import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { orderApi } from '@/lib/axios';
import { useCartStore, type CartItem } from '@/stores/cart.store';
import { Button } from '@/components/ui/button';
import { Loader2, ArrowLeft, ShoppingCart } from 'lucide-react';
import { toast } from 'sonner';

interface Product {
    id: number;
    name: string;
    description: string;
    price: number;
    imageUrl?: string;
    stock: number;
}

export const ProductDetailPage = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const addItem = useCartStore((state) => state.addItem);

    const { data: product, isLoading, error } = useQuery<Product>({
        queryKey: ['product', id],
        queryFn: async () => {
            // Mock/Real fetch
            try {
                const response = await orderApi.get(`/products/${id}`);
                return response.data;
            } catch (err) {
                // Fallback mock
                return {
                    id: Number(id),
                    name: `Product ${id}`,
                    description: 'Detailed description of the product goes here. Including features, specs, etc.',
                    price: 99.99,
                    stock: 10,
                    imageUrl: 'https://placehold.co/600'
                };
            }
        },
        enabled: !!id,
    });

    if (isLoading) {
        return (
            <div className="flex justify-center items-center min-h-[50vh]">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }

    if (error || !product) {
        return (
            <div className="container mx-auto py-8 text-center">
                <p className="text-red-500 mb-4">Product not found</p>
                <Button variant="outline" onClick={() => navigate('/')}>
                    <ArrowLeft className="mr-2 h-4 w-4" /> Back to Home
                </Button>
            </div>
        );
    }

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
        <div className="container mx-auto py-8">
            <Button variant="ghost" className="mb-6" onClick={() => navigate(-1)}>
                <ArrowLeft className="mr-2 h-4 w-4" /> Back
            </Button>

            <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
                <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden">
                    <img
                        src={product.imageUrl || '/placeholder-image.jpg'}
                        alt={product.name}
                        className="w-full h-full object-cover"
                    />
                </div>

                <div className="space-y-6">
                    <div>
                        <h1 className="text-3xl font-bold">{product.name}</h1>
                        <p className="text-2xl font-semibold text-primary mt-2">
                            ${product.price.toFixed(2)}
                        </p>
                    </div>

                    <p className="text-muted-foreground leading-relaxed">
                        {product.description}
                    </p>

                    <div className="pt-6 border-t">
                        <div className="flex items-center gap-4">
                            <Button size="lg" className="w-full md:w-auto" onClick={handleAddToCart} disabled={product.stock <= 0}>
                                <ShoppingCart className="mr-2 h-5 w-5" />
                                {product.stock > 0 ? 'Add to Cart' : 'Out of Stock'}
                            </Button>
                            <div className="text-sm text-muted-foreground">
                                {product.stock > 0 ? `${product.stock} in stock` : 'Unavailable'}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
