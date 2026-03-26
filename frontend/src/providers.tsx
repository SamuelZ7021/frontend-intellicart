import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'sonner';
import { BrowserRouter } from 'react-router-dom';
import type { ReactNode } from 'react';
import { NotificationListener } from './components/notifications/NotificationListener';

const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            staleTime: 60 * 1000,
            refetchOnWindowFocus: false,
        },
    },
});

interface ProvidersProps {
    children: ReactNode;
}

export function Providers({ children }: ProvidersProps) {
    return (
        <QueryClientProvider client={queryClient}>
            <BrowserRouter>
                {children}
                <NotificationListener />
                <Toaster richColors position="top-right" />
            </BrowserRouter>
        </QueryClientProvider>
    );
}
