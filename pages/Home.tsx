
import React from 'react';
import { ChevronRight, ArrowRight, Eye } from 'lucide-react';
import { db } from '../services/dbService';
import { Banner, Product } from '../types';
import { ProductCard } from '../components/ProductCard';

interface HomeProps {
  onProductClick: (p: Product) => void;
  onAddToCart: (p: Product) => void;
  onNavigate: (page: string) => void;
}

export const Home: React.FC<HomeProps> = ({ onProductClick, onNavigate }) => {
  const banners = db.getAll<Banner>('banners').filter(b => b.active);
  const heroBanner = banners.find(b => b.position === 'hero');
  const secBanner1 = banners.find(b => b.position === 'secondary_1');
  const secBanner2 = banners.find(b => b.position === 'secondary_2');
  
  const featuredProducts = db.getAll<Product>('products').filter(p => p.featured && p.active).slice(0, 4);
  const newProducts = db.getAll<Product>('products').filter(p => p.active).reverse().slice(0, 4);
  const bestSellers = db.getAll<Product>('products').filter(p => p.active).sort((a,b) => b.stock - a.stock).slice(0, 4);

  return (
    <div className="space-y-12 pb-20">
      {/* Hero Banner */}
      {heroBanner && (
        <section className="relative h-[400px] md:h-[500px] lg:h-[600px] w-full overflow-hidden">
          <img 
            src={heroBanner.imageUrl} 
            className="w-full h-full object-cover" 
            alt={heroBanner.title}
          />
          <div className="absolute inset-0 bg-gradient-to-r from-emerald-950/80 via-emerald-900/40 to-transparent flex items-center">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
              <div className="max-w-xl text-white space-y-6 animate-in fade-in slide-in-from-left-8 duration-700">
                <span className="bg-emerald-500 text-white text-[10px] font-black uppercase tracking-[0.2em] px-3 py-1 rounded-full">
                  Tecnologia de Ponta
                </span>
                <h1 className="text-4xl md:text-6xl font-extrabold leading-tight">
                  {heroBanner.title}
                </h1>
                <p className="text-lg md:text-xl text-emerald-50/80 leading-relaxed font-light">
                  {heroBanner.subtitle}
                </p>
                <div className="flex gap-4">
                  <button 
                    onClick={() => onNavigate('catalogo')}
                    className="bg-emerald-500 hover:bg-emerald-600 text-white px-8 py-4 rounded-full font-bold transition-all shadow-xl shadow-emerald-900/40 flex items-center gap-2 group"
                  >
                    VER CATÁLOGO <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Featured Sections */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        
        {/* Destaques */}
        <section>
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-black text-gray-900 uppercase tracking-tight flex items-center gap-3">
              <div className="w-1.5 h-8 bg-emerald-500 rounded-full"></div>
              Em Destaque
            </h2>
            <button onClick={() => onNavigate('catalogo')} className="text-emerald-600 font-bold text-sm flex items-center gap-1 hover:gap-2 transition-all">
              Explorar Catálogo <ChevronRight className="w-4 h-4" />
            </button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredProducts.map(p => (
              <ProductCard key={p.id} product={p} onClick={onProductClick} />
            ))}
          </div>
        </section>

        {/* Secondary Banners */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {[secBanner1, secBanner2].map((banner, i) => banner && (
            <div key={i} className="group relative h-64 rounded-3xl overflow-hidden cursor-pointer shadow-lg shadow-gray-200">
              <img 
                src={banner.imageUrl} 
                className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700" 
                alt={banner.title}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-gray-900/90 via-gray-900/20 to-transparent flex flex-col justify-end p-8">
                <h3 className="text-2xl font-extrabold text-white mb-2">{banner.title}</h3>
                <p className="text-gray-300 text-sm font-medium mb-4">{banner.subtitle}</p>
                <button 
                  onClick={() => onNavigate(banner.linkUrl)}
                  className="w-fit bg-white text-gray-900 px-6 py-2 rounded-full text-xs font-black uppercase tracking-wider hover:bg-emerald-500 hover:text-white transition-all"
                >
                  Saiba Mais
                </button>
              </div>
            </div>
          ))}
        </section>

        {/* Brand Banner */}
        <section className="bg-emerald-600 rounded-[2.5rem] p-8 md:p-12 overflow-hidden relative">
          <div className="absolute -right-20 -top-20 w-80 h-80 bg-white/10 rounded-full blur-3xl"></div>
          <div className="absolute -left-20 -bottom-20 w-64 h-64 bg-emerald-400/20 rounded-full blur-3xl"></div>
          
          <div className="relative z-10 flex flex-col md:flex-row items-center gap-12">
            <div className="flex-1 space-y-6 text-center md:text-left">
              <h2 className="text-3xl md:text-5xl font-black text-white leading-tight">
                Soluções para sua Empresa
              </h2>
              <p className="text-emerald-50 text-lg opacity-90 max-w-lg">
                Conheça nossa linha completa de hardwares e periféricos de alta performance para elevar o nível da sua produtividade.
              </p>
              <button 
                onClick={() => onNavigate('catalogo')}
                className="bg-white text-emerald-600 px-10 py-4 rounded-full font-bold text-lg shadow-xl hover:bg-emerald-50 transition-all active:scale-95 flex items-center gap-2 mx-auto md:mx-0"
              >
                <Eye className="w-5 h-5" /> Ver Catálogo
              </button>
            </div>
            <div className="flex-1">
              <img src="https://picsum.photos/seed/tech/800/600" className="rounded-3xl shadow-2xl rotate-2 hover:rotate-0 transition-transform duration-500" alt="Tech" />
            </div>
          </div>
        </section>

        {/* Novidades */}
        <section>
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-black text-gray-900 uppercase tracking-tight flex items-center gap-3">
              <div className="w-1.5 h-8 bg-emerald-500 rounded-full"></div>
              Adicionados Recentemente
            </h2>
            <button onClick={() => onNavigate('catalogo')} className="text-emerald-600 font-bold text-sm flex items-center gap-1 hover:gap-2 transition-all">
              Ver tudo <ChevronRight className="w-4 h-4" />
            </button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {newProducts.map(p => (
              <ProductCard key={p.id} product={p} onClick={onProductClick} />
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};
