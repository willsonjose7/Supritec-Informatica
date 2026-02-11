
import React, { useState } from 'react';
import { Plus, Search, Edit2, Trash2, Eye, Package, Check, X, AlertCircle } from 'lucide-react';
import { db } from '../../services/dbService';
import { Product, Category, Brand } from '../../types';

export const AdminProducts: React.FC = () => {
  const [products, setProducts] = useState<Product[]>(db.getAll<Product>('products'));
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  const categories = db.getAll<Category>('categories');
  const brands = db.getAll<Brand>('brands');

  const filteredProducts = products.filter(p => 
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    p.sku.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDelete = (id: string) => {
    if (window.confirm('Tem certeza que deseja excluir este produto?')) {
      db.delete('products', id);
      setProducts(db.getAll<Product>('products'));
    }
  };

  const handleToggleStatus = (product: Product) => {
    const updated = { ...product, active: !product.active };
    db.save('products', updated);
    setProducts(db.getAll<Product>('products'));
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    const productData: Product = {
      id: editingProduct?.id || `prod-${Date.now()}`,
      name: formData.get('name') as string,
      slug: (formData.get('name') as string).toLowerCase().replace(/ /g, '-'),
      sku: formData.get('sku') as string,
      price: Number(formData.get('price')),
      salePrice: formData.get('salePrice') ? Number(formData.get('salePrice')) : undefined,
      stock: Number(formData.get('stock')),
      categoryId: formData.get('categoryId') as string,
      brandId: formData.get('brandId') as string,
      description: formData.get('description') as string,
      specs: formData.get('specs') as string,
      weight: Number(formData.get('weight')),
      width: Number(formData.get('width')),
      height: Number(formData.get('height')),
      length: Number(formData.get('length')),
      featured: formData.get('featured') === 'on',
      active: editingProduct ? editingProduct.active : true,
      images: editingProduct?.images || ['https://via.placeholder.com/600'],
      createdAt: editingProduct?.createdAt || new Date().toISOString(),
    };

    db.save('products', productData);
    setProducts(db.getAll<Product>('products'));
    setIsModalOpen(false);
    setEditingProduct(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-gray-900">Gerenciar Produtos</h1>
          <p className="text-sm text-gray-500">Adicione, edite ou remova itens do seu catálogo.</p>
        </div>
        <button 
          onClick={() => { setEditingProduct(null); setIsModalOpen(true); }}
          className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2 transition-all shadow-lg shadow-emerald-100"
        >
          <Plus className="w-5 h-5" /> NOVO PRODUTO
        </button>
      </div>

      {/* Filter Bar */}
      <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm">
        <div className="relative">
          <input 
            type="text"
            placeholder="Buscar por nome ou SKU..."
            className="w-full bg-gray-50 border-none rounded-xl py-3 pl-12 pr-4 text-sm focus:ring-2 focus:ring-emerald-500 outline-none transition-all"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Produto</th>
                <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Categoria</th>
                <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Estoque</th>
                <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Status</th>
                <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filteredProducts.map((product) => (
                <tr key={product.id} className="hover:bg-gray-50/50 transition-colors group">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-lg bg-gray-100 border border-gray-100 overflow-hidden flex-shrink-0">
                        <img src={product.images[0]} alt={product.name} className="w-full h-full object-cover" />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-gray-900 line-clamp-1">{product.name}</p>
                        <p className="text-[10px] text-gray-400 font-bold uppercase">{product.sku}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-xs font-medium text-gray-600 bg-gray-100 px-2 py-1 rounded-md">
                      {categories.find(c => c.id === product.categoryId)?.name || 'N/A'}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <Package className={`w-4 h-4 ${product.stock < 5 ? 'text-red-500' : 'text-emerald-500'}`} />
                      <span className={`text-sm font-bold ${product.stock < 5 ? 'text-red-600' : 'text-gray-700'}`}>
                        {product.stock}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <button 
                      onClick={() => handleToggleStatus(product)}
                      className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase transition-all ${
                        product.active 
                        ? 'bg-emerald-50 text-emerald-600 hover:bg-emerald-100' 
                        : 'bg-gray-100 text-gray-400 hover:bg-gray-200'
                      }`}
                    >
                      {product.active ? <Check className="w-3 h-3" /> : <X className="w-3 h-3" />}
                      {product.active ? 'Ativo' : 'Inativo'}
                    </button>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button 
                        onClick={() => { setEditingProduct(product); setIsModalOpen(true); }}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => handleDelete(product.id)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Form */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-emerald-950/40 backdrop-blur-sm" onClick={() => setIsModalOpen(false)}></div>
          <div className="relative bg-white w-full max-w-4xl rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200 max-h-[90vh] flex flex-col">
            <div className="p-6 border-b border-gray-100 flex items-center justify-between bg-gray-50">
              <h2 className="text-xl font-black text-gray-900 uppercase">
                {editingProduct ? 'Editar Produto' : 'Novo Produto'}
              </h2>
              <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-gray-200 rounded-full transition-colors">
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-8 overflow-y-auto custom-scrollbar space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-xs font-black text-gray-400 uppercase tracking-widest">Nome do Produto</label>
                  <input name="name" defaultValue={editingProduct?.name} required className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-emerald-500 outline-none" />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-black text-gray-400 uppercase tracking-widest">SKU (Código)</label>
                  <input name="sku" defaultValue={editingProduct?.sku} required className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-emerald-500 outline-none" />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-black text-gray-400 uppercase tracking-widest">Categoria</label>
                  <select name="categoryId" defaultValue={editingProduct?.categoryId} required className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-emerald-500 outline-none appearance-none">
                    <option value="">Selecione...</option>
                    {categories.map(cat => <option key={cat.id} value={cat.id}>{cat.name}</option>)}
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-black text-gray-400 uppercase tracking-widest">Marca</label>
                  <select name="brandId" defaultValue={editingProduct?.brandId} required className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-emerald-500 outline-none appearance-none">
                    <option value="">Selecione...</option>
                    {brands.map(brand => <option key={brand.id} value={brand.id}>{brand.name}</option>)}
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-black text-gray-400 uppercase tracking-widest">Preço de Custo / Base (R$)</label>
                  <input name="price" type="number" step="0.01" defaultValue={editingProduct?.price} required className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-emerald-500 outline-none" />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-black text-gray-400 uppercase tracking-widest">Preço Promocional (R$)</label>
                  <input name="salePrice" type="number" step="0.01" defaultValue={editingProduct?.salePrice} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-emerald-500 outline-none" />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-black text-gray-400 uppercase tracking-widest">Estoque Atual</label>
                  <input name="stock" type="number" defaultValue={editingProduct?.stock} required className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-emerald-500 outline-none" />
                </div>
                <div className="flex items-center gap-3 h-full pt-6">
                  <input type="checkbox" name="featured" id="featured" defaultChecked={editingProduct?.featured} className="w-5 h-5 text-emerald-600 rounded focus:ring-emerald-500" />
                  <label htmlFor="featured" className="text-sm font-bold text-gray-700">Destaque na Home</label>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-black text-gray-400 uppercase tracking-widest">Descrição Breve</label>
                <textarea name="description" defaultValue={editingProduct?.description} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-emerald-500 outline-none h-24" />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-black text-gray-400 uppercase tracking-widest">Especificações Técnicas</label>
                <textarea name="specs" defaultValue={editingProduct?.specs} placeholder="Ex: Processador: i7&#10;RAM: 16GB" className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-emerald-500 outline-none h-32" />
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-400 uppercase">Peso (kg)</label>
                  <input name="weight" type="number" step="0.01" defaultValue={editingProduct?.weight} className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-xs" />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-400 uppercase">Largura (cm)</label>
                  <input name="width" type="number" defaultValue={editingProduct?.width} className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-xs" />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-400 uppercase">Altura (cm)</label>
                  <input name="height" type="number" defaultValue={editingProduct?.height} className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-xs" />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-400 uppercase">Comp. (cm)</label>
                  <input name="length" type="number" defaultValue={editingProduct?.length} className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-xs" />
                </div>
              </div>

              <div className="flex justify-end gap-4 pt-4 border-t border-gray-100">
                <button 
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-6 py-3 text-sm font-bold text-gray-500 hover:text-gray-700 uppercase"
                >
                  Cancelar
                </button>
                <button 
                  type="submit"
                  className="bg-emerald-600 hover:bg-emerald-700 text-white px-10 py-3 rounded-xl font-bold uppercase text-sm shadow-lg shadow-emerald-100 transition-all"
                >
                  Salvar Produto
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
