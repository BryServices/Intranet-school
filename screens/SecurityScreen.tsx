
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, Lock, Key, ShieldCheck, Smartphone, Loader2, CheckCircle2, Fingerprint } from 'lucide-react';
import Input from '../components/Input';
import Button from '../components/Button';

interface SecurityScreenProps {
  onClose: () => void;
}

const SecurityScreen: React.FC<SecurityScreenProps> = ({ onClose }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  
  // Form states
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  // Toggles states
  const [biometricsEnabled, setBiometricsEnabled] = useState(true);
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      alert("Les nouveaux mots de passe ne correspondent pas.");
      return;
    }

    setIsLoading(true);

    // Simulate API call
    setTimeout(() => {
        setIsLoading(false);
        setIsSuccess(true);
        // Reset form
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
        
        // Hide success message after delay
        setTimeout(() => setIsSuccess(false), 3000);
    }, 1500);
  };

  const ToggleItem = ({ 
    icon: Icon, 
    label, 
    description, 
    checked, 
    onChange 
  }: { 
    icon: any, 
    label: string, 
    description: string, 
    checked: boolean, 
    onChange: () => void 
  }) => (
    <div className="flex items-center justify-between p-4 bg-white dark:bg-surfaceDark rounded-2xl border border-gray-100 dark:border-white/5">
        <div className="flex items-center gap-4">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${checked ? 'bg-primary/10 text-primary' : 'bg-gray-100 dark:bg-white/5 text-gray-400'}`}>
                <Icon size={20} />
            </div>
            <div>
                <h3 className="font-bold text-sm text-textMainLight dark:text-textMainDark">{label}</h3>
                <p className="text-xs text-textSecLight dark:text-textSecDark mt-0.5">{description}</p>
            </div>
        </div>
        <button 
            type="button"
            onClick={onChange}
            className={`w-12 h-7 rounded-full transition-colors relative ${checked ? 'bg-primary' : 'bg-gray-200 dark:bg-white/10'}`}
        >
            <div className={`absolute top-1 left-1 w-5 h-5 bg-white rounded-full transition-transform shadow-sm ${checked ? 'translate-x-5' : 'translate-x-0'}`} />
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
                <h1 className="text-lg font-bold text-textMainLight dark:text-textMainDark">Sécurité</h1>
            </div>

            <div className="p-6 max-w-md mx-auto w-full space-y-8">
                
                {/* Advanced Security Options */}
                <div className="space-y-4">
                    <h2 className="text-xs font-bold text-textSecLight dark:text-textSecDark uppercase tracking-wider ml-1">
                        Authentification
                    </h2>
                    <div className="space-y-3">
                        <ToggleItem 
                            icon={Fingerprint}
                            label="Biométrie"
                            description="FaceID / TouchID"
                            checked={biometricsEnabled}
                            onChange={() => setBiometricsEnabled(!biometricsEnabled)}
                        />
                        <ToggleItem 
                            icon={Smartphone}
                            label="Double Facteur (2FA)"
                            description="Validation par SMS"
                            checked={twoFactorEnabled}
                            onChange={() => setTwoFactorEnabled(!twoFactorEnabled)}
                        />
                    </div>
                </div>

                {/* Password Change Form */}
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="flex items-center justify-between">
                         <h2 className="text-xs font-bold text-textSecLight dark:text-textSecDark uppercase tracking-wider ml-1">
                            Mot de passe
                        </h2>
                        {isSuccess && (
                            <motion.span 
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                className="text-xs font-medium text-green-600 flex items-center gap-1"
                            >
                                <CheckCircle2 size={14} />
                                Mis à jour
                            </motion.span>
                        )}
                    </div>

                    <div className="bg-white dark:bg-surfaceDark p-5 rounded-3xl shadow-soft space-y-5 border border-gray-100 dark:border-white/5">
                        <Input 
                            label="Mot de passe actuel" 
                            type="password"
                            icon={<Lock size={18} />}
                            value={currentPassword}
                            onChange={(e) => setCurrentPassword(e.target.value)}
                            placeholder="••••••••"
                        />
                        <div className="w-full h-px bg-gray-100 dark:bg-white/5" />
                        <Input 
                            label="Nouveau mot de passe" 
                            type="password"
                            icon={<Key size={18} />}
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            placeholder="8 caractères min."
                        />
                        <Input 
                            label="Confirmer le nouveau" 
                            type="password"
                            icon={<ShieldCheck size={18} />}
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            placeholder="••••••••"
                        />
                    </div>

                    <div className="pt-2">
                        <Button 
                            type="submit" 
                            disabled={isLoading || !currentPassword || !newPassword} 
                            fullWidth
                            className="shadow-xl shadow-primary/20"
                        >
                            {isLoading ? (
                                <div className="flex items-center gap-2">
                                    <Loader2 size={20} className="animate-spin" />
                                    <span>Mise à jour...</span>
                                </div>
                            ) : (
                                "Mettre à jour le mot de passe"
                            )}
                        </Button>
                    </div>
                </form>

                <div className="bg-blue-50 dark:bg-blue-900/10 p-4 rounded-2xl flex gap-3 text-sm text-blue-700 dark:text-blue-300">
                    <ShieldCheck className="flex-shrink-0 mt-0.5" size={18} />
                    <p className="leading-relaxed">
                        Pour votre sécurité, nous vous recommandons d'utiliser un mot de passe unique et d'activer la double authentification.
                    </p>
                </div>
            </div>
        </div>
    </motion.div>
  );
};

export default SecurityScreen;
