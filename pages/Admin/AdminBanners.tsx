
import React, { useState } from 'react';
import { Plus, Edit2, Trash2, Check, X, ImageIcon, ExternalLink, ArrowUpDown } from 'lucide-react';
import { db } from '../../services/dbService';
import { Banner } from '../../types';

export const AdminBanners: React.FC = () => {
  const [banners, setBanners] = useState<Banner[]>(db.getAll<Banner>('banners'));
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBanner, setEditingBanner] = useState<Banner | null>(null);

  const handleDelete = (id: string) => {
    if (window.confirm('Deseja realmente remover este banner?')) {
      db.delete('banners', id);
      setBanners(db.getAll<Banner>('banners'));
    }
  };

  const handleToggleStatus = (banner: Banner) => {
    const updated = { ...banner, active: !banner.active };
    db.save('banners', updated);
    setBanners(db.getAll<Banner>('banners'));
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    const bannerData: Banner = {
      id: editingBanner?.id || `ban-${Date.now()}`,
      position: formData.get('position') as 'hero' | 'secondary_1' | 'secondary_2',
      title: formData.get('title') as string,
      subtitle: formData.get('subtitle') as string,
      imageUrl: formData.get('imageUrl') as string,
      linkUrl: formData.get('linkUrl') as string,
      order: Number(formData.get('order')),
      active: editingBanner ? editingBanner.active : true,
    };

    db.save('banners', bannerData);
    setBanners(db.getAll<Banner>('banners'));
    setIsModalOpen(false);
    setEditingBanner(null);
  };

  const getPositionLabel = (pos: string) => {
    switch(pos) {
      case 'hero': return 'Principal (Hero)';
      case 'secondary_1': return 'Secundário Superior';
      case 'secondary_2': return 'Secundário Inferior';
      default: return pos;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-gray-900">Gerenciar Banners</h1>
          <p className="text-sm text-gray-500">Controle o visual das seções de destaque na Home.</p>
        </div>
        <button 
          onClick={() => { setEditingBanner(null); setIsModalOpen(true); }}
          className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2 transition-all shadow-lg shadow-emerald-100"
        >
          <Plus className="w-5 h-5" /> NOVO BANNER
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {banners.sort((a,b) => a.order - b.order).map((banner) => (
          <div key={banner.id} className="bg-white rounded-[2rem] border border-gray-100 shadow-sm overflow-hidden group hover:shadow-xl transition-all flex flex-col">
            <div className="relative aspect-[21/9] bg-gray-100 overflow-hidden">
              <img src={banner.imageUrl} alt={banner.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
              <div className="absolute top-4 left-4 flex gap-2">
                <span className="bg-emerald-600 text-white text-[10px] font-black px-3 py-1 rounded-full uppercase">
                  {getPositionLabel(banner.position)}
                </span>
                <span className="bg-black/60 backdrop-blur text-white text-[10px] font-black px-3 py-1 rounded-full uppercase flex items-center gap-1">
                  Ordem: {banner.order}
                </span>
              </div>
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4">
                <button 
                  onClick={() => { setEditingBanner(banner); setIsModalOpen(true); }}
                  className="bg-white text-gray-900 p-4 rounded-2xl hover:bg-emerald-500 hover:text-white transition-all shadow-xl active:scale-95"
                >
                  <Edit2 className="w-6 h-6" />
                </button>
                <button 
                  onClick={() => handleDelete(banner.id)}
                  className="bg-white text-red-600 p-4 rounded-2xl hover:bg-red-500 hover:text-white transition-all shadow-xl active:scale-95"
                >
                  <Trash2 className="w-6 h-6" />
                </button>
              </div>
            </div>

            <div className="p-6 flex flex-col flex-1">
              <div className="flex justify-between items-start mb-2">
                <h3 className="text-xl font-black text-gray-900 line-clamp-1">{banner.title}</h3>
                <button 
                  onClick={() => handleToggleStatus(banner)}
                  className={`px-3 py-1 rounded-full text-[10px] font-black uppercase transition-all ${
                    banner.active 
                    ? 'bg-emerald-50 text-emerald-600' 
                    : 'bg-gray-100 text-gray-400'
                  }`}
                >
                  {banner.active ? 'Ativo' : 'Pausado'}
                </button>
              </div>
              <p className="text-sm text-gray-500 mb-6 line-clamp-2">{banner.subtitle}</p>
              
              <div className="mt-auto pt-6 border-t border-gray-50 flex items-center justify-between text-xs font-bold text-gray-400">
                <div className="flex items-center gap-2 truncate">
                  <ExternalLink className="w-4 h-4 text-emerald-500" />
                  <span className="truncate">{banner.linkUrl}</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-emerald-950/40 backdrop-blur-sm" onClick={() => setIsModalOpen(false)}></div>
          <div className="relative bg-white w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="p-6 border-b border-gray-100 flex items-center justify-between bg-gray-50">
              <h2 className="text-xl font-black text-gray-900 uppercase tracking-tight">
                {editingBanner ? 'Editar Banner' : 'Novo Banner'}
              </h2>
              <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-gray-200 rounded-full transition-colors">
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-8 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-xs font-black text-gray-400 uppercase tracking-widest">Posição no Layout</label>
                  <select name="position" defaultValue={editingBanner?.position} required className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-emerald-500 outline-none appearance-none">
                    <option value="hero">Banner Principal (Hero)</option>
                    <option value="secondary_1">Secundário Superior (Lado Esquerdo)</option>
                    <option value="secondary_2">Secundário Inferior (Lado Direito)</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-black text-gray-400 uppercase tracking-widest">Ordem de Exibição</label>
                  <input name="order" type="number" defaultValue={editingBanner?.order || 1} required className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-emerald-500 outline-none" />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-black text-gray-400 uppercase tracking-widest">Título do Banner</label>
                <input name="title" defaultValue={editingBanner?.title} required className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-emerald-500 outline-none" />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-black text-gray-400 uppercase tracking-widest">Subtítulo / Descrição</label>
                <input name="subtitle" defaultValue={editingBanner?.subtitle} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-emerald-500 outline-none" />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-black text-gray-400 uppercase tracking-widest">URL da Imagem</label>
                <div className="flex gap-4 items-center">
                  <div className="relative flex-1">
                    <input name="imageUrl" defaultValue={editingBanner?.imageUrl} required placeholder="https://exemplo.com/imagem.jpg" className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-11 pl-12 text-sm focus:ring-2 focus:ring-emerald-500 outline-none" />
                    <ImageIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-black text-gray-400 uppercase tracking-widest">URL de Destino (Link)</label>
                <input name="linkUrl" defaultValue={editingBanner?.linkUrl} placeholder="/catalogo" className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-emerald-500 outline-none" />
              </div>

              <div className="flex justify-end gap-4 pt-6 border-t border-gray-100">
                <button 
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-6 py-3 text-sm font-bold text-gray-500 hover:text-gray-700 uppercase"
                >
                  Descartar
                </button>
                <button 
                  type="submit"
                  className="bg-emerald-600 hover:bg-emerald-700 text-white px-10 py-3 rounded-xl font-bold uppercase text-sm shadow-xl shadow-emerald-100 transition-all active:scale-95"
                >
                  Salvar Alterações
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
