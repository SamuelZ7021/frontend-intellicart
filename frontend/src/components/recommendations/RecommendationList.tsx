import { useQuery } from '@tanstack/react-query';
import { mlApi } from '@/lib/axios';
import { ProductCard } from '@/components/products/ProductCard';
import { Loader2 } from 'lucide-react';

interface Product {
    id: number;
    name: string;
    description: string;
    price: number;
    imageUrl?: string;
    stock: number;
}

interface RecommendationListProps {
    userId?: number; // Optional, for personalized recommendations
    productId?: number; // Optional, for "similar products"
    limit?: number;
}

export const RecommendationList = ({ userId, productId }: RecommendationListProps) => {
    const { data: recommendations, isLoading, error } = useQuery<Product[]>({
        queryKey: ['recommendations', userId, productId],
        queryFn: async () => {
            try {
                let endpoint = '/recommendations';
                if (userId) {
                    endpoint = `/recommendations/${userId}`;
                }

                const response = await mlApi.get(endpoint);
                return response.data;
            } catch (err) {
                console.warn("Failed to fetch recommendations, using mocks", err);
                return [
                    { id: 5, name: 'Recommended Item 1', description: 'AI picked this for you.', price: 59.99, stock: 10, imageUrl: 'https://placehold.co/400' },
                    { id: 6, name: 'Recommended Item 2', description: 'You might justify this.', price: 89.99, stock: 5, imageUrl: 'https://placehold.co/400' },
                    { id: 7, name: 'Recommended Item 3', description: 'Trending now.', price: 29.99, stock: 20, imageUrl: 'https://placehold.co/400' },
                    { id: 8, name: 'Recommended Item 4', description: 'Best seller.', price: 49.99, stock: 0, imageUrl: 'https://placehold.co/400' }
                ];
            }
        },
        enabled: !!userId || !!productId, // Only fetch if context is provided
    });

    if (isLoading) {
        return (
            <div className="flex justify-center py-8">
                <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
            </div>
        );
    }

    if (error || !recommendations || recommendations.length === 0) {
        return null; // Don't show section if no recommendations
    }

    return (
        <div className="my-12">
            <h2 className="text-2xl font-bold mb-6">Recommended for You</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {recommendations.map((product) => (
                    <ProductCard key={product.id} product={product} />
                ))}
            </div>
        </div>
    );
};
