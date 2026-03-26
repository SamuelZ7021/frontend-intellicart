// src/pages/admin/ProductFormPage.tsx
import { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getProductById, createProduct, updateProduct } from '@/lib/products';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import { ArrowLeft, Save, Loader2 } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle, AlertIcon } from '@/components/ui/alert';

const productSchema = z.object({
    name: z.string().min(3, 'El nombre debe tener al menos 3 caracteres'),
    description: z.string().min(10, 'La descripción debe ser más detallada'),
    price: z.coerce.number().min(0.01, 'El precio debe ser mayor a 0'),
    stock: z.coerce.number().int().min(0, 'El stock no puede ser negativo'),
    image: z.string().url('Debe ser una URL válida').optional().or(z.literal('')),
});

type ProductFormValues = z.infer<typeof productSchema>;

export const ProductFormPage = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const isEdit = !!id;

    const { register, handleSubmit, reset, formState: { errors } } = useForm<ProductFormValues>({
        resolver: zodResolver(productSchema) as any,
    });

    // Cargar datos si es edición
    const { data: product, isLoading: isLoadingProduct } = useQuery({
        queryKey: ['product', id],
        queryFn: () => getProductById(Number(id)),
        enabled: isEdit,
    });

    useEffect(() => {
        if (product) reset(product);
    }, [product, reset]);

    const mutation = useMutation({
        mutationFn: (values: ProductFormValues) =>
            isEdit ? updateProduct(Number(id), values) : createProduct(values),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['admin-products'] });
            toast.success(isEdit ? 'Producto actualizado' : 'Producto creado');
            navigate('/admin/products');
        },
        onError: () => toast.error('Error al guardar el producto'),
    });

    if (isEdit && isLoadingProduct) return <div className="flex justify-center py-20"><Loader2 className="animate-spin text-primary" /></div>;

    return (
        <div className="container mx-auto py-8 max-w-2xl px-4">
            <Button variant="ghost" onClick={() => navigate('/admin/products')} className="mb-4">
                <ArrowLeft className="mr-2 h-4 w-4" /> Volver al inventario
            </Button>

            <Card>
                <CardHeader>
                    <CardTitle className="text-2xl font-bold">{isEdit ? `Editar: ${product?.name}` : 'Nuevo Producto'}</CardTitle>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit((data) => mutation.mutate(data))} className="space-y-4">
                        {mutation.isError && (
                            <Alert variant="destructive">
                                <AlertIcon variant="destructive" />
                                <AlertTitle>Error al guardar</AlertTitle>
                                <AlertDescription>Ocurrió un error al intentar guardar el producto. Por favor intenta de nuevo.</AlertDescription>
                            </Alert>
                        )}
                        <div className="space-y-2">
                            <Label htmlFor="name">Nombre del Producto</Label>
                            <Input id="name" {...register('name')} placeholder="Ej. Smartphone X" />
                            {errors.name && <p className="text-sm text-red-500">{errors.name.message}</p>}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="description">Descripción</Label>
                            <Input id="description" {...register('description')} placeholder="Características principales..." />
                            {errors.description && <p className="text-sm text-red-500">{errors.description.message}</p>}
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="price">Precio ($)</Label>
                                <Input id="price" type="number" step="0.01" {...register('price')} />
                                {errors.price && <p className="text-sm text-red-500">{errors.price.message}</p>}
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="stock">Stock Inicial</Label>
                                <Input id="stock" type="number" {...register('stock')} />
                                {errors.stock && <p className="text-sm text-red-500">{errors.stock.message}</p>}
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="image">URL de la Imagen</Label>
                            <Input id="image" {...register('image')} placeholder="https://..." />
                            {errors.image && <p className="text-sm text-red-500">{errors.image.message}</p>}
                        </div>

                        <Button type="submit" className="w-full h-11" disabled={mutation.isPending}>
                            {mutation.isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
                            {isEdit ? 'Guardar Cambios' : 'Crear Producto'}
                        </Button>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
};