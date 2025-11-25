
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, Bell, Mail, MessageCircle, Calendar, GraduationCap, Megaphone, Smartphone } from 'lucide-react';

interface NotificationsScreenProps {
  onClose: () => void;
}

const NotificationsScreen: React.FC<NotificationsScreenProps> = ({ onClose }) => {
  // État local pour les préférences (dans une vraie app, cela viendrait du contexte ou d'une API)
  const [preferences, setPreferences] = useState({
    pushGlobal: true,
    emailGlobal: false,
    grades: true,
    chat: true,
    calendar: true,
    announcements: false,
    events: true
  });

  const toggle = (key: keyof typeof preferences) => {
    setPreferences(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const ToggleItem = ({ 
    icon: Icon, 
    label, 
    description, 
    isOn, 
    onToggle 
  }: { 
    icon: any, 
    label: string, 
    description?: string, 
    isOn: boolean, 
    onToggle: () => void 
  }) => (
    <div className="flex items-center justify-between p-4 bg-white dark:bg-surfaceDark rounded-2xl border border-gray-100 dark:border-white/5">
        <div className="flex items-center gap-4">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${isOn ? 'bg-primary/10 text-primary' : 'bg-gray-100 dark:bg-white/5 text-gray-400'}`}>
                <Icon size={20} />
            </div>
            <div>
                <h3 className="font-bold text-sm text-textMainLight dark:text-textMainDark">{label}</h3>
                {description && <p className="text-xs text-textSecLight dark:text-textSecDark mt-0.5">{description}</p>}
            </div>
        </div>
        <button 
            onClick={onToggle}
            className={`w-12 h-7 rounded-full transition-colors relative ${isOn ? 'bg-primary' : 'bg-gray-200 dark:bg-white/10'}`}
            aria-label={`Basculer ${label}`}
            aria-checked={isOn}
            role="switch"
        >
            <div className={`absolute top-1 left-1 w-5 h-5 bg-white rounded-full transition-transform shadow-sm ${isOn ? 'translate-x-5' : 'translate-x-0'}`} />
        </button>
    </div>
  );

  return (
    <motion.div 
        initial={{ x: '100%' }}
        animate={{ x: 0 }}
        exit={{ x: '100%' }}
        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
        className="fixed inset-0 z-50 bg-gray-50 dark:bg-black overflow-y-auto"
    >
        <div className="min-h-screen flex flex-col pb-24">
            {/* Header */}
            <div className="sticky top-0 bg-white/80 dark:bg-surfaceDark/80 backdrop-blur-md px-4 py-4 flex items-center gap-4 z-20 border-b border-gray-100 dark:border-white/5 pt-safe-top">
                <button 
                    onClick={onClose} 
                    className="p-2 -ml-2 rounded-full hover:bg-gray-100 dark:hover:bg-white/10 text-textMainLight dark:text-textMainDark"
                >
                    <ChevronLeft size={24} />
                </button>
                <h1 className="text-lg font-bold text-textMainLight dark:text-textMainDark">Notifications</h1>
            </div>

            <div className="p-6 max-w-md mx-auto w-full space-y-8">
                
                {/* Canaux */}
                <div className="space-y-4">
                    <h2 className="text-xs font-bold text-textSecLight dark:text-textSecDark uppercase tracking-wider ml-1">
                        Canaux de réception
                    </h2>
                    <div className="space-y-3">
                        <ToggleItem 
                            icon={Smartphone}
                            label="Notifications Push"
                            description="Sur votre appareil mobile"
                            isOn={preferences.pushGlobal}
                            onToggle={() => toggle('pushGlobal')}
                        />
                        <ToggleItem 
                            icon={Mail}
                            label="Emails"
                            description="Résumé quotidien et urgences"
                            isOn={preferences.emailGlobal}
                            onToggle={() => toggle('emailGlobal')}
                        />
                    </div>
                </div>

                {/* Catégories */}
                <div className="space-y-4">
                    <h2 className="text-xs font-bold text-textSecLight dark:text-textSecDark uppercase tracking-wider ml-1">
                        Alertes par catégorie
                    </h2>
                    <div className="space-y-3">
                        <ToggleItem 
                            icon={GraduationCap}
                            label="Notes & Résultats"
                            description="Nouvelle note publiée"
                            isOn={preferences.grades}
                            onToggle={() => toggle('grades')}
                        />
                        <ToggleItem 
                            icon={Calendar}
                            label="Agenda"
                            description="Rappels de cours et changements de salle"
                            isOn={preferences.calendar}
                            onToggle={() => toggle('calendar')}
                        />
                        <ToggleItem 
                            icon={MessageCircle}
                            label="Messages"
                            description="Chat de classe et messages privés"
                            isOn={preferences.chat}
                            onToggle={() => toggle('chat')}
                        />
                        <ToggleItem 
                            icon={Megaphone}
                            label="Informations urgentes"
                            description="Administration et scolarité"
                            isOn={preferences.announcements}
                            onToggle={() => toggle('announcements')}
                        />
                         <ToggleItem 
                            icon={Bell}
                            label="Vie étudiante"
                            description="Événements, clubs et sports"
                            isOn={preferences.events}
                            onToggle={() => toggle('events')}
                        />
                    </div>
                </div>

                <p className="text-center text-xs text-textSecLight dark:text-textSecDark px-4 pt-4">
                    Certaines notifications urgentes (sécurité, maintenance) ne peuvent pas être désactivées.
                </p>
            </div>
        </div>
    </motion.div>
  );
};

export default NotificationsScreen;
