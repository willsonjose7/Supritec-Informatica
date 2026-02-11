
import React, { useState, useRef } from 'react';
import { Save, Building2, Phone, Mail, MapPin, Globe, Share2, Clock, ImageIcon, Upload, X } from 'lucide-react';
import { db } from '../../services/dbService';
import { StoreSettings } from '../../types';

export const AdminStoreSettings: React.FC = () => {
  const [settings, setSettings] = useState<StoreSettings>(db.getStoreSettings());
  const [isSaving, setIsSaving] = useState(false);
  const [logoPreview, setLogoPreview] = useState<string>(settings.logoUrl);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        alert("A imagem deve ter no máximo 2MB");
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        setLogoPreview(base64String);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSaving(true);
    
    const formData = new FormData(e.currentTarget);
    const updatedSettings: StoreSettings = {
      name: formData.get('name') as string,
      logoUrl: logoPreview, // Usar o preview (que pode ser a URL original ou o novo base64)
      email: formData.get('email') as string,
      phone: formData.get('phone') as string,
      whatsapp: formData.get('whatsapp') as string,
      openingHours: formData.get('openingHours') as string,
      address: {
        street: formData.get('street') as string,
        number: formData.get('number') as string,
        neighborhood: formData.get('neighborhood') as string,
        city: formData.get('city') as string,
        state: formData.get('state') as string,
        zip: formData.get('zip') as string,
      },
      socials: {
        facebook: formData.get('facebook') as string,
        instagram: formData.get('instagram') as string,
        twitter: formData.get('twitter') as string,
        youtube: formData.get('youtube') as string,
      }
    };

    db.saveStoreSettings(updatedSettings);
    setSettings(updatedSettings);
    
    setTimeout(() => {
      setIsSaving(false);
      alert('Configurações salvas com sucesso!');
    }, 500);
  };

  return (
    <div className="space-y-6 pb-20">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-gray-900">Configurações da Loja</h1>
          <p className="text-sm text-gray-500">Edite as informações institucionais e de contato.</p>
        </div>
      </div>

      <form onSubmit={handleSave} className="space-y-8">
        {/* Identidade Visual */}
        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-gray-50 flex items-center gap-3 bg-gray-50/50">
            <ImageIcon className="w-5 h-5 text-emerald-600" />
            <h2 className="text-sm font-black text-gray-900 uppercase tracking-widest">Identidade Visual</h2>
          </div>
          <div className="p-8">
             <div className="flex flex-col md:flex-row items-center gap-10">
                <div className="relative group">
                  <div className="w-48 h-48 rounded-3xl bg-gray-50 border-2 border-dashed border-gray-200 flex items-center justify-center overflow-hidden transition-all group-hover:border-emerald-300">
                    {logoPreview ? (
                      <img src={logoPreview} alt="Logo Preview" className="w-full h-full object-contain p-4" />
                    ) : (
                      <ImageIcon className="w-12 h-12 text-gray-300" />
                    )}
                  </div>
                  <button 
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="absolute -bottom-4 left-1/2 -translate-x-1/2 bg-emerald-600 text-white px-4 py-2 rounded-full text-[10px] font-black uppercase shadow-lg hover:bg-emerald-700 transition-all flex items-center gap-2"
                  >
                    <Upload className="w-3 h-3" /> Alterar Logo
                  </button>
                  <input 
                    type="file" 
                    ref={fileInputRef} 
                    className="hidden" 
                    accept="image/*" 
                    onChange={handleFileChange} 
                  />
                </div>
                <div className="flex-1 space-y-4">
                   <div className="space-y-2">
                      <label className="text-xs font-black text-gray-400 uppercase tracking-widest">Dica</label>
                      <p className="text-xs text-gray-500 italic">Recomendamos imagens em formato PNG com fundo transparente. Tamanho máximo: 2MB.</p>
                   </div>
                   <div className="space-y-2">
                      <label className="text-xs font-black text-gray-400 uppercase tracking-widest">URL Manual (Opcional)</label>
                      <input 
                        type="text"
                        name="logoUrl" 
                        value={logoPreview}
                        onChange={(e) => setLogoPreview(e.target.value)}
                        placeholder="https://exemplo.com/logo.png"
                        className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-emerald-500 outline-none" 
                      />
                   </div>
                </div>
             </div>
          </div>
        </div>

        {/* General Info */}
        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-gray-50 flex items-center gap-3 bg-gray-50/50">
            <Building2 className="w-5 h-5 text-emerald-600" />
            <h2 className="text-sm font-black text-gray-900 uppercase tracking-widest">Informações Gerais</h2>
          </div>
          <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-xs font-black text-gray-400 uppercase tracking-widest">Nome da Loja</label>
              <input name="name" defaultValue={settings.name} required className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-emerald-500 outline-none" />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-black text-gray-400 uppercase tracking-widest">Horário de Funcionamento</label>
              <input name="openingHours" defaultValue={settings.openingHours} required className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-emerald-500 outline-none" />
            </div>
          </div>
        </div>

        {/* Contact Info */}
        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-gray-50 flex items-center gap-3 bg-gray-50/50">
            <Phone className="w-5 h-5 text-emerald-600" />
            <h2 className="text-sm font-black text-gray-900 uppercase tracking-widest">Contato & Social</h2>
          </div>
          <div className="p-8 grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <label className="text-xs font-black text-gray-400 uppercase tracking-widest">Telefone Fixo</label>
              <input name="phone" defaultValue={settings.phone} required className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-emerald-500 outline-none" />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-black text-gray-400 uppercase tracking-widest">WhatsApp</label>
              <input name="whatsapp" defaultValue={settings.whatsapp} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-emerald-500 outline-none" />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-black text-gray-400 uppercase tracking-widest">E-mail SAC</label>
              <input name="email" defaultValue={settings.email} required className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-emerald-500 outline-none" />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-black text-gray-400 uppercase tracking-widest">Instagram</label>
              <input name="instagram" defaultValue={settings.socials.instagram} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-emerald-500 outline-none" />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-black text-gray-400 uppercase tracking-widest">Facebook</label>
              <input name="facebook" defaultValue={settings.socials.facebook} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-emerald-500 outline-none" />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-black text-gray-400 uppercase tracking-widest">Youtube</label>
              <input name="youtube" defaultValue={settings.socials.youtube} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-emerald-500 outline-none" />
            </div>
          </div>
        </div>

        {/* Location Info */}
        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-gray-50 flex items-center gap-3 bg-gray-50/50">
            <MapPin className="w-5 h-5 text-emerald-600" />
            <h2 className="text-sm font-black text-gray-900 uppercase tracking-widest">Endereço da Sede</h2>
          </div>
          <div className="p-8 grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="space-y-2 md:col-span-3">
              <label className="text-xs font-black text-gray-400 uppercase tracking-widest">Rua / Logradouro</label>
              <input name="street" defaultValue={settings.address.street} required className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-emerald-500 outline-none" />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-black text-gray-400 uppercase tracking-widest">Número</label>
              <input name="number" defaultValue={settings.address.number} required className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-emerald-500 outline-none" />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-black text-gray-400 uppercase tracking-widest">Bairro</label>
              <input name="neighborhood" defaultValue={settings.address.neighborhood} required className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-emerald-500 outline-none" />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-black text-gray-400 uppercase tracking-widest">Cidade</label>
              <input name="city" defaultValue={settings.address.city} required className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-emerald-500 outline-none" />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-black text-gray-400 uppercase tracking-widest">Estado (UF)</label>
              <input name="state" defaultValue={settings.address.state} required className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-emerald-500 outline-none" />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-black text-gray-400 uppercase tracking-widest">CEP</label>
              <input name="zip" defaultValue={settings.address.zip} required className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-emerald-500 outline-none" />
            </div>
          </div>
        </div>

        <div className="flex justify-end">
          <button 
            type="submit"
            disabled={isSaving}
            className="bg-emerald-600 hover:bg-emerald-700 text-white px-12 py-4 rounded-2xl font-black uppercase text-sm shadow-xl shadow-emerald-100 transition-all flex items-center gap-3 active:scale-95 disabled:opacity-50"
          >
            {isSaving ? 'Salvando...' : (
              <>
                <Save className="w-5 h-5" /> Salvar Alterações
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};
