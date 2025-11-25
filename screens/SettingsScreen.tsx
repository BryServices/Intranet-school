
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight, User, Lock, Moon, Sun, Bell, Globe, Download, LogOut, ChevronLeft, Loader2, Check } from 'lucide-react';
import { useApp } from '../context/AppContext';
import EditProfileScreen from './EditProfileScreen';
import SecurityScreen from './SecurityScreen';
import LanguageScreen from './LanguageScreen';
import NotificationsScreen from './NotificationsScreen';
import DownloadDataScreen from './DownloadDataScreen';

interface SettingsScreenProps {
  onBack: () => void;
}

const SettingsItem = ({ 
    icon: Icon, 
    label, 
    value, 
    isDestructive = false, 
    isLoading = false,
    isSuccess = false,
    onClick 
}: { 
    icon: any, 
    label: string, 
    value?: string, 
    isDestructive?: boolean, 
    isLoading?: boolean,
    isSuccess?: boolean,
    onClick: () => void 
}) => (
    <button 
        onClick={onClick}
        disabled={isLoading}
        className="w-full flex items-center justify-between p-4 bg-white dark:bg-surfaceDark first:rounded-t-3xl last:rounded-b-3xl border-b border-gray-50 dark:border-white/5 last:border-0 hover:bg-gray-50 dark:hover:bg-white/5 transition-colors group active:scale-[0.99] disabled:opacity-70 disabled:cursor-wait"
    >
        <div className="flex items-center gap-3">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${isDestructive ? 'bg-red-50 text-red-500 dark:bg-red-900/20' : 'bg-gray-100 text-gray-600 dark:bg-white/10 dark:text-gray-300'}`}>
                <Icon size={16} />
            </div>
            <span className={`font-medium text-sm ${isDestructive ? 'text-red-500' : 'text-textMainLight dark:text-textMainDark'}`}>
                {label}
            </span>
        </div>
        <div className="flex items-center gap-2">
            {value && <span className="text-sm text-textSecLight dark:text-textSecDark">{value}</span>}
            
            {isLoading ? (
                <Loader2 size={16} className="text-primary animate-spin" />
            ) : isSuccess ? (
                <div className="bg-green-100 dark:bg-green-900/30 text-green-600 p-1 rounded-full">
                    <Check size={14} />
                </div>
            ) : (
                <ChevronRight size={16} className="text-gray-400" />
            )}
        </div>
    </button>
);

const SettingsScreen: React.FC<SettingsScreenProps> = ({ onBack }) => {
  const { user, theme, toggleTheme, logout, language, notifications } = useApp();
  const [isEditProfileOpen, setIsEditProfileOpen] = useState(false);
  const [isSecurityOpen, setIsSecurityOpen] = useState(false);
  const [isLanguageOpen, setIsLanguageOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isDownloadDataOpen, setIsDownloadDataOpen] = useState(false);
  
  const getLanguageLabel = (code: string) => {
    switch (code) {
        case 'fr': return 'Français';
        case 'en': return 'English';
        case 'es': return 'Español';
        case 'de': return 'Deutsch';
        default: return 'Français';
    }
  };

  return (
    <>
    <motion.div 
        initial={{ x: '100%' }}
        animate={{ x: 0 }}
        exit={{ x: '100%' }}
        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
        className="fixed inset-0 z-40 bg-gray-50 dark:bg-black overflow-y-auto"
    >
        {/* Header */}
        <div className="sticky top-0 bg-white/80 dark:bg-surfaceDark/80 backdrop-blur-md px-4 py-4 flex items-center gap-4 z-10 border-b border-gray-100 dark:border-white/5 pt-safe-top">
            <button onClick={onBack} className="p-2 -ml-2 rounded-full hover:bg-gray-100 dark:hover:bg-white/10">
                <ChevronLeft size={24} className="text-textMainLight dark:text-textMainDark" />
            </button>
            <h1 className="text-xl font-bold text-textMainLight dark:text-textMainDark">Paramètres</h1>
        </div>

        <div className="p-4 max-w-md mx-auto space-y-6 pb-24">
            {/* User Profile Summary */}
            <div className="flex flex-col items-center py-6">
                <div className="relative">
                    <img src={user?.avatarUrl} alt="Profile" className="w-24 h-24 rounded-full border-4 border-white dark:border-surfaceDark shadow-sm object-cover" />
                    <button 
                        onClick={() => setIsEditProfileOpen(true)}
                        className="absolute bottom-0 right-0 bg-primary text-white p-1.5 rounded-full border-4 border-white dark:border-black active:scale-95 transition-transform"
                    >
                        <User size={14} />
                    </button>
                </div>
                <h2 className="mt-4 text-lg font-bold text-textMainLight dark:text-textMainDark">{user?.fullName}</h2>
                <p className="text-sm text-textSecLight dark:text-textSecDark">{user?.matricule}</p>
            </div>

            {/* Account Section */}
            <div className="space-y-1">
                <h3 className="text-xs font-semibold text-textSecLight dark:text-textSecDark uppercase tracking-wider ml-4 mb-2">Compte</h3>
                <div className="shadow-sm rounded-3xl overflow-hidden">
                    <SettingsItem 
                        icon={User} 
                        label="Modifier le profil" 
                        onClick={() => setIsEditProfileOpen(true)} 
                    />
                    <SettingsItem 
                        icon={Lock} 
                        label="Sécurité & Mot de passe" 
                        onClick={() => setIsSecurityOpen(true)} 
                    />
                    <SettingsItem 
                        icon={Globe} 
                        label="Langue" 
                        value={getLanguageLabel(language)} 
                        onClick={() => setIsLanguageOpen(true)} 
                    />
                </div>
            </div>

             {/* App Section */}
             <div className="space-y-1">
                <h3 className="text-xs font-semibold text-textSecLight dark:text-textSecDark uppercase tracking-wider ml-4 mb-2">Application</h3>
                <div className="shadow-sm rounded-3xl overflow-hidden">
                    <SettingsItem 
                        icon={theme === 'dark' ? Moon : Sun} 
                        label="Apparence" 
                        value={theme === 'dark' ? 'Sombre' : 'Clair'} 
                        onClick={toggleTheme} 
                    />
                    <SettingsItem 
                        icon={Bell} 
                        label="Notifications" 
                        value="Activées" 
                        onClick={() => setIsNotificationsOpen(true)} 
                    />
                    <SettingsItem 
                        icon={Download} 
                        label="Télécharger mes données" 
                        onClick={() => setIsDownloadDataOpen(true)}
                    />
                </div>
            </div>

            {/* Logout */}
            <div className="shadow-sm rounded-3xl overflow-hidden">
                <SettingsItem icon={LogOut} label="Se déconnecter" isDestructive onClick={logout} />
            </div>

            <p className="text-center text-xs text-textSecLight dark:text-textSecDark pt-4">
                Version 1.0.0 (Build 2025.1)
            </p>
        </div>
    </motion.div>

    <AnimatePresence>
        {isEditProfileOpen && (
            <EditProfileScreen onClose={() => setIsEditProfileOpen(false)} />
        )}
        {isSecurityOpen && (
            <SecurityScreen onClose={() => setIsSecurityOpen(false)} />
        )}
        {isLanguageOpen && (
            <LanguageScreen onClose={() => setIsLanguageOpen(false)} />
        )}
        {isNotificationsOpen && (
            <NotificationsScreen onClose={() => setIsNotificationsOpen(false)} />
        )}
        {isDownloadDataOpen && (
            <DownloadDataScreen onClose={() => setIsDownloadDataOpen(false)} />
        )}
    </AnimatePresence>
    </>
  );
};

export default SettingsScreen;
