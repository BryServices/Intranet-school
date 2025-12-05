
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { User as UserIcon, Lock, ArrowRight, Loader2, Shield } from 'lucide-react';
import { useApp } from '../context/AppContext';
import Input from '../components/Input';
import Button from '../components/Button';

interface LoginScreenProps {
  onAdminLogin?: () => void;
  onAdminDashboard?: () => void;
}

const LoginScreen: React.FC<LoginScreenProps> = ({ onAdminLogin, onAdminDashboard }) => {
  const { login } = useApp();
  const [matricule, setMatricule] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Check for admin credentials shortcut
    if (matricule === 'admin' && password === 'admin') {
        setTimeout(() => {
            setIsLoading(false);
            if (onAdminDashboard) onAdminDashboard();
        }, 1500);
        return;
    }

    // Normal student login
    setTimeout(() => {
        login(matricule);
        setIsLoading(false);
    }, 1500);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 dark:bg-black p-6 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 left-0 w-full h-64 bg-primary/5 rounded-b-[3rem] -z-0" />

      <div className="flex-1 w-full flex items-center justify-center z-10 my-8">
        <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="w-full max-w-md bg-white dark:bg-surfaceDark rounded-3xl p-8 shadow-soft border border-gray-100 dark:border-white/5"
        >
            <div className="flex flex-col items-center mb-8">
            <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mb-4 text-primary">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-8 h-8">
                <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
                </svg>
            </div>
            <h1 className="text-2xl font-bold text-textMainLight dark:text-textMainDark">Bienvenue</h1>
            <p className="text-textSecLight dark:text-textSecDark mt-2">Connectez-vous à votre intranet</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
            <Input 
                label="Matricule" 
                placeholder="Ex: 2025-XYZ-001" 
                icon={<UserIcon size={20}/>}
                value={matricule}
                onChange={(e) => setMatricule(e.target.value)}
                autoComplete="username"
                name="username"
                id="matricule-input"
            />
            <Input 
                label="Mot de passe" 
                type="password" 
                placeholder="••••••••" 
                icon={<Lock size={20}/>}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
                name="password"
                id="password-input"
            />
            
            <div className="flex justify-end">
                <button 
                type="button" 
                className="text-sm font-medium text-primary hover:text-primary/80 transition-colors py-2 px-2 -mr-2 rounded-lg"
                tabIndex={0}
                >
                Mot de passe oublié ?
                </button>
            </div>

            <Button 
                type="submit" 
                disabled={isLoading} 
                className="mt-6 shadow-xl shadow-primary/20" 
                fullWidth
            >
                <div className="flex items-center justify-center gap-2">
                    {isLoading ? (
                        <>
                            <Loader2 size={20} className="animate-spin" />
                            <span>Connexion...</span>
                        </>
                    ) : (
                        <>
                            <span>Se connecter</span>
                            <ArrowRight size={20} />
                        </>
                    )}
                </div>
            </Button>
            </form>

            <div className="mt-8 text-center border-t border-gray-100 dark:border-white/5 pt-6">
                <p className="text-xs text-textSecLight dark:text-textSecDark leading-relaxed">
                    En vous connectant, vous acceptez les<br/>
                    <button className="underline cursor-pointer font-medium hover:text-primary transition-colors">
                    Conditions Générales d'Utilisation
                    </button>
                </p>
            </div>
        </motion.div>
      </div>

      {/* Admin Link Area - Flex positioned to avoid overlap */}
      <div className="w-full flex justify-center py-4 z-10 shrink-0">
        {onAdminLogin && (
            <button 
                onClick={onAdminLogin}
                className="group flex items-center gap-2 text-xs font-semibold text-textSecLight dark:text-textSecDark opacity-60 hover:opacity-100 hover:text-primary transition-all px-5 py-2.5 rounded-full hover:bg-white dark:hover:bg-white/10 border border-transparent hover:border-gray-200 dark:hover:border-white/5"
            >
                <Shield size={14} className="group-hover:text-primary transition-colors" />
                <span>Accès Administration</span>
            </button>
        )}
      </div>
    </div>
  );
};

export default LoginScreen;
