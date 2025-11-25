
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { User as UserIcon, Lock, ArrowRight, Loader2 } from 'lucide-react';
import { useApp } from '../context/AppContext';
import Input from '../components/Input';
import Button from '../components/Button';

const LoginScreen: React.FC = () => {
  const { login } = useApp();
  const [matricule, setMatricule] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    // Simulate network delay
    setTimeout(() => {
        login(matricule);
        setIsLoading(false);
    }, 1500);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-black p-6">
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
            aria-label="Matricule étudiant"
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
            aria-label="Mot de passe"
            id="password-input"
          />
          
          <div className="flex justify-end">
            <button 
              type="button" 
              className="text-sm font-medium text-primary hover:text-primary/80 transition-colors py-4 px-4 -mr-4 rounded-xl active:bg-primary/5"
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
            aria-busy={isLoading}
          >
            <div className="relative z-10 flex items-center justify-center gap-2">
                {isLoading ? (
                    <>
                        <Loader2 size={20} className="animate-spin" />
                        <span>Connexion en cours...</span>
                    </>
                ) : (
                    <>
                        <span>Se connecter</span>
                        <ArrowRight size={20} className="transition-transform duration-300 group-hover:translate-x-1" />
                    </>
                )}
            </div>
          </Button>
        </form>

        <div className="mt-8 text-center">
            <p className="text-xs text-textSecLight dark:text-textSecDark leading-relaxed">
                En vous connectant, vous acceptez les <br/>
                <button className="underline cursor-pointer font-medium text-textMainLight dark:text-textMainDark hover:text-primary transition-colors py-2">
                  Conditions Générales d'Utilisation
                </button>
            </p>
        </div>
      </motion.div>
    </div>
  );
};

export default LoginScreen;