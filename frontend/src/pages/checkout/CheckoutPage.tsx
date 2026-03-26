import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useCartStore } from '@/stores/cart.store';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { createOrder } from '@/lib/orders';
import { Separator } from '@/components/ui/separator';
import { CheckCircle2, Truck, CreditCard, MapPin, ShoppingBag, XCircle } from 'lucide-react';
import { FeedbackCard } from '@/components/ui/feedback-card';

const checkoutSchema = z.object({
  address: z.string().min(10, 'La dirección debe tener al menos 10 caracteres'),
  city: z.string().min(2, 'La ciudad es requerida'),
  zipCode: z.string().min(4, 'Código postal inválido'),
});

type CheckoutForm = z.infer<typeof checkoutSchema>;

export const CheckoutPage = () => {
  const { items, getTotal, clearCart } = useCartStore();
  const [isOrdered, setIsOrdered] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CheckoutForm>({
    resolver: zodResolver(checkoutSchema),
  });

  const onSubmit = async (data: CheckoutForm) => {
    if (items.length === 0) {
      toast.error('Tu carrito está vacío');
      return;
    }

    setIsSubmitting(true);
    setErrorMsg(null);
    try {
      const orderRequest = {
        items: items.map((item) => ({
          productId: Number(item.productId),
          quantity: item.quantity,
        })),
        shippingAddress: `${data.address}, ${data.city}, CP: ${data.zipCode}`,
      };

      const order = await createOrder(orderRequest);
      toast.success(`Orden #${order.id} recibida.`);
      clearCart();
      setIsOrdered(true);
    } catch (error) {
      setErrorMsg('No pudimos procesar tu pedido en este momento. Por favor, intenta de nuevo.');
      toast.error('Error al procesar la orden');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isOrdered) {
    return (
      <div className="container mx-auto py-12 px-4">
        <FeedbackCard
          type="success"
          title="¡Pedido Confirmado!"
          description="Tu compra se ha procesado con éxito. Pronto recibirás los detalles en tu correo."
          actionLabel="Volver a la tienda"
          onAction={() => navigate('/')}
          secondaryActionLabel="Ver mis pedidos"
          onSecondaryAction={() => navigate('/orders')}
        />
      </div>
    );
  }

  if (errorMsg) {
    return (
      <div className="container mx-auto py-12 px-4">
        <FeedbackCard
          type="error"
          title="Error en el Pedido"
          description={errorMsg}
          actionLabel="Intentar de nuevo"
          onAction={() => setErrorMsg(null)}
          secondaryActionLabel="Volver al carrito"
          onSecondaryAction={() => navigate('/cart')}
        />
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="max-w-2xl mx-auto p-12 text-center mt-12 bg-muted/20 rounded-xl border-2 border-dashed">
        <ShoppingBag className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
        <h2 className="text-2xl font-semibold mb-2 text-gray-700">Tu carrito está vacío</h2>
        <p className="text-muted-foreground mb-6">Parece que aún no has añadido nada a tu bolsa de compras.</p>
        <Button onClick={() => navigate('/')} size="lg">Ir a explorar productos</Button>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6 md:p-10">
      <div className="flex items-center gap-3 mb-8">
        <h1 className="text-3xl font-extrabold tracking-tight">Finalizar Compra</h1>
        <span className="bg-primary/10 text-primary text-xs font-bold px-2 py-1 rounded uppercase tracking-wider">
          Pago Seguro
        </span>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        <div className="lg:col-span-7 space-y-8">
          {/* Dirección de Envío */}
          <section className="space-y-4">
            <div className="flex items-center gap-2 text-xl font-semibold border-b pb-2">
              <MapPin className="w-5 h-5 text-primary" />
              <h2>Dirección de Envío</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
              <div className="md:col-span-2 space-y-2">
                <Label htmlFor="address">Calle y Número</Label>
                <Input
                  id="address"
                  placeholder="Ej: Av. Principal 123, Depto 4B"
                  {...register('address')}
                  className={errors.address ? 'border-destructive ring-destructive/20 focus-visible:ring-destructive' : 'h-11'}
                />
                {errors.address && <p className="text-xs font-medium text-destructive">{errors.address.message}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="city">Ciudad</Label>
                <Input
                  id="city"
                  placeholder="Ej: Ciudad de México"
                  {...register('city')}
                  className={errors.city ? 'border-destructive ring-destructive/20 focus-visible:ring-destructive' : 'h-11'}
                />
                {errors.city && <p className="text-xs font-medium text-destructive">{errors.city.message}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="zipCode">Código Postal</Label>
                <Input
                  id="zipCode"
                  placeholder="Ej: 06700"
                  {...register('zipCode')}
                  className={errors.zipCode ? 'border-destructive ring-destructive/20 focus-visible:ring-destructive' : 'h-11'}
                />
                {errors.zipCode && <p className="text-xs font-medium text-destructive">{errors.zipCode.message}</p>}
              </div>
            </div>
          </section>

          {/* Método de Envío */}
          <section className="space-y-4">
            <div className="flex items-center gap-2 text-xl font-semibold border-b pb-2">
              <Truck className="w-5 h-5 text-primary" />
              <h2>Método de Envío</h2>
            </div>
            <div className="pt-2">
              <label className="flex items-center justify-between p-4 border-2 border-primary bg-primary/5 rounded-xl cursor-pointer">
                <div className="flex gap-4 items-center">
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                    <Truck className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <p className="font-bold">Envío Express Estándar</p>
                    <p className="text-sm text-muted-foreground">3 a 5 días hábiles</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-bold text-green-600">Gratis</p>
                </div>
              </label>
            </div>
          </section>

          {/* Pago */}
          <section className="space-y-4">
            <div className="flex items-center gap-2 text-xl font-semibold border-b pb-2">
              <CreditCard className="w-5 h-5 text-primary" />
              <h2>Forma de Pago</h2>
            </div>
            <div className="pt-2">
              <div className="p-4 border-2 border-dashed rounded-xl bg-muted/30">
                <div className="flex gap-4 items-start">
                  <div className="w-12 h-12 bg-muted rounded-full flex items-center justify-center shrink-0">
                    <ShoppingBag className="w-6 h-6 text-muted-foreground" />
                  </div>
                  <div>
                    <p className="font-bold">Pago contra entrega</p>
                    <p className="text-sm text-muted-foreground">
                      Actualmente solo aceptamos pago en efectivo al momento de recibir tu pedido para garantizar tu seguridad.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>

        {/* Resumen Lateral */}
        <div className="lg:col-span-5">
          <Card className="sticky top-10 border-none shadow-xl bg-slate-50 overflow-hidden">
            <div className="h-2 bg-primary w-full" />
            <CardHeader className="pb-4">
              <CardTitle className="text-xl">Resumen del Pedido</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="max-h-[350px] overflow-y-auto space-y-4 pr-2 -mx-2 px-2 scrollbar-thin">
                {items.map((item) => (
                  <div key={item.productId} className="flex gap-4 items-center group">
                    <div className="h-16 w-16 rounded-lg bg-white border flex-shrink-0 overflow-hidden flex items-center justify-center shadow-sm">
                      {item.imageUrl ? (
                        <img src={item.imageUrl} alt={item.name} className="h-full w-full object-cover transition-transform group-hover:scale-110" />
                      ) : (
                        <ShoppingBag className="w-6 h-6 text-muted-foreground/30" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm text-gray-900 truncate">{item.name}</p>
                      <p className="text-xs text-muted-foreground">Cant: {item.quantity}</p>
                    </div>
                    <p className="font-semibold text-sm">${(item.price * item.quantity).toFixed(2)}</p>
                  </div>
                ))}
              </div>
              
              <Separator className="bg-gray-200" />
              
              <div className="space-y-3">
                <div className="flex justify-between text-sm text-gray-600">
                  <span>Subtotal</span>
                  <span className="font-medium">${getTotal().toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm text-gray-600">
                  <span>Envío estimado</span>
                  <span className="text-green-600 font-bold uppercase text-[10px] tracking-widest bg-green-50 px-2 py-0.5 rounded">Gratis</span>
                </div>
                <Separator className="bg-gray-200/50" />
                <div className="flex justify-between items-baseline pt-2">
                  <span className="text-lg font-bold text-gray-900">Total</span>
                  <div className="text-right">
                    <p className="text-2xl font-black text-primary">${getTotal().toFixed(2)}</p>
                    <p className="text-[10px] text-muted-foreground uppercase tracking-tighter">IVA incluido</p>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex-col gap-3 pt-2 pb-8 px-8">
              <Button 
                type="submit" 
                className="w-full text-lg h-14 shadow-lg shadow-primary/20 transition-all hover:scale-[1.02] active:scale-[0.98]" 
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Procesando Compra...' : 'Confirmar Pedido'}
              </Button>
              <p className="text-[10px] text-center text-muted-foreground flex items-center gap-1 justify-center">
                <CheckCircle2 className="w-3 h-3" /> Transacción segura y encriptada
              </p>
            </CardFooter>
          </Card>
        </div>
      </form>
    </div>
  );
};