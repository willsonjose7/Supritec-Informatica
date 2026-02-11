
import React from 'react';
import { ShoppingBag, Users, TrendingUp, Package, AlertCircle, ArrowUpRight, DollarSign } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { db } from '../../services/dbService';
import { Product, Order, OrderStatus } from '../../types';

const data = [
  { name: 'Seg', sales: 4000, revenue: 2400 },
  { name: 'Ter', sales: 3000, revenue: 1398 },
  { name: 'Qua', sales: 2000, revenue: 9800 },
  { name: 'Qui', sales: 2780, revenue: 3908 },
  { name: 'Sex', sales: 1890, revenue: 4800 },
  { name: 'Sáb', sales: 2390, revenue: 3800 },
  { name: 'Dom', sales: 3490, revenue: 4300 },
];

export const Dashboard: React.FC = () => {
  const products = db.getAll<Product>('products');
  const orders = db.getAll<Order>('orders');
  const lowStock = products.filter(p => p.stock < 5);
  const totalRevenue = orders.reduce((acc, o) => acc + o.total, 0);

  const stats = [
    { title: 'Vendas Totais', value: orders.length, icon: ShoppingBag, color: 'bg-emerald-500', trend: '+12%' },
    { title: 'Faturamento', value: `R$ ${totalRevenue.toLocaleString()}`, icon: DollarSign, color: 'bg-blue-500', trend: '+18%' },
    { title: 'Estoque Baixo', value: lowStock.length, icon: AlertCircle, color: 'bg-amber-500', trend: 'Ação necessária' },
    { title: 'Produtos Ativos', value: products.filter(p => p.active).length, icon: Package, color: 'bg-indigo-500', trend: '+2 novos' },
  ];

  return (
    <div className="p-8 space-y-8">
      <div>
        <h1 className="text-2xl font-black text-gray-900 mb-2">Dashboard Supritec</h1>
        <p className="text-gray-500">Visão geral da sua loja no momento.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <div key={i} className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 group hover:shadow-lg transition-all">
            <div className="flex items-center justify-between mb-4">
              <div className={`${stat.color} p-3 rounded-2xl text-white shadow-lg`}>
                <stat.icon className="w-6 h-6" />
              </div>
              <span className={`text-[10px] font-black px-2 py-1 rounded-full ${stat.trend.includes('+') ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-600'}`}>
                {stat.trend}
              </span>
            </div>
            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest">{stat.title}</h3>
            <p className="text-3xl font-black text-gray-900 mt-1">{stat.value}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Sales Chart */}
        <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-lg font-bold text-gray-900">Vendas nos últimos 7 dias</h3>
            <button className="text-xs font-bold text-emerald-600 hover:bg-emerald-50 px-3 py-1 rounded-full transition-all flex items-center gap-1">
              RELATÓRIO <ArrowUpRight className="w-3 h-3" />
            </button>
          </div>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f1f1" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#9ca3af'}} />
                <YAxis axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#9ca3af'}} />
                <Tooltip />
                <Area type="monotone" dataKey="revenue" stroke="#10b981" strokeWidth={3} fillOpacity={1} fill="url(#colorRevenue)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Recent Orders */}
        <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-lg font-bold text-gray-900">Pedidos Recentes</h3>
            <button className="text-xs font-bold text-emerald-600 hover:bg-emerald-50 px-3 py-1 rounded-full transition-all">VER TODOS</button>
          </div>
          <div className="space-y-4">
            {orders.slice(0, 5).length > 0 ? orders.slice(0, 5).map((order) => (
              <div key={order.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl border border-gray-100">
                <div className="flex items-center gap-4">
                  <div className="bg-white p-2 rounded-xl shadow-sm border border-gray-100">
                    <Package className="w-5 h-5 text-emerald-600" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-gray-900">#ORD-{order.id.slice(-6)}</p>
                    <p className="text-[10px] text-gray-400 font-bold uppercase">{new Date(order.createdAt).toLocaleDateString()}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-black text-gray-900">R$ {order.total.toLocaleString()}</p>
                  <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-widest">{order.status}</span>
                </div>
              </div>
            )) : (
              <div className="text-center py-20">
                <p className="text-gray-400 italic">Nenhum pedido realizado ainda.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
