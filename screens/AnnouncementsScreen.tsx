
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Calendar, X, Megaphone, Share2, ChevronRight, ArrowRight } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Announcement } from '../types';

const CATEGORIES = ["Tout", "Pédagogie", "Vie Étudiante", "Événements", "Stages & Emploi"];

const AnnouncementsScreen: React.FC = () => {
  // Use context data instead of hardcoded data
  const { announcements } = useApp();
  
  const [selectedCategory, setSelectedCategory] = useState("Tout");
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [selectedAnnouncement, setSelectedAnnouncement] = useState<Announcement | null>(null);

  const filteredAnnouncements = announcements.filter(ann => {
    const matchCategory = selectedCategory === "Tout" || ann.category === selectedCategory;
    const matchSearch = ann.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                        ann.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchCategory && matchSearch;
  });

  const getDateParts = (dateStr: string) => {
    const parts = dateStr.split(' ');
    if (parts.length >= 2) return { day: parts[0], month: parts[1] };
    // Fallback if date is not formatted as "15 Juil"
    return { day: 'INFO', month: '' };
  };

  const AnnouncementDetail = ({ ann, onClose }: { ann: Announcement, onClose: () => void }) => (
    <motion.div 
        initial={{ y: '100%' }}
        animate={{ y: 0 }}
        exit={{ y: '100%' }}
        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
        className="fixed inset-0 z-50 bg-bgLight dark:bg-bgDark flex flex-col overflow-y-auto"
        role="dialog"
    >
        <div className="relative">
             {/* Hero Image */}
            <div className="h-80 w-full relative overflow-hidden">
                {ann.imageUrl ? (
                    <img src={ann.imageUrl} alt={ann.title} className="w-full h-full object-cover" />
                ) : (
                    <div className="w-full h-full bg-gradient-to-br from-primary to-blue-600 flex items-center justify-center">
                        <Megaphone size={80} className="text-white/20" />
                    </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-black/20" />
                
                <div className="absolute top-safe-top left-0 right-0 px-4 mt-6 flex justify-between items-center z-20">
                    <button onClick={onClose} className="w-12 h-12 bg-white/90 dark:bg-black/60 backdrop-blur-md rounded-full flex items-center justify-center text-black dark:text-white hover:bg-white dark:hover:bg-black/80 transition-colors shadow-lg">
                        <X size={24} />
                    </button>
                    <button className="w-12 h-12 bg-white/90 dark:bg-black/60 backdrop-blur-md rounded-full flex items-center justify-center text-black dark:text-white hover:bg-white dark:hover:bg-black/80 transition-colors shadow-lg">
                        <Share2 size={22} />
                    </button>
                </div>
            </div>

            {/* Content Body */}
            <div className="relative -mt-12 bg-bgLight dark:bg-bgDark rounded-t-[32px] px-6 py-8 min-h-[calc(100vh-250px)] shadow-[0_-10px_40px_rgba(0,0,0,0.1)]">
                 <div className="w-12 h-1.5 bg-gray-200 dark:bg-gray-700 rounded-full mx-auto mb-8 opacity-50" />
                 
                 <div className="flex items-center gap-3 mb-5">
                    <span className="px-3 py-1.5 rounded-full bg-primary/10 text-primary text-xs font-bold uppercase tracking-wide">{ann.category}</span>
                    <span className="text-xs text-textSecLight dark:text-textSecDark flex items-center gap-1.5 font-medium"><Calendar size={14} /> {ann.date}</span>
                 </div>

                 <h1 className="text-3xl font-bold text-textMainLight dark:text-textMainDark mb-8 leading-tight">{ann.title}</h1>

                 <div className="prose prose-lg dark:prose-invert max-w-none">
                    {ann.content ? ann.content.split('\n').map((paragraph, idx) => (
                        <p key={idx} className="text-textMainLight/80 dark:text-textMainDark/80 leading-relaxed mb-6 text-[17px]">{paragraph}</p>
                    )) : <p>{ann.description}</p>}
                 </div>
                 <div className="h-24" />
            </div>
        </div>
    </motion.div>
  );

  return (
    <div className="min-h-screen bg-bgLight dark:bg-bgDark pt-20 pb-32">
      <AnimatePresence>
        {selectedAnnouncement && <AnnouncementDetail ann={selectedAnnouncement} onClose={() => setSelectedAnnouncement(null)} />}
      </AnimatePresence>

      <div className="fixed top-0 left-0 right-0 z-30 bg-white/90 dark:bg-black/90 backdrop-blur-xl border-b border-gray-100 dark:border-white/5 pt-safe-top transition-all duration-300">
        <div className="max-w-md mx-auto px-4 pb-0">
            <div className="flex items-center justify-between h-16">
                <AnimatePresence mode="wait">
                    {isSearchOpen ? (
                        <motion.div key="search" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="flex items-center w-full gap-3">
                            <div className="relative flex-1">
                                <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                                <input autoFocus type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="Rechercher une info..." className="w-full h-11 bg-gray-100 dark:bg-white/10 rounded-2xl pl-10 pr-4 text-sm outline-none text-textMainLight dark:text-textMainDark" />
                            </div>
                            <button onClick={() => { setIsSearchOpen(false); setSearchQuery(""); }} className="text-sm font-semibold text-primary px-2">Annuler</button>
                        </motion.div>
                    ) : (
                        <motion.div key="title" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex items-center justify-between w-full">
                            <h1 className="text-2xl font-bold text-textMainLight dark:text-textMainDark tracking-tight">Actualités</h1>
                            <button onClick={() => setIsSearchOpen(true)} className="w-10 h-10 rounded-full bg-gray-50 dark:bg-white/5 flex items-center justify-center text-textMainLight dark:text-textMainDark"><Search size={20} /></button>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
            <div className="flex gap-2 overflow-x-auto no-scrollbar pb-3 pt-1">
                {CATEGORIES.map((cat) => (
                    <button key={cat} onClick={() => setSelectedCategory(cat)} className={`whitespace-nowrap px-4 py-2 rounded-full text-xs font-semibold transition-all duration-300 border ${selectedCategory === cat ? 'bg-textMainLight dark:bg-white text-white dark:text-black border-transparent shadow-lg' : 'bg-transparent border-gray-200 dark:border-white/10 text-textSecLight dark:text-textSecDark'}`}>
                        {cat}
                    </button>
                ))}
            </div>
        </div>
      </div>

      <div className="max-w-md mx-auto px-4 pt-4 space-y-6">
        <AnimatePresence>
            {selectedCategory === "Tout" && !searchQuery && announcements.length > 0 && (
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} onClick={() => setSelectedAnnouncement(announcements[0])} className="relative w-full aspect-[4/3] rounded-[32px] overflow-hidden shadow-soft group cursor-pointer">
                    <img src={announcements[0].imageUrl} alt="Featured" className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                    <div className="absolute top-4 left-4"><span className="bg-white/20 backdrop-blur-md text-white text-[10px] font-bold px-2.5 py-1 rounded-lg uppercase tracking-wide border border-white/10">À la une</span></div>
                    <div className="absolute bottom-0 left-0 right-0 p-6">
                        <div className="backdrop-blur-xl bg-white/10 border border-white/10 rounded-2xl p-4">
                            <div className="flex items-center gap-2 text-white/80 text-xs mb-2 font-medium">
                                <span className="text-accent">{announcements[0].category}</span><span>•</span><span>{announcements[0].date}</span>
                            </div>
                            <h2 className="text-white text-lg font-bold leading-tight mb-2 line-clamp-2">{announcements[0].title}</h2>
                            <div className="flex items-center gap-2 text-white/60 text-xs font-medium group-hover:text-white transition-colors"><span>Lire l'article</span><ArrowRight size={14} /></div>
                        </div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>

        <div className="flex items-center justify-between pt-2">
            <h3 className="font-bold text-lg text-textMainLight dark:text-textMainDark">{searchQuery ? `Résultats` : "Dernières infos"}</h3>
        </div>

        <div className="space-y-4">
            {filteredAnnouncements.map((ann, idx) => {
                if (selectedCategory === "Tout" && !searchQuery && idx === 0) return null; // Skip featured
                const { day, month } = getDateParts(ann.date);
                return (
                    <motion.div key={ann.id} layout initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.05 }} onClick={() => setSelectedAnnouncement(ann)} className="bg-white dark:bg-surfaceDark p-3 rounded-3xl shadow-sm border border-gray-100 dark:border-white/5 flex gap-4 cursor-pointer group active:scale-[0.98] transition-transform relative overflow-hidden">
                        <div className="flex-shrink-0 w-14 h-16 bg-gray-50 dark:bg-white/5 rounded-2xl flex flex-col items-center justify-center border border-gray-100 dark:border-white/5 group-hover:border-primary/20 transition-colors">
                            <span className="text-lg font-bold text-textMainLight dark:text-textMainDark leading-none mb-0.5">{day}</span>
                            <span className="text-[10px] font-bold text-textSecLight dark:text-textSecDark uppercase">{month}</span>
                        </div>
                        <div className="flex-1 py-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1"><span className="text-[10px] font-bold text-primary uppercase tracking-wide">{ann.category}</span></div>
                            <h3 className="font-bold text-textMainLight dark:text-textMainDark text-sm leading-tight mb-1 truncate pr-2">{ann.title}</h3>
                            <p className="text-xs text-textSecLight dark:text-textSecDark line-clamp-2 leading-relaxed opacity-90">{ann.description}</p>
                        </div>
                        {ann.imageUrl ? (
                             <div className="w-16 h-16 rounded-2xl overflow-hidden flex-shrink-0 relative">
                                <img src={ann.imageUrl} alt="" className="w-full h-full object-cover" />
                             </div>
                        ) : (
                             <div className="w-10 h-full flex items-center justify-center text-gray-300 dark:text-gray-700"><ChevronRight size={20} /></div>
                        )}
                    </motion.div>
                );
            })}
        </div>
      </div>
    </div>
  );
};

export default AnnouncementsScreen;
