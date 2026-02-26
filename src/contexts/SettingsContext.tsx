import React, { createContext, useContext, useState, useEffect, type ReactNode } from 'react';

// --- KIỂU DỮ LIỆU ---
type Lang = 'vi' | 'en';
type Theme = 'light' | 'dark';

interface ISettingsContext {
    theme: Theme;
    lang: Lang;
    toggleTheme: () => void;
    setLang: (lang: Lang) => void;
}

const SettingsContext = createContext<ISettingsContext | null>(null);

const THEME_KEY = 'healhaven_theme';
const LANG_KEY = 'healhaven_lang';

export const SettingsProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [theme, setTheme] = useState<Theme>(() => {
        return (localStorage.getItem(THEME_KEY) as Theme) || 'light';
    });

    const [lang, setLangState] = useState<Lang>(() => {
        return (localStorage.getItem(LANG_KEY) as Lang) || 'vi';
    });

    // Áp dụng theme lên <html> mỗi khi thay đổi
    useEffect(() => {
        document.documentElement.setAttribute('data-theme', theme);
        localStorage.setItem(THEME_KEY, theme);
    }, [theme]);

    useEffect(() => {
        localStorage.setItem(LANG_KEY, lang);
    }, [lang]);

    const toggleTheme = () => setTheme(prev => prev === 'light' ? 'dark' : 'light');

    const setLang = (l: Lang) => setLangState(l);

    return (
        <SettingsContext.Provider value={{ theme, lang, toggleTheme, setLang }}>
            {children}
        </SettingsContext.Provider>
    );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useSettings = () => {
    const context = useContext(SettingsContext);
    if (!context) throw new Error('useSettings phải được dùng bên trong SettingsProvider');
    return context;
};
