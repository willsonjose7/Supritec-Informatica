
import { 
  User, Department, Category, Brand, Product, Banner, Address, Order, CartItem, OrderStatus, UserRole, StoreSettings
} from '../types';
import { DEPARTMENTS, CATEGORIES, BRANDS, SEED_PRODUCTS, SEED_BANNERS, INITIAL_USER, INITIAL_STORE_SETTINGS } from '../constants';

class DbService {
  private prefix = 'supritec_';

  constructor() {
    this.init();
  }

  private init() {
    if (!localStorage.getItem(this.key('departments'))) {
      localStorage.setItem(this.key('departments'), JSON.stringify(DEPARTMENTS));
    }
    if (!localStorage.getItem(this.key('categories'))) {
      localStorage.setItem(this.key('categories'), JSON.stringify(CATEGORIES));
    }
    if (!localStorage.getItem(this.key('brands'))) {
      localStorage.setItem(this.key('brands'), JSON.stringify(BRANDS));
    }
    if (!localStorage.getItem(this.key('products'))) {
      localStorage.setItem(this.key('products'), JSON.stringify(SEED_PRODUCTS));
    }
    if (!localStorage.getItem(this.key('banners'))) {
      localStorage.setItem(this.key('banners'), JSON.stringify(SEED_BANNERS));
    }
    if (!localStorage.getItem(this.key('users'))) {
      localStorage.setItem(this.key('users'), JSON.stringify([INITIAL_USER]));
    }
    if (!localStorage.getItem(this.key('orders'))) {
      localStorage.setItem(this.key('orders'), JSON.stringify([]));
    }
    if (!localStorage.getItem(this.key('addresses'))) {
      localStorage.setItem(this.key('addresses'), JSON.stringify([]));
    }
    if (!localStorage.getItem(this.key('settings'))) {
      localStorage.setItem(this.key('settings'), JSON.stringify(INITIAL_STORE_SETTINGS));
    }
  }

  private key(k: string) { return this.prefix + k; }

  private get<T>(k: string): T[] {
    const data = localStorage.getItem(this.key(k));
    return data ? JSON.parse(data) : [];
  }

  private set<T>(k: string, data: T[]) {
    localStorage.setItem(this.key(k), JSON.stringify(data));
  }

  // Generic CRUD Helpers
  getAll<T>(table: string): T[] { return this.get<T>(table); }
  
  getById<T extends { id: string }>(table: string, id: string): T | undefined {
    return this.get<T>(table).find(i => i.id === id);
  }

  save<T extends { id: string }>(table: string, item: T) {
    const items = this.get<T>(table);
    const index = items.findIndex(i => i.id === item.id);
    if (index >= 0) {
      items[index] = item;
    } else {
      items.push(item);
    }
    this.set(table, items);
    return item;
  }

  delete(table: string, id: string) {
    const items = this.get<any>(table);
    this.set(table, items.filter((i: any) => i.id !== id));
  }

  // Settings
  getStoreSettings(): StoreSettings {
    const data = localStorage.getItem(this.key('settings'));
    return data ? JSON.parse(data) : INITIAL_STORE_SETTINGS;
  }

  saveStoreSettings(settings: StoreSettings) {
    localStorage.setItem(this.key('settings'), JSON.stringify(settings));
  }

  // Specialized Business Logic
  getProductsByCategory(categoryId: string) {
    return this.get<Product>('products').filter(p => p.categoryId === categoryId && p.active);
  }

  getProductsByDepartment(departmentId: string) {
    const cats = this.get<Category>('categories').filter(c => c.departmentId === departmentId);
    const catIds = cats.map(c => c.id);
    return this.get<Product>('products').filter(p => catIds.includes(p.categoryId) && p.active);
  }

  searchProducts(query: string) {
    const q = query.toLowerCase();
    return this.get<Product>('products').filter(p => 
      p.active && (p.name.toLowerCase().includes(q) || p.description.toLowerCase().includes(q))
    );
  }

  createOrder(orderData: Omit<Order, 'id' | 'createdAt' | 'status'>) {
    const orders = this.get<Order>('orders');
    const newOrder: Order = {
      ...orderData,
      id: `ord-${Date.now()}`,
      status: OrderStatus.PENDING,
      createdAt: new Date().toISOString(),
    };
    orders.push(newOrder);
    this.set('orders', orders);

    // Update Stocks
    const products = this.get<Product>('products');
    newOrder.items.forEach(item => {
      const p = products.find(prod => prod.id === item.productId);
      if (p) p.stock -= item.quantity;
    });
    this.set('products', products);

    return newOrder;
  }
}

export const db = new DbService();
