import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createProduct } from '@/lib/products';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Save, Loader2, Package, Image as ImageIcon, Sparkles } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle, AlertIcon } from '@/components/ui/alert';
import { Separator } from '@/components/ui/separator';

const productSchema = z.object({
  name: z.string().min(3, 'El nombre debe tener al menos 3 caracteres'),
  description: z.string().min(10, 'La descripción debe ser más detallada'),
  price: z.coerce.number().min(0.01, 'El precio debe ser mayor a 0'),
  stock: z.coerce.number().int().min(1, 'El stock mínimo es 1'),
  imageUrl: z.string().url('Debe ser una URL válida').optional().or(z.literal('')),
});

type ProductFormValues = z.infer<typeof productSchema>;

export const UserAddProductPage = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<ProductFormValues>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      stock: 1,
      imageUrl: '',
    }
  });

  const imageUrl = watch('imageUrl');

  const mutation = useMutation({
    mutationFn: (values: ProductFormValues) => createProduct(values),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      toast.success('¡Producto publicado con éxito! Ya está disponible en la tienda.');
      navigate('/');
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || error.message || 'Error al guardar el producto';
      toast.error(message);
    },
  });

  return (
    <div className="max-w-5xl mx-auto py-8 px-4 sm:px-6">
      <div className="flex items-center justify-between mb-8">
        <Button variant="ghost" onClick={() => navigate('/profile')} className="hover:bg-primary/5 hover:text-primary transition-all">
          <ArrowLeft className="mr-2 h-4 w-4" /> Volver a Mi Perfil
        </Button>
        <div className="flex items-center gap-2 text-primary font-bold bg-primary/10 px-4 py-2 rounded-full text-sm">
          <Sparkles className="w-4 h-4" />
          Modo Vendedor Activo
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <Card className="shadow-xl border-none ring-1 ring-slate-200 overflow-hidden">
            <div className="h-2 bg-primary w-full" />
            <CardHeader className="pb-4">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-primary/10 rounded-xl">
                  <Package className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <CardTitle className="text-3xl font-black tracking-tight text-slate-900">Publicar Producto</CardTitle>
                  <CardDescription className="text-base">Completa los datos para que todos puedan verlo en la tienda</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit((data) => mutation.mutate(data))} className="space-y-6">
                {mutation.isError && (
                    <Alert variant="destructive" className="animate-in slide-in-from-top-2 duration-300">
                        <AlertIcon variant="destructive" />
                        <AlertTitle>Error al publicar</AlertTitle>
                        <AlertDescription>
                            {mutation.error instanceof Error ? mutation.error.message : 'No pudimos procesar tu solicitud.'}
                        </AlertDescription>
                    </Alert>
                )}
                
                <div className="grid grid-cols-1 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="name" className="text-sm font-bold text-slate-700">Nombre del Artículo</Label>
                    <Input 
                      id="name" 
                      {...register('name')} 
                      placeholder="Ej. PlayStation 5 Slim con 2 controles" 
                      className={`h-12 text-lg px-4 ${errors.name ? 'border-destructive ring-destructive/20' : 'focus:ring-primary/20'}`}
                    />
                    {errors.name && <p className="text-xs text-destructive font-bold flex items-center gap-1 mt-1"><AlertCircle className="w-3 h-3" /> {errors.name.message}</p>}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="description" className="text-sm font-bold text-slate-700">Descripción Detallada</Label>
                    <textarea 
                      id="description" 
                      {...register('description')} 
                      placeholder="Cuéntanos más sobre tu producto: estado, garantía, qué incluye..." 
                      className={`w-full min-h-[150px] rounded-xl border-slate-200 bg-background px-4 py-3 text-base ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/20 focus-visible:border-primary disabled:cursor-not-allowed disabled:opacity-50 transition-all ${errors.description ? 'border-destructive' : ''}`}
                    />
                    {errors.description && <p className="text-xs text-destructive font-bold flex items-center gap-1 mt-1"><AlertCircle className="w-3 h-3" /> {errors.description.message}</p>}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="price" className="text-sm font-bold text-slate-700">Precio de Venta ($)</Label>
                      <div className="relative group">
                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold group-focus-within:text-primary transition-colors">$</span>
                        <Input 
                          id="price" 
                          type="number" 
                          step="0.01" 
                          {...register('price')} 
                          className={`pl-8 h-12 text-lg font-bold ${errors.price ? 'border-destructive' : ''}`}
                          placeholder="0.00"
                        />
                      </div>
                      {errors.price && <p className="text-xs text-destructive font-bold flex items-center gap-1 mt-1"><AlertCircle className="w-3 h-3" /> {errors.price.message}</p>}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="stock" className="text-sm font-bold text-slate-700">Stock Disponible</Label>
                      <Input 
                        id="stock" 
                        type="number" 
                        {...register('stock')} 
                        className={`h-12 text-lg font-medium ${errors.stock ? 'border-destructive' : ''}`}
                      />
                      {errors.stock && <p className="text-xs text-destructive font-bold flex items-center gap-1 mt-1"><AlertCircle className="w-3 h-3" /> {errors.stock.message}</p>}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="imageUrl" className="text-sm font-bold text-slate-700">URL de la Imagen</Label>
                    <div className="relative group">
                        <ImageIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-primary transition-colors" />
                        <Input 
                        id="imageUrl" 
                        {...register('imageUrl')} 
                        placeholder="https://images.unsplash.com/photo-..." 
                        className={`pl-11 h-12 text-base ${errors.imageUrl ? 'border-destructive' : ''}`}
                        />
                    </div>
                    {errors.imageUrl && <p className="text-xs text-destructive font-bold flex items-center gap-1 mt-1"><AlertCircle className="w-3 h-3" /> {errors.imageUrl.message}</p>}
                    <p className="text-[10px] text-muted-foreground italic mt-1">Sugerencia: Usa enlaces de alta calidad para mejores ventas.</p>
                  </div>
                </div>

                <div className="pt-4">
                  <Button 
                    type="submit" 
                    className="w-full h-14 text-xl font-black shadow-lg shadow-primary/30 transition-all hover:scale-[1.01] active:scale-[0.99]" 
                    disabled={mutation.isPending}
                  >
                    {mutation.isPending ? (
                      <><Loader2 className="mr-2 h-6 w-6 animate-spin" /> Publicando...</>
                    ) : (
                      <><Save className="mr-2 h-6 w-6" /> Publicar Producto</>
                    )}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar Info & Preview */}
        <div className="space-y-6">
          <Card className="overflow-hidden border-none ring-1 ring-slate-200 shadow-lg">
            <CardHeader className="bg-slate-50 border-b py-4">
              <CardTitle className="text-sm font-bold flex items-center gap-2">
                <ImageIcon className="w-4 h-4 text-primary" />
                Vista Previa
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
                <div className="aspect-square bg-slate-100 flex items-center justify-center relative group">
                    {imageUrl ? (
                        <img 
                            src={imageUrl} 
                            alt="Preview" 
                            className="w-full h-full object-cover"
                            onError={(e) => {
                                (e.target as HTMLImageElement).src = 'https://placehold.co/600x600/f1f5f9/94a3b8?text=Imagen+No+Válida';
                            }}
                        />
                    ) : (
                        <div className="text-center p-8">
                            <ImageIcon className="w-12 h-12 text-slate-300 mx-auto mb-2" />
                            <p className="text-xs text-slate-400 font-medium">Pega una URL para ver la imagen aquí</p>
                        </div>
                    )}
                </div>
                <div className="p-4 bg-white border-t space-y-2">
                    <h4 className="font-bold text-slate-800 truncate">{watch('name') || 'Nombre del producto'}</h4>
                    <p className="text-primary font-black text-lg">${Number(watch('price') || 0).toFixed(2)}</p>
                </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-900 text-white border-none shadow-xl">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-bold flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-yellow-400" />
                Tips Pro
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-sm text-slate-300">
              <div className="flex gap-3">
                <div className="h-6 w-6 rounded-full bg-primary/20 flex items-center justify-center shrink-0 font-bold text-primary text-xs">1</div>
                <p>Usa un título que incluya marca y modelo.</p>
              </div>
              <div className="flex gap-3">
                <div className="h-6 w-6 rounded-full bg-primary/20 flex items-center justify-center shrink-0 font-bold text-primary text-xs">2</div>
                <p>Las descripciones largas venden un 40% más.</p>
              </div>
              <div className="flex gap-3">
                <div className="h-6 w-6 rounded-full bg-primary/20 flex items-center justify-center shrink-0 font-bold text-primary text-xs">3</div>
                <p>Asegúrate de tener stock antes de publicar.</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};