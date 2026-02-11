
import React, { useState } from 'react';
import { ShoppingBag, Trash2, ArrowRight, Truck, Ticket, ChevronLeft } from 'lucide-react';
import { CartItem, Product } from '../types';

interface CartProps {
  items: CartItem[];
  onUpdateQty: (pId: string, qty: number) => void;
  onRemove: (pId: string) => void;
  onNavigate: (page: string) => void;
}

export const Cart: React.FC<CartProps> = ({ items, onUpdateQty, onRemove, onNavigate }) => {
  const subtotal = items.reduce((acc, item) => acc + (item.unitPrice * item.quantity), 0);
  const [cep, setCep] = useState('');

  if (items.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-32 text-center space-y-6">
        <div className="w-24 h-24 bg-emerald-50 rounded-full flex items-center justify-center mx-auto mb-8">
          <ShoppingBag className="w-12 h-12 text-emerald-600" />
        </div>
        <h1 className="text-4xl font-black text-gray-900">Seu carrinho está vazio</h1>
        <p className="text-gray-500 max-w-md mx-auto">Que tal explorar nossas ofertas e encontrar a tecnologia que você precisa?</p>
        <button 
          onClick={() => onNavigate('catalogo')}
          className="bg-emerald-600 text-white px-10 py-4 rounded-full font-bold shadow-xl shadow-emerald-100 hover:bg-emerald-700 transition-all"
        >
          EXPLORAR PRODUTOS
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="flex items-center gap-4 mb-10">
        <button onClick={() => onNavigate('home')} className="p-2 hover:bg-emerald-50 rounded-full text-emerald-600 transition-colors">
          <ChevronLeft className="w-6 h-6" />
        </button>
        <h1 className="text-3xl font-black text-gray-900 uppercase tracking-tight">Meu Carrinho</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        {/* Items List */}
        <div className="lg:col-span-8 space-y-6">
          <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="hidden md:grid grid-cols-12 gap-4 p-6 border-b border-gray-50 text-[10px] font-black text-gray-400 uppercase tracking-widest">
              <div className="col-span-6">Produto</div>
              <div className="col-span-2 text-center">Preço</div>
              <div className="col-span-2 text-center">Qtd.</div>
              <div className="col-span-2 text-right">Total</div>
            </div>
            
            {items.map((item) => (
              <div key={item.id} className="grid grid-cols-1 md:grid-cols-12 gap-4 p-6 items-center border-b last:border-none border-gray-50 group">
                <div className="col-span-6 flex items-center gap-4">
                  <div className="w-20 h-20 rounded-xl overflow-hidden bg-gray-50 border border-gray-100 shrink-0">
                    <img src={item.product?.images[0]} className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 leading-tight mb-1">{item.product?.name}</h3>
                    <p className="text-[10px] text-gray-400 font-bold uppercase">{item.product?.sku}</p>
                    <button 
                      onClick={() => onRemove(item.productId)}
                      className="mt-2 text-xs font-bold text-red-500 hover:text-red-600 flex items-center gap-1"
                    >
                      <Trash2 className="w-3 h-3" /> Remover
                    </button>
                  </div>
                </div>
                <div className="col-span-2 text-center">
                  <span className="md:hidden text-xs text-gray-400 mr-2">Preço:</span>
                  <span className="text-sm font-bold text-gray-900">R$ {item.unitPrice.toLocaleString('pt-BR')}</span>
                </div>
                <div className="col-span-2 flex justify-center">
                  <div className="flex items-center border border-gray-200 rounded-xl p-1 bg-gray-50 h-10">
                    <button onClick={() => onUpdateQty(item.productId, Math.max(1, item.quantity - 1))} className="w-8 flex items-center justify-center font-bold">-</button>
                    <span className="w-8 text-center text-sm font-bold">{item.quantity}</span>
                    <button onClick={() => onUpdateQty(item.productId, item.quantity + 1)} className="w-8 flex items-center justify-center font-bold">+</button>
                  </div>
                </div>
                <div className="col-span-2 text-right">
                  <span className="md:hidden text-xs text-gray-400 mr-2">Total:</span>
                  <span className="text-sm font-black text-emerald-600">R$ {(item.unitPrice * item.quantity).toLocaleString('pt-BR')}</span>
                </div>
              </div>
            ))}
          </div>

          <div className="flex flex-col md:flex-row gap-6">
            <div className="flex-1 bg-white p-6 rounded-3xl border border-gray-100 shadow-sm space-y-4">
              <div className="flex items-center gap-2 text-xs font-black text-gray-400 uppercase tracking-widest">
                <Truck className="w-4 h-4" /> Calcular Frete
              </div>
              <div className="flex gap-2">
                <input 
                  type="text" 
                  value={cep}
                  onChange={(e) => setCep(e.target.value.replace(/\D/g, '').slice(0, 8))}
                  placeholder="00000-000"
                  className="flex-1 bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-emerald-500 outline-none"
                />
                <button className="bg-gray-900 text-white px-6 py-3 rounded-xl text-sm font-bold hover:bg-black transition-colors">OK</button>
              </div>
            </div>
            <div className="flex-1 bg-white p-6 rounded-3xl border border-gray-100 shadow-sm space-y-4">
              <div className="flex items-center gap-2 text-xs font-black text-gray-400 uppercase tracking-widest">
                <Ticket className="w-4 h-4" /> Cupom de Desconto
              </div>
              <div className="flex gap-2">
                <input 
                  type="text" 
                  placeholder="DIGITE SEU CUPOM"
                  className="flex-1 bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-emerald-500 outline-none"
                />
                <button className="bg-emerald-600 text-white px-6 py-3 rounded-xl text-sm font-bold hover:bg-emerald-700 transition-colors">APLICAR</button>
              </div>
            </div>
          </div>
        </div>

        {/* Summary Card */}
        <div className="lg:col-span-4">
          <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-xl space-y-6 sticky top-28">
            <h2 className="text-xl font-black text-gray-900 uppercase tracking-tight border-b border-gray-50 pb-4">Resumo do Pedido</h2>
            
            <div className="space-y-4">
              <div className="flex justify-between text-sm font-medium text-gray-500">
                <span>Subtotal ({items.length} itens)</span>
                <span>R$ {subtotal.toLocaleString('pt-BR')}</span>
              </div>
              <div className="flex justify-between text-sm font-medium text-gray-500">
                <span>Frete</span>
                <span className="text-emerald-600 font-bold">Calculado no próximo passo</span>
              </div>
              <div className="flex justify-between text-sm font-medium text-gray-500">
                <span>Descontos</span>
                <span>R$ 0,00</span>
              </div>
            </div>

            <div className="pt-6 border-t border-gray-100">
              <div className="flex justify-between items-baseline mb-2">
                <span className="text-gray-900 font-black text-lg">TOTAL</span>
                <div className="text-right">
                  <p className="text-3xl font-black text-emerald-600">R$ {subtotal.toLocaleString('pt-BR')}</p>
                </div>
              </div>
              <p className="text-xs text-gray-500 font-medium text-right">Ou em até 12x sem juros</p>
            </div>

            <button 
              onClick={() => onNavigate('checkout')}
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-5 rounded-2xl font-black text-lg shadow-xl shadow-emerald-100 flex items-center justify-center gap-3 transition-all active:scale-95"
            >
              FINALIZAR COMPRA <ArrowRight className="w-6 h-6" />
            </button>

            <button 
              onClick={() => onNavigate('catalogo')}
              className="w-full py-4 text-emerald-600 font-bold hover:text-emerald-700 transition-colors text-sm"
            >
              CONTINUAR COMPRANDO
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
