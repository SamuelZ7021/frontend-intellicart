import { useEffect } from 'react';
import { useAuthStore } from '@/stores/auth.store';
import { toast } from 'sonner';
import { Bell, Sparkles, PartyPopper, Wallet } from 'lucide-react';

export const NotificationListener = () => {
    const { user, isAuthenticated, token } = useAuthStore();

    useEffect(() => {
        if (!isAuthenticated || !user?.id) return;

        // Limpiar la URL base
        let baseUrl = import.meta.env.VITE_USER_SERVICE_URL;
        if (baseUrl.endsWith('/')) baseUrl = baseUrl.slice(0, -1);
            
        // EventSource no soporta cabeceras Authorization. Pasamos el token como query param.
        const sseUrl = `${baseUrl}/notifications/stream/${user.id}${token ? `?token=${token}` : ''}`;
        
        console.log(`[SSE] Conectando a: ${baseUrl}/notifications/stream/${user.id}`);
        
        const eventSource = new EventSource(sseUrl);

        eventSource.onopen = () => {
            console.log('[SSE] ✅ Conexión establecida con éxito');
        };

        eventSource.onmessage = (event) => {
            console.log('[SSE] Mensaje recibido:', event.data);
            try {
                const data = JSON.parse(event.data);
                
                // Detectar si es una notificación de pago (paga/payment)
                const isPayment = 
                    data.type === 'PAYMENT' || 
                    data.type === 'PAGO' || 
                    data.title?.toLowerCase().includes('pago') || 
                    data.title?.toLowerCase().includes('paga') ||
                    data.message?.toLowerCase().includes('pago') ||
                    data.message?.toLowerCase().includes('paga') ||
                    data.message?.toLowerCase().includes('éxito');

                if (isPayment) {
                    toast.success(data.title || '¡Pago Recibido!', {
                        description: data.message || 'Tu pago ha sido procesado con éxito. ¡Gracias!',
                        icon: <PartyPopper className="h-5 w-5 text-green-500" />,
                        duration: 8000,
                        style: { border: '1px solid #22c55e', backgroundColor: '#f0fdf4' }
                    });
                } else {
                    toast(data.title || '¡Nueva actualización!', {
                        description: data.message || 'Tienes una nueva notificación.',
                        icon: <Bell className="h-5 w-5 text-primary" />,
                        duration: 5000,
                    });
                }
            } catch (error) {
                const msgLower = String(event.data).toLowerCase();
                if (msgLower.includes('pago') || msgLower.includes('paga')) {
                    toast.success('Confirmación de Pago', {
                        description: event.data,
                        icon: <Wallet className="h-5 w-5 text-green-600" />,
                        duration: 7000,
                    });
                } else {
                    toast('Notificación de IntelliCart', {
                        description: event.data,
                        icon: <Sparkles className="h-5 w-5 text-yellow-500" />,
                    });
                }
            }
        };

        eventSource.onerror = (error) => {
            console.error('[SSE] ❌ Error en la conexión. Revisa los logs del backend.');
            eventSource.close();
        };

        return () => {
            eventSource.close();
        };
    }, [isAuthenticated, user?.id, token]);

    return null;
};
