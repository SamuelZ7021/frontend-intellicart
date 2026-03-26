import { useAuthStore } from '@/stores/auth.store';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { User, PackagePlus, Settings, ShoppingBag, ShieldCheck, Store, UserRound, Loader2, PlusCircle } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import api from '@/lib/api';
import { useState } from 'react';
import { toast } from 'sonner';
import { Alert, AlertDescription, AlertTitle, AlertIcon } from '@/components/ui/alert';

export const ProfilePage = () => {
  const { user, updateToken } = useAuthStore();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  if (!user) return null;

  const isSeller = user.roles.includes('SELLER');
  const isAdmin = user.roles.includes('ADMIN');

  const handleToggleSeller = async () => {
    try {
      setLoading(true);
      setErrorMsg(null);
      const response = await api.post('/users/me/toggle-seller');
      
      if (response.data && response.data.token) {
        updateToken(response.data.token);
        toast.success(isSeller ? 'Ya no eres vendedor' : '¡Ahora eres vendedor!');
      } else {
        throw new Error('El servidor no devolvió un token actualizado');
      }
    } catch (error: any) {
      console.error("Error toggling seller role", error);
      const message = error.response?.data?.message || 'No se pudo cambiar el rol de vendedor. Inténtalo de nuevo.';
      setErrorMsg(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in duration-500 px-4 py-8">
      <div className="flex flex-col md:flex-row gap-8 items-start">
        {/* User Info Sidebar */}
        <Card className="w-full md:w-1/3 shadow-md border-t-4 border-t-primary overflow-hidden">
          <CardHeader className="text-center pb-2">
            <div className="mx-auto bg-primary/10 p-4 rounded-full w-20 h-20 flex items-center justify-center mb-4">
              <User className="w-10 h-10 text-primary" />
            </div>
            <CardTitle className="text-2xl font-bold">{user.username}</CardTitle>
            <CardDescription>{user.email}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Separator />
            <div className="space-y-2">
              <p className="text-[10px] font-black uppercase text-muted-foreground tracking-widest">Estado de la cuenta</p>
              <div className="flex flex-wrap gap-2">
                {user.roles.length > 0 ? (
                  user.roles.map((role) => (
                    <span 
                      key={role} 
                      className="px-2 py-1 bg-secondary text-secondary-foreground rounded-md text-xs font-bold flex items-center gap-1 border border-secondary-foreground/10"
                    >
                      {role === 'ADMIN' && <ShieldCheck className="w-3 h-3 text-red-500" />}
                      {role === 'SELLER' && <Store className="w-3 h-3 text-blue-500" />}
                      {role}
                    </span>
                  ))
                ) : (
                  <span className="text-xs text-muted-foreground italic">Usuario Estándar</span>
                )}
              </div>
            </div>
            
            <Separator />

            {errorMsg && (
              <Alert variant="destructive" className="mt-2">
                <AlertIcon variant="destructive" />
                <AlertTitle>Error</AlertTitle>
                <AlertDescription className="text-xs">{errorMsg}</AlertDescription>
              </Alert>
            )}
            
            <Button 
              variant={isSeller ? "outline" : "default"} 
              className={`w-full gap-2 h-11 transition-all ${!isSeller ? 'shadow-lg shadow-primary/20 hover:scale-[1.02]' : ''}`} 
              onClick={handleToggleSeller}
              disabled={loading}
            >
              {loading ? (
                <><Loader2 className="w-4 h-4 animate-spin" /> Procesando...</>
              ) : isSeller ? (
                <><UserRound className="w-4 h-4" /> Dejar de ser Vendedor</>
              ) : (
                <><Store className="w-4 h-4" /> Ser Vendedor</>
              )}
            </Button>
          </CardContent>
        </Card>

        {/* Main Content Area */}
        <div className="flex-1 w-full space-y-6">
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold tracking-tight">Mi Perfil</h1>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Quick Actions Card */}
            {(isSeller || isAdmin) && (
              <Card className="hover:shadow-lg transition-all cursor-default group border-l-4 border-l-green-500 overflow-hidden relative">
                <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                    <Store className="w-16 h-16 text-green-600" />
                </div>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <PackagePlus className="w-5 h-5 text-green-600" />
                    Panel de Vendedor
                  </CardTitle>
                  <CardDescription>Gestiona tus productos y ventas</CardDescription>
                </CardHeader>
                <CardContent className="flex flex-col gap-2 relative z-10">
                  <Button 
                    onClick={() => navigate('/profile/add-product')} 
                    className="w-full bg-green-600 hover:bg-green-700 mt-2 h-10 gap-2"
                  >
                    <PlusCircle className="w-4 h-4" /> Publicar Nuevo Producto
                  </Button>
                  <Button 
                    variant="outline"
                    onClick={() => navigate('/admin/products')} 
                    className="w-full border-green-200 hover:bg-green-50 text-green-700 h-10"
                  >
                    Ver Mis Productos
                  </Button>
                </CardContent>
              </Card>
            )}

            <Card className="hover:shadow-lg transition-all cursor-default group border-l-4 border-l-blue-500 overflow-hidden relative">
              <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                  <ShoppingBag className="w-16 h-16 text-blue-600" />
              </div>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center gap-2">
                  <ShoppingBag className="w-5 h-5 text-blue-600" />
                  Mis Compras
                </CardTitle>
                <CardDescription>Revisa el historial de tus pedidos</CardDescription>
              </CardHeader>
              <CardContent className="relative z-10">
                <Button 
                  variant="outline" 
                  className="w-full mt-2 h-10 border-blue-200 hover:bg-blue-50 text-blue-700"
                  onClick={() => navigate('/orders')}
                >
                  Ver Pedidos
                </Button>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-all cursor-default group border-l-4 border-l-slate-400 opacity-75 grayscale hover:grayscale-0 hover:opacity-100 transition-all overflow-hidden relative">
              <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                  <Settings className="w-16 h-16 text-slate-600" />
              </div>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Settings className="w-5 h-5 text-slate-600" />
                  Configuración
                </CardTitle>
                <CardDescription>Edita tus datos y preferencias</CardDescription>
              </CardHeader>
              <CardContent className="relative z-10">
                <Button variant="secondary" className="w-full mt-2 h-10" disabled>
                  Editar Cuenta (Próximamente)
                </Button>
              </CardContent>
            </Card>

            {isAdmin && (
              <Card className="hover:shadow-lg transition-all cursor-default group border-l-4 border-l-purple-500 overflow-hidden relative">
                <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                    <ShieldCheck className="w-16 h-16 text-purple-600" />
                </div>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <ShieldCheck className="w-5 h-5 text-purple-600" />
                    Panel de Control
                  </CardTitle>
                  <CardDescription>Gestionar usuarios e inventario global</CardDescription>
                </CardHeader>
                <CardContent className="relative z-10">
                  <Button 
                    variant="default" 
                    onClick={() => navigate('/admin/dashboard')} 
                    className="w-full bg-purple-600 hover:bg-purple-700 mt-2 h-10"
                  >
                    Administración
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
