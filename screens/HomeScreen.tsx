
import React from 'react';
import { motion } from 'framer-motion';
import { Camera, Settings, Bell, MessageCircle, Trophy, Sparkles, Clock, ArrowRight, TrendingUp, CreditCard, AlertCircle } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Announcement } from '../types';

interface HomeScreenProps {
  onOpenChat: () => void;
  onOpenSettings: () => void;
  onOpenGrades: () => void;
  onOpenCalendar: () => void;
  onOpenAnnouncements: () => void;
  onOpenStudentCard: () => void;
  onOpenAbsences: () => void;
  onOpenAlerts: () => void;
}

const ANNOUNCEMENTS: Announcement[] = [
  {
    id: '1',
    title: 'Remise des diplômes 2024',
    description: 'La cérémonie aura lieu le 15 Juillet au grand amphithéâtre. Inscriptions ouvertes.',
    content: 'La cérémonie de remise des diplômes est un moment fort de la vie étudiante. Elle marque la fin de vos études et le début de votre vie professionnelle. Venez nombreux pour célébrer votre réussite avec vos proches et vos enseignants.',
    date: 'Hier',
    important: true,
    category: 'Événement'
  },
  {
    id: '2',
    title: 'Maintenance Moodle',
    description: 'La plateforme de cours sera indisponible ce samedi de 22h à 02h.',
    content: 'Une maintenance planifiée est prévue sur la plateforme Moodle. Veuillez prendre vos dispositions pour télécharger vos supports de cours avant la coupure.',
    date: 'Il y a 2h',
    important: false,
    category: 'Info'
  },
  {
    id: '3',
    title: 'Club Robotique',
    description: 'Rejoignez-nous pour la coupe de France ! Première réunion Jeudi.',
    content: 'Le club robotique organise sa première réunion de l\'année. Au programme : présentation des projets, constitution des équipes pour la coupe de France de robotique et ateliers d\'initiation.',
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
    onOpenAnnouncements,
    onOpenStudentCard,
    onOpenAbsences,
    onOpenAlerts
}) => {
  const { user, unreadCount } = useApp();

  if (!user) return null;

  // Calcul pour le cercle de progression
  const radius = 36;
  const circumference = 2 * Math.PI * radius;
  const progress = (user.gpa / 20) * 100;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  return (
    <div className="pb-32 pt-20 px-4 max-w-md mx-auto">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-40 backdrop-blur-md bg-white/50 dark:bg-black/50 border-b border-white/5">
        <div className="max-w-md mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
              <button 
                onClick={onOpenSettings}
                className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-white/10 transition-colors text-textMainLight dark:text-textMainDark"
              >
                <Settings size={24} />
              </button>
          </div>
          
          <div className="flex items-center gap-2">
            {/* Quick Access e-Card */}
            <button 
                onClick={onOpenStudentCard}
                className="flex items-center gap-2 bg-primary/10 hover:bg-primary/20 text-primary px-3 py-1.5 rounded-full transition-colors active:scale-95"
            >
                <CreditCard size={18} />
                <span className="text-xs font-bold">Ma Carte</span>
            </button>

            <button 
                onClick={onOpenAlerts}
                className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-white/10 transition-colors text-textMainLight dark:text-textMainDark relative"
            >
                <Bell size={24} />
                {unreadCount > 0 && (
                <span className="absolute top-2 right-2 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white dark:border-black animate-pulse" />
                )}
            </button>
          </div>
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

        {/* Scolarité Grid */}
        <div className="grid grid-cols-2 gap-4">
            {/* Absences Card (New) */}
            <motion.button
                onClick={onOpenAbsences}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                whileTap={{ scale: 0.96 }}
                transition={{ delay: 0.05 }}
                className="bg-white dark:bg-surfaceDark p-4 rounded-3xl shadow-soft flex flex-col items-center justify-center gap-2 group relative overflow-hidden h-[180px]"
            >
                <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                    <AlertCircle size={80} />
                </div>
                
                <div className="relative w-16 h-16">
                    <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
                        <path className="text-gray-100 dark:text-white/5" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" strokeWidth="3" />
                        <path className="text-orange-500" strokeDasharray="94, 100" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center flex-col">
                         <span className="text-lg font-bold text-orange-500">6.5h</span>
                    </div>
                </div>
                
                <span className="text-sm font-bold text-textMainLight dark:text-textMainDark mt-1">Absences</span>
                <span className="text-[10px] text-orange-500 font-medium bg-orange-50 dark:bg-orange-900/10 px-2 py-0.5 rounded-full">1 à justifier</span>
            </motion.button>

            {/* GPA Card - Redesigned */}
            <motion.button 
                onClick={onOpenGrades}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                whileTap={{ scale: 0.96 }}
                className="bg-gradient-to-br from-primary to-blue-600 text-white p-4 rounded-3xl shadow-soft relative overflow-hidden text-center group flex flex-col items-center justify-between h-[180px]"
            >
                <div className="flex items-center justify-between w-full mb-1 z-10">
                    <span className="text-xs font-medium text-white/80">Moyenne</span>
                    <div className="flex items-center gap-1 bg-white/20 px-1.5 py-0.5 rounded-md text-[10px] font-bold">
                        <TrendingUp size={10} />
                        <span>+0.5</span>
                    </div>
                </div>

                {/* Circular Progress */}
                <div className="relative w-20 h-20 flex items-center justify-center z-10">
                    <svg className="w-full h-full -rotate-90" viewBox="0 0 88 88">
                        <circle cx="44" cy="44" r={radius} fill="none" stroke="currentColor" strokeWidth="6" className="text-white/20" />
                        <circle cx="44" cy="44" r={radius} fill="none" stroke="currentColor" strokeWidth="6" strokeLinecap="round" strokeDasharray={circumference} strokeDashoffset={strokeDashoffset} className="text-white drop-shadow-[0_0_10px_rgba(255,255,255,0.5)]" />
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <span className="text-2xl font-bold leading-none tracking-tighter">
                            {Math.floor(user.gpa)}
                            <span className="text-sm opacity-80">.{user.gpa.toString().split('.')[1]}</span>
                        </span>
                    </div>
                </div>

                <div className="mt-1 text-xs font-medium bg-black/20 px-3 py-1 rounded-full z-10 backdrop-blur-sm border border-white/10">
                    Rang: {user.rank}
                </div>
                <div className="absolute -bottom-6 -right-6 text-white/5 rotate-12 group-hover:rotate-0 transition-transform duration-500">
                    <Trophy size={100} />
                </div>
            </motion.button>
        </div>
        
        {/* Calendar Card (Full Width) */}
        <motion.button 
            onClick={onOpenCalendar}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            whileTap={{ scale: 0.98 }}
            transition={{ delay: 0.2 }}
            className="w-full bg-white dark:bg-surfaceDark p-5 rounded-3xl shadow-soft flex flex-col justify-between text-left group relative overflow-hidden ring-1 ring-transparent hover:ring-accent/20 transition-all duration-300 min-h-[140px]"
        >
            <div className="absolute inset-0 bg-accent/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

            <div className="flex justify-between items-start mb-2 w-full relative z-10">
                <div className="w-10 h-10 bg-accent/10 rounded-full flex items-center justify-center text-accent group-hover:scale-110 transition-transform duration-300">
                    <Sparkles size={20} />
                </div>
                <div className="w-8 h-8 rounded-full bg-gray-50 dark:bg-white/5 flex items-center justify-center text-textSecLight dark:text-textSecDark opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all duration-300">
                    <ArrowRight size={16} />
                </div>
            </div>
            <div className="relative z-10 mt-auto">
                <p className="text-textSecLight dark:text-textSecDark text-xs font-medium">Prochain Cours</p>
                <div className="flex justify-between items-end">
                    <div>
                        <p className="text-textMainLight dark:text-textMainDark font-bold text-lg leading-tight mt-1 group-hover:text-accent transition-colors duration-300 line-clamp-1">
                            Algorithmique
                        </p>
                        <p className="text-accent text-xs mt-1.5 font-medium flex items-center gap-1">
                            <Clock size={12} />
                            <span>Dans 35 min • Amphi B</span>
                        </p>
                    </div>
                </div>
            </div>
        </motion.button>


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

      {/* FAB Chat */}
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
    