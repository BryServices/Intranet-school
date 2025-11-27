
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, Theme, Language } from '../types';

interface AppContextType {
  user: User | null;
  login: (matricule: string) => void;
  logout: () => void;
  updateUser: (data: Partial<User>) => void;
  theme: Theme;
  toggleTheme: () => void;
  language: Language;
  setLanguage: (lang: Language) => void;
  notifications: number;
  clearNotifications: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const DUMMY_USER: User = {
  id: 'u1',
  matricule: '2025-XYZ-001',
  firstName: 'Alexandre',
  lastName: 'Dupont',
  fullName: 'Alexandre Dupont',
  bio: 'Passionné par le développement web et l’IA.',
  avatarUrl: 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=200&h=200&fit=crop',
  level: 'Master 1',
  major: 'Informatique',
  option: 'Génie Logiciel',
  isClassRep: true,
  gpa: 16.5,
  rank: '3ème',
};

export const AppProvider = ({ children }: { children?: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [theme, setTheme] = useState<Theme>('light'); // Default state is light
  const [language, setLanguageState] = useState<Language>('fr');
  const [notifications, setNotifications] = useState(3);

  useEffect(() => {
    // Check stored preferences
    const storedTheme = localStorage.getItem('theme') as Theme;
    if (storedTheme) {
      setTheme(storedTheme);
    }

    const storedLang = localStorage.getItem('language') as Language;
    if (storedLang) {
      setLanguageState(storedLang);
    }
  }, []);

  useEffect(() => {
    const root = window.document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    localStorage.setItem('theme', theme);
  }, [theme]);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('language', lang);
  };

  const login = (matricule: string) => {
    // Simulate login
    setTimeout(() => {
        setUser(DUMMY_USER);
    }, 500);
  };

  const logout = () => {
    setUser(null);
  };

  const updateUser = (data: Partial<User>) => {
    if (user) {
        const updatedUser = { ...user, ...data };
        // Update fullName automatically if names change
        if (data.firstName || data.lastName) {
            updatedUser.fullName = `${updatedUser.firstName} ${updatedUser.lastName}`;
        }
        setUser(updatedUser);
    }
  };

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  const clearNotifications = () => setNotifications(0);

  return (
    <AppContext.Provider value={{ user, login, logout, updateUser, theme, toggleTheme, language, setLanguage, notifications, clearNotifications }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within AppProvider');
  return context;
};
