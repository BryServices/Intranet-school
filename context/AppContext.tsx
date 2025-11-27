
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, Theme, Language, AppNotification } from '../types';

interface AppContextType {
  user: User | null;
  login: (matricule: string) => void;
  logout: () => void;
  updateUser: (data: Partial<User>) => void;
  theme: Theme;
  toggleTheme: () => void;
  language: Language;
  setLanguage: (lang: Language) => void;
  notifications: AppNotification[];
  unreadCount: number;
  markAllAsRead: () => void;
  deleteNotification: (id: string) => void;
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

const DUMMY_NOTIFICATIONS: AppNotification[] = [
  {
    id: '1',
    title: 'Nouvelle note disponible',
    message: 'Votre note en Algorithmique Avancée a été publiée : 16.5/20',
    date: 'Il y a 10 min',
    type: 'GRADE',
    read: false,
  },
  {
    id: '2',
    title: 'Changement de salle',
    message: 'Le cours de Droit du Numérique de 14h aura lieu en Salle 204.',
    date: 'Il y a 1h',
    type: 'CALENDAR',
    read: false,
  },
  {
    id: '3',
    title: 'Rappel : Justificatif',
    message: 'N\'oubliez pas de justifier votre absence du 14 Octobre.',
    date: 'Hier',
    type: 'ADMIN',
    read: true,
  },
  {
    id: '4',
    title: 'Soirée BDE',
    message: 'La billetterie pour la soirée d\'intégration est ouverte !',
    date: 'Hier',
    type: 'EVENT',
    read: true,
  }
];

export const AppProvider = ({ children }: { children?: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [theme, setTheme] = useState<Theme>('light');
  const [language, setLanguageState] = useState<Language>('fr');
  const [notifications, setNotifications] = useState<AppNotification[]>(DUMMY_NOTIFICATIONS);

  useEffect(() => {
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
        if (data.firstName || data.lastName) {
            updatedUser.fullName = `${updatedUser.firstName} ${updatedUser.lastName}`;
        }
        setUser(updatedUser);
    }
  };

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const deleteNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <AppContext.Provider value={{ 
      user, 
      login, 
      logout, 
      updateUser, 
      theme, 
      toggleTheme, 
      language, 
      setLanguage, 
      notifications, 
      unreadCount, 
      markAllAsRead, 
      deleteNotification 
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within AppProvider');
  return context;
};