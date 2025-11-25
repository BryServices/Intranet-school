
import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, Camera, Check, Loader2, User, FileText, ZoomIn, ZoomOut, Move, X } from 'lucide-react';
import { useApp } from '../context/AppContext';
import Input from '../components/Input';
import Button from '../components/Button';

interface EditProfileScreenProps {
  onClose: () => void;
}

// Composant interne pour le recadrage
const ImageCropper = ({ 
    imageSrc, 
    onCancel, 
    onCropComplete 
}: { 
    imageSrc: string; 
    onCancel: () => void; 
    onCropComplete: (croppedImage: string) => void; 
}) => {
    const [zoom, setZoom] = useState(1);
    const [position, setPosition] = useState({ x: 0, y: 0 });
    const [isDragging, setIsDragging] = useState(false);
    const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
    const imageRef = useRef<HTMLImageElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);

    // Taille de la zone de coupe (cercle)
    const CROP_SIZE = 280; 

    const handlePointerDown = (e: React.PointerEvent) => {
        setIsDragging(true);
        setDragStart({ x: e.clientX - position.x, y: e.clientY - position.y });
    };

    const handlePointerMove = (e: React.PointerEvent) => {
        if (isDragging) {
            setPosition({
                x: e.clientX - dragStart.x,
                y: e.clientY - dragStart.y
            });
        }
    };

    const handlePointerUp = () => {
        setIsDragging(false);
    };

    const performCrop = () => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        const img = imageRef.current;

        if (!ctx || !img) return;

        // Résolution de sortie (Haute qualité)
        const OUTPUT_SIZE = 500;
        canvas.width = OUTPUT_SIZE;
        canvas.height = OUTPUT_SIZE;

        // Remplir le fond (au cas où l'image ne couvre pas tout)
        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(0, 0, OUTPUT_SIZE, OUTPUT_SIZE);

        // Calculs de projection
        // Le ratio entre la taille de sortie et la taille visuelle de la zone de crop
        const scaleFactor = OUTPUT_SIZE / CROP_SIZE;

        ctx.translate(OUTPUT_SIZE / 2, OUTPUT_SIZE / 2);
        ctx.scale(zoom * scaleFactor, zoom * scaleFactor);
        ctx.translate(position.x, position.y);
        
        // Dessiner l'image centrée par rapport au contexte transformé
        ctx.drawImage(img, -img.naturalWidth / 2, -img.naturalHeight / 2);

        onCropComplete(canvas.toDataURL('image/jpeg', 0.9));
    };

    return (
        <div className="fixed inset-0 z-[60] bg-black flex flex-col">
            <div className="relative flex-1 overflow-hidden touch-none select-none bg-black"
                 onPointerDown={handlePointerDown}
                 onPointerMove={handlePointerMove}
                 onPointerUp={handlePointerUp}
                 onPointerLeave={handlePointerUp}
                 ref={containerRef}
            >
                {/* Image conteneur centré */}
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <img 
                        ref={imageRef}
                        src={imageSrc}
                        alt="To Crop"
                        style={{
                            transform: `translate(${position.x}px, ${position.y}px) scale(${zoom})`,
                            cursor: 'move'
                        }}
                        className="max-w-none transition-transform duration-75 pointer-events-auto"
                        draggable={false}
                    />
                </div>

                {/* Masque Sombre avec trou circulaire (Overlay) */}
                <div className="absolute inset-0 pointer-events-none" 
                     style={{
                         background: `radial-gradient(circle ${CROP_SIZE / 2}px at center, transparent 99%, rgba(0,0,0,0.8) 100%)`
                     }}
                />
                
                {/* Indicateur de zone */}
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <div 
                        className="rounded-full border-2 border-white/50 shadow-[0_0_0_9999px_rgba(0,0,0,0.5)]"
                        style={{ width: CROP_SIZE, height: CROP_SIZE }} 
                    />
                </div>
                
                {/* Guide Text */}
                <div className="absolute top-safe-top mt-4 w-full text-center pointer-events-none">
                    <span className="bg-black/50 text-white px-3 py-1 rounded-full text-xs backdrop-blur-md">
                        Déplacez et zoomez pour ajuster
                    </span>
                </div>
            </div>

            {/* Contrôles */}
            <div className="bg-surfaceDark px-6 py-6 pb-safe-bottom space-y-6">
                <div className="flex items-center gap-4">
                    <ZoomOut size={20} className="text-gray-400" />
                    <input 
                        type="range" 
                        min="0.5" 
                        max="3" 
                        step="0.01" 
                        value={zoom}
                        onChange={(e) => setZoom(parseFloat(e.target.value))}
                        className="flex-1 h-2 bg-gray-600 rounded-lg appearance-none cursor-pointer accent-primary"
                    />
                    <ZoomIn size={20} className="text-gray-400" />
                </div>

                <div className="flex gap-3">
                    <Button 
                        variant="secondary" 
                        onClick={onCancel}
                        className="flex-1 !bg-gray-700 !text-white hover:!bg-gray-600"
                    >
                        Annuler
                    </Button>
                    <Button 
                        onClick={performCrop} 
                        className="flex-1"
                    >
                        Appliquer
                    </Button>
                </div>
            </div>
        </div>
    );
};

const EditProfileScreen: React.FC<EditProfileScreenProps> = ({ onClose }) => {
  const { user, updateUser } = useApp();
  const [isLoading, setIsLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // Crop State
  const [rawImage, setRawImage] = useState<string | null>(null);

  // Local state for form
  const [formData, setFormData] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    bio: user?.bio || '',
    avatarUrl: user?.avatarUrl || '',
  });

  if (!user) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulate API call
    setTimeout(() => {
        updateUser(formData);
        setIsLoading(false);
        onClose();
    }, 1000);
  };

  const handlePhotoClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert("L'image est trop volumineuse (max 5MB).");
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === 'string') {
            // Au lieu de mettre à jour directement, on ouvre le cropper
            setRawImage(reader.result);
        }
      };
      reader.readAsDataURL(file);
      // Reset input value to allow selecting the same file again if needed
      event.target.value = '';
    }
  };

  const handleCropComplete = (croppedImageBase64: string) => {
      setFormData(prev => ({ ...prev, avatarUrl: croppedImageBase64 }));
      setRawImage(null); // Close cropper
  };

  return (
    <>
        <motion.div 
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed inset-0 z-50 bg-gray-50 dark:bg-black overflow-y-auto"
        >
            <form onSubmit={handleSubmit} className="min-h-screen flex flex-col">
                {/* Header */}
                <div className="sticky top-0 bg-white/80 dark:bg-surfaceDark/80 backdrop-blur-md px-4 py-4 flex items-center justify-between z-20 border-b border-gray-100 dark:border-white/5 pt-safe-top">
                    <button 
                        type="button"
                        onClick={onClose} 
                        className="p-2 -ml-2 rounded-full hover:bg-gray-100 dark:hover:bg-white/10 text-textMainLight dark:text-textMainDark"
                    >
                        <ChevronLeft size={24} />
                    </button>
                    <h1 className="text-lg font-bold text-textMainLight dark:text-textMainDark">Modifier le profil</h1>
                    <button 
                        type="submit" 
                        disabled={isLoading}
                        className="p-2 -mr-2 text-primary font-bold text-sm hover:opacity-80 disabled:opacity-50 flex items-center gap-2"
                    >
                        {isLoading ? <Loader2 size={18} className="animate-spin" /> : 'Enregistrer'}
                    </button>
                </div>

                <div className="p-6 max-w-md mx-auto w-full space-y-8 pb-24">
                    
                    {/* Avatar Section */}
                    <div className="flex flex-col items-center">
                        <input 
                            type="file" 
                            ref={fileInputRef} 
                            onChange={handleFileChange} 
                            accept="image/png, image/jpeg, image/webp" 
                            className="hidden" 
                        />
                        <div 
                            onClick={handlePhotoClick}
                            className="relative group cursor-pointer active:scale-95 transition-transform"
                            role="button"
                            aria-label="Changer la photo de profil"
                        >
                            <div className="w-28 h-28 rounded-full border-4 border-white dark:border-surfaceDark shadow-soft overflow-hidden bg-gray-100 dark:bg-white/10 relative">
                                <img 
                                    src={formData.avatarUrl} 
                                    alt="Profile" 
                                    className="w-full h-full object-cover" 
                                />
                            </div>
                            <div className="absolute inset-0 bg-black/30 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                <Camera className="text-white" size={24} />
                            </div>
                            <button 
                                type="button"
                                className="absolute bottom-0 right-0 bg-primary text-white p-2 rounded-full border-4 border-white dark:border-black shadow-md"
                            >
                                <Camera size={16} />
                            </button>
                        </div>
                        <button 
                            type="button" 
                            onClick={handlePhotoClick}
                            className="mt-3 text-xs text-primary font-medium hover:underline"
                        >
                            Changer la photo
                        </button>
                    </div>

                    {/* Form Fields */}
                    <div className="space-y-6">
                        <div className="grid grid-cols-2 gap-4">
                            <Input 
                                label="Prénom" 
                                value={formData.firstName}
                                onChange={(e) => setFormData({...formData, firstName: e.target.value})}
                                icon={<User size={18} />}
                            />
                            <Input 
                                label="Nom" 
                                value={formData.lastName}
                                onChange={(e) => setFormData({...formData, lastName: e.target.value})}
                            />
                        </div>

                        <div className="flex flex-col gap-2">
                            <label className="text-sm font-medium text-textSecLight dark:text-textSecDark ml-1">
                                Bio
                            </label>
                            <div className="relative">
                                <div className="absolute left-4 top-4 text-gray-400">
                                    <FileText size={18} />
                                </div>
                                <textarea
                                    className="w-full h-32 bg-gray-50 dark:bg-white/5 border border-borderLight dark:border-borderDark rounded-[18px] p-4 pl-12 text-textMainLight dark:text-textMainDark placeholder-gray-400 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-200 resize-none"
                                    value={formData.bio}
                                    onChange={(e) => setFormData({...formData, bio: e.target.value})}
                                    maxLength={150}
                                />
                                <div className="absolute bottom-3 right-4 text-xs text-gray-400">
                                    {formData.bio.length}/150
                                </div>
                            </div>
                        </div>

                        {/* Read Only Fields */}
                        <div className="space-y-4 pt-4 border-t border-gray-100 dark:border-white/5">
                            <h3 className="text-xs font-bold text-textSecLight dark:text-textSecDark uppercase tracking-wider ml-1">
                                Informations Académiques (Non modifiables)
                            </h3>
                            <div className="bg-gray-100 dark:bg-white/5 p-4 rounded-2xl space-y-3 opacity-70">
                                <div className="flex justify-between items-center text-sm">
                                    <span className="text-textSecLight dark:text-textSecDark">Matricule</span>
                                    <span className="font-mono font-medium text-textMainLight dark:text-textMainDark">{user.matricule}</span>
                                </div>
                                <div className="flex justify-between items-center text-sm">
                                    <span className="text-textSecLight dark:text-textSecDark">Niveau</span>
                                    <span className="font-medium text-textMainLight dark:text-textMainDark">{user.level}</span>
                                </div>
                                <div className="flex justify-between items-center text-sm">
                                    <span className="text-textSecLight dark:text-textSecDark">Filière</span>
                                    <span className="font-medium text-textMainLight dark:text-textMainDark">{user.major}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </form>
        </motion.div>

        {/* Cropper Modal Overlay */}
        <AnimatePresence>
            {rawImage && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 z-[60]"
                >
                    <ImageCropper 
                        imageSrc={rawImage} 
                        onCancel={() => setRawImage(null)} 
                        onCropComplete={handleCropComplete} 
                    />
                </motion.div>
            )}
        </AnimatePresence>
    </>
  );
};

export default EditProfileScreen;
