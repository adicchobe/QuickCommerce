
import React, { useState, useEffect } from 'react';
import { Order, OrderStatus } from '../types';

interface TrackingViewProps {
  order: Order;
  onBack: () => void;
}

const TrackingView: React.FC<TrackingViewProps> = ({ order, onBack }) => {
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState<OrderStatus>(OrderStatus.PLACED);

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress(p => {
        if (p >= 100) return 100;
        const next = p + 0.5;
        
        // Fixed: Use correct OrderStatus enum values defined in types.ts
        if (next < 25) setStatus(OrderStatus.PLACED);
        else if (next < 45) setStatus(OrderStatus.PICKING);
        else if (next < 65) setStatus(OrderStatus.PACKED);
        else if (next < 95) setStatus(OrderStatus.DISPATCHED);
        else setStatus(OrderStatus.DELIVERED);
        
        return next;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const getStatusText = () => {
    switch (status) {
      case OrderStatus.PLACED: return "Order Received";
      // Fixed: Use correct OrderStatus enum values (PICKING instead of PREPARING)
      case OrderStatus.PICKING: return "Picking Ingredients";
      case OrderStatus.PACKED: return "Packing Your Order";
      // Fixed: Use DISPATCHED instead of OUT_FOR_DELIVERY
      case OrderStatus.DISPATCHED: return "Dash Partner is En Route";
      case OrderStatus.DELIVERED: return "Delivered!";
      default: return "";
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-4 space-y-8">
      <button onClick={onBack} className="text-gray-500 flex items-center gap-2 mb-4">
        <span>←</span> Back to Home
      </button>

      <div className="bg-white rounded-3xl p-8 shadow-2xl border relative overflow-hidden">
        <div className="relative z-10">
          <div className="flex justify-between items-start mb-12">
            <div>
              <p className="text-xs font-bold text-indigo-600 tracking-widest uppercase mb-1">Order #{order.id}</p>
              <h2 className="text-3xl font-extrabold">{getStatusText()}</h2>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-500">Arriving in</p>
              <p className="text-4xl font-black text-indigo-600">8 mins</p>
            </div>
          </div>

          <div className="space-y-12">
            {/* Delivery Progress Bar */}
            <div className="relative pt-1">
              <div className="overflow-hidden h-3 mb-4 text-xs flex rounded-full bg-indigo-100">
                <div style={{ width: `${progress}%` }} className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-indigo-600 transition-all duration-1000"></div>
              </div>
              <div className="flex justify-between text-xs text-gray-400 font-bold">
                <span className={status === OrderStatus.PLACED ? 'text-indigo-600' : ''}>Placed</span>
                {/* Fixed: Use valid OrderStatus values for highlight condition */}
                <span className={(status === OrderStatus.PICKING || status === OrderStatus.PACKED) ? 'text-indigo-600' : ''}>Prepared</span>
                <span className={status === OrderStatus.DISPATCHED ? 'text-indigo-600' : ''}>Shipped</span>
                <span className={status === OrderStatus.DELIVERED ? 'text-indigo-600' : ''}>Delivered</span>
              </div>
            </div>

            {/* Dash Partner Card */}
            <div className="bg-gray-50 rounded-2xl p-4 flex items-center gap-4 border border-gray-100">
              <img src="https://picsum.photos/seed/delivery/100/100" className="w-16 h-16 rounded-full border-4 border-white shadow-sm" alt="delivery" />
              <div className="flex-1">
                <h4 className="font-bold">Rahul S.</h4>
                <p className="text-xs text-gray-500">Your dedicated Dash Partner</p>
              </div>
              <div className="flex gap-2">
                <button className="bg-white w-10 h-10 flex items-center justify-center rounded-full shadow-sm border">📞</button>
                <button className="bg-white w-10 h-10 flex items-center justify-center rounded-full shadow-sm border">💬</button>
              </div>
            </div>
          </div>
        </div>

        {/* Decorative background elements */}
        <div className="absolute top-0 right-0 p-8 opacity-5">
          <span className="text-9xl">⚡</span>
        </div>
      </div>

      <div className="bg-white rounded-3xl p-6 shadow-md border">
        <h3 className="font-bold mb-4">Order Summary</h3>
        <div className="space-y-3">
          {order.items.map(item => (
            <div key={item.id} className="flex justify-between text-sm">
              <span className="text-gray-600">{item.quantity}x {item.name}</span>
              <span className="font-medium">${(item.price * item.quantity).toFixed(2)}</span>
            </div>
          ))}
          <div className="border-t pt-3 mt-3 flex justify-between font-bold text-lg">
            <span>Total Paid</span>
            <span className="text-indigo-600">${order.total.toFixed(2)}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TrackingView;
