
import React from 'react';
import { motion } from 'framer-motion';
import { Camera, Settings, Bell, MessageCircle, Trophy, Sparkles, Clock, ArrowRight } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Announcement } from '../types';

interface HomeScreenProps {
  onOpenChat: () => void;
  onOpenSettings: () => void;
  onOpenGrades: () => void;
  onOpenCalendar: () => void;
  onOpenAnnouncements: () => void;
}

const ANNOUNCEMENTS: Announcement[] = [
  {
    id: '1',
    title: 'Remise des diplômes 2024',
    description: 'La cérémonie aura lieu le 15 Juillet au grand amphithéâtre. Inscriptions ouvertes.',
    date: 'Hier',
    important: true,
    category: 'Événement'
  },
  {
    id: '2',
    title: 'Maintenance Moodle',
    description: 'La plateforme de cours sera indisponible ce samedi de 22h à 02h.',
    date: 'Il y a 2h',
    important: false,
    category: 'Info'
  },
  {
    id: '3',
    title: 'Club Robotique',
    description: 'Rejoignez-nous pour la coupe de France ! Première réunion Jeudi.',
    date: 'Il y a 5h',
    important: false,
    category: 'Vie étudiante'
  }
];

const HomeScreen: React.FC<HomeScreenProps> = ({ 
    onOpenChat, 
    onOpenSettings, 
    onOpenGrades, 
    onOpenCalendar, 
    onOpenAnnouncements 
}) => {
  const { user, notifications } = useApp();

  if (!user) return null;

  return (
    <div className="pb-32 pt-20 px-4 max-w-md mx-auto">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-40 backdrop-blur-md bg-white/50 dark:bg-black/50 border-b border-white/5">
        <div className="max-w-md mx-auto px-4 h-16 flex items-center justify-between">
          <button 
            onClick={onOpenSettings}
            className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-white/10 transition-colors text-textMainLight dark:text-textMainDark"
          >
            <Settings size={24} />
          </button>
          
          <button className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-white/10 transition-colors text-textMainLight dark:text-textMainDark relative">
            <Bell size={24} />
            {notifications > 0 && (
              <span className="absolute top-2 right-2 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white dark:border-black animate-pulse" />
            )}
          </button>
        </div>
      </header>

      {/* Content */}
      <div className="space-y-6">
        {/* Profile Card */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4 }}
          className="bg-white dark:bg-surfaceDark rounded-3xl p-6 shadow-soft relative overflow-hidden text-center"
        >
          {user.isClassRep && (
             <div className="absolute -top-10 -right-10 w-32 h-32 bg-yellow-400/20 rounded-full blur-2xl" />
          )}
          
          <div className="relative inline-block mb-4">
            <div className={`p-1 rounded-full border-[4px] ${user.isClassRep ? 'border-yellow-500' : 'border-primary'}`}>
               <img 
                 src={user.avatarUrl} 
                 alt="Profile" 
                 className="w-28 h-28 rounded-full object-cover bg-gray-200"
               />
            </div>
            {user.isClassRep && (
               <div className="absolute -top-2 right-0 bg-yellow-500 text-white text-[10px] font-bold px-2 py-1 rounded-full shadow-sm border-2 border-white dark:border-surfaceDark">
                 DELEGUÉ
               </div>
            )}
            <button className="absolute bottom-1 right-1 bg-surfaceDark dark:bg-white text-white dark:text-black p-2 rounded-full shadow-lg hover:scale-105 transition-transform">
              <Camera size={16} />
            </button>
          </div>

          <h2 className="text-2xl font-bold text-textMainLight dark:text-textMainDark leading-tight">
            {user.fullName}
          </h2>
          <p className="text-textSecLight dark:text-textSecDark mt-2 text-sm max-w-[200px] mx-auto leading-relaxed">
            {user.bio}
          </p>

          <div className="mt-6 flex flex-wrap justify-center gap-2 text-xs font-medium text-textSecLight dark:text-textSecDark">
            <span className="bg-gray-100 dark:bg-white/5 px-3 py-1 rounded-full">{user.matricule}</span>
            <span className="bg-gray-100 dark:bg-white/5 px-3 py-1 rounded-full">{user.level}</span>
            <span className="bg-gray-100 dark:bg-white/5 px-3 py-1 rounded-full">{user.major}</span>
          </div>
        </motion.div>

        {/* Stats Row */}
        <div className="grid grid-cols-2 gap-4">
            <motion.button 
                onClick={onOpenGrades}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                whileTap={{ scale: 0.96 }}
                className="bg-primary text-white p-5 rounded-3xl shadow-soft relative overflow-hidden text-left group"
            >
                <div className="absolute top-0 right-0 p-4 opacity-20 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-6">
                    <Trophy size={48} />
                </div>
                <p className="text-primary-100 text-sm font-medium mb-1">Moyenne Gen.</p>
                <div className="flex items-baseline gap-1">
                    <span className="text-3xl font-bold">{user.gpa}</span>
                    <span className="text-sm opacity-80">/20</span>
                </div>
                <div className="mt-2 text-xs bg-white/20 inline-block px-2 py-1 rounded-lg">
                    Rang: {user.rank}
                </div>
            </motion.button>

            <motion.button 
                onClick={onOpenCalendar}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                whileTap={{ scale: 0.95 }}
                transition={{ delay: 0.2 }}
                className="bg-white dark:bg-surfaceDark p-5 rounded-3xl shadow-soft flex flex-col justify-between text-left group relative overflow-hidden ring-1 ring-transparent hover:ring-accent/20 transition-all duration-300"
            >
                {/* Background interaction hint */}
                <div className="absolute inset-0 bg-accent/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                <div className="flex justify-between items-start mb-2 w-full relative z-10">
                    <div className="w-10 h-10 bg-accent/10 rounded-full flex items-center justify-center text-accent group-hover:scale-110 transition-transform duration-300">
                        <Sparkles size={20} />
                    </div>
                    {/* Navigation Arrow */}
                    <div className="w-8 h-8 rounded-full bg-gray-50 dark:bg-white/5 flex items-center justify-center text-textSecLight dark:text-textSecDark opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all duration-300">
                        <ArrowRight size={16} />
                    </div>
                </div>
                <div className="relative z-10">
                    <p className="text-textSecLight dark:text-textSecDark text-xs font-medium">Prochain Cours</p>
                    <p className="text-textMainLight dark:text-textMainDark font-bold text-lg leading-tight mt-1 group-hover:text-accent transition-colors duration-300">
                        Algorithmique
                    </p>
                    <p className="text-accent text-xs mt-1 font-medium flex items-center gap-1">
                        <span>Dans 35 min • Amphi B</span>
                    </p>
                </div>
            </motion.button>
        </div>

        {/* Important Announcement Banner */}
        <motion.div 
             onClick={onOpenAnnouncements}
             whileTap={{ scale: 0.98 }}
             initial={{ opacity: 0, y: 20 }}
             animate={{ opacity: 1, y: 0 }}
             transition={{ delay: 0.3 }}
             className="w-full bg-gradient-to-r from-gray-900 to-gray-800 dark:from-white dark:to-gray-200 rounded-3xl p-6 shadow-xl text-white dark:text-black relative overflow-hidden cursor-pointer group"
        >
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 dark:bg-black/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-2xl"></div>
            <div className="relative z-10">
                <span className="bg-accent text-white text-[10px] font-bold px-2 py-1 rounded-md uppercase tracking-wide">Important</span>
                <h3 className="text-xl font-bold mt-3 mb-1 group-hover:translate-x-1 transition-transform">{ANNOUNCEMENTS[0].title}</h3>
                <p className="text-sm opacity-80 line-clamp-2">{ANNOUNCEMENTS[0].description}</p>
            </div>
        </motion.div>

      </div>

      {/* FAB Chat - Moved up to bottom-32 */}
      <motion.button
        onClick={onOpenChat}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.9 }}
        className="fixed bottom-32 right-6 w-14 h-14 bg-primary text-white rounded-full shadow-lg shadow-primary/40 flex items-center justify-center z-40"
      >
        <MessageCircle size={28} />
      </motion.button>
    </div>
  );
};

export default HomeScreen;
