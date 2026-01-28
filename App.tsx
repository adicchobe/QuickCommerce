
import React, { useState, useMemo, useEffect } from 'react';
import { Product, CartItem, Order, Category, OrderStatus, DarkStore } from './types';
import { MOCK_PRODUCTS, CATEGORIES } from './constants';
import CartDrawer from './components/CartDrawer';
import AIAssistant from './components/AIAssistant';
import TrackingView from './components/TrackingView';
import MissionControl from './components/MissionControl';

const App: React.FC = () => {
  const [viewMode, setViewMode] = useState<'customer' | 'ops'>('customer');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [orders, setOrders] = useState<Order[]>([]);
  const [activeOrder, setActiveOrder] = useState<Order | null>(null);
  const [inventory, setInventory] = useState<Product[]>(MOCK_PRODUCTS);
  
  const [storeInfo] = useState<DarkStore>({
    id: 'DS-421',
    name: 'South-East Hub',
    address: '42nd Avenue, Block B',
    activeRiders: 14,
    idleRiders: 6,
    ordersInQueue: 0,
    inventoryHealth: 92
  });

  const filteredProducts = useMemo(() => {
    return inventory.filter(p => {
      const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          p.category.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = selectedCategory ? p.category === selectedCategory : true;
      return matchesSearch && matchesCategory;
    });
  }, [searchTerm, selectedCategory, inventory]);

  const addToCart = (product: Product) => {
    if (product.stock <= 0) return;
    setCart(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        return prev.map(item => item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item);
      }
      return [...prev, { ...product, quantity: 1 }];
    });
  };

  const updateCartQuantity = (id: string, delta: number) => {
    setCart(prev => prev.map(item => {
      if (item.id === id) {
        const newQty = Math.max(0, item.quantity + delta);
        return { ...item, quantity: newQty };
      }
      return item;
    }).filter(item => item.quantity > 0));
  };

  const handleCheckout = () => {
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const orderId = Math.random().toString(36).substr(2, 9).toUpperCase();
    const newOrder: Order = {
      id: orderId,
      items: [...cart],
      status: OrderStatus.PLACED,
      timestamp: Date.now(),
      eta: 10,
      total,
      storeId: storeInfo.id
    };

    // Supply-side logic: Deduct inventory
    setInventory(prev => prev.map(p => {
      const cartItem = cart.find(ci => ci.id === p.id);
      if (cartItem) return { ...p, stock: Math.max(0, p.stock - cartItem.quantity) };
      return p;
    }));

    setOrders(prev => [...prev, newOrder]);
    setActiveOrder(newOrder);
    setCart([]);
    setIsCartOpen(false);
  };

  const updateOrderStatus = (orderId: string, status: OrderStatus) => {
    setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status } : o));
    if (activeOrder && activeOrder.id === orderId) {
      setActiveOrder(prev => prev ? { ...prev, status } : null);
    }
  };

  if (viewMode === 'ops') {
    return (
      <div className="relative">
        <button 
          onClick={() => setViewMode('customer')}
          className="fixed bottom-6 right-6 z-50 bg-white text-slate-900 px-6 py-3 rounded-2xl font-black shadow-2xl border-4 border-slate-900"
        >
          Switch to Customer Mode
        </button>
        <MissionControl 
          orders={orders} 
          inventory={inventory} 
          store={storeInfo}
          onUpdateOrderStatus={updateOrderStatus}
        />
      </div>
    );
  }

  if (activeOrder && activeOrder.status !== OrderStatus.DELIVERED) {
    return <TrackingView order={activeOrder} onBack={() => setActiveOrder(null)} />;
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-white shadow-sm border-b px-4 py-3 md:px-8">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          <div className="flex flex-col">
            <h1 className="text-xl font-extrabold text-indigo-600 tracking-tight">QuickDash</h1>
            <p className="text-[10px] text-gray-500 flex items-center gap-1 font-medium">
              <span className="text-indigo-400">📍</span> {storeInfo.name}
            </p>
          </div>
          
          <div className="flex-1 max-w-xl hidden md:block">
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">🔍</span>
              <input 
                type="text" 
                placeholder="Search for fresh mangoes, milk, chips..." 
                className="w-full bg-gray-100 border-none rounded-2xl py-2.5 px-12 focus:ring-2 focus:ring-indigo-500 outline-none transition"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          <div className="flex gap-2">
            <button 
              onClick={() => setViewMode('ops')}
              className="bg-slate-100 text-slate-600 p-3 rounded-2xl hover:bg-slate-200 transition"
              title="Switch to Operations Mode"
            >
              ⚙️
            </button>
            <button 
              onClick={() => setIsCartOpen(true)}
              className="relative bg-indigo-600 text-white p-3 rounded-2xl shadow-lg shadow-indigo-100 flex items-center gap-2 hover:bg-indigo-700 transition"
            >
              <span className="text-xl">🛒</span>
              {cart.length > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-[10px] w-6 h-6 flex items-center justify-center rounded-full border-2 border-white font-bold">
                  {cart.reduce((s, i) => s + i.quantity, 0)}
                </span>
              )}
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-6 md:px-8 space-y-8">
        {/* Supply Promise Banner */}
        <div className="bg-indigo-600 rounded-[2.5rem] p-8 md:p-12 text-white flex flex-col md:flex-row items-center justify-between gap-8 relative overflow-hidden shadow-2xl">
          <div className="relative z-10 max-w-lg">
            <div className="bg-white/20 backdrop-blur-md px-4 py-1.5 rounded-full text-[10px] font-bold tracking-widest uppercase mb-6 inline-block">
              Proprietary Logistics Network
            </div>
            <h2 className="text-4xl md:text-5xl font-black mb-4 leading-tight">
              Hyper-local sourcing for <span className="text-yellow-300">extreme fresh.</span>
            </h2>
            <p className="text-indigo-100 mb-8 text-sm opacity-80 leading-relaxed">
              Our South-East hub just restocked 42 items. Direct from farm to dark store in under 4 hours.
            </p>
            <button className="bg-white text-indigo-900 px-8 py-4 rounded-2xl font-black text-lg shadow-xl hover:scale-105 transition">
              Explore Freshness ⚡
            </button>
          </div>
          <div className="lg:w-1/3 w-full">
            <AIAssistant onSearch={setSearchTerm} />
          </div>
          <div className="absolute -bottom-10 -right-10 opacity-10 pointer-events-none">
             <span className="text-[15rem] rotate-12 inline-block">🚚</span>
          </div>
        </div>

        {/* Categories */}
        <section>
          <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
            <button 
              onClick={() => setSelectedCategory(null)}
              className={`flex-shrink-0 px-6 py-3 rounded-2xl font-bold transition ${!selectedCategory ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-200' : 'bg-white border'}`}
            >
              All Items
            </button>
            {CATEGORIES.map(cat => (
              <button 
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`flex-shrink-0 flex items-center gap-2 px-6 py-3 rounded-2xl font-bold transition ${selectedCategory === cat.id ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-200' : 'bg-white border hover:border-indigo-300'}`}
              >
                <span>{cat.icon}</span>
                {cat.name}
              </button>
            ))}
          </div>
        </section>

        {/* Products */}
        <section>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            {filteredProducts.map(product => (
              <div key={product.id} className="group bg-white rounded-[2rem] p-4 border border-gray-100 shadow-sm hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 flex flex-col relative">
                {product.stock < 10 && (
                   <span className="absolute top-4 right-4 bg-red-100 text-red-600 text-[10px] font-black px-2 py-1 rounded-lg z-10 animate-pulse">
                     LOW STOCK
                   </span>
                )}
                <div className="relative overflow-hidden rounded-2xl aspect-square mb-4">
                  <img src={product.image} alt={product.name} className="w-full h-full object-cover group-hover:scale-110 transition duration-700" />
                </div>
                <div className="flex-1">
                  <p className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest mb-1">{product.category}</p>
                  <h4 className="font-bold text-gray-800 line-clamp-1 text-lg">{product.name}</h4>
                  <p className="text-xs text-gray-400 mb-4">{product.unit}</p>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xl font-black text-slate-900">${product.price.toFixed(2)}</span>
                  <button 
                    disabled={product.stock <= 0}
                    onClick={() => addToCart(product)}
                    className={`w-12 h-12 flex items-center justify-center rounded-2xl font-bold transition shadow-sm ${
                      product.stock > 0 
                      ? 'bg-indigo-600 text-white hover:bg-indigo-700' 
                      : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    }`}
                  >
                    {product.stock > 0 ? '+' : '×'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>

      <CartDrawer 
        isOpen={isCartOpen} 
        onClose={() => setIsCartOpen(false)} 
        items={cart} 
        onUpdateQuantity={updateCartQuantity}
        onCheckout={handleCheckout}
      />
    </div>
  );
};

export default App;
