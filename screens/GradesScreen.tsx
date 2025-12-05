
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, TrendingUp, Award, Calendar, AlertCircle, FileText, ShieldCheck, Clock, Loader2 } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Grade } from '../types';

interface GradesScreenProps {
  onBack: () => void;
}

// Mock function for details
const getEvaluationsForSubject = (subject: Grade) => {
  const variation = () => (Math.random() * 4) - 2; 
  return [
    { id: '1', title: 'Devoir Surveillé 1', type: 'CC', date: '12 Oct', score: Math.min(20, Math.max(0, Number((subject.value + variation()).toFixed(1)))), total: 20, coef: 1, classAverage: 11.5 },
    { id: '2', title: 'Travaux Pratiques', type: 'TP', date: '05 Nov', score: Math.min(20, Math.max(0, Number((subject.value + variation() + 1).toFixed(1)))), total: 20, coef: 1, classAverage: 13.0 },
    { id: '4', title: 'Examen Final (Session)', type: 'EXAMEN', date: '10 Jan', score: subject.value, total: 20, coef: 4, classAverage: subject.average }
  ];
};

const GradesScreen: React.FC<GradesScreenProps> = ({ onBack }) => {
  const { user, grades } = useApp(); // Use context
  const [semester, setSemester] = useState<'S1' | 'S2'>('S1');
  const [selectedSubject, setSelectedSubject] = useState<Grade | null>(null);
  const [requestStatus, setRequestStatus] = useState<'idle' | 'requesting' | 'pending_signature' | 'ready'>('idle');

  const currentGrades = grades[semester];
  const average = (currentGrades.reduce((acc, curr) => acc + (curr.value * curr.coef), 0) / currentGrades.reduce((acc, curr) => acc + curr.coef, 0)).toFixed(2);

  const getGradeColor = (grade: number) => {
    if (grade >= 16) return 'text-green-600 dark:text-green-400';
    if (grade >= 14) return 'text-primary';
    if (grade >= 10) return 'text-yellow-600 dark:text-yellow-500';
    return 'text-red-500';
  };
  const getBarColor = (grade: number) => {
    if (grade >= 16) return 'bg-green-500';
    if (grade >= 14) return 'bg-primary';
    if (grade >= 10) return 'bg-yellow-500';
    return 'bg-red-500';
  };
  const getBarHeight = (grade: number) => `${Math.max(5, (grade / 20) * 100)}%`;

  const handleRequestBulletin = () => {
    if (requestStatus !== 'idle') return;
    setRequestStatus('requesting');
    setTimeout(() => {
        setRequestStatus('pending_signature');
        setTimeout(() => { setRequestStatus('ready'); }, 4000);
    }, 1500);
  };

  const handleDownload = () => {
    const dummyContent = `BULLETIN OFFICIEL - SEMESTRE ${semester}\n\nÉtudiant: ${user?.fullName}\nMatricule: ${user?.matricule}\nMoyenne Générale: ${average}/20`;
    const blob = new Blob([dummyContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Bulletin_Officiel_${semester}_${user?.matricule}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const SubjectDetails = ({ subject, onClose }: { subject: Grade; onClose: () => void }) => {
    const evaluations = getEvaluationsForSubject(subject);
    return (
      <motion.div initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }} transition={{ type: 'spring', damping: 25, stiffness: 200 }} className="fixed inset-0 z-50 bg-bgLight dark:bg-bgDark flex flex-col">
        <div className="bg-white/90 dark:bg-surfaceDark/90 backdrop-blur-md px-4 py-4 border-b border-borderLight dark:border-borderDark flex items-center justify-between shadow-sm pt-safe-top z-10">
             <button onClick={onClose} className="p-3 -ml-2 rounded-full hover:bg-gray-100 dark:hover:bg-white/10 transition-colors"><ChevronLeft size={24} className="text-textMainLight dark:text-textMainDark" /></button>
             <h2 className="font-bold text-lg text-textMainLight dark:text-textMainDark truncate max-w-[200px]">{subject.subject}</h2>
             <div className="w-10" /> 
        </div>
        <div className="flex-1 overflow-y-auto p-4 pb-24 space-y-6">
            <div className="bg-white dark:bg-surfaceDark rounded-3xl p-6 shadow-soft flex items-center justify-between relative overflow-hidden">
                <div className="absolute top-0 right-0 p-4 opacity-5"><FileText size={100} /></div>
                <div className="relative z-10">
                    <p className="text-textSecLight dark:text-textSecDark text-sm mb-1">{subject.code}</p>
                    <h3 className="text-2xl font-bold text-textMainLight dark:text-textMainDark mb-2">Moyenne Matière</h3>
                    <div className="flex items-center gap-2 text-sm bg-gray-100 dark:bg-white/5 w-fit px-3 py-1 rounded-full"><span className="text-textSecLight dark:text-textSecDark">Coef: {subject.coef}</span></div>
                </div>
                <div className="relative z-10 flex flex-col items-end"><span className={`text-4xl font-bold ${getGradeColor(subject.value)}`}>{subject.value}</span><span className="text-sm text-textSecLight dark:text-textSecDark">/20</span></div>
            </div>
            <div role="list">
                <h3 className="font-bold text-textMainLight dark:text-textMainDark mb-4 px-2">Évaluations</h3>
                <div className="space-y-3">
                    {evaluations.map((evaluation, idx) => (
                        <motion.div key={evaluation.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.1 }} className="bg-white dark:bg-surfaceDark p-4 rounded-2xl shadow-sm border border-gray-100 dark:border-white/5">
                            <div className="flex justify-between items-start mb-2">
                                <div>
                                    <div className="flex items-center gap-2 mb-1"><span className="text-[10px] font-bold px-2 py-0.5 rounded-md uppercase tracking-wide bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400">{evaluation.type}</span><span className="text-xs text-textSecLight dark:text-textSecDark flex items-center gap-1"><Calendar size={10} /> {evaluation.date}</span></div>
                                    <h4 className="font-bold text-textMainLight dark:text-textMainDark text-sm">{evaluation.title}</h4>
                                </div>
                                <div className="text-right"><span className={`font-bold text-lg ${getGradeColor(evaluation.score)}`}>{evaluation.score}</span><span className="text-xs text-textSecLight dark:text-textSecDark">/{evaluation.total}</span></div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </div>
      </motion.div>
    );
  };

  return (
    <>
    <motion.div initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }} transition={{ type: 'spring', damping: 25, stiffness: 200 }} className="fixed inset-0 z-40 bg-gray-50 dark:bg-black overflow-y-auto pb-24">
        <div className="sticky top-0 bg-white/90 dark:bg-surfaceDark/90 backdrop-blur-md px-4 py-4 flex items-center gap-4 z-20 border-b border-gray-100 dark:border-white/5 pt-safe-top">
            <button onClick={onBack} className="p-2 -ml-2 rounded-full hover:bg-gray-100 dark:hover:bg-white/10"><ChevronLeft size={24} className="text-textMainLight dark:text-textMainDark" /></button>
            <h1 className="text-xl font-bold text-textMainLight dark:text-textMainDark">Mes Notes</h1>
        </div>

        <div className="p-4 max-w-md mx-auto space-y-6">
            <div className="bg-white dark:bg-surfaceDark p-1.5 rounded-2xl flex shadow-sm border border-gray-100 dark:border-white/5">
                {(['S1', 'S2'] as const).map((s) => (
                    <button key={s} onClick={() => setSemester(s)} className={`flex-1 h-12 rounded-xl text-sm font-semibold transition-all ${semester === s ? 'bg-primary text-white shadow-md' : 'text-textSecLight dark:text-textSecDark hover:bg-gray-50 dark:hover:bg-white/5'}`}>Semestre {s === 'S1' ? '1' : '2'}</button>
                ))}
            </div>

            <motion.div key={semester} initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="bg-white dark:bg-surfaceDark rounded-3xl p-6 shadow-soft relative overflow-hidden">
                 <div className="absolute top-0 right-0 p-6 opacity-5 dark:opacity-10"><Award size={120} /></div>
                <div className="relative z-10 flex flex-col items-center">
                    <span className="text-textSecLight dark:text-textSecDark font-medium mb-1">Moyenne Générale</span>
                    <div className="flex items-baseline gap-2"><span className={`text-5xl font-bold ${getGradeColor(parseFloat(average))}`}>{average}</span><span className="text-xl text-textSecLight dark:text-textSecDark font-medium">/20</span></div>
                    <div className="mt-4 flex items-center gap-2 text-sm bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 px-3 py-1.5 rounded-full"><TrendingUp size={16} /><span>+0.5 vs dernier semestre</span></div>
                </div>
            </motion.div>

            <div className="bg-white dark:bg-surfaceDark rounded-3xl p-6 shadow-soft">
                <div className="flex justify-between items-center mb-6"><h3 className="font-bold text-textMainLight dark:text-textMainDark">Performance</h3></div>
                <div className="h-56 flex items-end justify-between gap-3">
                    {currentGrades.slice(0, 5).map((grade, index) => (
                         <button key={index} onClick={() => setSelectedSubject(grade)} className="flex flex-col items-center flex-1 gap-2 group cursor-pointer focus:outline-none">
                            <span className={`text-sm font-bold transition-transform group-hover:-translate-y-1 ${getGradeColor(grade.value)}`}>{grade.value}</span>
                            <div className="relative w-full bg-gray-100 dark:bg-white/5 rounded-t-lg h-full flex items-end overflow-hidden">
                                <motion.div initial={{ height: 0 }} animate={{ height: getBarHeight(grade.value) }} transition={{ delay: index * 0.1, duration: 0.5, ease: "easeOut" }} className={`w-full relative ${getBarColor(grade.value)} opacity-90 group-hover:opacity-100 transition-opacity`}></motion.div>
                            </div>
                            <span className="text-[10px] font-medium text-textSecLight dark:text-textSecDark truncate w-full text-center uppercase tracking-wide">{grade.code.split('-')[0]}</span>
                         </button>
                    ))}
                </div>
            </div>

            <div className="space-y-4" role="list">
                <h3 className="font-bold text-textMainLight dark:text-textMainDark px-2">Détails des notes</h3>
                {currentGrades.map((grade, idx) => (
                    <motion.button key={grade.code} role="listitem" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 + (idx * 0.05) }} onClick={() => setSelectedSubject(grade)} className="w-full bg-white dark:bg-surfaceDark p-4 rounded-2xl shadow-sm border border-gray-100 dark:border-white/5 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-white/5 transition-colors active:scale-[0.98] group">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-xl bg-gray-50 dark:bg-white/5 flex items-center justify-center text-textSecLight dark:text-textSecDark font-bold text-xs group-hover:bg-primary/10 group-hover:text-primary transition-colors">x{grade.coef}</div>
                            <div className="text-left"><h4 className="font-bold text-textMainLight dark:text-textMainDark text-sm">{grade.subject}</h4><p className="text-xs text-textSecLight dark:text-textSecDark">{grade.code}</p></div>
                        </div>
                        <div className="text-right flex items-center gap-3"><div className="flex flex-col items-end"><span className={`font-bold text-lg ${getGradeColor(grade.value)}`}>{grade.value}</span><span className="text-xs text-textSecLight dark:text-textSecDark">/20</span></div><div className={`text-opacity-50 ${getGradeColor(grade.value)}`}>{grade.value >= 14 ? <TrendingUp size={16} /> : <AlertCircle size={16} />}</div></div>
                    </motion.button>
                ))}
            </div>

             <div className="pt-4 pb-8">
                 <h3 className="font-bold text-textMainLight dark:text-textMainDark px-2 mb-3">Documents Officiels</h3>
                 <div className="bg-white dark:bg-surfaceDark rounded-3xl p-6 shadow-soft border border-gray-100 dark:border-white/5">
                    <AnimatePresence mode="wait">
                        {requestStatus === 'idle' && <motion.button key="request" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={handleRequestBulletin} className="w-full h-12 bg-primary text-white rounded-xl font-semibold text-sm flex items-center justify-center gap-2 hover:bg-primary/90 transition-colors shadow-lg shadow-primary/20"><FileText size={18} />Demander l'édition du bulletin</motion.button>}
                        {requestStatus === 'requesting' && <motion.div key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="w-full h-12 bg-gray-100 dark:bg-white/5 text-textSecLight dark:text-textSecDark rounded-xl font-medium text-sm flex items-center justify-center gap-2"><Loader2 size={18} className="animate-spin text-primary" />Traitement...</motion.div>}
                        {requestStatus === 'pending_signature' && <motion.div key="pending" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="w-full h-12 bg-orange-50 dark:bg-orange-900/10 text-orange-600 dark:text-orange-400 rounded-xl font-medium text-sm flex items-center justify-center gap-2 border border-orange-100 dark:border-orange-900/20"><Clock size={18} />En cours de signature</motion.div>}
                        {requestStatus === 'ready' && <motion.button key="download" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} onClick={handleDownload} className="w-full h-12 bg-green-600 text-white rounded-xl font-semibold text-sm flex items-center justify-center gap-2 hover:bg-green-700 transition-colors shadow-lg shadow-green-600/20"><ShieldCheck size={18} />Télécharger le bulletin</motion.button>}
                    </AnimatePresence>
                 </div>
             </div>
             <div className="h-6" /> 
        </div>
    </motion.div>
    <AnimatePresence>{selectedSubject && <SubjectDetails subject={selectedSubject} onClose={() => setSelectedSubject(null)} />}</AnimatePresence>
    </>
  );
};

export default GradesScreen;
