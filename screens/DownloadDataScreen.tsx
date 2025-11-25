
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, Download, CheckCircle2, FileText, Calendar, Check, AlertCircle, FileBadge, Loader2 } from 'lucide-react';
import { useApp } from '../context/AppContext';
import Button from '../components/Button';

interface DownloadDataScreenProps {
  onClose: () => void;
}

type ExportOption = 'S1' | 'S2' | 'schedule';

const DownloadDataScreen: React.FC<DownloadDataScreenProps> = ({ onClose }) => {
  const { user } = useApp();
  const [selectedOptions, setSelectedOptions] = useState<Set<ExportOption>>(new Set(['S1']));
  const [isExporting, setIsExporting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const toggleSelection = (id: ExportOption) => {
    const newSelection = new Set(selectedOptions);
    if (newSelection.has(id)) {
      newSelection.delete(id);
    } else {
      newSelection.add(id);
    }
    setSelectedOptions(newSelection);
  };

  const handleExport = async () => {
    if (selectedOptions.size === 0) return;
    setIsExporting(true);

    // Simulation de génération de données
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Construction de l'objet JSON dynamique (Simulation de PDF/Documents)
    const exportData: any = {
      meta: {
        exportDate: new Date().toISOString(),
        student: user?.fullName || 'Etudiant',
        matricule: user?.matricule || 'N/A',
        university: "Université XYZ"
      },
      documents: []
    };

    if (selectedOptions.has('S1')) {
      exportData.documents.push({
        type: "RELEVE_NOTES",
        semester: "S1",
        year: "2024-2025",
        status: "OFFICIEL",
        content: "Données chiffrées du Semestre 1..."
      });
    }

    if (selectedOptions.has('S2')) {
      exportData.documents.push({
        type: "RELEVE_NOTES",
        semester: "S2",
        year: "2024-2025",
        status: "PROVISOIRE",
        content: "Données chiffrées du Semestre 2..."
      });
    }

    if (selectedOptions.has('schedule')) {
      exportData.documents.push({
        type: "EMPLOI_DU_TEMPS",
        period: "S2",
        content: "Export iCal/JSON de l'agenda..."
      });
    }

    try {
      // Création du Blob et téléchargement
      const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      
      // Nom du fichier intelligent
      let filename = `documents-${user?.matricule || 'student'}`;
      if (selectedOptions.has('S1') && !selectedOptions.has('S2')) filename += '-S1';
      else if (!selectedOptions.has('S1') && selectedOptions.has('S2')) filename += '-S2';
      else if (selectedOptions.has('S1') && selectedOptions.has('S2')) filename += '-S1-S2';
      
      link.download = `${filename}.json`;
      
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      setIsExporting(false);
      setIsSuccess(true);
      
      setTimeout(() => {
          setIsSuccess(false);
          onClose();
      }, 2500);
    } catch (error) {
      console.error("Export failed", error);
      setIsExporting(false);
    }
  };

  const SelectionItem = ({ 
    id, 
    label, 
    description, 
    icon: Icon,
    isSecondary = false
  }: { 
    id: ExportOption, 
    label: string, 
    description: string, 
    icon: any,
    isSecondary?: boolean
  }) => {
    const isSelected = selectedOptions.has(id);
    return (
        <button
            onClick={() => toggleSelection(id)}
            className={`w-full text-left p-4 rounded-2xl border transition-all duration-200 flex items-center justify-between group mb-3 last:mb-0 ${
                isSelected 
                ? 'bg-white dark:bg-surfaceDark border-primary shadow-sm ring-1 ring-primary' 
                : 'bg-white dark:bg-surfaceDark border-gray-100 dark:border-white/5 opacity-80 hover:opacity-100'
            }`}
        >
            <div className="flex items-center gap-4">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors ${
                    isSelected 
                    ? 'bg-primary/10 text-primary' 
                    : isSecondary ? 'bg-orange-50 dark:bg-white/5 text-orange-400' : 'bg-blue-50 dark:bg-white/5 text-blue-500'
                }`}>
                    <Icon size={20} />
                </div>
                <div>
                    <h3 className={`font-bold text-sm ${isSelected ? 'text-textMainLight dark:text-textMainDark' : 'text-textSecLight dark:text-textSecDark'}`}>
                        {label}
                    </h3>
                    <p className="text-xs text-textSecLight dark:text-textSecDark mt-0.5">
                        {description}
                    </p>
                </div>
            </div>
            <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${
                isSelected 
                ? 'bg-primary border-primary text-white' 
                : 'border-gray-300 dark:border-gray-600 bg-transparent'
            }`}>
                {isSelected && <Check size={14} strokeWidth={3} />}
            </div>
        </button>
    );
  };

  return (
    <motion.div 
        initial={{ x: '100%' }}
        animate={{ x: 0 }}
        exit={{ x: '100%' }}
        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
        className="fixed inset-0 z-50 bg-gray-50 dark:bg-black overflow-y-auto"
    >
        <div className="min-h-screen flex flex-col pb-6">
            {/* Header */}
            <div className="sticky top-0 bg-white/80 dark:bg-surfaceDark/80 backdrop-blur-md px-4 py-4 flex items-center gap-4 z-20 border-b border-gray-100 dark:border-white/5 pt-safe-top">
                <button 
                    onClick={onClose} 
                    className="p-2 -ml-2 rounded-full hover:bg-gray-100 dark:hover:bg-white/10 text-textMainLight dark:text-textMainDark"
                >
                    <ChevronLeft size={24} />
                </button>
                <h1 className="text-lg font-bold text-textMainLight dark:text-textMainDark">Mes Documents</h1>
            </div>

            <div className="p-6 max-w-md mx-auto w-full flex-1 flex flex-col">
                
                <div className="mb-6 bg-blue-50 dark:bg-blue-900/10 p-4 rounded-2xl flex gap-3 text-sm text-blue-700 dark:text-blue-300 border border-blue-100 dark:border-blue-900/20">
                    <AlertCircle className="flex-shrink-0 mt-0.5" size={18} />
                    <p className="leading-relaxed">
                        Téléchargez vos documents officiels. Les relevés de notes sont signés numériquement.
                    </p>
                </div>

                <div className="flex-1 space-y-6">
                    {/* Section Relevés de notes */}
                    <div>
                        <h2 className="text-xs font-bold text-textSecLight dark:text-textSecDark uppercase tracking-wider ml-1 mb-3">
                            Relevés de notes
                        </h2>
                        <SelectionItem 
                            id="S1"
                            label="Semestre 1"
                            description="Relevé officiel • 30 Crédits ECTS"
                            icon={FileText}
                        />
                        <SelectionItem 
                            id="S2"
                            label="Semestre 2"
                            description="Relevé provisoire • En cours"
                            icon={FileBadge}
                        />
                    </div>

                    {/* Section Agenda */}
                    <div>
                        <h2 className="text-xs font-bold text-textSecLight dark:text-textSecDark uppercase tracking-wider ml-1 mb-3">
                            Organisation
                        </h2>
                        <SelectionItem 
                            id="schedule"
                            label="Emploi du temps"
                            description="Planning complet au format PDF"
                            icon={Calendar}
                            isSecondary
                        />
                    </div>
                </div>

                <div className="pt-6 mt-auto">
                    <Button 
                        onClick={handleExport}
                        disabled={isExporting || selectedOptions.size === 0}
                        fullWidth
                        className="shadow-xl shadow-primary/20"
                    >
                        {isSuccess ? (
                            <div className="flex items-center gap-2">
                                <CheckCircle2 size={20} />
                                <span>Documents téléchargés</span>
                            </div>
                        ) : isExporting ? (
                            <div className="flex items-center gap-2">
                                <Loader2 size={20} className="animate-spin" />
                                <span>Génération en cours...</span>
                            </div>
                        ) : (
                            <span>Télécharger ({selectedOptions.size})</span>
                        )}
                    </Button>
                </div>
            </div>
        </div>
    </motion.div>
  );
};

export default DownloadDataScreen;
