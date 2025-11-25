
import React from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, Check } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Language } from '../types';

interface LanguageScreenProps {
  onClose: () => void;
}

const LANGUAGES: { code: Language; label: string; flag: string }[] = [
  { code: 'fr', label: 'Français', flag: '🇫🇷' },
  { code: 'en', label: 'English', flag: '🇬🇧' },
  { code: 'es', label: 'Español', flag: '🇪🇸' },
  { code: 'de', label: 'Deutsch', flag: '🇩🇪' },
];

const LanguageScreen: React.FC<LanguageScreenProps> = ({ onClose }) => {
  const { language, setLanguage } = useApp();

  const handleSelect = (lang: Language) => {
    setLanguage(lang);
    // On pourrait fermer automatiquement après sélection, mais on laisse l'utilisateur choisir
    // onClose(); 
  };

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
                <h1 className="text-lg font-bold text-textMainLight dark:text-textMainDark">Langue</h1>
            </div>

            <div className="p-6 max-w-md mx-auto w-full space-y-6">
                <div className="bg-white dark:bg-surfaceDark rounded-3xl overflow-hidden shadow-soft border border-gray-100 dark:border-white/5">
                    {LANGUAGES.map((lang, index) => {
                        const isSelected = language === lang.code;
                        return (
                            <button
                                key={lang.code}
                                onClick={() => handleSelect(lang.code)}
                                className={`w-full flex items-center justify-between p-5 transition-colors ${
                                    index !== LANGUAGES.length - 1 ? 'border-b border-gray-100 dark:border-white/5' : ''
                                } ${isSelected ? 'bg-primary/5 dark:bg-primary/10' : 'hover:bg-gray-50 dark:hover:bg-white/5'}`}
                            >
                                <div className="flex items-center gap-4">
                                    <span className="text-2xl">{lang.flag}</span>
                                    <span className={`font-medium ${isSelected ? 'text-primary' : 'text-textMainLight dark:text-textMainDark'}`}>
                                        {lang.label}
                                    </span>
                                </div>
                                {isSelected && (
                                    <motion.div 
                                        initial={{ scale: 0 }} 
                                        animate={{ scale: 1 }}
                                        className="w-6 h-6 bg-primary rounded-full flex items-center justify-center text-white"
                                    >
                                        <Check size={14} strokeWidth={3} />
                                    </motion.div>
                                )}
                            </button>
                        );
                    })}
                </div>

                <p className="text-center text-xs text-textSecLight dark:text-textSecDark px-4">
                    Cette option changera la langue de l'interface de l'application. Le contenu pédagogique (cours, annonces) restera dans sa langue d'origine.
                </p>
            </div>
        </div>
    </motion.div>
  );
};

export default LanguageScreen;
