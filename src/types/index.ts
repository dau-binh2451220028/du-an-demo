export interface Product {
  id: number
  name: string
  category: 'ao-thun' | 'so-mi' | 'quan-jean' | 'ao-khoac' | 'vay-dam' | 'phu-kien'
  categoryName: string
  gender: 'nam' | 'nu' | 'unisex'
  price: number
  originalPrice: number
  discountPercent?: number
  image: string
  images: string[]
  sizes: string[]
  colors: {
    name: string
    code: string
  }[]
  rating: number
  reviewsCount: number
  soldCount: number
  isNew?: boolean
  isHot?: boolean
  description: string
  details: {
    material: string
    fit: string
    origin: string
    instructions: string
  }
}

export interface CartItem {
  cartId: string // Combination of productId + size + color
  productId: number
  name: string
  price: number
  image: string
  size: string
  color: {
    name: string
    code: string
  }
  quantity: number
}

export interface OrderCustomer {
  fullName: string
  phone: string
  email: string
  address: string
  city: string
  district: string
  notes?: string
  paymentMethod: 'cod' | 'banking' | 'momo'
}

export interface Order {
  orderId: string
  createdAt: string
  customer: OrderCustomer
  items: CartItem[]
  subtotal: number
  discount: number
  shippingFee: number
  total: number
  voucherCode?: string
}

export interface ToastMessage {
  id: string
  type: 'success' | 'info' | 'warning' | 'error'
  title: string
  message: string
  timeout?: number
}

export interface User {
  id: string
  fullName: string
  email: string
  phone: string
  address?: string
  city?: string
  district?: string
  avatar?: string
}

export interface ChatMessage {
  id: string
  sender: 'bot' | 'user'
  text: string
  timestamp: string
  suggestedProducts?: Product[]
  quickOptions?: string[]
}
