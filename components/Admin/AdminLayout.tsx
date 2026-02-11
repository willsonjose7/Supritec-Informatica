
import React from 'react';
import { 
  LayoutDashboard, 
  Package, 
  Layers, 
  Image as ImageIcon, 
  ShoppingBag, 
  Settings, 
  ChevronRight,
  LogOut,
  ExternalLink,
  Store
} from 'lucide-react';

interface AdminLayoutProps {
  children: React.ReactNode;
  activeTab: string;
  onNavigate: (tab: string) => void;
  onExit: () => void;
}

export const AdminLayout: React.FC<AdminLayoutProps> = ({ children, activeTab, onNavigate, onExit }) => {
  const menuItems = [
    { id: 'admin-dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'admin-products', label: 'Produtos', icon: Package },
    { id: 'admin-departments', label: 'Departamentos', icon: Layers },
    { id: 'admin-banners', label: 'Banners', icon: ImageIcon },
    { id: 'admin-orders', label: 'Pedidos', icon: ShoppingBag },
    { id: 'admin-settings', label: 'Config. Loja', icon: Store },
  ];

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className="w-64 bg-emerald-950 text-white flex flex-col fixed inset-y-0 z-50">
        <div className="p-6 border-b border-emerald-900 bg-white flex flex-col items-center gap-2">
          <img src="logo.png" alt="Supritec" className="h-12 w-auto object-contain" />
          <p className="text-[10px] text-emerald-900 font-black uppercase tracking-widest bg-emerald-100 px-3 py-1 rounded-full">Painel Admin</p>
        </div>

        <nav className="flex-1 p-4 space-y-1 mt-4">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={`w-full flex items-center justify-between p-3 rounded-xl transition-all group ${
                activeTab === item.id 
                ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-900/40' 
                : 'text-emerald-100/60 hover:bg-white/5 hover:text-white'
              }`}
            >
              <div className="flex items-center gap-3">
                <item.icon className={`w-5 h-5 ${activeTab === item.id ? 'text-white' : 'text-emerald-500'}`} />
                <span className="text-sm font-bold">{item.label}</span>
              </div>
              <ChevronRight className={`w-4 h-4 transition-transform ${activeTab === item.id ? 'rotate-90 opacity-100' : 'opacity-0 group-hover:opacity-100'}`} />
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-emerald-900 space-y-2">
          <button 
            onClick={() => onNavigate('home')}
            className="w-full flex items-center gap-3 p-3 rounded-xl text-emerald-100/60 hover:bg-white/5 hover:text-white transition-all text-sm font-bold"
          >
            <ExternalLink className="w-5 h-5 text-emerald-500" /> Ver Loja
          </button>
          <button 
            onClick={onExit}
            className="w-full flex items-center gap-3 p-3 rounded-xl text-red-400 hover:bg-red-500/10 transition-all text-sm font-bold"
          >
            <LogOut className="w-5 h-5" /> Sair do Painel
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 ml-64 p-8">
        <div className="animate-in fade-in duration-500">
          {children}
        </div>
      </main>
    </div>
  );
};
