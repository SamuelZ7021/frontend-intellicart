import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { jwtDecode } from 'jwt-decode';

interface User {
    id: string;
    username: string;
    email: string;
    roles: string[];
}

interface AuthState {
    token: string | null;
    user: User | null;
    isAuthenticated: boolean;
    login: (token: string) => void;
    updateToken: (token: string) => void;
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
                    const decoded: any = jwtDecode(token);
                    // Normalizar roles: quitar prefijo ROLE_ si existe
                    const rawRoles = decoded.roles || [];
                    const normalizedRoles = rawRoles.map((role: string) => 
                        role.startsWith('ROLE_') ? role.replace('ROLE_', '') : role
                    );

                    const user: User = {
                        id: decoded.userId || decoded.sub,
                        username: decoded.username || decoded.sub,
                        email: decoded.email || '',
                        roles: normalizedRoles,
                    };
                    localStorage.setItem('token', token);
                    set({ token, user, isAuthenticated: true });
                } catch (error) {
                    console.error("Invalid token", error);
                }
            },
            updateToken: (token: string) => {
                try {
                    const decoded: any = jwtDecode(token);
                    // Normalizar roles: quitar prefijo ROLE_ si existe
                    const rawRoles = decoded.roles || [];
                    const normalizedRoles = rawRoles.map((role: string) => 
                        role.startsWith('ROLE_') ? role.replace('ROLE_', '') : role
                    );

                    const user: User = {
                        id: decoded.userId || decoded.sub,
                        username: decoded.username || decoded.sub,
                        email: decoded.email || '',
                        roles: normalizedRoles,
                    };
                    localStorage.setItem('token', token);
                    set({ token, user });
                } catch (error) {
                    console.error("Invalid token", error);
                }
            },
            logout: () => {
                localStorage.removeItem('token');
                set({ token: null, user: null, isAuthenticated: false });
            },
        }),
        {
            name: 'auth-storage', // name of item in the storage (must be unique)
        }
    )
);
