
import React, { useState } from 'react';
import { Order, OrderStatus, DarkStore, Product } from '../types';
import { getSupplyForecast } from '../geminiService';

interface MissionControlProps {
  orders: Order[];
  inventory: Product[];
  store: DarkStore;
  onUpdateOrderStatus: (orderId: string, status: OrderStatus) => void;
}

const MissionControl: React.FC<MissionControlProps> = ({ orders, inventory, store, onUpdateOrderStatus }) => {
  const [forecast, setForecast] = useState<any>(null);
  const [loadingForecast, setLoadingForecast] = useState(false);

  const handleForecast = async () => {
    setLoadingForecast(true);
    const result = await getSupplyForecast(inventory, orders);
    setForecast(result);
    setLoadingForecast(false);
  };

  const pendingOrders = orders.filter(o => o.status !== OrderStatus.DELIVERED);

  return (
    <div className="bg-slate-900 min-h-screen text-slate-100 p-6 font-mono">
      {/* Header Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        {[
          { label: 'SLA COMPLIANCE', value: '98.4%', color: 'text-green-400' },
          { label: 'IDLE RIDERS', value: store.idleRiders, color: 'text-blue-400' },
          { label: 'AVG PICK TIME', value: '42s', color: 'text-yellow-400' },
          { label: 'QUEUE DEPTH', value: pendingOrders.length, color: 'text-purple-400' },
        ].map(stat => (
          <div key={stat.label} className="bg-slate-800 border border-slate-700 p-4 rounded-xl">
            <p className="text-[10px] text-slate-400 font-bold mb-1 tracking-widest">{stat.label}</p>
            <p className={`text-2xl font-black ${stat.color}`}>{stat.value}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Fulfillment Queue */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-black flex items-center gap-2">
              <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
              LIVE FULFILLMENT QUEUE
            </h2>
          </div>

          <div className="space-y-3">
            {pendingOrders.length === 0 ? (
              <div className="bg-slate-800/50 border border-dashed border-slate-700 p-12 text-center rounded-2xl text-slate-500">
                Awaiting new orders...
              </div>
            ) : (
              pendingOrders.map(order => (
                <div key={order.id} className="bg-slate-800 border border-slate-700 p-4 rounded-2xl flex items-center justify-between hover:border-slate-500 transition">
                  <div className="flex items-center gap-4">
                    <div className="bg-slate-700 w-12 h-12 rounded-xl flex items-center justify-center font-bold">
                      #{order.id.slice(-3)}
                    </div>
                    <div>
                      <p className="text-sm font-bold">Order ID: {order.id}</p>
                      <p className="text-[10px] text-slate-400">Items: {order.items.length} | Value: ${order.total.toFixed(2)}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className={`text-[10px] font-bold px-2 py-1 rounded border ${
                      order.status === OrderStatus.PLACED ? 'border-red-500 text-red-500 bg-red-500/10' :
                      order.status === OrderStatus.PICKING ? 'border-yellow-500 text-yellow-500 bg-yellow-500/10' :
                      'border-green-500 text-green-500 bg-green-500/10'
                    }`}>
                      {order.status}
                    </span>
                    
                    {order.status === OrderStatus.PLACED && (
                      <button 
                        onClick={() => onUpdateOrderStatus(order.id, OrderStatus.PICKING)}
                        className="bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold py-2 px-4 rounded-lg transition"
                      >
                        Start Picking
                      </button>
                    )}
                    {order.status === OrderStatus.PICKING && (
                      <button 
                        onClick={() => onUpdateOrderStatus(order.id, OrderStatus.PACKED)}
                        className="bg-green-600 hover:bg-green-500 text-white text-xs font-bold py-2 px-4 rounded-lg transition"
                      >
                        Finish Packing
                      </button>
                    )}
                    {order.status === OrderStatus.PACKED && (
                      <button 
                        onClick={() => onUpdateOrderStatus(order.id, OrderStatus.DISPATCHED)}
                        className="bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold py-2 px-4 rounded-lg transition"
                      >
                        Assign Rider
                      </button>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* AI Supply Forecaster */}
        <div className="space-y-6">
          <div className="bg-indigo-900/30 border border-indigo-500/30 p-6 rounded-[2rem] relative overflow-hidden">
             <div className="relative z-10">
                <h3 className="text-lg font-black text-indigo-300 mb-2 flex items-center gap-2">
                  <span>🧠</span> AI SUPPLY ANALYST
                </h3>
                <p className="text-xs text-indigo-400 mb-4 leading-relaxed">
                  Predictive stock monitoring for Dark Store {store.name}. Use Gemini to analyze velocity.
                </p>
                <button 
                  disabled={loadingForecast}
                  onClick={handleForecast}
                  className="w-full bg-indigo-500 hover:bg-indigo-400 text-white font-bold py-3 rounded-xl transition shadow-lg shadow-indigo-500/20 disabled:opacity-50"
                >
                  {loadingForecast ? 'Analyzing Velocity...' : 'Generate Restock Plan'}
                </button>
             </div>

             {forecast && (
               <div className="mt-6 space-y-4 animate-fade-in bg-slate-900/80 p-4 rounded-xl border border-indigo-500/20">
                  <div>
                    <p className="text-[10px] text-slate-500 font-bold mb-2 tracking-widest uppercase">At Risk Items</p>
                    <div className="flex flex-wrap gap-2">
                      {forecast.atRiskItems.map((item: string) => (
                        <span key={item} className="bg-red-500/10 text-red-400 text-[10px] px-2 py-1 rounded border border-red-500/20">
                          {item}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="border-t border-slate-700 pt-3">
                    <p className="text-xs font-bold text-indigo-300 mb-1">Recommended Action:</p>
                    <p className="text-[11px] text-slate-300 leading-relaxed italic">"{forecast.recommendedAction}"</p>
                  </div>
                  <div className="flex items-center gap-2 mt-2">
                    <div className={`w-2 h-2 rounded-full ${forecast.urgencyLevel === 'high' ? 'bg-red-500' : 'bg-yellow-500'}`}></div>
                    <span className="text-[10px] font-bold uppercase tracking-wider">{forecast.urgencyLevel} PRIORITY</span>
                  </div>
               </div>
             )}
          </div>

          <div className="bg-slate-800 border border-slate-700 p-6 rounded-[2rem]">
            <h3 className="font-bold mb-4 text-slate-400 text-xs tracking-widest">INVENTORY HEALTH</h3>
            <div className="space-y-4">
              {inventory.slice(0, 5).map(item => (
                <div key={item.id}>
                  <div className="flex justify-between text-[11px] mb-1">
                    <span>{item.name}</span>
                    <span className={item.stock < 30 ? 'text-red-400 font-bold' : 'text-slate-500'}>{item.stock} {item.unit} left</span>
                  </div>
                  <div className="w-full h-1 bg-slate-700 rounded-full overflow-hidden">
                    <div 
                      className={`h-full transition-all duration-1000 ${item.stock < 30 ? 'bg-red-500' : 'bg-indigo-500'}`}
                      style={{ width: `${Math.min(100, item.stock)}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MissionControl;
