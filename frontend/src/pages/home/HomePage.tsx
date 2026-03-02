import { useQuery } from '@tanstack/react-query';
import { orderApi } from '@/lib/axios';
import { ProductCard } from '@/components/products/ProductCard';
import { RecommendationList } from '@/components/recommendations/RecommendationList';
import { Loader2 } from 'lucide-react';
import { useAuthStore } from '@/stores/auth.store';

interface Product {
    id: number;
    name: string;
    description: string;
    price: number;
    imageUrl?: string;
    stock: number;
}

export const HomePage = () => {
    const user = useAuthStore((state) => state.user);

    const { data: products, isLoading, error } = useQuery<Product[]>({
        queryKey: ['products'],
        queryFn: async () => {
            // Mocking data for now if API is not ready, or use real API
            try {
                const response = await orderApi.get('/products');
                return response.data;
            } catch (err) {
                // Fallback mock data for development
                console.warn("Failed to fetch products, using mock data", err);
                return [
                    { id: 1, name: 'Smartphone X', description: 'Latest model with high-res camera.', price: 999.99, stock: 10, imageUrl: 'https://placehold.co/400' },
                    { id: 2, name: 'Laptop Pro', description: 'Powerful laptop for professionals.', price: 1499.50, stock: 5, imageUrl: 'https://placehold.co/400' },
                    { id: 3, name: 'Wireless Earbuds', description: 'Noise cancelling earbuds.', price: 199.00, stock: 20, imageUrl: 'https://placehold.co/400' },
                    { id: 4, name: 'Smart Watch', description: 'Track your fitness and notifications.', price: 299.99, stock: 0, imageUrl: 'https://placehold.co/400' }
                ];
            }
        },
    });

    if (isLoading) {
        return (
            <div className="flex justify-center items-center py-20">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }

    if (error) {
        return (
            <div className="text-center py-10 text-red-500">
                Error loading products. Please try again later.
            </div>
        );
    }

    return (
        <div className="container mx-auto py-8">
            <section className="mb-12">
                <h1 className="text-4xl font-extrabold tracking-tight text-center mb-4">
                    Welcome to IntelliCart
                </h1>
                <p className="text-lg text-muted-foreground text-center max-w-2xl mx-auto">
                    Discover the future of shopping with our AI-powered recommendations.
                </p>
            </section>

            {user && <RecommendationList userId={user.id} />}

            <h2 className="text-2xl font-bold mb-6">Featured Products</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {products?.map((product) => (
                    <ProductCard key={product.id} product={product} />
                ))}
            </div>
        </div>
    );
};
