import { Link } from 'react-router-dom';
import { useAuthStore } from '@/stores/auth.store';
import { useCartStore } from '@/stores/cart.store';
import { Button } from '@/components/ui/button';
import { ShoppingCart, LogOut, User as UserIcon } from 'lucide-react';

export const Navbar = () => {
    const { isAuthenticated, user, logout } = useAuthStore();
    const cartItems = useCartStore((state) => state.items);
    const cartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);

    return (
        <nav className="border-b bg-background sticky top-0 z-50 shadow-sm">
            <div className="container mx-auto px-4 py-3 flex items-center justify-between">
                <Link to="/" className="text-xl font-bold tracking-tight hover:text-primary transition-colors">
                    IntelliCart
                </Link>

                <div className="flex items-center gap-4">
                    <Link to="/cart">
                        <Button variant="ghost" className="relative h-10 w-10 p-0">
                            <ShoppingCart className="h-5 w-5" />
                            {cartCount > 0 && (
                                <span className="absolute -top-1 -right-1 bg-primary text-primary-foreground text-[10px] font-bold rounded-full h-4 w-4 flex items-center justify-center">
                                    {cartCount}
                                </span>
                            )}
                        </Button>
                    </Link>

                    {isAuthenticated ? (
                        <div className="flex items-center gap-3">
                            <Link 
                                to="/profile" 
                                className="flex items-center gap-2 px-3 py-1.5 rounded-full hover:bg-secondary transition-all group"
                            >
                                <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                                    <UserIcon className="h-4 w-4 text-primary" />
                                </div>
                                <span className="text-sm font-semibold hidden md:inline-block">
                                    {user?.username}
                                </span>
                            </Link>

                            {user?.roles.includes('SELLER') && (
                                <Link to="/admin/products" className="hidden sm:block">
                                    <Button variant="ghost" size="sm" className="font-semibold">Vendedor</Button>
                                </Link>
                            )}
                            {user?.roles.includes('ADMIN') && (
                                <Link to="/admin/dashboard" className="hidden sm:block">
                                    <Button variant="outline" size="sm" className="font-semibold text-purple-600 border-purple-200">Admin</Button>
                                </Link>
                            )}
                            
                            <Button 
                                variant="ghost" 
                                size="icon" 
                                onClick={logout} 
                                title="Cerrar Sesión"
                                className="text-muted-foreground hover:text-destructive"
                            >
                                <LogOut className="h-5 w-5" />
                            </Button>
                        </div>
                    ) : (
                        <div className="flex items-center gap-2">
                            <Link to="/login">
                                <Button variant="ghost" size="sm">Entrar</Button>
                            </Link>
                            <Link to="/register">
                                <Button size="sm">Registrarse</Button>
                            </Link>
                        </div>
                    )}
                </div>
            </div>
        </nav>
    );
};
