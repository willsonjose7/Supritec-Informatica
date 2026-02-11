
import React, { useState, useEffect } from 'react';
import { User, Search, Menu, X, ChevronDown, Package, LayoutDashboard, LogOut, ChevronRight, Home, LayoutGrid, Info, Phone, ShieldCheck } from 'lucide-react';
import { db } from '../services/dbService';
import { Department, Category, UserRole, StoreSettings } from '../types';

interface HeaderProps {
  currentUser: any;
  onLogout: () => void;
  onNavigate: (page: string) => void;
}

export const Header: React.FC<HeaderProps> = ({ currentUser, onLogout, onNavigate }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'nav' | 'search'>('nav');
  
  const departments = db.getAll<Department>('departments').filter(d => d.active);
  const settings = db.getStoreSettings();

  // Lock scroll when menu is open
  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => { document.body.style.overflow = 'unset'; };
  }, [isMenuOpen]);

  const handleMobileNav = (path: string) => {
    onNavigate(path);
    setIsMenuOpen(false);
  };

  const isAdmin = currentUser?.role === UserRole.ADMIN;

  return (
    <>
      <header className="sticky top-0 z-50 bg-white shadow-sm border-b border-emerald-100">
        {/* Top Bar */}
        <div className="bg-emerald-900 text-white text-[10px] md:text-xs py-2 text-center font-bold uppercase tracking-wider px-4 flex justify-center items-center gap-4">
          <span>{settings.name} - O seu catálogo de tecnologia</span>
          {isAdmin && (
            <span className="hidden md:inline-flex items-center gap-1 text-emerald-300">
              <ShieldCheck className="w-3 h-3" /> MODO ADMINISTRADOR ATIVO
            </span>
          )}
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 md:h-24 gap-4">
            
            {/* Menu Toggle - Mobile */}
            <button 
              className="md:hidden p-2 -ml-2 text-gray-700 hover:text-emerald-600 transition-colors"
              onClick={() => { setActiveTab('nav'); setIsMenuOpen(true); }}
            >
              <Menu className="w-6 h-6" />
            </button>

            {/* Logo Image */}
            <div className="flex-shrink-0 flex items-center cursor-pointer py-2" onClick={() => onNavigate('home')}>
              <img 
                src={settings.logoUrl} 
                alt={settings.name} 
                className="h-12 md:h-16 w-auto object-contain"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = 'https://via.placeholder.com/150x50?text=' + settings.name; 
                }}
              />
            </div>

            {/* Search Bar - Desktop */}
            <div className="hidden md:flex flex-1 max-w-xl mx-8">
              <div className="relative w-full">
                <input
                  type="text"
                  className="w-full bg-gray-100 border-none rounded-full py-2.5 pl-12 pr-4 text-sm focus:ring-2 focus:ring-emerald-500 focus:bg-white transition-all outline-none"
                  placeholder="O que você está procurando hoje?"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && onNavigate(`catalogo?q=${searchQuery}`)}
                />
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-1 sm:gap-4">
              <button 
                className="md:hidden p-2 text-gray-700 hover:text-emerald-600"
                onClick={() => { setActiveTab('search'); setIsMenuOpen(true); }}
              >
                <Search className="w-6 h-6" />
              </button>

              {/* Dedicated Admin Button for Desktop */}
              {isAdmin && (
                <button 
                  onClick={() => onNavigate('admin')}
                  className="hidden md:flex items-center gap-2 bg-emerald-50 text-emerald-700 px-4 py-2.5 rounded-xl border border-emerald-100 hover:bg-emerald-100 transition-all font-bold text-xs"
                >
                  <LayoutDashboard className="w-4 h-4" />
                  <span className="hidden lg:inline">PAINEL ADMIN</span>
                </button>
              )}

              <div className="relative group cursor-pointer">
                <div 
                  className="flex items-center gap-2 hover:text-emerald-600 transition-colors p-2 md:p-0"
                  onClick={() => currentUser ? onNavigate('minha-conta') : onNavigate('login')}
                >
                  <User className="w-6 h-6 text-gray-700" />
                  <div className="hidden lg:block">
                    <p className="text-[10px] text-gray-500 uppercase font-bold leading-none">Minha Conta</p>
                    <p className="text-sm font-bold text-gray-900">{currentUser ? currentUser.name.split(' ')[0] : 'Entrar'}</p>
                  </div>
                </div>
                
                {currentUser && (
                  <div className="absolute right-0 mt-2 w-52 bg-white rounded-2xl shadow-2xl border border-gray-100 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all py-3 z-50">
                    <div className="px-4 py-2 mb-2 border-b border-gray-50">
                      <p className="text-[10px] font-black text-gray-400 uppercase">Logado como</p>
                      <p className="text-sm font-bold text-gray-900 truncate">{currentUser.name}</p>
                    </div>

                    {isAdmin && (
                      <button onClick={() => onNavigate('admin')} className="w-full text-left px-4 py-2.5 text-sm font-bold text-emerald-600 hover:bg-emerald-50 flex items-center gap-3">
                        <LayoutDashboard className="w-4 h-4" /> Painel Admin
                      </button>
                    )}
                    
                    <button onClick={() => onNavigate('pedidos')} className="w-full text-left px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-emerald-50 flex items-center gap-3">
                      <Package className="w-4 h-4" /> Meus Pedidos
                    </button>

                    <hr className="my-2 border-gray-100" />
                    
                    <button onClick={onLogout} className="w-full text-left px-4 py-2.5 text-sm font-bold text-red-600 hover:bg-red-50 flex items-center gap-3">
                      <LogOut className="w-4 h-4" /> Sair da Conta
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Categories Bar - Desktop */}
        <nav className="hidden md:block bg-gray-50 border-t border-gray-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <ul className="flex items-center gap-8 py-3">
              <li className="relative group cursor-pointer">
                <span className="flex items-center gap-2 text-sm font-bold text-gray-700 hover:text-emerald-600">
                  <LayoutGrid className="w-4 h-4" /> Todos os Departamentos
                </span>
                <div className="absolute left-0 top-full mt-0 w-64 bg-white shadow-2xl rounded-b-xl overflow-hidden opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50 border border-gray-100">
                  {departments.map(dep => (
                    <div 
                      key={dep.id}
                      className="px-4 py-3 text-sm font-medium hover:bg-emerald-50 hover:text-emerald-600 flex items-center justify-between border-b border-gray-50 last:border-none cursor-pointer"
                      onClick={() => onNavigate(`catalogo/${dep.slug}`)}
                    >
                      {dep.name}
                      <ChevronRight className="w-4 h-4 text-gray-300" />
                    </div>
                  ))}
                </div>
              </li>
              {departments.slice(0, 6).map(dep => (
                <li key={dep.id}>
                  <button 
                    onClick={() => onNavigate(`catalogo/${dep.slug}`)}
                    className="text-xs font-bold text-gray-500 hover:text-emerald-600 transition-colors uppercase tracking-widest"
                  >
                    {dep.name}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </nav>
      </header>

      {/* Mobile Drawer Navigation */}
      <div className={`fixed inset-0 z-[60] lg:hidden transition-opacity duration-300 ${isMenuOpen ? 'opacity-100 visible' : 'opacity-0 invisible'}`}>
        {/* Overlay */}
        <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setIsMenuOpen(false)}></div>
        
        {/* Sidebar */}
        <div className={`absolute inset-y-0 left-0 w-[85%] max-w-sm bg-white shadow-2xl flex flex-col transform transition-transform duration-300 ease-out ${isMenuOpen ? 'translate-x-0' : '-translate-x-full'}`}>
          
          {/* Drawer Header */}
          <div className="p-6 bg-emerald-900 text-white">
            <div className="flex items-center justify-between mb-8">
              <img src={settings.logoUrl} alt={settings.name} className="h-10 w-auto invert brightness-0" />
              <button onClick={() => setIsMenuOpen(false)} className="p-2 hover:bg-white/10 rounded-full">
                <X className="w-6 h-6" />
              </button>
            </div>
            
            {/* Drawer Tabs */}
            <div className="flex bg-white/10 rounded-xl p-1">
              <button 
                onClick={() => setActiveTab('nav')}
                className={`flex-1 py-2 text-xs font-black uppercase tracking-widest rounded-lg transition-all ${activeTab === 'nav' ? 'bg-white text-emerald-900 shadow-lg' : 'text-white/60'}`}
              >
                Menu
              </button>
              <button 
                onClick={() => setActiveTab('search')}
                className={`flex-1 py-2 text-xs font-black uppercase tracking-widest rounded-lg transition-all ${activeTab === 'search' ? 'bg-white text-emerald-900 shadow-lg' : 'text-white/60'}`}
              >
                Busca
              </button>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto custom-scrollbar">
            {activeTab === 'nav' ? (
              <div className="py-4">
                {/* Admin Quick Links (Mobile) */}
                {isAdmin && (
                  <div className="px-6 mb-6">
                    <h3 className="text-[10px] font-black text-emerald-600 uppercase tracking-[0.2em] mb-3">Administração</h3>
                    <button 
                      onClick={() => handleMobileNav('admin')}
                      className="w-full flex items-center gap-4 py-4 bg-emerald-50 rounded-2xl px-4 text-emerald-700 font-bold shadow-sm"
                    >
                      <LayoutDashboard className="w-5 h-5" /> Painel Administrativo
                    </button>
                  </div>
                )}

                {/* Main Links */}
                <div className="px-6 space-y-1 mb-8">
                   <button onClick={() => handleMobileNav('home')} className="w-full flex items-center gap-4 py-3 text-gray-700 font-bold hover:text-emerald-600 border-b border-gray-50">
                      <Home className="w-5 h-5 text-emerald-500" /> Início
                   </button>
                   <button onClick={() => handleMobileNav('catalogo')} className="w-full flex items-center gap-4 py-3 text-gray-700 font-bold hover:text-emerald-600 border-b border-gray-50">
                      <LayoutGrid className="w-5 h-5 text-emerald-500" /> Ver Todo Catálogo
                   </button>
                </div>

                {/* Departments Section */}
                <div className="px-6 mb-8">
                  <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-4">Categorias de Produtos</h3>
                  <div className="space-y-1">
                    {departments.map(dep => (
                      <button 
                        key={dep.id}
                        onClick={() => handleMobileNav(`catalogo/${dep.slug}`)}
                        className="w-full flex items-center justify-between py-4 text-gray-800 font-medium hover:text-emerald-600 group active:bg-emerald-50 px-2 rounded-xl transition-colors"
                      >
                        {dep.name}
                        <ChevronRight className="w-4 h-4 text-gray-300 group-hover:text-emerald-500" />
                      </button>
                    ))}
                  </div>
                </div>

                {/* Contact/Support Section */}
                <div className="px-6 pt-4 border-t border-gray-100">
                  <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-4">Atendimento</h3>
                  <div className="space-y-4">
                    <div className="flex items-center gap-4 text-sm text-gray-600">
                      <Phone className="w-5 h-5 text-emerald-500" /> {settings.phone}
                    </div>
                    <div className="flex items-center gap-4 text-sm text-gray-600">
                      <Info className="w-5 h-5 text-emerald-500" /> Sobre a {settings.name}
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="p-6 space-y-6">
                <div className="relative">
                  <input 
                    autoFocus
                    type="text"
                    placeholder="O que você está procurando?"
                    className="w-full bg-gray-50 border-2 border-gray-100 rounded-2xl py-4 pl-12 pr-4 text-sm focus:border-emerald-500 transition-all outline-none"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleMobileNav(`catalogo?q=${searchQuery}`)}
                  />
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-emerald-500 w-5 h-5" />
                </div>
                
                <div className="space-y-4">
                  <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest">Buscas Sugeridas</h3>
                  <div className="flex flex-wrap gap-2">
                    {['Notebook', 'iPhone', 'Gamer', 'Monitor', 'Teclado'].map(tag => (
                      <button 
                        key={tag}
                        onClick={() => handleMobileNav(`catalogo?q=${tag}`)}
                        className="bg-gray-100 hover:bg-emerald-50 text-gray-600 hover:text-emerald-600 px-4 py-2 rounded-full text-xs font-bold transition-colors"
                      >
                        {tag}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Drawer Footer */}
          {!currentUser ? (
            <div className="p-6 bg-gray-50 border-t border-gray-100">
              <button 
                onClick={() => handleMobileNav('login')}
                className="w-full bg-emerald-600 text-white py-4 rounded-2xl font-black uppercase text-xs tracking-widest shadow-xl shadow-emerald-100"
              >
                Entrar / Criar Conta
              </button>
            </div>
          ) : (
            <div className="p-6 bg-gray-50 border-t border-gray-100 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-600 font-black">
                  {currentUser.name.charAt(0)}
                </div>
                <div>
                  <p className="text-xs font-bold text-gray-900 leading-none">{currentUser.name}</p>
                  <p className="text-[10px] text-gray-500">{currentUser.email}</p>
                </div>
              </div>
              <button onClick={onLogout} className="p-2 text-red-500 hover:bg-red-50 rounded-lg">
                <LogOut className="w-5 h-5" />
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
};
