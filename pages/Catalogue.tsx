
import React, { useState, useMemo } from 'react';
import { Filter, ChevronDown, LayoutGrid, List, X, Search, ChevronLeft, ChevronRight, Eye } from 'lucide-react';
import { db } from '../services/dbService';
import { Product, Category, Department, Brand } from '../types';
import { ProductCard } from '../components/ProductCard';

interface CatalogueProps {
  onProductClick: (p: Product) => void;
  onAddToCart?: (p: Product) => void;
  onNavigate: (page: string) => void;
  initialQuery?: string;
  initialCategory?: string;
}

export const Catalogue: React.FC<CatalogueProps> = ({ 
  onProductClick, 
  onNavigate,
  initialQuery = '',
  initialCategory = ''
}) => {
  // State
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState(initialQuery);
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [selectedBrand, setSelectedBrand] = useState<string>('');
  const [onlyInStock, setOnlyInStock] = useState(false);
  const [sortBy, setSortBy] = useState('newest');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12;

  // Data
  const products = db.getAll<Product>('products');
  const categories = db.getAll<Category>('categories').filter(c => c.active);
  const departments = db.getAll<Department>('departments').filter(d => d.active);
  const brands = db.getAll<Brand>('brands');

  // Filtering Logic
  const filteredProducts = useMemo(() => {
    let result = products.filter(p => p.active);

    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      result = result.filter(p => p.name.toLowerCase().includes(q) || p.description.toLowerCase().includes(q));
    }

    if (selectedCategory) {
      result = result.filter(p => {
        const cat = categories.find(c => c.slug === selectedCategory);
        const dep = departments.find(d => d.slug === selectedCategory);
        if (cat) return p.categoryId === cat.id;
        if (dep) {
          const depCats = categories.filter(c => c.departmentId === dep.id).map(c => c.id);
          return depCats.includes(p.categoryId);
        }
        return true;
      });
    }

    if (selectedBrand) {
      result = result.filter(p => p.brandId === selectedBrand);
    }

    if (onlyInStock) {
      result = result.filter(p => p.stock > 0);
    }

    // Sorting
    switch (sortBy) {
      case 'name-asc':
        result.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'newest':
        result.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        break;
    }

    return result;
  }, [products, searchQuery, selectedCategory, selectedBrand, onlyInStock, sortBy, categories, departments]);

  // Pagination Logic
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const paginatedProducts = filteredProducts.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const clearFilters = () => {
    setSearchQuery('');
    setSelectedCategory('');
    setSelectedBrand('');
    setOnlyInStock(false);
    setSortBy('newest');
    setCurrentPage(1);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="flex flex-col md:flex-row gap-10">
        
        {/* Sidebar Filters (Desktop) */}
        <aside className="hidden lg:block w-64 shrink-0 space-y-8">
          <div>
            <h3 className="text-sm font-black text-gray-900 uppercase tracking-widest mb-6 flex items-center gap-2">
              <Filter className="w-4 h-4 text-emerald-600" /> Filtros
            </h3>
            
            {/* Categories */}
            <div className="space-y-4 mb-8">
              <h4 className="text-xs font-bold text-gray-400 uppercase">Departamentos</h4>
              <div className="space-y-2">
                <button 
                  onClick={() => setSelectedCategory('')}
                  className={`block text-sm transition-colors ${!selectedCategory ? 'text-emerald-600 font-bold' : 'text-gray-600 hover:text-emerald-600'}`}
                >
                  Todos os Produtos
                </button>
                {departments.map(dep => (
                  <button 
                    key={dep.id}
                    onClick={() => setSelectedCategory(dep.slug)}
                    className={`block text-sm transition-colors ${selectedCategory === dep.slug ? 'text-emerald-600 font-bold' : 'text-gray-600 hover:text-emerald-600'}`}
                  >
                    {dep.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Brands */}
            <div className="space-y-4 mb-8">
              <h4 className="text-xs font-bold text-gray-400 uppercase">Marcas</h4>
              <div className="space-y-2 max-h-48 overflow-y-auto custom-scrollbar pr-2">
                {brands.map(brand => (
                  <label key={brand.id} className="flex items-center gap-2 cursor-pointer group">
                    <input 
                      type="radio" 
                      name="brand"
                      checked={selectedBrand === brand.id}
                      onChange={() => setSelectedBrand(brand.id)}
                      className="w-4 h-4 text-emerald-600 focus:ring-emerald-500 border-gray-300 rounded"
                    />
                    <span className="text-sm text-gray-600 group-hover:text-emerald-600">{brand.name}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Availability */}
            <div className="space-y-4 mb-8">
              <label className="flex items-center gap-3 cursor-pointer group">
                <div className="relative">
                  <input 
                    type="checkbox" 
                    checked={onlyInStock}
                    onChange={(e) => setOnlyInStock(e.target.checked)}
                    className="sr-only"
                  />
                  <div className={`w-10 h-5 rounded-full transition-colors ${onlyInStock ? 'bg-emerald-500' : 'bg-gray-200'}`}></div>
                  <div className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full transition-transform ${onlyInStock ? 'translate-x-5' : 'translate-x-0'}`}></div>
                </div>
                <span className="text-sm font-bold text-gray-700">Disponíveis</span>
              </label>
            </div>

            <button 
              onClick={clearFilters}
              className="w-full py-3 text-xs font-black text-gray-400 hover:text-red-500 uppercase tracking-widest border-t border-gray-100 mt-4 transition-colors"
            >
              Resetar Catálogo
            </button>
          </div>
        </aside>

        {/* Main Content */}
        <div className="flex-1 space-y-8">
          
          {/* Top Controls */}
          <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-4 w-full sm:w-auto">
              <div className="relative flex-1 sm:w-64">
                <input 
                  type="text"
                  placeholder="Pesquisar..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-gray-50 border-none rounded-xl py-2 pl-10 pr-4 text-sm focus:ring-2 focus:ring-emerald-500 transition-all outline-none"
                />
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
              </div>
              <p className="hidden md:block text-xs font-bold text-gray-400 uppercase tracking-widest">
                {filteredProducts.length} itens listados
              </p>
            </div>

            <div className="flex items-center gap-4 w-full sm:w-auto">
              <button 
                onClick={() => setIsMobileFilterOpen(true)}
                className="lg:hidden flex-1 flex items-center justify-center gap-2 bg-emerald-50 text-emerald-600 py-2 rounded-xl text-sm font-bold"
              >
                <Filter className="w-4 h-4" /> Filtros
              </button>
              
              <div className="relative group">
                <select 
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="appearance-none bg-gray-50 border-none rounded-xl py-2 pl-4 pr-10 text-sm font-bold text-gray-700 focus:ring-2 focus:ring-emerald-500 outline-none cursor-pointer"
                >
                  <option value="newest">Lançamentos</option>
                  <option value="name-asc">Nome (A-Z)</option>
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4 pointer-events-none" />
              </div>
            </div>
          </div>

          {/* Product Grid */}
          {paginatedProducts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6 animate-in fade-in duration-500">
              {paginatedProducts.map(product => (
                <ProductCard 
                  key={product.id} 
                  product={product} 
                  onClick={onProductClick} 
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-32 bg-white rounded-3xl border border-gray-100 space-y-4">
              <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto">
                <Search className="w-10 h-10 text-gray-300" />
              </div>
              <h3 className="text-xl font-black text-gray-900">Nenhum item encontrado</h3>
              <p className="text-gray-500">Tente buscar por outro termo ou limpar os filtros.</p>
              <button 
                onClick={clearFilters}
                className="bg-emerald-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-emerald-700 transition-all"
              >
                Ver Catálogo Completo
              </button>
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 pt-10">
              <button 
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(prev => prev - 1)}
                className="p-2 rounded-xl bg-white border border-gray-200 text-gray-400 hover:text-emerald-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              
              {[...Array(totalPages)].map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentPage(i + 1)}
                  className={`w-10 h-10 rounded-xl font-bold text-sm transition-all ${currentPage === i + 1 ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-100' : 'bg-white border border-gray-200 text-gray-600 hover:border-emerald-500 hover:text-emerald-600'}`}
                >
                  {i + 1}
                </button>
              ))}

              <button 
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage(prev => prev + 1)}
                className="p-2 rounded-xl bg-white border border-gray-200 text-gray-400 hover:text-emerald-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Mobile Filters Modal */}
      {isMobileFilterOpen && (
        <div className="fixed inset-0 z-[60] lg:hidden">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setIsMobileFilterOpen(false)}></div>
          <div className="absolute inset-y-0 right-0 w-80 bg-white shadow-2xl p-8 animate-in slide-in-from-right duration-300 flex flex-col">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-xl font-black text-gray-900 uppercase">Filtros</h2>
              <button onClick={() => setIsMobileFilterOpen(false)} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <div className="flex-1 overflow-y-auto custom-scrollbar space-y-8 pr-2">
              <div className="space-y-4">
                <h4 className="text-xs font-bold text-gray-400 uppercase">Departamentos</h4>
                <div className="grid grid-cols-1 gap-2">
                  {departments.map(dep => (
                    <button 
                      key={dep.id}
                      onClick={() => { setSelectedCategory(dep.slug); setIsMobileFilterOpen(false); }}
                      className={`text-left px-4 py-3 rounded-xl text-sm font-bold ${selectedCategory === dep.slug ? 'bg-emerald-600 text-white' : 'bg-gray-50 text-gray-600'}`}
                    >
                      {dep.name}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="pt-6 border-t border-gray-100 grid grid-cols-2 gap-4">
              <button onClick={clearFilters} className="py-4 text-xs font-black text-gray-400 uppercase">Limpar</button>
              <button onClick={() => setIsMobileFilterOpen(false)} className="py-4 bg-emerald-600 text-white rounded-2xl font-black text-xs uppercase shadow-xl shadow-emerald-100">Ver Itens</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
