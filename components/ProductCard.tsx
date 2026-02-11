
import React from 'react';
import { Star, Heart, Eye } from 'lucide-react';
import { Product } from '../types';

interface ProductCardProps {
  product: Product;
  onAddToCart?: (p: Product) => void; // Mantido para compatibilidade, mas não utilizado
  onClick: (p: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, onClick }) => {
  return (
    <div 
      className="group bg-white rounded-2xl p-4 shadow-sm hover:shadow-2xl hover:-translate-y-1 hover:scale-[1.02] transition-all duration-500 border border-gray-100 flex flex-col relative h-full cursor-default"
    >
      <button className="absolute top-4 right-4 z-10 text-gray-300 hover:text-red-500 transition-colors">
        <Heart className="w-5 h-5" />
      </button>

      {/* Image */}
      <div 
        className="relative aspect-square mb-4 overflow-hidden rounded-xl cursor-pointer"
        onClick={() => onClick(product)}
      >
        <img 
          src={product.images[0]} 
          alt={product.name}
          className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
        />
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors flex items-center justify-center">
            <Eye className="text-white opacity-0 group-hover:opacity-100 w-8 h-8 transition-opacity" />
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 flex flex-col">
        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mb-1">{product.sku}</p>
        <h3 
          className="text-sm font-bold text-gray-800 line-clamp-2 mb-2 group-hover:text-emerald-600 transition-colors cursor-pointer"
          onClick={() => onClick(product)}
        >
          {product.name}
        </h3>
        
        <div className="flex items-center gap-1 mb-3">
          {[1,2,3,4,5].map(s => <Star key={s} className="w-3 h-3 fill-yellow-400 text-yellow-400" />)}
          <span className="text-[10px] text-gray-400 font-medium">(42)</span>
        </div>

        <div className="mt-auto">
          <p className="text-xs text-gray-500 font-medium italic">Consulte disponibilidade</p>
        </div>
      </div>

      {/* Button - Now just View Details */}
      <button 
        onClick={() => onClick(product)}
        className="mt-4 w-full bg-gray-900 hover:bg-emerald-600 text-white py-3 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-colors shadow-lg shadow-gray-100 active:scale-95"
      >
        <Eye className="w-4 h-4" /> VER DETALHES
      </button>
    </div>
  );
};
