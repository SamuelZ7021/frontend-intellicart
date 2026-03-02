import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { jwtDecode } from 'jwt-decode';

interface User {
    id: number;
    username: string;
    email: string;
    roles: string[];
}

interface AuthState {
    token: string | null;
    user: User | null;
    isAuthenticated: boolean;
    login: (token: string) => void;
    logout: () => void;
}

export const useAuthStore = create<AuthState>()(
    persist(
        (set) => ({
            token: null,
            user: null,
            isAuthenticated: false,
            login: (token: string) => {
                try {
                    // Decode token to get user info if available in payload
                    // Adjust based on your JWT structure
                    const decoded: any = jwtDecode(token);
                    const user: User = {
                        id: decoded.userId || decoded.sub, // Adapt based on token claims
                        username: decoded.username || decoded.sub,
                        email: decoded.email || '',
                        roles: decoded.roles || [],
                    };

                    set({ token, user, isAuthenticated: true });
                } catch (error) {
                    console.error("Invalid token", error);
                }
            },
            logout: () => set({ token: null, user: null, isAuthenticated: false }),
        }),
        {
            name: 'auth-storage', // name of item in the storage (must be unique)
        }
    )
);
