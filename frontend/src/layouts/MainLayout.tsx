import { Outlet } from 'react-router-dom';
import { Navbar } from '@/components/layout/Navbar';

export const MainLayout = () => {
    return (
        <div className="min-h-screen flex flex-col">
            <Navbar />
            <main className="flex-1 container mx-auto px-4 py-8">
                <Outlet />
            </main>
            <footer className="border-t py-6 text-center text-sm text-muted-foreground">
                © {new Date().getFullYear()} IntelliCart. All rights reserved.
            </footer>
        </div>
    );
};
