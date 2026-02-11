
export enum UserRole {
  CUSTOMER = 'customer',
  ADMIN = 'admin'
}

export enum OrderStatus {
  PENDING = 'Aguardando pagamento',
  PAID = 'Pago',
  PREPARING = 'Em separação',
  SHIPPED = 'Enviado',
  DELIVERED = 'Entregue',
  CANCELLED = 'Cancelado'
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  createdAt: string;
}

export interface Address {
  id: string;
  userId: string;
  cep: string;
  rua: string;
  numero: string;
  complemento?: string;
  bairro: string;
  cidade: string;
  uf: string;
  principal: boolean;
}

export interface StoreSettings {
  name: string;
  logoUrl: string;
  email: string;
  phone: string;
  whatsapp?: string;
  address: {
    street: string;
    number: string;
    complement?: string;
    neighborhood: string;
    city: string;
    state: string;
    zip: string;
  };
  openingHours: string;
  socials: {
    facebook?: string;
    instagram?: string;
    twitter?: string;
    youtube?: string;
  };
}

export interface Department {
  id: string;
  name: string;
  slug: string;
  order: number;
  active: boolean;
}

export interface Category {
  id: string;
  departmentId: string;
  name: string;
  slug: string;
  order: number;
  active: boolean;
}

export interface Brand {
  id: string;
  name: string;
  slug: string;
}

export interface Product {
  id: string;
  categoryId: string;
  brandId: string;
  name: string;
  slug: string;
  description: string;
  specs: string;
  price: number;
  salePrice?: number;
  sku: string;
  stock: number;
  weight: number;
  width: number;
  height: number;
  length: number;
  featured: boolean;
  active: boolean;
  images: string[];
  createdAt: string;
}

export interface Banner {
  id: string;
  position: 'hero' | 'secondary_1' | 'secondary_2';
  title: string;
  subtitle: string;
  imageUrl: string;
  linkUrl: string;
  order: number;
  active: boolean;
}

export interface CartItem {
  id: string;
  productId: string;
  quantity: number;
  unitPrice: number;
  product?: Product;
}

export interface Order {
  id: string;
  userId: string;
  status: OrderStatus;
  subtotal: number;
  shippingCost: number;
  total: number;
  paymentMethod: string;
  paymentStatus: string;
  gateway: string;
  gatewayTransactionId: string;
  shippingService: string;
  shippingDeadlineDays: number;
  shippingAddressSnapshot: Address;
  trackingCode?: string;
  createdAt: string;
  items: OrderItem[];
}

export interface OrderItem {
  id: string;
  orderId: string;
  productId: string;
  nameSnapshot: string;
  unitPrice: number;
  quantity: number;
  skuSnapshot: string;
}
