
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, User, Check, Download, Coffee } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { CourseType } from '../types';

const getTypeColor = (type: CourseType, variant: 'bg' | 'text' | 'border') => {
  const colors = {
    CM: { bg: 'bg-blue-100 dark:bg-blue-900/30', text: 'text-blue-700 dark:text-blue-300', border: 'border-blue-200 dark:border-blue-800' },
    TD: { bg: 'bg-orange-100 dark:bg-orange-900/30', text: 'text-orange-700 dark:text-orange-300', border: 'border-orange-200 dark:border-orange-800' },
    TP: { bg: 'bg-purple-100 dark:bg-purple-900/30', text: 'text-purple-700 dark:text-purple-300', border: 'border-purple-200 dark:border-purple-800' },
    EXAMEN: { bg: 'bg-red-100 dark:bg-red-900/30', text: 'text-red-700 dark:text-red-300', border: 'border-red-200 dark:border-red-800' },
  };
  return colors[type][variant];
};

const CalendarScreen: React.FC = () => {
  // Use context
  const { schedule } = useApp();
  
  const [selectedDayIndex, setSelectedDayIndex] = useState(0); 
  const [isExporting, setIsExporting] = useState(false);
  const currentSchedule = schedule[selectedDayIndex];

  const handleExportCalendar = () => {
    setIsExporting(true);
    setTimeout(() => setIsExporting(false), 2000);
  };

  return (
    <div className="min-h-screen bg-bgLight dark:bg-bgDark pt-20 pb-32 px-4 max-w-md mx-auto">
       <header className="fixed top-0 left-0 right-0 z-30 bg-white/95 dark:bg-black/95 backdrop-blur-xl border-b border-gray-100 dark:border-white/5 pt-safe-top shadow-sm pb-2">
        <div className="max-w-md mx-auto px-4 h-16 flex items-center justify-between">
          <h1 className="text-xl font-bold text-textMainLight dark:text-textMainDark">Emploi du temps</h1>
          <button onClick={handleExportCalendar} disabled={isExporting} className="flex items-center gap-2 text-sm font-medium text-primary bg-primary/10 px-4 py-2 rounded-full hover:bg-primary/20 transition-colors active:scale-95">
             {isExporting ? <Check size={18} /> : <Download size={18} />}
             <span>{isExporting ? 'Ajouté' : 'Sync'}</span>
          </button>
        </div>
        <div className="max-w-md mx-auto px-2 pb-3 mt-2 overflow-x-auto no-scrollbar flex gap-2" role="tablist">
            {schedule.map((dayData, index) => {
                const isSelected = index === selectedDayIndex;
                return (
                    <button key={dayData.date} onClick={() => setSelectedDayIndex(index)} className={`flex flex-col items-center justify-center min-w-[84px] h-[96px] rounded-2xl transition-all duration-300 border ${isSelected ? 'bg-primary border-primary text-white shadow-lg shadow-primary/30 scale-105' : 'bg-white dark:bg-surfaceDark border-transparent text-textSecLight dark:text-textSecDark hover:bg-gray-50 dark:hover:bg-white/5'}`}>
                        <span className={`text-xs font-medium uppercase tracking-wider ${isSelected ? 'opacity-90' : ''}`}>{dayData.day}</span>
                        <span className="text-xl font-bold mt-1">{dayData.date}</span>
                        <div className={`w-1.5 h-1.5 rounded-full mt-2 transition-colors ${isSelected ? 'bg-white' : dayData.courses.length > 0 ? 'bg-primary' : 'bg-transparent'}`} />
                    </button>
                )
            })}
        </div>
      </header>

      <div className="h-48"></div>

      <div className="mt-2">
          <div className="flex justify-between items-end mb-6 px-2">
            <h2 className="text-lg font-bold text-textMainLight dark:text-textMainDark leading-none">{currentSchedule.fullDate}</h2>
            <span className="text-xs text-textSecLight dark:text-textSecDark bg-gray-100 dark:bg-white/5 px-2.5 py-1 rounded-lg border border-gray-200 dark:border-white/10">Semaine 42</span>
          </div>

          <div className="space-y-4 relative">
            <div className="absolute left-[27px] top-2 bottom-0 w-[2px] bg-gray-200 dark:bg-white/5 -z-10 rounded-full"></div>

            <AnimatePresence mode='wait'>
                <motion.div key={selectedDayIndex} initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }} transition={{ duration: 0.2 }} className="space-y-6">
                    {currentSchedule.courses.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-24 opacity-60 text-center px-6">
                            <div className="w-24 h-24 bg-gray-100 dark:bg-white/5 rounded-full flex items-center justify-center mb-6">
                                <Coffee size={40} className="text-gray-400 dark:text-gray-500" />
                            </div>
                            <h3 className="text-lg font-bold text-textMainLight dark:text-textMainDark mb-2">Pas de cours aujourd'hui</h3>
                            <p className="text-sm text-textSecLight dark:text-textSecDark leading-relaxed">Profitez-en pour réviser ou vous reposer.<br/>Aucun événement prévu.</p>
                        </div>
                    ) : (
                        currentSchedule.courses.map((course, idx) => (
                            <div key={course.id} className="flex gap-4 group">
                                <div className="flex flex-col items-end w-14 flex-shrink-0 pt-1">
                                    <span className="text-sm font-bold text-textMainLight dark:text-textMainDark tabular-nums">{course.startTime}</span>
                                    <span className="text-xs text-textSecLight dark:text-textSecDark tabular-nums mt-0.5 opacity-80">{course.endTime}</span>
                                </div>
                                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.1 }} className={`flex-1 bg-white dark:bg-surfaceDark rounded-2xl p-5 shadow-sm border-l-[6px] border-t border-r border-b border-gray-100 dark:border-white/5 relative overflow-hidden active:scale-[0.98] transition-transform ${getTypeColor(course.type, 'border')}`}>
                                    <div className="flex justify-between items-start mb-2">
                                        <span className={`text-[10px] font-bold px-2 py-1 rounded-md uppercase tracking-wide ${getTypeColor(course.type, 'bg')} ${getTypeColor(course.type, 'text')}`}>{course.type}</span>
                                    </div>
                                    <h3 className="font-bold text-textMainLight dark:text-textMainDark text-[16px] mb-1 leading-tight">{course.title}</h3>
                                    <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 mt-3">
                                        <div className="flex items-center gap-1.5 text-xs text-textSecLight dark:text-textSecDark"><MapPin size={14} className="text-gray-400" /><span>{course.room}</span></div>
                                        <div className="flex items-center gap-1.5 text-xs text-textSecLight dark:text-textSecDark"><User size={14} className="text-gray-400" /><span>{course.professor}</span></div>
                                    </div>
                                </motion.div>
                            </div>
                        ))
                    )}
                </motion.div>
            </AnimatePresence>
          </div>
      </div>
    </div>
  );
};

export default CalendarScreen;
