
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Wifi, ShieldCheck, QrCode, CreditCard, RotateCw } from 'lucide-react';
import { useApp } from '../context/AppContext';

interface StudentCardScreenProps {
  onClose: () => void;
}

const StudentCardScreen: React.FC<StudentCardScreenProps> = ({ onClose }) => {
  const { user } = useApp();
  const [isFlipped, setIsFlipped] = useState(false);

  if (!user) return null;

  return (
    <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 bg-black/90 backdrop-blur-xl flex flex-col items-center justify-center p-6 overflow-hidden"
    >
        {/* Close Button */}
        <button 
            onClick={onClose}
            className="absolute top-6 right-6 p-3 bg-white/10 rounded-full text-white hover:bg-white/20 transition-colors z-50 backdrop-blur-md"
        >
            <X size={24} />
        </button>

        <h1 className="text-white text-2xl font-bold mb-2 text-center">Ma Carte Étudiante</h1>
        <p className="text-white/50 text-sm mb-10 text-center">Touchez la carte pour la retourner</p>

        {/* 3D Flip Container */}
        <div 
            className="perspective-1000 w-full max-w-[340px] aspect-[1.586/1] cursor-pointer group"
            onClick={() => setIsFlipped(!isFlipped)}
        >
            <motion.div
                className="w-full h-full relative"
                initial={false}
                animate={{ rotateY: isFlipped ? 180 : 0 }}
                transition={{ duration: 0.6, type: "spring", stiffness: 260, damping: 20 }}
                style={{ transformStyle: "preserve-3d" }}
            >
                {/* ---------------- FRONT FACE ---------------- */}
                <div 
                    className="absolute inset-0 backface-hidden rounded-3xl overflow-hidden shadow-[0_25px_50px_-12px_rgba(0,0,0,0.5)] border border-white/10 bg-gradient-to-br from-[#1e293b] via-[#0f172a] to-[#020617]"
                    style={{ backfaceVisibility: 'hidden' }}
                >
                    {/* Noise Texture */}
                    <div className="absolute inset-0 opacity-20 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] mix-blend-overlay pointer-events-none"></div>
                    
                    {/* Decorative Circles */}
                    <div className="absolute -top-20 -right-20 w-60 h-60 rounded-full bg-blue-500/20 blur-3xl"></div>
                    <div className="absolute -bottom-20 -left-20 w-60 h-60 rounded-full bg-purple-500/20 blur-3xl"></div>

                    {/* Content */}
                    <div className="absolute inset-0 p-6 flex flex-col justify-between z-10">
                        {/* Header */}
                        <div className="flex justify-between items-start">
                             <div className="flex items-center gap-2">
                                <div className="w-10 h-10 bg-white/5 rounded-full flex items-center justify-center backdrop-blur-md border border-white/10">
                                    <ShieldCheck size={20} className="text-white" />
                                </div>
                                <div>
                                    <h2 className="text-white text-xs font-bold tracking-widest uppercase opacity-80">Université XYZ</h2>
                                    <p className="text-[10px] text-white/50">Année 2024-2025</p>
                                </div>
                             </div>
                             {/* Gold Chip */}
                             <div className="w-12 h-9 rounded-lg bg-gradient-to-br from-yellow-200 via-yellow-500 to-yellow-600 border border-yellow-400 shadow-sm flex items-center justify-center relative overflow-hidden">
                                <div className="absolute inset-0 opacity-30">
                                    <div className="w-[1px] h-full bg-black/20 absolute left-1/3"></div>
                                    <div className="w-[1px] h-full bg-black/20 absolute right-1/3"></div>
                                    <div className="h-[1px] w-full bg-black/20 absolute top-1/2"></div>
                                </div>
                                <Wifi size={24} className="text-black/20 rotate-90 ml-6" />
                             </div>
                        </div>

                        {/* Middle Info */}
                        <div className="flex gap-5 items-center mt-2">
                            <div className="w-24 h-24 rounded-xl overflow-hidden border-2 border-white/20 shadow-lg relative bg-gray-800">
                                <img src={user.avatarUrl} alt="Student" className="w-full h-full object-cover" />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                            </div>
                            <div className="flex-1 min-w-0">
                                <h1 className="text-white text-xl font-bold uppercase tracking-wide truncate">
                                    {user.lastName}
                                </h1>
                                <p className="text-white/90 text-lg font-medium truncate mb-1">
                                    {user.firstName}
                                </p>
                                <div className="inline-block bg-white/10 backdrop-blur-md border border-white/10 px-2 py-0.5 rounded text-[10px] text-white/80 font-mono">
                                    ID: {user.matricule}
                                </div>
                            </div>
                        </div>

                        {/* Footer */}
                        <div className="flex justify-between items-end">
                            <div>
                                <p className="text-[9px] text-white/40 uppercase tracking-widest mb-0.5">Niveau</p>
                                <p className="text-sm font-bold text-accent">{user.level} - {user.major}</p>
                            </div>
                             <div className="flex gap-1">
                                 <div className="w-2 h-2 rounded-full bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.5)]"></div>
                                 <span className="text-[9px] text-white/60 uppercase">Actif</span>
                             </div>
                        </div>
                    </div>

                    {/* Glossy Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-tr from-white/0 via-white/5 to-white/0 pointer-events-none z-20"></div>
                </div>

                {/* ---------------- BACK FACE ---------------- */}
                <div 
                    className="absolute inset-0 backface-hidden rounded-3xl overflow-hidden shadow-2xl border border-white/10 bg-[#f8fafc] flex flex-col items-center justify-center p-6"
                    style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}
                >
                    {/* Magnetic Strip */}
                    <div className="absolute top-4 left-0 right-0 h-10 bg-[#1e293b]"></div>

                    {/* QR Code Area */}
                    <div className="mt-12 bg-white p-2 rounded-xl shadow-inner border border-gray-100">
                        <div className="w-32 h-32 bg-black flex flex-wrap content-center justify-center p-1">
                             {/* Simulated Real QR */}
                             <div className="w-full h-full bg-white relative">
                                <div className="absolute top-0 left-0 w-8 h-8 border-4 border-black">
                                    <div className="w-4 h-4 bg-black absolute top-1 left-1"></div>
                                </div>
                                <div className="absolute top-0 right-0 w-8 h-8 border-4 border-black">
                                     <div className="w-4 h-4 bg-black absolute top-1 left-1"></div>
                                </div>
                                <div className="absolute bottom-0 left-0 w-8 h-8 border-4 border-black">
                                     <div className="w-4 h-4 bg-black absolute top-1 left-1"></div>
                                </div>
                                {/* Random dots */}
                                <div className="absolute inset-0 m-2 flex flex-wrap gap-1 justify-center items-center overflow-hidden opacity-80">
                                    {[...Array(20)].map((_, i) => (
                                        <div key={i} className="w-2 h-2 bg-black rounded-sm"></div>
                                    ))}
                                </div>
                             </div>
                        </div>
                    </div>

                    {/* Barcode & Signature */}
                    <div className="w-full mt-6 space-y-4">
                        <div className="flex justify-between items-center text-xs text-gray-400 font-mono">
                            <span>VALID: 09/25</span>
                            <span>{user.matricule}</span>
                        </div>
                        {/* Barcode Strip */}
                        <div className="h-10 w-full bg-transparent flex items-end justify-between px-2 gap-[2px] opacity-80">
                            {[...Array(40)].map((_, i) => (
                                <div key={i} className={`bg-black h-${Math.random() > 0.5 ? 'full' : '2/3'} w-[2px]`}></div>
                            ))}
                        </div>
                    </div>
                </div>
            </motion.div>
        </div>

        {/* Action Buttons */}
        <div className="mt-10 flex gap-4">
            <button className="flex flex-col items-center gap-2 text-white/70 hover:text-white transition-colors group">
                <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center group-hover:bg-white/20 transition-colors backdrop-blur-md">
                    <QrCode size={20} />
                </div>
                <span className="text-xs">Scanner</span>
            </button>
            <button className="flex flex-col items-center gap-2 text-white/70 hover:text-white transition-colors group">
                <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center group-hover:bg-white/20 transition-colors backdrop-blur-md">
                    <CreditCard size={20} />
                </div>
                <span className="text-xs">Recharger</span>
            </button>
        </div>
    </motion.div>
  );
};

export default StudentCardScreen;
