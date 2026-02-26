import React, { createContext, useContext, useState, useEffect, type ReactNode } from 'react';

// --- KIỂU DỮ LIỆU ---
export interface User {
    id: string;
    name: string;
    email: string;
    role: 'attendee' | 'host' | 'venue' | 'admin';
    avatar?: string; // URL ảnh đại diện (tùy chọn)
}

interface IAuthContext {
    user: User | null;
    isLoggedIn: boolean;
    isLoading: boolean;
    login: (userData: User, token: string) => void;
    logout: () => void;
}

const AuthContext = createContext<IAuthContext | null>(null);

// --- KEY lưu vào localStorage ---
const TOKEN_KEY = 'healhaven_token';
const USER_KEY = 'healhaven_user';

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true); // Đang kiểm tra session

    // Khôi phục session từ localStorage khi app khởi động
    useEffect(() => {
        try {
            const savedToken = localStorage.getItem(TOKEN_KEY);
            const savedUser = localStorage.getItem(USER_KEY);

            if (savedToken && savedUser) {
                setUser(JSON.parse(savedUser));
            }
        } catch {
            // Dữ liệu localStorage bị lỗi → xóa đi
            localStorage.removeItem(TOKEN_KEY);
            localStorage.removeItem(USER_KEY);
        } finally {
            setIsLoading(false);
        }
    }, []);

    const login = (userData: User, token: string) => {
        setUser(userData);
        localStorage.setItem(TOKEN_KEY, token);
        localStorage.setItem(USER_KEY, JSON.stringify(userData));
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem(TOKEN_KEY);
        localStorage.removeItem(USER_KEY);
    };

    return (
        <AuthContext.Provider value={{ user, isLoggedIn: !!user, isLoading, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) throw new Error('useAuth phải được dùng bên trong AuthProvider');
    return context;
};
