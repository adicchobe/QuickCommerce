
import { Category, Product } from './types';

export const CATEGORIES: Category[] = [
  { id: 'fruits', name: 'Fresh Fruits', icon: '🍎', color: 'bg-red-100' },
  { id: 'vegetables', name: 'Vegetables', icon: '🥦', color: 'bg-green-100' },
  { id: 'dairy', name: 'Dairy & Eggs', icon: '🥛', color: 'bg-blue-100' },
  { id: 'snacks', name: 'Snacks', icon: '🍪', color: 'bg-yellow-100' },
  { id: 'beverages', name: 'Beverages', icon: '🥤', color: 'bg-purple-100' },
  { id: 'meat', name: 'Meat & Fish', icon: '🥩', color: 'bg-orange-100' },
  { id: 'cleaning', name: 'Cleaning', icon: '🧼', color: 'bg-teal-100' },
];

export const MOCK_PRODUCTS: Product[] = [
  { id: '1', name: 'Alphonso Mangoes', price: 12.99, category: 'fruits', image: 'https://picsum.photos/seed/mango/400/400', unit: '1kg', stock: 45, description: 'Sweetest seasonal mangoes.' },
  { id: '2', name: 'Organic Broccoli', price: 2.49, category: 'vegetables', image: 'https://picsum.photos/seed/broccoli/400/400', unit: '500g', stock: 120, description: 'Freshly harvested organic broccoli.' },
  { id: '3', name: 'Whole Milk', price: 4.99, category: 'dairy', image: 'https://picsum.photos/seed/milk/400/400', unit: '1L', stock: 80, description: 'Farm fresh whole milk.' },
  { id: '4', name: 'Potato Chips', price: 1.99, category: 'snacks', image: 'https://picsum.photos/seed/chips/400/400', unit: '150g', stock: 200, description: 'Classic salted potato chips.' },
  { id: '5', name: 'Greek Yogurt', price: 3.50, category: 'dairy', image: 'https://picsum.photos/seed/yogurt/400/400', unit: '500g', stock: 35, description: 'Thick and creamy authentic Greek yogurt.' },
  { id: '6', name: 'Avocado Toast Box', price: 8.99, category: 'vegetables', image: 'https://picsum.photos/seed/avocado/400/400', unit: 'Box', stock: 15, description: 'Everything you need for perfect avocado toast.' },
  { id: '7', name: 'Sparkling Water', price: 5.99, category: 'beverages', image: 'https://picsum.photos/seed/water/400/400', unit: 'Pack of 6', stock: 60, description: 'Zero calorie crisp sparkling water.' },
  { id: '8', name: 'Chicken Breast', price: 9.99, category: 'meat', image: 'https://picsum.photos/seed/chicken/400/400', unit: '500g', stock: 25, description: 'Antibiotic-free lean chicken breast.' },
];
