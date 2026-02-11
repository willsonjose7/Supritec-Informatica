
import React, { useState } from 'react';
import { Heart, ShieldCheck, Truck, RotateCcw, Star, ChevronRight, Check, MessageSquare } from 'lucide-react';
import { Product } from '../types';

interface ProductDetailProps {
  product: Product;
  onAddToCart?: (p: Product, qty: number) => void;
  onNavigate: (page: string) => void;
}

export const ProductDetail: React.FC<ProductDetailProps> = ({ product, onNavigate }) => {
  const [selectedImage, setSelectedImage] = useState(product.images[0]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Breadcrumbs */}
      <nav className="flex items-center gap-2 text-xs font-bold text-gray-400 uppercase tracking-widest mb-8">
        <button onClick={() => onNavigate('home')} className="hover:text-emerald-600">Home</button>
        <ChevronRight className="w-3 h-3" />
        <button onClick={() => onNavigate('catalogo')} className="hover:text-emerald-600">Catálogo</button>
        <ChevronRight className="w-3 h-3" />
        <span className="text-gray-900 truncate">{product.name}</span>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        {/* Gallery */}
        <div className="lg:col-span-7 space-y-4">
          <div className="aspect-square bg-white rounded-3xl border border-gray-100 overflow-hidden shadow-sm relative group">
            <img 
              src={selectedImage} 
              alt={product.name} 
              className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700" 
            />
            <button className="absolute top-6 right-6 p-3 bg-white/80 backdrop-blur shadow-sm rounded-full text-gray-400 hover:text-red-500 transition-colors">
              <Heart className="w-6 h-6" />
            </button>
          </div>
          <div className="grid grid-cols-5 gap-4">
            {product.images.map((img, i) => (
              <button 
                key={i}
                onClick={() => setSelectedImage(img)}
                className={`aspect-square rounded-xl overflow-hidden border-2 transition-all ${selectedImage === img ? 'border-emerald-500' : 'border-transparent opacity-60 hover:opacity-100'}`}
              >
                <img src={img} className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        </div>

        {/* Info */}
        <div className="lg:col-span-5 space-y-8">
          <div className="space-y-4">
            <p className="text-xs font-black text-emerald-600 uppercase tracking-[0.2em]">{product.sku}</p>
            <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 leading-tight">{product.name}</h1>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1">
                {[1,2,3,4,5].map(s => <Star key={s} className="w-4 h-4 fill-yellow-400 text-yellow-400" />)}
              </div>
              <span className="text-sm font-bold text-gray-400">4.8 (124 avaliações)</span>
            </div>
          </div>

          <div className="p-8 bg-white rounded-3xl border border-emerald-50 shadow-sm space-y-6">
            <div className="space-y-4">
               <h3 className="text-xl font-bold text-emerald-900 uppercase tracking-tight">Interessado neste produto?</h3>
               <p className="text-sm text-gray-600 leading-relaxed">
                  Entre em contato conosco para verificar a disponibilidade imediata, especificações técnicas adicionais ou solicitar um orçamento personalizado para sua empresa.
               </p>
            </div>

            <div className="space-y-3">
              <button 
                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-4 rounded-2xl font-black shadow-xl shadow-emerald-100 flex items-center justify-center gap-3 transition-all active:scale-95 uppercase text-sm tracking-wider"
              >
                <MessageSquare className="w-5 h-5" /> Falar com Consultor
              </button>
              <button 
                className="w-full bg-gray-100 hover:bg-gray-200 text-gray-800 py-4 rounded-2xl font-black flex items-center justify-center gap-3 transition-all active:scale-95 uppercase text-sm tracking-wider"
              >
                Solicitar Orçamento
              </button>
            </div>

            <div className="pt-6 border-t border-gray-100">
               <div className="flex items-center gap-2 text-emerald-600 font-bold text-sm">
                  <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
                  Catálogo Atualizado em Tempo Real
               </div>
            </div>
          </div>

          {/* Benefits */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="flex flex-col items-center text-center p-4 bg-gray-50 rounded-2xl border border-gray-100">
              <ShieldCheck className="w-6 h-6 text-emerald-600 mb-2" />
              <p className="text-[10px] font-bold text-gray-900 uppercase">Garantia</p>
              <p className="text-[10px] text-gray-500">Oficial do Fabricante</p>
            </div>
            <div className="flex flex-col items-center text-center p-4 bg-gray-50 rounded-2xl border border-gray-100">
              <Truck className="w-6 h-6 text-emerald-600 mb-2" />
              <p className="text-[10px] font-bold text-gray-900 uppercase">Entrega</p>
              <p className="text-[10px] text-gray-500">Todo o Brasil</p>
            </div>
            <div className="flex flex-col items-center text-center p-4 bg-gray-50 rounded-2xl border border-gray-100">
              <RotateCcw className="w-6 h-6 text-emerald-600 mb-2" />
              <p className="text-[10px] font-bold text-gray-900 uppercase">Suporte</p>
              <p className="text-[10px] text-gray-500">Técnico Especializado</p>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="mt-20">
        <div className="border-b border-gray-200 mb-10">
          <ul className="flex gap-10">
            <li className="pb-4 border-b-4 border-emerald-500 text-lg font-black text-gray-900 uppercase tracking-tight">Descrição Completa</li>
            <li className="pb-4 text-lg font-black text-gray-400 hover:text-gray-600 cursor-not-allowed uppercase tracking-tight">Ficha Técnica</li>
          </ul>
        </div>
        <div className="max-w-4xl space-y-8">
          <div className="prose prose-emerald lg:prose-lg max-w-none text-gray-600 leading-relaxed">
            <p className="text-xl font-medium text-gray-900 mb-6">{product.description}</p>
            <div className="bg-white p-8 rounded-3xl border border-gray-100 space-y-6 shadow-sm">
              <h3 className="text-xl font-extrabold text-gray-900 flex items-center gap-2">
                <Check className="w-6 h-6 text-emerald-500" /> Especificações
              </h3>
              <p className="text-gray-600 whitespace-pre-wrap">{product.specs}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
