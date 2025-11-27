
import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, AlertCircle, Upload, CheckCircle2, Clock, Calendar, FileText, X, CloudUpload } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Absence } from '../types';
import Button from '../components/Button';

interface AbsencesScreenProps {
  onBack: () => void;
}

const DUMMY_ABSENCES: Absence[] = [
    { id: '1', date: '14 Oct', subject: 'Algorithmique Avancée', type: 'CM', duration: '2h', status: 'UNJUSTIFIED' },
    { id: '2', date: '02 Oct', subject: 'Anglais Technique', type: 'TD', duration: '1h30', status: 'JUSTIFIED', justificationUrl: 'certificat.pdf' },
    { id: '3', date: '28 Sept', subject: 'Gestion de Projet', type: 'TP', duration: '3h', status: 'PENDING', justificationUrl: 'certificat_waiting.jpg' },
];

const AbsencesScreen: React.FC<AbsencesScreenProps> = ({ onBack }) => {
  const [absences, setAbsences] = useState<Absence[]>(DUMMY_ABSENCES);
  const [selectedAbsence, setSelectedAbsence] = useState<Absence | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Calcul du taux de présence (Simulé)
  const totalHours = 120;
  const missedHours = 6.5;
  const presenceRate = Math.round(((totalHours - missedHours) / totalHours) * 100);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && selectedAbsence) {
        setIsUploading(true);
        // Simulation d'upload
        setTimeout(() => {
            const updated = absences.map(a => 
                a.id === selectedAbsence.id ? { ...a, status: 'PENDING' as const, justificationUrl: file.name } : a
            );
            setAbsences(updated);
            setIsUploading(false);
            setSelectedAbsence(null);
        }, 1500);
    }
  };

  const getStatusBadge = (status: Absence['status']) => {
      switch(status) {
          case 'JUSTIFIED': return <span className="bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 px-2 py-1 rounded-md text-[10px] font-bold uppercase">Justifiée</span>;
          case 'PENDING': return <span className="bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-400 px-2 py-1 rounded-md text-[10px] font-bold uppercase">En attente</span>;
          case 'UNJUSTIFIED': return <span className="bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 px-2 py-1 rounded-md text-[10px] font-bold uppercase">Non justifiée</span>;
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
        <div className="sticky top-0 bg-white/90 dark:bg-surfaceDark/90 backdrop-blur-md px-4 py-4 flex items-center gap-4 z-20 border-b border-gray-100 dark:border-white/5 pt-safe-top">
            <button onClick={onBack} className="p-2 -ml-2 rounded-full hover:bg-gray-100 dark:hover:bg-white/10">
                <ChevronLeft size={24} className="text-textMainLight dark:text-textMainDark" />
            </button>
            <h1 className="text-xl font-bold text-textMainLight dark:text-textMainDark">Assiduité</h1>
        </div>

        <div className="p-4 max-w-md mx-auto space-y-6">
            
            {/* Gauge Card */}
            <div className="bg-white dark:bg-surfaceDark rounded-3xl p-6 shadow-soft flex items-center justify-between relative overflow-hidden">
                <div>
                    <h2 className="text-textSecLight dark:text-textSecDark text-sm font-medium mb-1">Taux de présence</h2>
                    <div className="flex items-baseline gap-1">
                        <span className={`text-4xl font-bold ${presenceRate > 90 ? 'text-green-600' : 'text-orange-500'}`}>{presenceRate}%</span>
                        <span className="text-xs text-textSecLight">ce semestre</span>
                    </div>
                    <p className="text-xs text-textSecLight dark:text-textSecDark mt-2">
                        {missedHours}h d'absence enregistrées
                    </p>
                </div>
                
                {/* Visual Gauge */}
                <div className="relative w-20 h-20">
                    <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
                        <path className="text-gray-100 dark:text-white/5" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" strokeWidth="4" />
                        <path className={`${presenceRate > 90 ? 'text-green-500' : 'text-orange-500'}`} strokeDasharray={`${presenceRate}, 100`} d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
                    </svg>
                </div>
            </div>

            {/* Warning Banner */}
            {presenceRate < 90 && (
                 <div className="bg-orange-50 dark:bg-orange-900/20 p-4 rounded-2xl flex gap-3 border border-orange-100 dark:border-orange-900/30">
                    <AlertCircle className="text-orange-500 flex-shrink-0" size={20} />
                    <p className="text-sm text-orange-700 dark:text-orange-300">
                        Attention, un taux inférieur à 90% peut impacter la validation de votre semestre. Pensez à justifier vos absences.
                    </p>
                </div>
            )}

            {/* List */}
            <div className="space-y-4">
                <h3 className="font-bold text-textMainLight dark:text-textMainDark px-2">Historique</h3>
                {absences.map((absence) => (
                    <div key={absence.id} className="bg-white dark:bg-surfaceDark p-4 rounded-2xl shadow-sm border border-gray-100 dark:border-white/5">
                        <div className="flex justify-between items-start mb-3">
                            <div>
                                <h4 className="font-bold text-textMainLight dark:text-textMainDark text-sm">{absence.subject}</h4>
                                <div className="flex items-center gap-2 mt-1">
                                    <span className="text-[10px] font-bold bg-gray-100 dark:bg-white/10 px-1.5 py-0.5 rounded text-textSecLight">{absence.type}</span>
                                    <span className="text-xs text-textSecLight dark:text-textSecDark flex items-center gap-1">
                                        <Calendar size={12} /> {absence.date}
                                    </span>
                                    <span className="text-xs text-textSecLight dark:text-textSecDark flex items-center gap-1">
                                        <Clock size={12} /> {absence.duration}
                                    </span>
                                </div>
                            </div>
                            {getStatusBadge(absence.status)}
                        </div>

                        {/* Action Area */}
                        {absence.status === 'UNJUSTIFIED' ? (
                            <button 
                                onClick={() => setSelectedAbsence(absence)}
                                className="w-full py-2 flex items-center justify-center gap-2 text-primary bg-primary/5 hover:bg-primary/10 rounded-xl text-sm font-medium transition-colors"
                            >
                                <Upload size={16} />
                                Justifier cette absence
                            </button>
                        ) : (
                            <div className="flex items-center gap-2 text-xs text-textSecLight dark:text-textSecDark bg-gray-50 dark:bg-white/5 p-2 rounded-xl">
                                <FileText size={14} />
                                <span className="truncate flex-1">
                                    {absence.justificationUrl || 'Certificat transmis'}
                                </span>
                                {absence.status === 'JUSTIFIED' && <CheckCircle2 size={14} className="text-green-500" />}
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>

        {/* Upload Modal - Center Positioned */}
        <AnimatePresence>
            {selectedAbsence && (
                <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-6">
                    <motion.div 
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        transition={{ type: "spring", bounce: 0.3 }}
                        className="bg-white dark:bg-surfaceDark w-full max-w-sm rounded-3xl p-6 shadow-2xl relative"
                    >
                        <button 
                            onClick={() => setSelectedAbsence(null)} 
                            className="absolute top-4 right-4 p-2 rounded-full bg-gray-100 dark:bg-white/10 hover:bg-gray-200 dark:hover:bg-white/20 transition-colors"
                        >
                            <X size={18} />
                        </button>
                        
                        <div className="mb-6">
                            <h3 className="font-bold text-lg text-textMainLight dark:text-textMainDark">Justificatif</h3>
                            <p className="text-sm text-textSecLight dark:text-textSecDark mt-1">
                                Absence du <strong>{selectedAbsence.date}</strong><br/>
                                <span className="text-xs opacity-70">{selectedAbsence.subject}</span>
                            </p>
                        </div>

                        <input 
                            type="file" 
                            ref={fileInputRef}
                            className="hidden"
                            accept=".pdf,.jpg,.jpeg,.png"
                            onChange={handleFileSelect}
                        />

                        {/* Drag & Drop Visual Zone */}
                        <div 
                            onClick={() => fileInputRef.current?.click()}
                            className="border-2 border-dashed border-primary/30 hover:border-primary/60 bg-primary/5 hover:bg-primary/10 rounded-2xl p-8 flex flex-col items-center justify-center text-center cursor-pointer transition-all group mb-6"
                        >
                            <div className="w-12 h-12 bg-white dark:bg-white/10 rounded-full flex items-center justify-center mb-3 shadow-sm group-hover:scale-110 transition-transform">
                                <CloudUpload className="text-primary" size={24} />
                            </div>
                            <span className="text-sm font-semibold text-primary">Cliquez pour téléverser</span>
                            <span className="text-xs text-textSecLight dark:text-textSecDark mt-1">PDF, JPG ou PNG (max 5Mo)</span>
                        </div>

                        <Button 
                            onClick={() => fileInputRef.current?.click()}
                            fullWidth
                            disabled={isUploading}
                        >
                             {isUploading ? 'Envoi en cours...' : 'Sélectionner un fichier'}
                        </Button>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    </motion.div>
  );
};

export default AbsencesScreen;
