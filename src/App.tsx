import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Menu, X, Phone, MessageCircle, ShieldCheck, 
  Tv, Wifi, ArrowRight, LogIn, LogOut, 
  Plus, Trash2, Edit2, Save, CheckCircle2,
  ChevronRight, Info, Smartphone, Download,
  FileText, Table as TableIcon, Loader2, Image as ImageIcon,
  User, Lock, Search, Filter, Settings, Globe, Eye, EyeOff
} from 'lucide-react';
import { Promotion, UserRole, Category, AppConfig, HeroSlide } from './types';
import { INITIAL_PROMOTIONS, IZZI_COLORS, IZZI_LOGO, IZZI_ICON, DEFAULT_CONFIG } from './constants';
import { cn } from './lib/utils';
import jsPDF from 'jspdf';
import * as XLSX from 'xlsx';

// --- Persistence Layer (localStorage) ---
const PROMOS_KEY = 'izzi_promotions';
const CONFIG_KEY = 'izzi_config';

const getStoredPromos = (): Promotion[] => {
  const stored = localStorage.getItem(PROMOS_KEY);
  return stored ? JSON.parse(stored) : INITIAL_PROMOTIONS;
};

const getStoredConfig = (): AppConfig => {
  const stored = localStorage.getItem(CONFIG_KEY);
  return stored ? JSON.parse(stored) : DEFAULT_CONFIG;
};

const saveStoredPromos = (promos: Promotion[]) => {
  localStorage.setItem(PROMOS_KEY, JSON.stringify(promos));
};

const saveStoredConfig = (config: AppConfig) => {
  localStorage.setItem(CONFIG_KEY, JSON.stringify(config));
};

// --- Components ---

const Header = ({ role, onLogout, onLoginClick }: { role: UserRole | null, onLogout: () => void, onLoginClick: () => void }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <>
      <header className="h-[80px] bg-white/80 backdrop-blur-xl border-b border-gray-100 flex items-center justify-between px-6 md:px-12 fixed top-0 left-0 right-0 z-[60] transition-all">
        <div className="flex items-center gap-6">
          <button 
            onClick={() => setIsMenuOpen(true)}
            className="lg:hidden p-2 hover:bg-gray-50 rounded-2xl transition-colors text-primary"
          >
            <Menu size={24} />
          </button>
          <img src={IZZI_LOGO} alt="izzi" className="h-8 md:h-10" />
        </div>
        
        <nav className="hidden lg:flex items-center gap-10 text-dark font-semibold text-[13px] uppercase tracking-widest">
          <a href="#promos" className="hover:text-primary transition-colors">Internet</a>
          <a href="#promos" className="hover:text-primary transition-colors">Combos</a>
          <a href="#promos" className="hover:text-primary transition-colors">Móvil</a>
          <a href="#ayuda" className="hover:text-primary transition-colors">Ayuda</a>
        </nav>

        <div className="flex items-center gap-4">
          {role === 'admin' ? (
            <button 
              onClick={onLogout}
              className="flex items-center gap-2 bg-dark text-white px-5 py-2.5 rounded-2xl text-xs font-bold hover:bg-primary transition-all shadow-sm"
            >
              <LogOut size={14} />
              <span className="hidden sm:inline">Cerrar Sesión</span>
            </button>
          ) : (
            <button 
              onClick={onLoginClick}
              className="text-dark/40 hover:text-primary transition-colors p-2"
              title="Admin Login"
            >
              <User size={20} />
            </button>
          )}
          <button className="bg-primary text-white px-8 py-3 rounded-2xl font-bold text-sm hover:scale-105 active:scale-95 transition-all shadow-lg shadow-primary/20">
            Contrata
          </button>
        </div>
      </header>

      {/* Mobile Drawer Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMenuOpen(false)}
              className="fixed inset-0 bg-dark/20 backdrop-blur-md z-[70]"
            />
            <motion.div 
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed top-0 left-0 bottom-0 w-[70%] max-w-[320px] bg-white z-[80] shadow-2xl flex flex-col"
            >
              <div className="p-8 flex justify-between items-center border-b border-gray-50">
                <img src={IZZI_LOGO} alt="izzi" className="h-8" />
                <button onClick={() => setIsMenuOpen(false)} className="p-2 hover:bg-gray-50 rounded-xl text-primary">
                  <X size={24} />
                </button>
              </div>
              <nav className="flex-1 p-8 flex flex-col gap-8 text-lg font-bold text-dark uppercase tracking-wider">
                <a href="#promos" onClick={() => setIsMenuOpen(false)} className="flex items-center justify-between group">
                  Internet <ChevronRight size={20} className="text-primary opacity-0 group-hover:opacity-100 transition-all" />
                </a>
                <a href="#promos" onClick={() => setIsMenuOpen(false)} className="flex items-center justify-between group">
                  Combos <ChevronRight size={20} className="text-primary opacity-0 group-hover:opacity-100 transition-all" />
                </a>
                <a href="#promos" onClick={() => setIsMenuOpen(false)} className="flex items-center justify-between group">
                  Móvil <ChevronRight size={20} className="text-primary opacity-0 group-hover:opacity-100 transition-all" />
                </a>
                <a href="#ayuda" onClick={() => setIsMenuOpen(false)} className="flex items-center justify-between group">
                  Ayuda <ChevronRight size={20} className="text-primary opacity-0 group-hover:opacity-100 transition-all" />
                </a>
              </nav>
              <div className="p-8 border-t border-gray-50">
                <button className="w-full bg-primary text-white py-5 rounded-3xl font-bold uppercase tracking-widest shadow-xl shadow-primary/20">
                  Contrata ya
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

const HeroSlider = ({ slides }: { slides: HeroSlide[] }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (slides.length <= 1) return;
    const timer = setInterval(() => {
      setCurrentIndex(prev => (prev + 1) % slides.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [slides]);

  if (slides.length === 0) return null;

  const current = slides[currentIndex];

  return (
    <section className="relative h-[600px] md:h-[700px] bg-dark overflow-hidden">
      <AnimatePresence mode="wait">
        <motion.div 
          key={current.id}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1 }}
          className="absolute inset-0"
        >
          <img 
            src={current.image_url} 
            alt={current.title} 
            className="w-full h-full object-cover opacity-50 scale-105"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-dark via-dark/20 to-transparent" />
        </motion.div>
      </AnimatePresence>
      
      <div className="container mx-auto px-6 h-full flex items-center relative z-10">
        <motion.div 
          key={`text-${current.id}`}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.8 }}
          className="max-w-3xl"
        >
          <div className="flex items-center gap-3 mb-8">
            <span className="bg-primary text-white px-5 py-1.5 rounded-full text-[10px] font-black uppercase tracking-[0.2em]">
              OFERTA DEL MES
            </span>
            <div className="h-[1px] w-12 bg-white/20" />
            <span className="text-white/60 text-[10px] font-bold uppercase tracking-widest">Exclusivo Web</span>
          </div>
          <h1 className="text-6xl md:text-8xl font-black text-white leading-[0.9] mb-8 tracking-tighter">
            {current.title.split(' ').map((word, i) => (
              <span key={i} className={i % 2 !== 0 ? "text-secondary" : ""}>{word} </span>
            ))}
          </h1>
          <p className="text-xl text-white/60 mb-10 font-medium max-w-xl leading-relaxed">
            {current.subtitle}
          </p>
          <button className="bg-white text-dark px-10 py-5 rounded-3xl font-black text-lg hover:bg-primary hover:text-white transition-all flex items-center gap-3 group shadow-2xl">
            CONTRATAR AHORA <ArrowRight className="group-hover:translate-x-2 transition-transform" />
          </button>
        </motion.div>
      </div>

      <div className="absolute bottom-12 left-6 right-6 container mx-auto flex justify-between items-center z-20">
        <div className="flex gap-3">
          {slides.map((_, idx) => (
            <button 
              key={idx}
              onClick={() => setCurrentIndex(idx)}
              className={cn(
                "h-1.5 rounded-full transition-all duration-500",
                idx === currentIndex ? "w-12 bg-secondary" : "w-3 bg-white/20 hover:bg-white/40"
              )}
            />
          ))}
        </div>
        <div className="hidden md:flex items-center gap-4 text-white/40 text-[10px] font-bold uppercase tracking-widest">
          <span>0{currentIndex + 1}</span>
          <div className="w-10 h-[1px] bg-white/10" />
          <span>0{slides.length}</span>
        </div>
      </div>
    </section>
  );
};

const PromoCard: React.FC<{ promo: Promotion, salesPhone: string }> = ({ promo, salesPhone }) => {
  const whatsappMsg = `Hola, me interesa contratar el paquete ${promo.titulo} de ${promo.megas} Megas por $${promo.precio} que vi en su página web. ¿Me podrían dar más información?`;
  const whatsappUrl = `https://wa.me/${salesPhone}?text=${encodeURIComponent(whatsappMsg)}`;

  return (
    <motion.div 
      whileHover={{ y: -12 }}
      className="bg-white rounded-[40px] overflow-hidden shadow-2xl shadow-dark/5 border border-gray-50 group flex flex-col h-full"
    >
      <div className="relative h-56 overflow-hidden">
        <img 
          src={promo.imagen_url} 
          alt={promo.titulo} 
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
          referrerPolicy="no-referrer"
        />
        <div className="absolute top-6 left-6 bg-white/90 backdrop-blur-md px-4 py-1.5 rounded-2xl text-[10px] font-black uppercase tracking-widest text-primary shadow-sm">
          {promo.categoria}
        </div>
      </div>
      
      <div className="p-10 flex-1 flex flex-col">
        <h3 className="text-2xl font-black text-dark mb-6 leading-tight tracking-tight">
          {promo.titulo}
        </h3>
        
        <div className="flex items-center justify-between mb-8 p-6 bg-light/30 rounded-3xl">
          <div className="flex flex-col">
            <span className="text-3xl font-black text-primary">{promo.megas}</span>
            <span className="text-[10px] font-bold text-primary/60 uppercase tracking-widest">Megas</span>
          </div>
          <div className="w-[1px] h-10 bg-primary/10" />
          <div className="text-right">
            <span className="text-3xl font-black text-dark">${promo.precio}</span>
            <span className="block text-[10px] font-bold text-dark/40 uppercase tracking-widest">Al mes</span>
          </div>
        </div>

        <ul className="space-y-4 mb-10 flex-1">
          {promo.features?.map((f, i) => (
            <li key={i} className="flex items-center gap-3 text-sm text-dark/60 font-medium">
              <div className="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                <CheckCircle2 size={12} />
              </div>
              {f}
            </li>
          ))}
        </ul>

        <a 
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="w-full bg-dark text-white py-5 rounded-3xl font-black text-sm hover:bg-primary transition-all flex items-center justify-center gap-3 shadow-xl shadow-dark/10"
        >
          <MessageCircle size={18} /> CONTRATAR AHORA
        </a>
      </div>
    </motion.div>
  );
}

const AdminDashboard = ({ 
  promos, setPromos, 
  config, setConfig 
}: { 
  promos: Promotion[], setPromos: React.Dispatch<React.SetStateAction<Promotion[]>>,
  config: AppConfig, setConfig: React.Dispatch<React.SetStateAction<AppConfig>>
}) => {
  const [activeTab, setActiveTab] = useState<'promos' | 'slider' | 'config'>('promos');
  const [isEditing, setIsEditing] = useState<string | null>(null);
  const [formData, setFormData] = useState<any>({});
  const [isLoading, setIsLoading] = useState(false);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error', msg: string } | null>(null);

  const showFeedback = (type: 'success' | 'error', msg: string) => {
    setFeedback({ type, msg });
    setTimeout(() => setFeedback(null), 3000);
  };

  const handleSavePromo = () => {
    if (!formData.titulo || !formData.precio) {
      showFeedback('error', 'Título y precio son obligatorios');
      return;
    }

    setIsLoading(true);
    setTimeout(() => {
      const promoToSave = {
        ...formData,
        id: formData.id || Date.now().toString(),
        features: formData.features || ['Internet de alta velocidad', 'Llamadas ilimitadas'],
        imagen_url: formData.imagen_url || 'https://images.unsplash.com/photo-1544197150-b99a580bb7a8?auto=format&fit=crop&q=80&w=1200'
      } as Promotion;

      setPromos(prev => {
        const index = prev.findIndex(p => p.id === promoToSave.id);
        let updated;
        if (index >= 0) {
          updated = [...prev];
          updated[index] = promoToSave;
        } else {
          updated = [promoToSave, ...prev];
        }
        saveStoredPromos(updated);
        return updated;
      });

      setIsEditing(null);
      setFormData({});
      setIsLoading(false);
      showFeedback('success', 'Promoción guardada correctamente');
    }, 500);
  };

  const handleSaveSlide = () => {
    if (!formData.title || !formData.image_url) {
      showFeedback('error', 'Título e imagen son obligatorios');
      return;
    }

    setIsLoading(true);
    setTimeout(() => {
      const newSlides = [...config.heroSlides];
      const index = newSlides.findIndex(s => s.id === formData.id);
      
      if (index >= 0) {
        newSlides[index] = formData as HeroSlide;
      } else {
        newSlides.push({ ...formData, id: Date.now().toString() });
      }

      const newConfig = { ...config, heroSlides: newSlides };
      setConfig(newConfig);
      saveStoredConfig(newConfig);
      
      setIsEditing(null);
      setFormData({});
      setIsLoading(false);
      showFeedback('success', 'Slide guardado correctamente');
    }, 500);
  };

  const handleSaveConfig = (e: React.FormEvent) => {
    e.preventDefault();
    saveStoredConfig(config);
    showFeedback('success', 'Configuración global actualizada');
  };

  const handleDeletePromo = (id: string) => {
    if (!confirm('¿Eliminar esta promoción?')) return;
    const updated = promos.filter(p => p.id !== id);
    setPromos(updated);
    saveStoredPromos(updated);
    showFeedback('success', 'Eliminado correctamente');
  };

  const handleDeleteSlide = (id: string) => {
    if (!confirm('¿Eliminar este slide?')) return;
    const newSlides = config.heroSlides.filter(s => s.id !== id);
    const newConfig = { ...config, heroSlides: newSlides };
    setConfig(newConfig);
    saveStoredConfig(newConfig);
    showFeedback('success', 'Slide eliminado');
  };

  const exportToPDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(22);
    doc.setTextColor(4, 126, 41);
    doc.text('izzi | Reporte de Promociones', 20, 30);
    doc.setFontSize(12);
    doc.setTextColor(40, 40, 41);
    
    promos.forEach((p, i) => {
      const y = 50 + (i * 35);
      doc.setFont('helvetica', 'bold');
      doc.text(`${i + 1}. ${p.titulo}`, 20, y);
      doc.setFont('helvetica', 'normal');
      doc.text(`Megas: ${p.megas} | Precio: $${p.precio} | Categoría: ${p.categoria}`, 20, y + 7);
      doc.text(`Destacado: ${p.destacado ? 'Sí' : 'No'}`, 20, y + 14);
    });
    
    doc.save('promociones_izzi.pdf');
  };

  const exportToExcel = () => {
    const ws = XLSX.utils.json_to_sheet(promos.map(p => ({
      ID: p.id,
      Título: p.titulo,
      Megas: p.megas,
      Precio: p.precio,
      Categoría: p.categoria,
      Destacado: p.destacado ? 'Sí' : 'No',
      Imagen: p.imagen_url
    })));
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Promociones");
    XLSX.writeFile(wb, "promociones_izzi.xlsx");
  };

  return (
    <div className="min-h-screen bg-[#F9FAFB] pt-32 pb-24">
      <div className="container mx-auto px-6">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-8 mb-16">
          <div>
            <h1 className="text-4xl font-black text-dark mb-2 tracking-tight">CMS izzi</h1>
            <p className="text-dark/40 font-medium">Gestión total de contenidos y configuración.</p>
          </div>
          
          <div className="flex flex-wrap gap-4 w-full lg:w-auto">
            <div className="bg-white p-2 rounded-3xl shadow-sm border border-gray-100 flex flex-wrap gap-2 w-full sm:w-auto">
              <button 
                onClick={() => setActiveTab('promos')}
                className={cn(
                  "flex-1 sm:flex-none px-4 sm:px-6 py-3 rounded-2xl font-bold text-[10px] sm:text-xs transition-all",
                  activeTab === 'promos' ? "bg-primary text-white" : "text-dark/40 hover:bg-gray-50"
                )}
              >
                Promociones
              </button>
              <button 
                onClick={() => setActiveTab('slider')}
                className={cn(
                  "flex-1 sm:flex-none px-4 sm:px-6 py-3 rounded-2xl font-bold text-[10px] sm:text-xs transition-all",
                  activeTab === 'slider' ? "bg-primary text-white" : "text-dark/40 hover:bg-gray-50"
                )}
              >
                Hero Slider
              </button>
              <button 
                onClick={() => setActiveTab('config')}
                className={cn(
                  "flex-1 sm:flex-none px-4 sm:px-6 py-3 rounded-2xl font-bold text-[10px] sm:text-xs transition-all",
                  activeTab === 'config' ? "bg-primary text-white" : "text-dark/40 hover:bg-gray-50"
                )}
              >
                Global
              </button>
            </div>
          </div>
        </div>

        <AnimatePresence>
          {feedback && (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className={cn(
                "fixed bottom-12 left-1/2 -translate-x-1/2 px-8 py-4 rounded-3xl text-white font-bold z-[100] shadow-2xl flex items-center gap-3",
                feedback.type === 'success' ? "bg-primary" : "bg-accent"
              )}
            >
              {feedback.type === 'success' ? <CheckCircle2 size={20} /> : <Info size={20} />}
              {feedback.msg}
            </motion.div>
          )}
        </AnimatePresence>

        {activeTab === 'promos' && (
          <div className="space-y-12">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
              <h2 className="text-2xl font-black text-dark">Listado de Paquetes</h2>
              <div className="flex flex-wrap gap-3 w-full sm:w-auto">
                <button onClick={exportToPDF} className="flex-1 sm:flex-none bg-white border border-gray-100 text-dark/60 px-4 py-3 rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-gray-50 transition-all shadow-sm text-xs">
                  <FileText size={16} /> PDF
                </button>
                <button onClick={exportToExcel} className="flex-1 sm:flex-none bg-white border border-gray-100 text-dark/60 px-4 py-3 rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-gray-50 transition-all shadow-sm text-xs">
                  <TableIcon size={16} /> Excel
                </button>
                <button 
                  onClick={() => { setIsEditing('new_promo'); setFormData({ categoria: 'Internet', destacado: false }); }}
                  className="w-full sm:w-auto bg-primary text-white px-6 py-4 rounded-2xl font-black flex items-center justify-center gap-2 hover:bg-dark transition-all shadow-xl shadow-primary/20 text-xs"
                >
                  <Plus size={18} /> NUEVA PROMO
                </button>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {promos.map(promo => (
                <div key={promo.id} className="bg-white rounded-[40px] p-6 sm:p-8 shadow-sm border border-gray-50 flex flex-col group hover:shadow-2xl hover:shadow-dark/5 transition-all duration-500">
                  <div className="flex justify-between items-start mb-6">
                    <div className="flex items-center gap-4">
                      <div className="w-14 h-14 bg-gray-50 rounded-2xl flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-colors">
                        {promo.categoria === 'Internet' ? <Wifi size={24} /> : promo.categoria === 'Combo' ? <Tv size={24} /> : <Smartphone size={24} />}
                      </div>
                      <div>
                        <h3 className="font-black text-dark tracking-tight">{promo.titulo}</h3>
                        <span className="text-[10px] font-bold text-dark/30 uppercase tracking-widest">{promo.categoria}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex-1 mb-8">
                    <div className="relative h-40 rounded-3xl overflow-hidden mb-6">
                      <img src={promo.imagen_url} alt={promo.titulo} className="w-full h-full object-cover" />
                    </div>
                    <div className="flex justify-between items-end px-2">
                      <div className="flex flex-col">
                        <span className="text-[10px] font-bold text-dark/30 uppercase tracking-widest">Precio</span>
                        <span className="text-3xl font-black text-dark">${promo.precio}</span>
                      </div>
                      <div className="text-right flex flex-col">
                        <span className="text-[10px] font-bold text-dark/30 uppercase tracking-widest">Velocidad</span>
                        <span className="text-xl font-bold text-primary">{promo.megas} Megas</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <button 
                      onClick={() => { setIsEditing('edit_promo'); setFormData(promo); }}
                      className="flex-1 bg-gray-50 text-dark py-4 rounded-2xl font-bold hover:bg-gray-100 transition-all flex items-center justify-center gap-2"
                    >
                      <Edit2 size={16} /> Editar
                    </button>
                    <button 
                      onClick={() => handleDeletePromo(promo.id)}
                      className="p-4 bg-accent/5 text-accent rounded-2xl hover:bg-accent hover:text-white transition-all"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'slider' && (
          <div className="space-y-12">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
              <h2 className="text-2xl font-black text-dark">Diapositivas del Hero</h2>
              <button 
                onClick={() => { setIsEditing('new_slide'); setFormData({}); }}
                className="w-full sm:w-auto bg-primary text-white px-8 py-4 rounded-2xl font-black flex items-center justify-center gap-2 hover:bg-dark transition-all shadow-xl shadow-primary/20 text-xs"
              >
                <Plus size={18} /> NUEVO SLIDE
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {config.heroSlides.map(slide => (
                <div key={slide.id} className="bg-white rounded-[40px] p-6 sm:p-8 shadow-sm border border-gray-50 flex flex-col group hover:shadow-2xl hover:shadow-dark/5 transition-all duration-500">
                  <div className="relative h-48 rounded-3xl overflow-hidden mb-6">
                    <img src={slide.image_url} alt={slide.title} className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-dark/40 p-6 flex flex-col justify-end">
                      <h3 className="text-white font-black text-xl leading-tight">{slide.title}</h3>
                    </div>
                  </div>
                  <p className="text-dark/40 text-sm font-medium mb-8 line-clamp-2 flex-1">{slide.subtitle}</p>
                  <div className="flex gap-3">
                    <button 
                      onClick={() => { setIsEditing('edit_slide'); setFormData(slide); }}
                      className="flex-1 bg-gray-50 text-dark py-4 rounded-2xl font-bold hover:bg-gray-100 transition-all flex items-center justify-center gap-2"
                    >
                      <Edit2 size={16} /> Editar
                    </button>
                    <button 
                      onClick={() => handleDeleteSlide(slide.id)}
                      className="p-4 bg-accent/5 text-accent rounded-2xl hover:bg-accent hover:text-white transition-all"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'config' && (
          <div className="max-w-2xl mx-auto">
            <div className="bg-white rounded-[48px] p-12 shadow-sm border border-gray-50">
              <h2 className="text-2xl font-black text-dark mb-10">Configuración Global</h2>
              <form onSubmit={handleSaveConfig} className="space-y-8">
                <div>
                  <label className="block text-[10px] font-black uppercase text-dark/30 mb-2 tracking-widest">WhatsApp de Ventas (Sin +)</label>
                  <div className="relative">
                    <input 
                      type="text" 
                      value={config.salesPhone} 
                      onChange={e => setConfig({...config, salesPhone: e.target.value})}
                      className="w-full bg-gray-50 border-none rounded-2xl p-5 pl-14 outline-none focus:ring-2 focus:ring-primary/20 transition-all font-medium"
                      placeholder="526635097802"
                    />
                    <Phone className="absolute left-5 top-1/2 -translate-y-1/2 text-dark/20" size={20} />
                  </div>
                  <p className="text-[10px] text-dark/30 mt-2 ml-2">Este número recibirá todos los pedidos de la landing.</p>
                </div>
                <button className="w-full bg-dark text-white py-5 rounded-3xl font-black text-lg hover:bg-primary transition-all shadow-xl shadow-dark/10">
                  GUARDAR CONFIGURACIÓN
                </button>
              </form>
            </div>
          </div>
        )}

        <AnimatePresence>
          {isEditing && (
            <div className="fixed inset-0 z-[100] flex items-center justify-center bg-dark/40 backdrop-blur-xl p-4 sm:p-6">
              <motion.div 
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="bg-white rounded-[40px] sm:rounded-[48px] p-6 sm:p-10 md:p-14 max-w-3xl w-full shadow-2xl max-h-[90vh] overflow-y-auto"
              >
                <div className="flex justify-between items-center mb-8 sm:mb-12">
                  <h2 className="text-3xl font-black text-dark tracking-tight">
                    {isEditing.includes('promo') ? (isEditing.includes('new') ? 'Nueva Promoción' : 'Editar Promoción') : (isEditing.includes('new') ? 'Nuevo Slide' : 'Editar Slide')}
                  </h2>
                  <button onClick={() => setIsEditing(null)} className="p-3 hover:bg-gray-50 rounded-2xl transition-colors">
                    <X size={24} />
                  </button>
                </div>

                {isEditing.includes('promo') ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                    <div className="space-y-8">
                      <div>
                        <label className="block text-[10px] font-black uppercase text-dark/30 mb-2 tracking-widest">Título de la Oferta</label>
                        <input 
                          type="text" 
                          value={formData.titulo || ''} 
                          onChange={e => setFormData({...formData, titulo: e.target.value})}
                          className="w-full bg-gray-50 border-none rounded-2xl p-5 outline-none focus:ring-2 focus:ring-primary/20 transition-all font-medium"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-6">
                        <div>
                          <label className="block text-[10px] font-black uppercase text-dark/30 mb-2 tracking-widest">Megas</label>
                          <input 
                            type="text" 
                            value={formData.megas || ''} 
                            onChange={e => setFormData({...formData, megas: e.target.value})}
                            className="w-full bg-gray-50 border-none rounded-2xl p-5 outline-none focus:ring-2 focus:ring-primary/20 transition-all font-medium"
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] font-black uppercase text-dark/30 mb-2 tracking-widest">Precio ($)</label>
                          <input 
                            type="number" 
                            value={formData.precio || ''} 
                            onChange={e => setFormData({...formData, precio: Number(e.target.value)})}
                            className="w-full bg-gray-50 border-none rounded-2xl p-5 outline-none focus:ring-2 focus:ring-primary/20 transition-all font-medium"
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-[10px] font-black uppercase text-dark/30 mb-2 tracking-widest">Categoría</label>
                        <div className="flex gap-3">
                          {(['Internet', 'Combo', 'Móvil'] as Category[]).map(cat => (
                            <button
                              key={cat}
                              onClick={() => setFormData({...formData, categoria: cat})}
                              className={cn(
                                "flex-1 py-4 rounded-2xl font-bold text-xs transition-all",
                                formData.categoria === cat ? "bg-primary text-white" : "bg-gray-50 text-dark/40"
                              )}
                            >
                              {cat}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                    <div className="space-y-8">
                      <div>
                        <label className="block text-[10px] font-black uppercase text-dark/30 mb-2 tracking-widest">URL de Imagen</label>
                        <input 
                          type="text" 
                          value={formData.imagen_url || ''} 
                          onChange={e => setFormData({...formData, imagen_url: e.target.value})}
                          className="w-full bg-gray-50 border-none rounded-2xl p-5 outline-none focus:ring-2 focus:ring-primary/20 transition-all font-medium"
                        />
                      </div>
                      {formData.imagen_url && (
                        <img src={formData.imagen_url} className="rounded-3xl h-40 w-full object-cover" alt="Preview" />
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                    <div className="space-y-8">
                      <div>
                        <label className="block text-[10px] font-black uppercase text-dark/30 mb-2 tracking-widest">Título del Slide</label>
                        <input 
                          type="text" 
                          value={formData.title || ''} 
                          onChange={e => setFormData({...formData, title: e.target.value})}
                          className="w-full bg-gray-50 border-none rounded-2xl p-5 outline-none focus:ring-2 focus:ring-primary/20 transition-all font-medium"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-black uppercase text-dark/30 mb-2 tracking-widest">Descripción</label>
                        <textarea 
                          value={formData.subtitle || ''} 
                          onChange={e => setFormData({...formData, subtitle: e.target.value})}
                          className="w-full bg-gray-50 border-none rounded-2xl p-5 outline-none focus:ring-2 focus:ring-primary/20 transition-all font-medium h-32 resize-none"
                        />
                      </div>
                    </div>
                    <div className="space-y-8">
                      <div>
                        <label className="block text-[10px] font-black uppercase text-dark/30 mb-2 tracking-widest">URL de Fondo</label>
                        <input 
                          type="text" 
                          value={formData.image_url || ''} 
                          onChange={e => setFormData({...formData, image_url: e.target.value})}
                          className="w-full bg-gray-50 border-none rounded-2xl p-5 outline-none focus:ring-2 focus:ring-primary/20 transition-all font-medium"
                        />
                      </div>
                      {formData.image_url && (
                        <img src={formData.image_url} className="rounded-3xl h-40 w-full object-cover" alt="Preview" />
                      )}
                    </div>
                  </div>
                )}

                <div className="mt-14 flex gap-4">
                  <button 
                    onClick={isEditing.includes('promo') ? handleSavePromo : handleSaveSlide}
                    disabled={isLoading}
                    className="flex-1 bg-dark text-white py-5 rounded-3xl font-black text-lg hover:bg-primary transition-all flex items-center justify-center gap-3 shadow-2xl shadow-dark/10"
                  >
                    {isLoading ? <Loader2 className="animate-spin" /> : <Save size={22} />}
                    GUARDAR CAMBIOS
                  </button>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

const LoginForm = ({ onLogin }: { onLogin: () => void }) => {
  const [user, setUser] = useState('');
  const [pass, setPass] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (user === 'admin' && pass === '123admin') {
      onLogin();
    } else {
      setError(true);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-dark/20 backdrop-blur-xl p-6">
      <motion.div 
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-white rounded-[48px] p-12 md:p-16 max-w-md w-full shadow-2xl"
      >
        <div className="text-center mb-12">
          <div className="w-20 h-20 bg-primary flex items-center justify-center rounded-3xl mx-auto mb-6 shadow-xl shadow-primary/20">
            <img src={IZZI_ICON} alt="izzi" className="w-12 h-12" />
          </div>
          <h2 className="text-3xl font-black text-dark tracking-tight">Acceso Admin</h2>
          <p className="text-dark/40 font-medium">Ingresa tus credenciales</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <div className="relative">
              <input 
                type="text" 
                placeholder="Usuario" 
                className={cn(
                  "w-full bg-gray-50 border-2 rounded-2xl p-5 pl-14 outline-none transition-all font-medium",
                  error ? 'border-accent/20' : 'border-transparent focus:border-primary/20'
                )}
                value={user}
                onChange={e => { setUser(e.target.value); setError(false); }}
              />
              <User className="absolute left-5 top-1/2 -translate-y-1/2 text-dark/20" size={20} />
            </div>
            <div className="relative">
              <input 
                type={showPassword ? "text" : "password"} 
                placeholder="Contraseña" 
                className={cn(
                  "w-full bg-gray-50 border-2 rounded-2xl p-5 pl-14 pr-14 outline-none transition-all font-medium",
                  error ? 'border-accent/20' : 'border-transparent focus:border-primary/20'
                )}
                value={pass}
                onChange={e => { setPass(e.target.value); setError(false); }}
              />
              <Lock className="absolute left-5 top-1/2 -translate-y-1/2 text-dark/20" size={20} />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-5 top-1/2 -translate-y-1/2 text-dark/20 hover:text-primary transition-colors"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
            {error && <p className="text-accent text-xs font-bold mt-2 ml-2">Credenciales incorrectas</p>}
          </div>
          <button className="w-full bg-dark text-white py-5 rounded-3xl font-black text-lg hover:bg-primary transition-all shadow-xl shadow-dark/10">
            ENTRAR
          </button>
          <p className="text-center text-[10px] font-bold text-dark/20 uppercase tracking-widest">Solo personal autorizado</p>
        </form>
      </motion.div>
    </div>
  );
};

const Footer = () => (
  <footer className="bg-dark text-white/20 py-12 border-t border-white/5">
    <div className="container mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-8">
      <img src={IZZI_LOGO} alt="izzi" className="h-6 opacity-20 grayscale brightness-200" />
      <div className="flex gap-10 text-[10px] font-bold uppercase tracking-widest">
        <a href="#" className="hover:text-white transition-colors">Privacidad</a>
        <a href="#" className="hover:text-white transition-colors">Términos</a>
        <a href="#" className="hover:text-white transition-colors">Contacto</a>
      </div>
      <p className="text-[10px] font-bold uppercase tracking-widest">
        &copy; 2024 IZZI TELECOM | MÉXICO
      </p>
    </div>
  </footer>
);

// --- Main App ---

export default function App() {
  const [role, setRole] = useState<UserRole | null>(null);
  const [showLogin, setShowLogin] = useState(false);
  const [promos, setPromos] = useState<Promotion[]>([]);
  const [config, setConfig] = useState<AppConfig>(DEFAULT_CONFIG);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Load from localStorage
    const data = getStoredPromos();
    const conf = getStoredConfig();
    setPromos(data);
    setConfig(conf);
    setIsLoading(false);
  }, []);

  return (
    <div className="min-h-screen bg-white font-sans selection:bg-primary selection:text-white flex flex-col antialiased">
      <Header 
        role={role} 
        onLogout={() => setRole(null)} 
        onLoginClick={() => setShowLogin(true)} 
      />

      <AnimatePresence>
        {showLogin && (
          <LoginForm onLogin={() => { setRole('admin'); setShowLogin(false); }} />
        )}
      </AnimatePresence>

      <main className="flex-1 pt-[80px]">
        {isLoading ? (
          <div className="h-[60vh] flex items-center justify-center">
            <Loader2 className="animate-spin text-primary" size={48} />
          </div>
        ) : role === 'admin' ? (
          <AdminDashboard 
            promos={promos} setPromos={setPromos} 
            config={config} setConfig={setConfig} 
          />
        ) : (
          <>
            <HeroSlider slides={config.heroSlides} />
            
            <section id="promos" className="py-32 container mx-auto px-6">
              <div className="flex flex-col lg:flex-row justify-between items-end mb-24 gap-10">
                <div className="max-w-2xl">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-1 bg-primary rounded-full" />
                    <span className="text-primary font-black text-[10px] uppercase tracking-[0.3em]">Nuestras Ofertas</span>
                  </div>
                  <h2 className="text-5xl md:text-7xl font-black text-dark mb-6 tracking-tighter leading-[0.9]">
                    Paquetes <span className="text-primary">izzi</span> <br />
                    diseñados para ti.
                  </h2>
                  <p className="text-xl text-dark/40 font-medium leading-relaxed">
                    Elige la velocidad que mejor se adapte a tu estilo de vida y disfruta de la mejor conexión.
                  </p>
                </div>
                <div className="flex gap-3 bg-gray-50 p-2 rounded-3xl">
                  {['Todos', 'Internet', 'Combo', 'Móvil'].map(cat => (
                    <button 
                      key={cat}
                      className="px-8 py-3 rounded-2xl font-bold text-xs hover:bg-white hover:shadow-xl hover:shadow-dark/5 transition-all text-dark/40 hover:text-primary"
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
                {promos.map(promo => (
                  <PromoCard key={promo.id} promo={promo} salesPhone={config.salesPhone} />
                ))}
              </div>
            </section>

            <section className="py-32 bg-light/20">
              <div className="container mx-auto px-6">
                <div className="bg-dark rounded-[64px] p-16 md:p-24 shadow-2xl flex flex-col lg:flex-row items-center gap-20 overflow-hidden relative">
                  <div className="absolute top-0 right-0 w-96 h-96 bg-primary/10 blur-[120px] rounded-full -mr-48 -mt-48" />
                  <div className="lg:w-1/2 relative z-10">
                    <div className="w-20 h-20 bg-primary rounded-3xl flex items-center justify-center text-white mb-10 shadow-2xl shadow-primary/20">
                      <Smartphone size={36} />
                    </div>
                    <h2 className="text-5xl md:text-7xl font-black text-white mb-8 tracking-tighter leading-[0.9]">
                      Tu cuenta izzi <br />
                      <span className="text-secondary">EN TU CELULAR</span>
                    </h2>
                    <p className="text-xl text-white/40 mb-12 leading-relaxed max-w-lg">
                      Paga tu recibo, consulta tu saldo y gestiona tus servicios desde la App izzi. Rápido, fácil y seguro.
                    </p>
                    <div className="flex flex-wrap gap-6">
                      <button className="bg-white text-dark px-10 py-5 rounded-3xl font-black flex items-center gap-3 hover:bg-primary hover:text-white transition-all shadow-2xl">
                        <Download size={22} /> DESCARGAR APP
                      </button>
                    </div>
                  </div>
                  <div className="lg:w-1/2 relative">
                    <div className="absolute inset-0 bg-primary/20 blur-[100px] rounded-full" />
                    <img 
                      src="https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?auto=format&fit=crop&q=80&w=1200" 
                      alt="App izzi" 
                      className="rounded-[48px] shadow-2xl relative z-10 rotate-6 hover:rotate-0 transition-transform duration-700"
                    />
                  </div>
                </div>
              </div>
            </section>
          </>
        )}
      </main>

      <Footer />

      {/* Floating WhatsApp Button */}
      <a 
        href={`https://wa.me/${config.salesPhone}?text=${encodeURIComponent('Hola izzi! Quiero información sobre sus paquetes.')}`} 
        target="_blank" 
        rel="noopener noreferrer"
        className="fixed bottom-10 right-10 z-50 bg-[#25D366] text-white p-6 rounded-full shadow-2xl hover:scale-110 transition-transform flex items-center justify-center group"
      >
        <MessageCircle size={32} />
        <div className="max-w-0 overflow-hidden group-hover:max-w-xs group-hover:ml-4 transition-all duration-500 whitespace-nowrap font-black uppercase tracking-widest text-xs">
          ¿Necesitas ayuda?
        </div>
      </a>
    </div>
  );
}
