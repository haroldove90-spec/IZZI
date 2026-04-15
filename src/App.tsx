import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Menu, X, Phone, MessageCircle, ShieldCheck, 
  Tv, Wifi, ArrowRight, LogIn, LogOut, 
  Plus, Trash2, Edit2, Save, CheckCircle2,
  ChevronRight, Info
} from 'lucide-react';
import { Promotion, UserRole } from './types';
import { INITIAL_PROMOTIONS, IZZI_COLORS } from './constants';

// --- Components ---

const Header = ({ role, onLogout, onLoginClick }: { role: UserRole | null, onLogout: () => void, onLoginClick: () => void }) => {
  return (
    <header className="h-[70px] border-b border-gray-light bg-white flex items-center justify-between px-10 fixed top-0 left-0 right-0 z-50">
      <div className="flex items-center gap-2">
        <div className="text-magenta text-[32px] font-black tracking-[-2px] italic">izzi</div>
      </div>
      
      <nav className="hidden md:flex items-center gap-6 text-black-soft font-medium text-sm">
        <a href="#promos" className="hover:text-magenta transition-colors">Internet</a>
        <a href="#promos" className="hover:text-magenta transition-colors">Televisión</a>
        <a href="#promos" className="hover:text-magenta transition-colors">Telefonía</a>
        <a href="#ayuda" className="hover:text-magenta transition-colors">Ayuda</a>
        <button className="bg-[#25D366] text-white px-4 py-2 rounded-full text-[13px] font-bold ml-5">
          WhatsApp Directo
        </button>
      </nav>

      <div className="flex items-center gap-4">
        {role === 'admin' ? (
          <button 
            onClick={onLogout}
            className="flex items-center gap-2 bg-black-soft text-white px-4 py-2 rounded-full text-xs font-bold hover:bg-magenta transition-all"
          >
            <LogOut size={14} />
            <span>Salir Admin</span>
          </button>
        ) : (
          <button 
            onClick={onLoginClick}
            className="text-black-soft/50 hover:text-black-soft transition-colors p-2"
            title="Admin Login"
          >
            <LogIn size={20} />
          </button>
        )}
      </div>
    </header>
  );
};

const Hero = () => (
  <section className="p-10 flex flex-col justify-center bg-gradient-to-br from-white to-[#F9F9F9] min-h-[calc(100vh-110px)]">
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="max-w-xl"
    >
      <span className="text-magenta font-bold uppercase text-[12px] tracking-[2px] mb-4 block">
        Oferta Exclusiva 2024
      </span>
      <h1 className="text-[64px] leading-[0.95] font-black tracking-[-3px] mb-6 uppercase">
        CONÉCTATE<br />
        A TU MUNDO<br />
        <span className="text-magenta">SIN LÍMITES.</span>
      </h1>
      <p className="text-[18px] text-[#555] mb-8">
        El internet más rápido de México, ahora con Disney+ incluido.
      </p>
      
      <div className="bg-white p-6 border border-gray-light rounded-lg shadow-[0_10px_25px_rgba(0,0,0,0.05)] max-w-[480px]">
        <p className="text-[12px] font-bold mb-3 uppercase tracking-wider">Validador de Cobertura</p>
        <div className="flex gap-2">
          <input 
            type="text" 
            placeholder="Ingresa tu código postal..." 
            className="flex-1 p-3 border border-gray-200 rounded text-sm outline-none focus:border-magenta"
          />
          <button className="bg-magenta text-white px-5 py-3 rounded font-bold text-sm hover:bg-black-soft transition-all">
            VALIDAR
          </button>
        </div>
      </div>
    </motion.div>
  </section>
);

function PromoCard({ promo }: { promo: Promotion; key?: React.Key }) {
  return (
    <motion.div 
      whileHover={{ scale: 1.02 }}
      className="bg-white rounded-xl p-5 mb-4 border-l-4 border-magenta shadow-sm relative transition-transform"
    >
      {promo.isPopular && (
        <span className="absolute top-2 right-4 text-[10px] font-bold text-magenta uppercase">Recomendado</span>
      )}
      <h3 className="text-[22px] font-black mb-1 uppercase">{promo.title}</h3>
      <div className="text-[28px] text-magenta font-extrabold flex items-baseline gap-1">
        ${promo.price} <span className="text-[14px] text-[#888] font-normal">/mes</span>
      </div>
      <p className="text-[12px] text-[#666] mt-2 font-medium">
        {promo.megas} Megas • {promo.features.join(' + ')}
      </p>
    </motion.div>
  );
}

const CoverageForm = () => {
  const [status, setStatus] = useState<'idle' | 'loading' | 'success'>('idle');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');
    setTimeout(() => setStatus('success'), 1500);
  };

  return (
    <section id="cobertura" className="py-24 bg-gray-50">
      <div className="container mx-auto px-6">
        <div className="max-w-4xl mx-auto bg-white rounded-[40px] shadow-2xl overflow-hidden flex flex-col md:flex-row">
          <div className="md:w-1/2 bg-black p-12 flex flex-col justify-center text-white">
            <ShieldCheck size={48} className="text-[#E5007E] mb-6" />
            <h2 className="text-4xl font-black mb-4 uppercase italic">¿Tienes cobertura?</h2>
            <p className="text-gray-400">Ingresa tus datos para verificar si izzi llega a tu hogar y descubre ofertas exclusivas para tu zona.</p>
          </div>
          <div className="md:w-1/2 p-12">
            {status === 'success' ? (
              <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="text-center py-8">
                <CheckCircle2 size={64} className="text-green-500 mx-auto mb-4" />
                <h3 className="text-2xl font-bold mb-2">¡Excelente noticia!</h3>
                <p className="text-gray-600">Tenemos cobertura en tu zona. Un asesor te contactará pronto.</p>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-black uppercase text-gray-500 mb-1">Código Postal</label>
                  <input required type="text" placeholder="Ej. 01234" className="w-full bg-gray-100 border-none rounded-xl p-4 focus:ring-2 focus:ring-[#E5007E] outline-none transition-all" />
                </div>
                <div>
                  <label className="block text-xs font-black uppercase text-gray-500 mb-1">Teléfono</label>
                  <input required type="tel" placeholder="10 dígitos" className="w-full bg-gray-100 border-none rounded-xl p-4 focus:ring-2 focus:ring-[#E5007E] outline-none transition-all" />
                </div>
                <button 
                  disabled={status === 'loading'}
                  className="w-full bg-[#E5007E] text-white py-4 rounded-xl font-black text-lg hover:bg-black transition-all disabled:opacity-50"
                >
                  {status === 'loading' ? 'Verificando...' : 'VERIFICAR AHORA'}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

const AdminDashboard = ({ promos, setPromos }: { promos: Promotion[], setPromos: React.Dispatch<React.SetStateAction<Promotion[]>> }) => {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<Partial<Promotion>>({});
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  const handleDelete = (id: string) => {
    setPromos(prev => prev.filter(p => p.id !== id));
    setDeleteConfirmId(null);
  };

  const handleEdit = (promo: Promotion) => {
    setEditingId(promo.id);
    setEditForm(promo);
  };

  const handleSave = () => {
    setPromos(prev => prev.map(p => p.id === editingId ? { ...p, ...editForm } as Promotion : p));
    setEditingId(null);
  };

  const handleAdd = () => {
    const newPromo: Promotion = {
      id: Date.now().toString(),
      title: 'Nuevo Paquete',
      megas: 50,
      channels: 0,
      price: 400,
      features: ['Internet', 'Telefonía'],
      isPopular: false
    };
    setPromos(prev => [...prev, newPromo]);
    handleEdit(newPromo);
  };

  return (
    <div className="min-h-screen bg-gray-100 pt-32 pb-20">
      <div className="container mx-auto px-6">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-black text-black uppercase italic">Dashboard Admin</h1>
            <p className="text-gray-500">Gestiona las promociones que ven tus clientes</p>
          </div>
          <button 
            onClick={handleAdd}
            className="bg-black text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2 hover:bg-[#E5007E] transition-all"
          >
            <Plus size={20} /> Nueva Promo
          </button>
        </div>

        <div className="grid grid-cols-1 gap-6">
          {promos.map(promo => (
            <div key={promo.id} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200 flex flex-col md:flex-row gap-6 items-center">
              {editingId === promo.id ? (
                <div className="flex-1 grid grid-cols-1 md:grid-cols-4 gap-4 w-full">
                  <input 
                    className="border rounded-lg p-2" 
                    value={editForm.title} 
                    onChange={e => setEditForm({...editForm, title: e.target.value})} 
                    placeholder="Título"
                  />
                  <input 
                    type="number" 
                    className="border rounded-lg p-2" 
                    value={editForm.megas} 
                    onChange={e => setEditForm({...editForm, megas: Number(e.target.value)})} 
                    placeholder="Megas"
                  />
                  <input 
                    type="number" 
                    className="border rounded-lg p-2" 
                    value={editForm.price} 
                    onChange={e => setEditForm({...editForm, price: Number(e.target.value)})} 
                    placeholder="Precio"
                  />
                  <div className="flex items-center gap-2">
                    <input 
                      type="checkbox" 
                      checked={editForm.isPopular} 
                      onChange={e => setEditForm({...editForm, isPopular: e.target.checked})} 
                    />
                    <label>Popular</label>
                  </div>
                </div>
              ) : (
                <div className="flex-1 flex items-center gap-6 w-full">
                  <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center text-[#E5007E]">
                    <Wifi size={24} />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold text-lg">{promo.title}</h3>
                    <p className="text-sm text-gray-500">{promo.megas} Megas • ${promo.price}/mes</p>
                  </div>
                  {promo.isPopular && <span className="bg-[#E5007E]/10 text-[#E5007E] text-xs font-bold px-2 py-1 rounded">Popular</span>}
                </div>
              )}

              <div className="flex gap-2">
                {editingId === promo.id ? (
                  <button onClick={handleSave} className="p-3 bg-green-500 text-white rounded-xl hover:bg-green-600 transition-all">
                    <Save size={20} />
                  </button>
                ) : (
                  <button onClick={() => handleEdit(promo)} className="p-3 bg-gray-100 text-gray-600 rounded-xl hover:bg-gray-200 transition-all">
                    <Edit2 size={20} />
                  </button>
                )}
                
                {deleteConfirmId === promo.id ? (
                  <div className="flex gap-1">
                    <button onClick={() => handleDelete(promo.id)} className="p-3 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-all text-xs font-bold">
                      SÍ
                    </button>
                    <button onClick={() => setDeleteConfirmId(null)} className="p-3 bg-gray-200 text-gray-600 rounded-xl hover:bg-gray-300 transition-all text-xs font-bold">
                      NO
                    </button>
                  </div>
                ) : (
                  <button onClick={() => setDeleteConfirmId(promo.id)} className="p-3 bg-red-50 text-red-500 rounded-xl hover:bg-red-500 hover:text-white transition-all">
                    <Trash2 size={20} />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const LoginForm = ({ onLogin }: { onLogin: () => void }) => {
  const [pass, setPass] = useState('');
  const [error, setError] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (pass === 'admin123') {
      onLogin();
    } else {
      setError(true);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-6">
      <motion.div 
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-white rounded-[32px] p-10 max-w-md w-full shadow-2xl"
      >
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-[#E5007E] flex items-center justify-center rounded-2xl mx-auto mb-4 rotate-3">
            <span className="text-white font-black text-2xl italic">izzi</span>
          </div>
          <h2 className="text-3xl font-black uppercase italic">Acceso Admin</h2>
          <p className="text-gray-500">Ingresa la clave maestra</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <input 
              type="password" 
              placeholder="Contraseña (admin123)" 
              className={`w-full bg-gray-100 border-2 rounded-2xl p-4 outline-none transition-all ${error ? 'border-red-500' : 'border-transparent focus:border-[#E5007E]'}`}
              value={pass}
              onChange={e => { setPass(e.target.value); setError(false); }}
            />
            {error && <p className="text-red-500 text-xs font-bold mt-2 ml-2">Contraseña incorrecta</p>}
          </div>
          <button className="w-full bg-black text-white py-4 rounded-2xl font-black text-lg hover:bg-[#E5007E] transition-all">
            ENTRAR
          </button>
          <p className="text-center text-xs text-gray-400">Solo personal autorizado</p>
        </form>
      </motion.div>
    </div>
  );
};

const Footer = () => (
  <footer className="h-[40px] bg-black-soft text-white/40 flex items-center justify-center text-[11px] tracking-[1px] uppercase">
    &copy; 2024 IZZI TELECOM | TODOS LOS DERECHOS RESERVADOS
  </footer>
);

// --- Main App ---

export default function App() {
  const [role, setRole] = useState<UserRole | null>(null);
  const [showLogin, setShowLogin] = useState(false);
  const [promos, setPromos] = useState<Promotion[]>(INITIAL_PROMOTIONS);

  return (
    <div className="min-h-screen bg-white font-sans selection:bg-magenta selection:text-white flex flex-col">
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

      <main className="flex-1 pt-[70px]">
        {role === 'admin' ? (
          <AdminDashboard promos={promos} setPromos={setPromos} />
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] min-h-[calc(100vh-110px)]">
            <Hero />
            
            <aside className="bg-gray-light border-l border-gray-200 p-8 overflow-y-auto">
              <div className="flex justify-between items-center mb-6">
                <span className="text-[18px] font-extrabold uppercase tracking-tight">Promociones</span>
                <span className="text-[10px] opacity-50 font-bold">ACTUALIZADO HOY</span>
              </div>
              
              <div className="space-y-4">
                {promos.map(promo => (
                  <PromoCard key={promo.id} promo={promo} />
                ))}
              </div>

              <div className="mt-8 p-6 bg-black-soft rounded-2xl text-white">
                <h4 className="font-black text-lg mb-2 italic">izzi go</h4>
                <p className="text-xs text-white/60 mb-4">Lleva tu entretenimiento a todas partes.</p>
                <div className="flex gap-2">
                  <div className="h-8 w-24 bg-white/10 rounded flex items-center justify-center text-[10px] font-bold">App Store</div>
                  <div className="h-8 w-24 bg-white/10 rounded flex items-center justify-center text-[10px] font-bold">Play Store</div>
                </div>
              </div>
            </aside>
          </div>
        )}
      </main>

      <Footer />

      {/* Admin Pill Indicator */}
      {role === 'admin' && (
        <div className="fixed bottom-5 right-5 bg-black-soft text-white px-5 py-3 rounded-full text-[12px] font-bold flex items-center gap-2 shadow-2xl z-[60]">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
          SESIÓN ADMIN: ACTIVA
        </div>
      )}

      {/* Floating WhatsApp Button (Hidden on large screens if sidebar is active) */}
      <a 
        href="https://wa.me/1234567890" 
        target="_blank" 
        rel="noopener noreferrer"
        className="fixed bottom-8 left-8 z-50 bg-[#25D366] text-white p-4 rounded-full shadow-2xl hover:scale-110 transition-transform lg:hidden"
      >
        <MessageCircle size={24} />
      </a>
    </div>
  );
}
