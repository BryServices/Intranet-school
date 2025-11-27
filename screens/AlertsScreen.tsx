
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, Check, Trash2, Bell, GraduationCap, Calendar, AlertCircle, Sparkles, MessageCircle } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { AppNotification } from '../types';

interface AlertsScreenProps {
  onBack: () => void;
}

const AlertsScreen: React.FC<AlertsScreenProps> = ({ onBack }) => {
  const { notifications, markAllAsRead, deleteNotification, unreadCount } = useApp();

  const getIcon = (type: AppNotification['type']) => {
    switch (type) {
        case 'GRADE': return <GraduationCap size={20} className="text-green-500" />;
        case 'CALENDAR': return <Calendar size={20} className="text-blue-500" />;
        case 'ADMIN': return <AlertCircle size={20} className="text-orange-500" />;
        case 'EVENT': return <Sparkles size={20} className="text-purple-500" />;
        case 'CHAT': return <MessageCircle size={20} className="text-pink-500" />;
        default: return <Bell size={20} className="text-gray-500" />;
    }
  };

  const getBgColor = (type: AppNotification['type']) => {
    switch (type) {
        case 'GRADE': return 'bg-green-100 dark:bg-green-900/20';
        case 'CALENDAR': return 'bg-blue-100 dark:bg-blue-900/20';
        case 'ADMIN': return 'bg-orange-100 dark:bg-orange-900/20';
        case 'EVENT': return 'bg-purple-100 dark:bg-purple-900/20';
        case 'CHAT': return 'bg-pink-100 dark:bg-pink-900/20';
        default: return 'bg-gray-100 dark:bg-white/10';
    }
  };

  return (
    <motion.div 
        initial={{ x: '100%' }}
        animate={{ x: 0 }}
        exit={{ x: '100%' }}
        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
        className="fixed inset-0 z-40 bg-gray-50 dark:bg-black overflow-y-auto pb-24"
    >
        {/* Header */}
        <div className="sticky top-0 bg-white/90 dark:bg-surfaceDark/90 backdrop-blur-md px-4 py-4 flex items-center justify-between z-20 border-b border-gray-100 dark:border-white/5 pt-safe-top">
            <div className="flex items-center gap-4">
                <button onClick={onBack} className="p-2 -ml-2 rounded-full hover:bg-gray-100 dark:hover:bg-white/10">
                    <ChevronLeft size={24} className="text-textMainLight dark:text-textMainDark" />
                </button>
                <h1 className="text-xl font-bold text-textMainLight dark:text-textMainDark">Notifications</h1>
            </div>
            {unreadCount > 0 && (
                <button 
                    onClick={markAllAsRead}
                    className="text-xs font-bold text-primary px-3 py-1.5 bg-primary/10 rounded-full hover:bg-primary/20 transition-colors"
                >
                    Tout lire
                </button>
            )}
        </div>

        <div className="p-4 max-w-md mx-auto space-y-4">
            {notifications.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-24 opacity-60 text-center px-6">
                    <div className="w-24 h-24 bg-gray-100 dark:bg-white/5 rounded-full flex items-center justify-center mb-6">
                        <Bell size={40} className="text-gray-400 dark:text-gray-500" />
                    </div>
                    <h3 className="text-lg font-bold text-textMainLight dark:text-textMainDark mb-2">Rien à signaler</h3>
                    <p className="text-sm text-textSecLight dark:text-textSecDark leading-relaxed">
                        Vous êtes à jour ! Aucune nouvelle notification pour le moment.
                    </p>
                </div>
            ) : (
                <AnimatePresence initial={false}>
                    {notifications.map((notif) => (
                        <motion.div
                            key={notif.id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, x: -100 }}
                            className={`p-4 rounded-2xl shadow-sm border flex gap-4 relative group overflow-hidden transition-colors ${
                                notif.read 
                                ? 'bg-white dark:bg-surfaceDark border-gray-100 dark:border-white/5 opacity-80' 
                                : 'bg-white dark:bg-surfaceDark border-primary/20 ring-1 ring-primary/10'
                            }`}
                        >
                            <div className={`w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 ${getBgColor(notif.type)}`}>
                                {getIcon(notif.type)}
                            </div>
                            
                            <div className="flex-1 min-w-0 py-0.5">
                                <div className="flex justify-between items-start mb-1">
                                    <h3 className={`text-sm font-bold truncate ${notif.read ? 'text-textMainLight dark:text-textMainDark' : 'text-primary'}`}>
                                        {notif.title}
                                    </h3>
                                    <span className="text-[10px] text-textSecLight dark:text-textSecDark whitespace-nowrap ml-2">
                                        {notif.date}
                                    </span>
                                </div>
                                <p className="text-xs text-textSecLight dark:text-textSecDark leading-relaxed line-clamp-2">
                                    {notif.message}
                                </p>
                            </div>

                            {/* Actions (visible on hover/swipe context ideally, simpler here) */}
                            {!notif.read && (
                                <div className="absolute top-4 right-4 w-2 h-2 rounded-full bg-primary" />
                            )}
                            
                            {/* Delete Button (visible on hover or for demo) */}
                             <button 
                                onClick={() => deleteNotification(notif.id)}
                                className="absolute bottom-2 right-2 p-2 text-gray-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                                <Trash2 size={16} />
                            </button>
                        </motion.div>
                    ))}
                </AnimatePresence>
            )}
        </div>
    </motion.div>
  );
};

export default AlertsScreen;