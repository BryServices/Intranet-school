
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Calendar, X, Megaphone, Share2, ChevronRight, ArrowRight } from 'lucide-react';

interface Announcement {
  id: string;
  title: string;
  category: string;
  date: string; 
  rawDate: Date; 
  description: string;
  content: string;
  imageUrl?: string;
  important?: boolean;
}

const CATEGORIES = ["Tout", "Pédagogie", "Vie Étudiante", "Événements", "Stages & Emploi"];

const ANNOUNCEMENTS_DATA: Announcement[] = [
  {
    id: '1',
    title: 'Remise des diplômes Promotion 2024',
    category: 'Événements',
    date: '15 Juil',
    rawDate: new Date(2025, 6, 15),
    description: 'La cérémonie officielle aura lieu le 15 Juillet au grand amphithéâtre. Les inscriptions pour les invités sont ouvertes.',
    content: `Chers étudiants,\n\nNous avons le plaisir de vous annoncer que la cérémonie de remise des diplômes de la promotion 2024 se tiendra le vendredi 15 juillet à partir de 14h00 dans le Grand Amphithéâtre.\n\nProgramme de la journée :\n- 13h30 : Accueil des diplômés et émargement\n- 14h00 : Discours d'ouverture du Directeur\n- 14h30 : Appel des diplômés par filière\n- 16h30 : Cocktail de clôture dans le hall principal\n\nChaque étudiant peut inviter jusqu'à 2 personnes. Veuillez confirmer votre présence et inscrire vos invités via le formulaire envoyé par mail avant le 30 juin.\n\nUne tenue correcte est exigée (toge fournie sur place).`,
    imageUrl: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=800&h=600&fit=crop',
    important: true,
  },
  {
    id: '2',
    title: 'Maintenance planifiée Moodle',
    category: 'Pédagogie',
    date: '12 Oct',
    rawDate: new Date(2025, 9, 12),
    description: 'La plateforme de cours sera indisponible ce samedi de 22h à 02h pour une mise à jour de sécurité.',
    content: `Une maintenance technique est programmée sur la plateforme Moodle ce samedi soir entre 22h00 et 02h00 du matin.\n\nDurant cette période, l'accès aux cours, le dépôt de devoirs et les forums seront inaccessibles.\n\nNous vous conseillons d'anticiper vos dépôts de travaux si une échéance est fixée à cette date.\n\nMerci de votre compréhension,\nLe service informatique.`,
  },
  {
    id: '3',
    title: 'Club Robotique : Coupe de France',
    category: 'Vie Étudiante',
    date: '10 Oct',
    rawDate: new Date(2025, 9, 10),
    description: "Rejoignez l'équipe universitaire pour la préparation de la Coupe de France de Robotique !",
    content: `Le Club Robotique recrute ses nouveaux membres pour la saison 2025 !\n\nObjectif : La Coupe de France de Robotique.\nThème de l'année : "The Cherry on the Cake".\n\nNous recherchons des profils variés :\n- Mécanique & Conception 3D\n- Électronique embarquée\n- Programmation (C++, Python)\n- Communication & Gestion de projet\n\nPremière réunion d'information ce jeudi à 18h en salle 204. Venez nombreux !`,
    imageUrl: 'https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?w=800&h=400&fit=crop',
  },
  {
    id: '4',
    title: 'Offre de stage : Développeur Fullstack',
    category: 'Stages & Emploi',
    date: '08 Oct',
    rawDate: new Date(2025, 9, 8),
    description: 'Partenaire Tech recherche un stagiaire pour 6 mois. Stack : React, Node.js.',
    content: `Notre partenaire "InnovTech Solutions" recherche un(e) stagiaire Développeur Fullstack pour une durée de 6 mois.\n\nMissions :\n- Participation au développement d'une nouvelle plateforme SaaS\n- Création d'interfaces utilisateurs modernes avec React\n- Développement d'API REST avec Node.js/Express\n\nProfil recherché :\n- Étudiant en Master 1 ou 2 Informatique\n- Bonnes connaissances en JavaScript/TypeScript\n- Curieux et autonome\n\nEnvoyez votre CV à stages@innovtech.com avec la référence STAGE-FS-2025.`,
  },
  {
    id: '5',
    title: 'Bourse au mérite : Dépôt des dossiers',
    category: 'Vie Étudiante',
    date: '05 Oct',
    rawDate: new Date(2025, 9, 5),
    description: "La campagne pour les bourses au mérite est ouverte jusqu'au 31 Octobre.",
    content: `Les étudiants souhaitant postuler à la bourse au mérite de l'université pour l'année universitaire 2025-2026 sont invités à déposer leur dossier au secrétariat général avant le 31 octobre.\n\nCritères d'éligibilité :\n- Avoir obtenu une moyenne supérieure à 16/20 l'année précédente\n- Assiduité exemplaire\n\nPièces à fournir :\n- Relevés de notes\n- Lettre de motivation\n- Avis d'imposition des parents\n\nTout dossier incomplet sera refusé.`,
  }
];

const AnnouncementsScreen: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState("Tout");
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [selectedAnnouncement, setSelectedAnnouncement] = useState<Announcement | null>(null);

  const filteredAnnouncements = ANNOUNCEMENTS_DATA.filter(ann => {
    const matchCategory = selectedCategory === "Tout" || ann.category === selectedCategory;
    const matchSearch = ann.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                        ann.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchCategory && matchSearch;
  });

  const getDateParts = (dateStr: string) => {
    const parts = dateStr.split(' ');
    if (parts.length >= 2) return { day: parts[0], month: parts[1] };
    return { day: '??', month: '---' };
  };

  const AnnouncementDetail = ({ ann, onClose }: { ann: Announcement, onClose: () => void }) => (
    <motion.div 
        initial={{ y: '100%' }}
        animate={{ y: 0 }}
        exit={{ y: '100%' }}
        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
        className="fixed inset-0 z-50 bg-bgLight dark:bg-bgDark flex flex-col overflow-y-auto"
        role="dialog"
        aria-modal="true"
        aria-labelledby="announcement-title"
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
                
                {/* Navbar buttons in Hero */}
                <div className="absolute top-safe-top left-0 right-0 px-4 mt-6 flex justify-between items-center z-20">
                    <button 
                        onClick={onClose}
                        className="w-12 h-12 bg-white/90 dark:bg-black/60 backdrop-blur-md rounded-full flex items-center justify-center text-black dark:text-white hover:bg-white dark:hover:bg-black/80 transition-colors shadow-lg"
                        aria-label="Fermer"
                    >
                        <X size={24} />
                    </button>
                    <button 
                        className="w-12 h-12 bg-white/90 dark:bg-black/60 backdrop-blur-md rounded-full flex items-center justify-center text-black dark:text-white hover:bg-white dark:hover:bg-black/80 transition-colors shadow-lg"
                        aria-label="Partager"
                    >
                        <Share2 size={22} />
                    </button>
                </div>
            </div>

            {/* Content Body */}
            <div className="relative -mt-12 bg-bgLight dark:bg-bgDark rounded-t-[32px] px-6 py-8 min-h-[calc(100vh-250px)] shadow-[0_-10px_40px_rgba(0,0,0,0.1)]">
                 {/* Drag indicator */}
                 <div className="w-12 h-1.5 bg-gray-200 dark:bg-gray-700 rounded-full mx-auto mb-8 opacity-50" />
                 
                 <div className="flex items-center gap-3 mb-5">
                    <span className="px-3 py-1.5 rounded-full bg-primary/10 text-primary text-xs font-bold uppercase tracking-wide">
                        {ann.category}
                    </span>
                    <span className="text-xs text-textSecLight dark:text-textSecDark flex items-center gap-1.5 font-medium">
                        <Calendar size={14} /> {ann.date}
                    </span>
                 </div>

                 <h1 id="announcement-title" className="text-3xl font-bold text-textMainLight dark:text-textMainDark mb-8 leading-tight">
                    {ann.title}
                 </h1>

                 <div className="prose prose-lg dark:prose-invert max-w-none">
                    {ann.content.split('\n').map((paragraph, idx) => (
                        <p key={idx} className="text-textMainLight/80 dark:text-textMainDark/80 leading-relaxed mb-6 text-[17px]">
                            {paragraph}
                        </p>
                    ))}
                 </div>
                 
                 <div className="h-24" />
            </div>
        </div>
    </motion.div>
  );

  return (
    <div className="min-h-screen bg-bgLight dark:bg-bgDark pt-20 pb-32">
      <AnimatePresence>
        {selectedAnnouncement && (
            <AnnouncementDetail 
                ann={selectedAnnouncement} 
                onClose={() => setSelectedAnnouncement(null)} 
            />
        )}
      </AnimatePresence>

      {/* Header */}
      <div className="fixed top-0 left-0 right-0 z-30 bg-white/90 dark:bg-black/90 backdrop-blur-xl border-b border-gray-100 dark:border-white/5 pt-safe-top transition-all duration-300">
        <div className="max-w-md mx-auto px-4 pb-0">
            <div className="flex items-center justify-between h-16">
                <AnimatePresence mode="wait">
                    {isSearchOpen ? (
                        <motion.div 
                            key="search"
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            transition={{ duration: 0.2 }}
                            className="flex items-center w-full gap-3"
                        >
                            <div className="relative flex-1">
                                <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                                <input 
                                    autoFocus
                                    type="text" 
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    placeholder="Rechercher une info..."
                                    className="w-full h-11 bg-gray-100 dark:bg-white/10 rounded-2xl pl-10 pr-4 text-sm outline-none text-textMainLight dark:text-textMainDark placeholder-gray-500 border border-transparent focus:border-primary/20 focus:ring-2 focus:ring-primary/20 transition-all"
                                />
                            </div>
                            <button 
                                onClick={() => {
                                    setIsSearchOpen(false);
                                    setSearchQuery("");
                                }}
                                className="text-sm font-semibold text-primary px-2 hover:opacity-80 transition-opacity"
                            >
                                Annuler
                            </button>
                        </motion.div>
                    ) : (
                        <motion.div 
                            key="title"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="flex items-center justify-between w-full"
                        >
                            <h1 className="text-2xl font-bold text-textMainLight dark:text-textMainDark tracking-tight">Actualités</h1>
                            <button 
                                onClick={() => setIsSearchOpen(true)}
                                className="w-10 h-10 rounded-full bg-gray-50 dark:bg-white/5 flex items-center justify-center text-textMainLight dark:text-textMainDark hover:bg-gray-100 dark:hover:bg-white/10 transition-colors"
                                aria-label="Rechercher"
                            >
                                <Search size={20} />
                            </button>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
            
            {/* Categories */}
            <div className="flex gap-2 overflow-x-auto no-scrollbar pb-3 pt-1" role="tablist">
                {CATEGORIES.map((cat) => {
                    const isSelected = selectedCategory === cat;
                    return (
                        <button
                            key={cat}
                            role="tab"
                            aria-selected={isSelected}
                            onClick={() => setSelectedCategory(cat)}
                            className={`whitespace-nowrap px-4 py-2 rounded-full text-xs font-semibold transition-all duration-300 border ${
                                isSelected 
                                ? 'bg-textMainLight dark:bg-white text-white dark:text-black border-transparent shadow-lg shadow-black/10 dark:shadow-white/10' 
                                : 'bg-transparent border-gray-200 dark:border-white/10 text-textSecLight dark:text-textSecDark hover:border-gray-300 dark:hover:border-white/20'
                            }`}
                        >
                            {cat}
                        </button>
                    )
                })}
            </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-md mx-auto px-4 pt-4 space-y-6">
        
        {/* Featured Card (Hidden on Search) */}
        <AnimatePresence>
            {selectedCategory === "Tout" && !searchQuery && (
                <motion.div 
                    initial={{ opacity: 0, y: 20, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, height: 0 }}
                    onClick={() => setSelectedAnnouncement(ANNOUNCEMENTS_DATA[0])}
                    className="relative w-full aspect-[4/3] rounded-[32px] overflow-hidden shadow-soft group cursor-pointer"
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => e.key === 'Enter' && setSelectedAnnouncement(ANNOUNCEMENTS_DATA[0])}
                >
                    <img 
                        src={ANNOUNCEMENTS_DATA[0].imageUrl} 
                        alt="Featured" 
                        className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                    
                    <div className="absolute top-4 left-4 flex gap-2">
                        <span className="bg-white/20 backdrop-blur-md text-white text-[10px] font-bold px-2.5 py-1 rounded-lg uppercase tracking-wide border border-white/10">
                            À la une
                        </span>
                    </div>

                    <div className="absolute bottom-0 left-0 right-0 p-6">
                        <div className="backdrop-blur-xl bg-white/10 border border-white/10 rounded-2xl p-4">
                            <div className="flex items-center gap-2 text-white/80 text-xs mb-2 font-medium">
                                <span className="text-accent">{ANNOUNCEMENTS_DATA[0].category}</span>
                                <span>•</span>
                                <span>{ANNOUNCEMENTS_DATA[0].date}</span>
                            </div>
                            <h2 className="text-white text-lg font-bold leading-tight mb-2 line-clamp-2">
                                {ANNOUNCEMENTS_DATA[0].title}
                            </h2>
                            <div className="flex items-center gap-2 text-white/60 text-xs font-medium group-hover:text-white transition-colors">
                                <span>Lire l'article</span>
                                <ArrowRight size={14} />
                            </div>
                        </div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>

        {/* List Title */}
        <div className="flex items-center justify-between pt-2">
            <h3 className="font-bold text-lg text-textMainLight dark:text-textMainDark">
                {searchQuery ? `Résultats pour "${searchQuery}"` : "Dernières infos"}
            </h3>
            {!searchQuery && (
                <span className="text-xs text-textSecLight dark:text-textSecDark bg-gray-100 dark:bg-white/5 px-2 py-1 rounded-lg">
                    {filteredAnnouncements.length - (selectedCategory === "Tout" ? 1 : 0)} articles
                </span>
            )}
        </div>

        {/* List */}
        <div className="space-y-4" role="list">
            {filteredAnnouncements.map((ann, idx) => {
                // Skip Featured item in "Tout" view
                if (selectedCategory === "Tout" && !searchQuery && idx === 0) return null;
                const { day, month } = getDateParts(ann.date);

                return (
                    <motion.div
                        key={ann.id}
                        role="listitem"
                        layout
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.05 }}
                        onClick={() => setSelectedAnnouncement(ann)}
                        onKeyDown={(e) => e.key === 'Enter' && setSelectedAnnouncement(ann)}
                        tabIndex={0}
                        className="bg-white dark:bg-surfaceDark p-3 rounded-3xl shadow-sm border border-gray-100 dark:border-white/5 flex gap-4 cursor-pointer group active:scale-[0.98] transition-transform relative overflow-hidden focus:outline-none focus:ring-2 focus:ring-primary/20"
                    >
                        {/* Date Badge */}
                        <div className="flex-shrink-0 w-14 h-16 bg-gray-50 dark:bg-white/5 rounded-2xl flex flex-col items-center justify-center border border-gray-100 dark:border-white/5 group-hover:border-primary/20 transition-colors" aria-label={`Publié le ${ann.date}`}>
                            <span className="text-lg font-bold text-textMainLight dark:text-textMainDark leading-none mb-0.5">{day}</span>
                            <span className="text-lg font-bold text-textMainLight dark:text-textMainDark leading-none mb-0.5">{day}</span>
                            <span className="text-[10px] font-bold text-textSecLight dark:text-textSecDark uppercase">{month}</span>
                        </div>

                        {/* Content */}
                        <div className="flex-1 py-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                                <span className="text-[10px] font-bold text-primary uppercase tracking-wide">
                                    {ann.category}
                                </span>
                            </div>
                            <h3 className="font-bold text-textMainLight dark:text-textMainDark text-sm leading-tight mb-1 truncate pr-2">
                                {ann.title}
                            </h3>
                            <p className="text-xs text-textSecLight dark:text-textSecDark line-clamp-2 leading-relaxed opacity-90">
                                {ann.description}
                            </p>
                        </div>

                        {/* Thumbnail or Icon */}
                        {ann.imageUrl ? (
                             <div className="w-16 h-16 rounded-2xl overflow-hidden flex-shrink-0 relative">
                                <img src={ann.imageUrl} alt="" className="w-full h-full object-cover" />
                                <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors" />
                             </div>
                        ) : (
                             <div className="w-10 h-full flex items-center justify-center text-gray-300 dark:text-gray-700">
                                <ChevronRight size={20} />
                             </div>
                        )}
                    </motion.div>
                );
            })}

            {filteredAnnouncements.length === 0 && (
                <div className="flex flex-col items-center justify-center py-12 text-center opacity-60">
                    <div className="w-16 h-16 bg-gray-100 dark:bg-white/5 rounded-full flex items-center justify-center mb-4">
                        <Search size={24} className="text-gray-400" />
                    </div>
                    <p className="text-textMainLight dark:text-textMainDark font-medium">Aucun résultat</p>
                    <p className="text-sm text-textSecLight dark:text-textSecDark">Essayez d'autres mots-clés</p>
                </div>
            )}
        </div>
      </div>
    </div>
  );
};

export default AnnouncementsScreen;
