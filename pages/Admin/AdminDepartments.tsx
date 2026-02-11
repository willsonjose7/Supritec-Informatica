
import React, { useState } from 'react';
import { Plus, Edit2, Trash2, Check, X, Layers, Hash } from 'lucide-react';
import { db } from '../../services/dbService';
import { Department } from '../../types';

export const AdminDepartments: React.FC = () => {
  const [departments, setDepartments] = useState<Department[]>(db.getAll<Department>('departments'));
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingDept, setEditingDept] = useState<Department | null>(null);

  const handleDelete = (id: string) => {
    if (window.confirm('Excluir este departamento? Isso não afetará os produtos, mas eles perderão a referência visual.')) {
      db.delete('departments', id);
      setDepartments(db.getAll<Department>('departments'));
    }
  };

  const handleToggleStatus = (dept: Department) => {
    const updated = { ...dept, active: !dept.active };
    db.save('departments', updated);
    setDepartments(db.getAll<Department>('departments'));
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    const name = formData.get('name') as string;
    const deptData: Department = {
      id: editingDept?.id || `dep-${Date.now()}`,
      name: name,
      slug: name.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/ /g, '-'),
      order: Number(formData.get('order')),
      active: editingDept ? editingDept.active : true,
    };

    db.save('departments', deptData);
    setDepartments(db.getAll<Department>('departments'));
    setIsModalOpen(false);
    setEditingDept(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-gray-900">Departamentos</h1>
          <p className="text-sm text-gray-500">Organize a navegação principal da sua loja.</p>
        </div>
        <button 
          onClick={() => { setEditingDept(null); setIsModalOpen(true); }}
          className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2 transition-all shadow-lg shadow-emerald-100"
        >
          <Plus className="w-5 h-5" /> NOVO DEPARTAMENTO
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {departments.sort((a,b) => a.order - b.order).map((dept) => (
          <div key={dept.id} className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm hover:shadow-md transition-all group relative">
            <div className="flex items-start justify-between mb-4">
              <div className="bg-emerald-50 p-3 rounded-2xl text-emerald-600">
                <Layers className="w-6 h-6" />
              </div>
              <div className="flex items-center gap-1">
                <button 
                  onClick={() => { setEditingDept(dept); setIsModalOpen(true); }}
                  className="p-2 text-gray-400 hover:text-emerald-600 transition-colors"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
                <button 
                  onClick={() => handleDelete(dept.id)}
                  className="p-2 text-gray-400 hover:text-red-600 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>

            <h3 className="text-lg font-bold text-gray-900 mb-1">{dept.name}</h3>
            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest flex items-center gap-1 mb-6">
               Slug: {dept.slug}
            </p>

            <div className="flex items-center justify-between mt-auto">
              <div className="flex items-center gap-1.5 text-xs font-bold text-gray-500">
                <Hash className="w-3.5 h-3.5" /> Ordem: {dept.order}
              </div>
              <button 
                onClick={() => handleToggleStatus(dept)}
                className={`px-3 py-1 rounded-full text-[10px] font-black uppercase transition-all ${
                  dept.active 
                  ? 'bg-emerald-50 text-emerald-600 hover:bg-emerald-100' 
                  : 'bg-gray-100 text-gray-400 hover:bg-gray-200'
                }`}
              >
                {dept.active ? 'Ativo' : 'Inativo'}
              </button>
            </div>
          </div>
        ))}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-emerald-950/40 backdrop-blur-sm" onClick={() => setIsModalOpen(false)}></div>
          <div className="relative bg-white w-full max-w-md rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="p-6 border-b border-gray-100 flex items-center justify-between bg-gray-50">
              <h2 className="text-lg font-black text-gray-900 uppercase">
                {editingDept ? 'Editar Depto' : 'Novo Depto'}
              </h2>
              <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-gray-200 rounded-full transition-colors">
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-8 space-y-6">
              <div className="space-y-2">
                <label className="text-xs font-black text-gray-400 uppercase tracking-widest">Nome</label>
                <input 
                  name="name" 
                  defaultValue={editingDept?.name} 
                  required 
                  placeholder="Ex: Celulares & Tablets"
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-emerald-500 outline-none" 
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-black text-gray-400 uppercase tracking-widest">Ordem de Exibição</label>
                <input 
                  name="order" 
                  type="number" 
                  defaultValue={editingDept?.order || departments.length + 1} 
                  required 
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-emerald-500 outline-none" 
                />
              </div>

              <div className="flex justify-end gap-4 pt-4">
                <button 
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-6 py-3 text-sm font-bold text-gray-500 hover:text-gray-700 uppercase"
                >
                  Cancelar
                </button>
                <button 
                  type="submit"
                  className="bg-emerald-600 hover:bg-emerald-700 text-white px-8 py-3 rounded-xl font-bold uppercase text-sm shadow-lg shadow-emerald-100 transition-all"
                >
                  Confirmar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
