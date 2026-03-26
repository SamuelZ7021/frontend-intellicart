import { useQuery } from '@tanstack/react-query';
import api from '@/lib/api';
import { ProductCard } from '@/components/products/ProductCard';
import { RecommendationList } from '@/components/recommendations/RecommendationList';
import { Loader2, AlertCircle } from 'lucide-react';
import { useAuthStore } from '@/stores/auth.store';
import { Button } from '@/components/ui/button';

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

    const { data: products, isLoading, isError, refetch } = useQuery<Product[]>({
        queryKey: ['products'],
        queryFn: async () => {
            try {
                const response = await api.get('/products');
                return response.data;
            } catch (err) {
                console.error("Failed to fetch products", err);
                // Fallback mock data for development if API fails
                return [
                    
                ];
            }
        },
    });

    if (isLoading) {
        return (
            <div className="flex flex-col justify-center items-center py-24 space-y-4">
                <Loader2 className="h-10 w-10 animate-spin text-primary" />
                <p className="text-muted-foreground animate-pulse">Cargando catálogo...</p>
            </div>
        );
    }

    if (isError) {
        return (
            <div className="flex flex-col items-center justify-center py-20 px-4 text-center">
                <div className="bg-destructive/10 p-4 rounded-full mb-4">
                    <AlertCircle className="h-10 w-10 text-destructive" />
                </div>
                <h2 className="text-2xl font-bold mb-2">¡Ups! Algo salió mal</h2>
                <p className="text-muted-foreground max-w-md mb-6">
                    No pudimos cargar los productos en este momento. Por favor, intenta de nuevo.
                </p>
                <Button onClick={() => refetch()} variant="outline">
                    Reintentar cargar
                </Button>
            </div>
        );
    }

    return (
        <div className="container mx-auto py-8 space-y-12">
            <section className="relative overflow-hidden rounded-3xl bg-slate-900 py-16 px-8 md:px-12 text-white shadow-2xl">
                <div className="relative z-10 max-w-3xl">
                    <h1 className="text-4xl md:text-6xl font-black tracking-tight mb-6 leading-tight">
                        Bienvenido a <span className="text-white">IntelliCart</span>
                    </h1>
                    <p className="text-xl text-slate-300 mb-8 max-w-xl">
                        Descubre el futuro de las compras con recomendaciones personalizadas impulsadas por IA.
                    </p>
                    {!user && (
                        <div className="flex gap-4">
                            <Button size="lg" className="text-white cursor-pointer" onClick={() => window.location.href = '/register'}>
                                Crear cuenta
                            </Button>
                            <Button size="lg" variant="outline" className="text-black border-white cursor-pointer"  onClick={() => window.location.href = '/login'}>
                                Iniciar sesión
                            </Button>
                        </div>
                    )}
                </div>
                <div className="absolute top-0 right-0 w-1/3 h-full bg-gradient-to-l from-primary/20 to-transparent hidden lg:block" />
            </section>

            {user && (
                <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
                    <RecommendationList />
                </div>
            )}

            <section>
                <div className="flex items-end justify-between mb-8">
                    <div>
                        <h2 className="text-3xl font-bold tracking-tight">Productos Destacados</h2>
                        <p className="text-muted-foreground">Nuestra selección exclusiva para ti</p>
                    </div>
                    <div className="hidden md:block h-px flex-1 mx-8 bg-slate-200" />
                </div>
                
                {products && products.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                        {products.map((product) => (
                            <ProductCard key={product.id} product={product} />
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-20 bg-muted/30 rounded-2xl border-2 border-dashed">
                        <p className="text-muted-foreground italic">No hay productos disponibles en este momento.</p>
                    </div>
                )}
            </section>
        </div>
    );
};
