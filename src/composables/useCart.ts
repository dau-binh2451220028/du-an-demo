import { ref, computed } from 'vue'
import type { CartItem, Product } from '../types'
import { VOUCHERS } from '../data/products'

const CART_STORAGE_KEY = 'binh_fashion_cart'

const savedCart = localStorage.getItem(CART_STORAGE_KEY)
const cartItems = ref<CartItem[]>(savedCart ? JSON.parse(savedCart) : [])
const isCartOpen = ref<boolean>(false)
const appliedVoucherCode = ref<string>('')

const saveCart = () => {
  localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cartItems.value))
}

export function useCart() {
  const openCart = () => {
    isCartOpen.value = true
  }

  const closeCart = () => {
    isCartOpen.value = false
  }

  const toggleCart = () => {
    isCartOpen.value = !isCartOpen.value
  }

  const addToCart = (
    product: Product,
    size: string,
    color: { name: string; code: string },
    quantity = 1
  ) => {
    const cartId = `${product.id}-${size}-${color.name}`
    const existingItem = cartItems.value.find((item) => item.cartId === cartId)

    if (existingItem) {
      existingItem.quantity += quantity
    } else {
      cartItems.value.push({
        cartId,
        productId: product.id,
        name: product.name,
        price: product.price,
        image: product.image,
        size,
        color,
        quantity
      })
    }
    saveCart()
  }

  const updateQuantity = (cartId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(cartId)
      return
    }
    const item = cartItems.value.find((item) => item.cartId === cartId)
    if (item) {
      item.quantity = quantity
      saveCart()
    }
  }

  const removeFromCart = (cartId: string) => {
    cartItems.value = cartItems.value.filter((item) => item.cartId !== cartId)
    saveCart()
  }

  const clearCart = () => {
    cartItems.value = []
    appliedVoucherCode.value = ''
    saveCart()
  }

  const subtotal = computed(() => {
    return cartItems.value.reduce((sum, item) => sum + item.price * item.quantity, 0)
  })

  const totalItemsCount = computed(() => {
    return cartItems.value.reduce((sum, item) => sum + item.quantity, 0)
  })

  const discount = computed(() => {
    if (!appliedVoucherCode.value) return 0
    const voucher = VOUCHERS[appliedVoucherCode.value.toUpperCase()]
    if (!voucher) return 0
    if (subtotal.value < voucher.minOrder) return 0

    if (voucher.discountPercent > 0) {
      return Math.round((subtotal.value * voucher.discountPercent) / 100)
    }
    return 0
  })

  const shippingFee = computed(() => {
    if (cartItems.value.length === 0) return 0
    if (subtotal.value >= 499000 || appliedVoucherCode.value.toUpperCase() === 'FREESHIP') {
      return 0
    }
    return 30000 // 30,000 VND standard shipping
  })

  const total = computed(() => {
    if (cartItems.value.length === 0) return 0
    return Math.max(0, subtotal.value - discount.value + shippingFee.value)
  })

  const applyVoucher = (code: string): { success: boolean; message: string } => {
    const cleanCode = code.trim().toUpperCase()
    const voucher = VOUCHERS[cleanCode]

    if (!voucher) {
      return { success: false, message: 'Mã giảm giá không hợp lệ hoặc đã hết hạn.' }
    }

    if (subtotal.value < voucher.minOrder) {
      return {
        success: false,
        message: `Đơn hàng tối thiểu ${voucher.minOrder.toLocaleString('vi-VN')}đ để áp dụng mã này.`
      }
    }

    appliedVoucherCode.value = cleanCode
    return { success: true, message: `Áp dụng thành công mã giảm giá ${cleanCode}!` }
  }

  const removeVoucher = () => {
    appliedVoucherCode.value = ''
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(price)
  }

  return {
    cartItems,
    isCartOpen,
    appliedVoucherCode,
    subtotal,
    discount,
    shippingFee,
    total,
    totalItemsCount,
    openCart,
    closeCart,
    toggleCart,
    addToCart,
    updateQuantity,
    removeFromCart,
    clearCart,
    applyVoucher,
    removeVoucher,
    formatPrice
  }
}

