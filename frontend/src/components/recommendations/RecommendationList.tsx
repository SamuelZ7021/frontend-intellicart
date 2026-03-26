import { useQuery } from "@tanstack/react-query";
import { useAuthStore } from "@/stores/auth.store";
import { getRecommendations } from '@/lib/recommendations';
import { ProductCard } from "../products/ProductCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const RecommendationList = () => {
    const {user} = useAuthStore();

    const {data: recommendations, isLoading, error} = useQuery({
        queryKey: ['recommendations', user?.id],
        queryFn: () => getRecommendations(user?.id!),
        enabled: !!user?.id,
        staleTime: 1000 * 60 * 5,
    });
    if(isLoading) return <p> Cargando recomendaciones...</p>
    
    // Si hay error o no hay datos, no mostramos nada
    if(error || !recommendations) return null;

    // Si data es un objeto con la propiedad 'recommendations', la usamos
    const items = Array.isArray(recommendations) 
        ? recommendations 
        : (recommendations as any).recommendations;

    // Si aún no es un array, no podemos renderizar nada
    if (!Array.isArray(items)) return null;

    return (
        <section className="my-8">
            <h2 className="text-2xl font-bold mb-4"> Recomendaciones para ti</h2> 
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {items.map((product) => (
                    <ProductCard key={product.id} product={product}/>
                ))}
            </div>
        </section>
    )
}