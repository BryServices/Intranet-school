import React from 'react';
import { Home, Calendar, Megaphone } from 'lucide-react';
import { motion } from 'framer-motion';

interface BottomNavProps {
  currentTab: string;
  onTabChange: (tab: string) => void;
}

const BottomNav: React.FC<BottomNavProps> = ({ currentTab, onTabChange }) => {
  const tabs = [
    { id: 'home', icon: Home, label: 'Accueil' },
    { id: 'calendar', icon: Calendar, label: 'Agenda' },
    { id: 'announcements', icon: Megaphone, label: 'Informations' },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50" aria-label="Navigation principale">
      <div className="max-w-md mx-auto relative">
        <div className="absolute inset-0 bg-white/90 dark:bg-[#121212]/90 backdrop-blur-xl border-t border-white/20 dark:border-white/5 shadow-[0_-5px_20px_rgba(0,0,0,0.03)]" />
        
        <div className="relative flex justify-around items-center h-[88px] pb-5 px-6">
          {tabs.map((tab) => {
            const isActive = currentTab === tab.id;
            const Icon = tab.icon;

            return (
              <button
                key={tab.id}
                onClick={() => onTabChange(tab.id)}
                aria-label={tab.label}
                aria-current={isActive ? 'page' : undefined}
                className="relative flex flex-col items-center justify-center w-20 h-full gap-1 group"
              >
                <div className={`
                  p-2 rounded-xl transition-all duration-300 relative z-10
                  ${isActive ? 'bg-primary/10 text-primary scale-110' : 'text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300'}
                `}>
                  <Icon 
                    size={26} 
                    strokeWidth={isActive ? 2.5 : 2}
                    className="transition-transform duration-200" 
                  />
                </div>
                {/* Visual label for better UX if needed, kept hidden for minimalism but present for screen readers via aria-label above */}
                <span className={`text-[10px] font-medium transition-all duration-300 ${isActive ? 'text-primary translate-y-0 opacity-100' : 'translate-y-2 opacity-0 text-transparent'}`}>
                  {tab.label}
                </span>
                
                {isActive && (
                    <motion.div 
                        layoutId="nav-indicator"
                        className="absolute bottom-2 w-1.5 h-1.5 rounded-full bg-primary shadow-[0_0_8px_rgba(var(--primary),0.6)]"
                    />
                )}
              </button>
            );
          })}
        </div>
      </div>
    </nav>
  );
};

export default BottomNav;