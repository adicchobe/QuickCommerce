
export interface Product {
  id: string;
  name: string;
  price: number;
  category: string;
  image: string;
  unit: string;
  stock: number;
  description: string;
  demandTrend?: 'rising' | 'stable' | 'falling';
}

export interface CartItem extends Product {
  quantity: number;
}

export enum OrderStatus {
  PLACED = 'PLACED',
  PICKING = 'PICKING',
  PACKED = 'PACKED',
  DISPATCHED = 'DISPATCHED',
  DELIVERED = 'DELIVERED'
}

export interface Order {
  id: string;
  items: CartItem[];
  status: OrderStatus;
  timestamp: number;
  pickingStartTime?: number;
  packingEndTime?: number;
  eta: number;
  total: number;
  storeId: string;
  riderId?: string;
}

export interface DarkStore {
  id: string;
  name: string;
  address: string;
  activeRiders: number;
  idleRiders: number;
  ordersInQueue: number;
  inventoryHealth: number; // 0-100
}

export interface Category {
  id: string;
  name: string;
  icon: string;
  color: string;
}
