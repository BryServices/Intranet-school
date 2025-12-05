
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Shield, Lock, ArrowRight, Loader2, ChevronLeft, AlertTriangle } from 'lucide-react';
import Input from '../components/Input';
import Button from '../components/Button';

interface AdminLoginScreenProps {
  onLoginSuccess: () => void;
  onBack: () => void;
}

const AdminLoginScreen: React.FC<AdminLoginScreenProps> = ({ onLoginSuccess, onBack }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    // Simulation d'authentification sécurisée
    setTimeout(() => {
      // Mock credentials: admin / admin
      if (username === 'admin' && password === 'admin') {
        onLoginSuccess();
      } else {
        setError('Identifiants incorrects. Veuillez réessayer.');
        setIsLoading(false);
      }
    }, 1500);
  };

  return (
    // Force dark mode context for this screen for a secure "vault" look
    <div className="dark min-h-screen bg-[#050505] flex flex-col items-center justify-center p-6 relative overflow-hidden text-white font-sans">
      {/* Background Effects */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-20%] right-[-10%] w-[600px] h-[600px] bg-indigo-600/20 rounded-full blur-[120px] opacity-40" />
        <div className="absolute bottom-[-20%] left-[-10%] w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[100px] opacity-40" />
        {/* Noise overlay */}
        <div className="absolute inset-0 opacity-[0.15]" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='1'/%3E%3C/svg%3E")` }} />
      </div>

      <button 
        onClick={onBack}
        className="absolute top-6 left-6 p-3 rounded-full bg-white/5 hover:bg-white/10 text-white/70 hover:text-white transition-all z-20 backdrop-blur-md border border-white/5 group"
      >
        <ChevronLeft size={24} className="group-hover:-translate-x-0.5 transition-transform" />
      </button>

      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="w-full max-w-md relative z-10"
      >
        <div className="bg-[#121212]/80 backdrop-blur-2xl border border-white/10 p-8 rounded-[32px] shadow-2xl">
            <div className="flex flex-col items-center mb-8">
                <div className="w-20 h-20 bg-gradient-to-br from-indigo-500 to-blue-600 rounded-3xl flex items-center justify-center mb-6 shadow-lg shadow-indigo-500/30">
                    <Shield size={36} className="text-white" />
                </div>
                <h1 className="text-3xl font-bold text-white tracking-tight">Admin Portal</h1>
                <p className="text-white/40 mt-2 text-sm text-center font-medium">
                    Veuillez vous authentifier pour accéder au tableau de bord.
                </p>
            </div>

            <form onSubmit={handleLogin} className="space-y-6">
                <div className="space-y-4">
                     {/* Username */}
                    <div className="space-y-1">
                        <Input 
                            icon={<Shield size={20} />}
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            placeholder="Identifiant"
                            label="Utilisateur"
                            autoComplete="off"
                        />
                    </div>

                    {/* Password */}
                    <div className="space-y-1">
                        <Input 
                            type="password"
                            icon={<Lock size={20} />}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="••••••••"
                            label="Mot de passe"
                        />
                    </div>
                </div>

                <AnimatePresence>
                    {error && (
                        <motion.div 
                            initial={{ opacity: 0, height: 0, marginTop: 0 }}
                            animate={{ opacity: 1, height: 'auto', marginTop: 12 }}
                            exit={{ opacity: 0, height: 0, marginTop: 0 }}
                            className="overflow-hidden"
                        >
                            <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-3 flex items-center gap-3 text-red-400 text-sm">
                                <AlertTriangle size={18} className="flex-shrink-0" />
                                <span>{error}</span>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                <Button 
                    type="submit" 
                    disabled={isLoading || !username || !password} 
                    fullWidth
                    className="!bg-white !text-black hover:!bg-gray-200 !shadow-none !h-14 !text-base mt-2"
                >
                    {isLoading ? (
                        <div className="flex items-center gap-2">
                            <Loader2 size={20} className="animate-spin" />
                            <span>Vérification...</span>
                        </div>
                    ) : (
                        <div className="flex items-center gap-2">
                            <span>Se connecter</span>
                            <ArrowRight size={20} />
                        </div>
                    )}
                </Button>
            </form>
        </div>

        <p className="text-center text-white/20 text-xs mt-8 font-mono">
            SECURE SYSTEM • ACCESS LOGGED
        </p>
      </motion.div>
    </div>
  );
};

export default AdminLoginScreen;
