
import React from 'react';
import { Facebook, Instagram, Twitter, Youtube, Mail, Phone, MapPin, ShieldCheck, Truck, RotateCcw } from 'lucide-react';
import { db } from '../services/dbService';

export const Footer: React.FC = () => {
  const settings = db.getStoreSettings();

  return (
    <footer className="bg-white border-t border-gray-200 mt-20 pt-16">
      {/* Features Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16 border-b border-gray-100">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="flex items-center gap-4 group">
            <div className="bg-emerald-50 p-4 rounded-2xl group-hover:bg-emerald-600 transition-colors">
              <Truck className="w-8 h-8 text-emerald-600 group-hover:text-white" />
            </div>
            <div>
              <h4 className="font-bold text-gray-900">Entrega Rápida</h4>
              <p className="text-sm text-gray-500">Enviamos para todo o Brasil.</p>
            </div>
          </div>
          <div className="flex items-center gap-4 group">
            <div className="bg-emerald-50 p-4 rounded-2xl group-hover:bg-emerald-600 transition-colors">
              <ShieldCheck className="w-8 h-8 text-emerald-600 group-hover:text-white" />
            </div>
            <div>
              <h4 className="font-bold text-gray-900">Compra Segura</h4>
              <p className="text-sm text-gray-500">Seus dados protegidos com criptografia.</p>
            </div>
          </div>
          <div className="flex items-center gap-4 group">
            <div className="bg-emerald-50 p-4 rounded-2xl group-hover:bg-emerald-600 transition-colors">
              <RotateCcw className="w-8 h-8 text-emerald-600 group-hover:text-white" />
            </div>
            <div>
              <h4 className="font-bold text-gray-900">Devolução Grátis</h4>
              <p className="text-sm text-gray-500">Até 7 dias para troca ou devolução.</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
        {/* About */}
        <div>
          <div className="mb-6">
            <img src={settings.logoUrl} alt={settings.name} className="h-16 w-auto object-contain" />
          </div>
          <p className="text-sm text-gray-500 leading-relaxed mb-6">
            A {settings.name} é referência nacional em eletrônicos e tecnologia de ponta. Qualidade, confiança e os melhores preços do mercado desde sempre.
          </p>
          <div className="flex items-center gap-4">
            {settings.socials.facebook && <a href={settings.socials.facebook} className="bg-gray-100 p-2 rounded-full hover:bg-emerald-100 hover:text-emerald-600 transition-all"><Facebook className="w-5 h-5" /></a>}
            {settings.socials.instagram && <a href={settings.socials.instagram} className="bg-gray-100 p-2 rounded-full hover:bg-emerald-100 hover:text-emerald-600 transition-all"><Instagram className="w-5 h-5" /></a>}
            {settings.socials.twitter && <a href={settings.socials.twitter} className="bg-gray-100 p-2 rounded-full hover:bg-emerald-100 hover:text-emerald-600 transition-all"><Twitter className="w-5 h-5" /></a>}
            {settings.socials.youtube && <a href={settings.socials.youtube} className="bg-gray-100 p-2 rounded-full hover:bg-emerald-100 hover:text-emerald-600 transition-all"><Youtube className="w-5 h-5" /></a>}
          </div>
        </div>

        {/* Categories */}
        <div>
          <h4 className="font-bold text-gray-900 mb-6">Departamentos</h4>
          <ul className="space-y-3">
            <li><a href="#" className="text-sm text-gray-500 hover:text-emerald-600 transition-colors">Computadores</a></li>
            <li><a href="#" className="text-sm text-gray-500 hover:text-emerald-600 transition-colors">Celulares & Tablets</a></li>
            <li><a href="#" className="text-sm text-gray-500 hover:text-emerald-600 transition-colors">Consoles & Games</a></li>
            <li><a href="#" className="text-sm text-gray-500 hover:text-emerald-600 transition-colors">Áudio & Home Theater</a></li>
            <li><a href="#" className="text-sm text-gray-500 hover:text-emerald-600 transition-colors">Periféricos PC</a></li>
          </ul>
        </div>

        {/* Institutions */}
        <div>
          <h4 className="font-bold text-gray-900 mb-6">Ajuda & Suporte</h4>
          <ul className="space-y-3">
            <li><a href="#" className="text-sm text-gray-500 hover:text-emerald-600 transition-colors">Meus Pedidos</a></li>
            <li><a href="#" className="text-sm text-gray-500 hover:text-emerald-600 transition-colors">Trocas e Devoluções</a></li>
            <li><a href="#" className="text-sm text-gray-500 hover:text-emerald-600 transition-colors">Prazos de Entrega</a></li>
            <li><a href="#" className="text-sm text-gray-500 hover:text-emerald-600 transition-colors">Políticas de Privacidade</a></li>
            <li><a href="#" className="text-sm text-gray-500 hover:text-emerald-600 transition-colors">Trabalhe Conosco</a></li>
          </ul>
        </div>

        {/* Contact */}
        <div>
          <h4 className="font-bold text-gray-900 mb-6">Atendimento</h4>
          <ul className="space-y-4">
            <li className="flex items-start gap-3">
              <Phone className="w-5 h-5 text-emerald-600" />
              <div>
                <p className="text-sm font-bold text-gray-900">{settings.phone}</p>
                <p className="text-[10px] text-gray-500 uppercase font-bold">{settings.openingHours}</p>
              </div>
            </li>
            <li className="flex items-start gap-3">
              <Mail className="w-5 h-5 text-emerald-600" />
              <div>
                <p className="text-sm font-bold text-gray-900">{settings.email}</p>
                <p className="text-[10px] text-gray-500 uppercase font-bold">Respostas em até 24h úteis</p>
              </div>
            </li>
            <li className="flex items-start gap-3">
              <MapPin className="w-5 h-5 text-emerald-600" />
              <div>
                <p className="text-sm text-gray-500 leading-tight">
                  {settings.address.street}, {settings.address.number} - {settings.address.neighborhood}<br />
                  {settings.address.city} - {settings.address.state}, {settings.address.zip}
                </p>
              </div>
            </li>
          </ul>
        </div>
      </div>

      <div className="bg-gray-50 border-t border-gray-100 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <p className="text-xs text-gray-500 text-center md:text-left">
            © 2024 {settings.name.toUpperCase()} TECNOLOGIA LTDA. CNPJ: 00.000.000/0001-00. Preços e condições sujeitos a alterações sem aviso prévio.
          </p>
          <div className="flex items-center gap-2">
            <img src="https://via.placeholder.com/120x30?text=Payment+Methods" alt="Pagamentos" className="h-6 opacity-60" />
          </div>
        </div>
      </div>
    </footer>
  );
};
