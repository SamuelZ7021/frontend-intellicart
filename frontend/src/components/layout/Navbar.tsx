import { Link } from 'react-router-dom';
import { useAuthStore } from '@/stores/auth.store';
import { useCartStore } from '@/stores/cart.store';
import { Button } from '@/components/ui/button';
import { ShoppingCart, LogOut } from 'lucide-react';

export const Navbar = () => {
    const { isAuthenticated, user, logout } = useAuthStore();
    const cartItems = useCartStore((state) => state.items);
    const cartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);

    return (
        <nav className="border-b bg-background">
            <div className="container mx-auto px-4 py-3 flex items-center justify-between">
                <Link to="/" className="text-xl font-bold">
                    IntelliCart
                </Link>

                <div className="flex items-center gap-4">
                    <Link to="/cart">
                        <Button variant="ghost" className="relative">
                            <ShoppingCart className="h-5 w-5" />
                            {cartCount > 0 && (
                                <span className="absolute -top-1 -right-1 bg-primary text-primary-foreground text-xs rounded-full h-5 w-5 flex items-center justify-center">
                                    {cartCount}
                                </span>
                            )}
                        </Button>
                    </Link>

                    {isAuthenticated ? (
                        <div className="flex items-center gap-2">
                            <span className="text-sm font-medium hidden md:inline-block">
                                {user?.username}
                            </span>
                            {user?.roles.includes('ADMIN') && (
                                <Link to="/admin/users">
                                    <Button variant="ghost" size="sm">Admin</Button>
                                </Link>
                            )}
                            <Button variant="ghost" size="icon" onClick={logout} title="Logout">
                                <LogOut className="h-5 w-5" />
                            </Button>
                        </div>
                    ) : (
                        <div className="flex items-center gap-2">
                            <Link to="/login">
                                <Button variant="ghost" size="sm">Login</Button>
                            </Link>
                            <Link to="/register">
                                <Button size="sm">Register</Button>
                            </Link>
                        </div>
                    )}
                </div>
            </div>
        </nav>
    );
};
