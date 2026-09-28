<script setup lang="ts">
import { computed } from 'vue'
import { useWishlist } from '../composables/useWishlist'
import { useCart } from '../composables/useCart'
import { useToast } from '../composables/useToast'
import { PRODUCTS } from '../data/products'
import type { Product } from '../types'

const props = defineProps<{
  isOpen: boolean
}>()

const emit = defineEmits<{
  (e: 'close'): void
  (e: 'quickView', product: Product): void
}>()

const { wishlistIds, toggleWishlist } = useWishlist()
const { addToCart, formatPrice } = useCart()
const { showToast } = useToast()

const favoriteProducts = computed(() => {
  return PRODUCTS.filter((p) => wishlistIds.value.includes(p.id))
})

const handleAddToCart = (product: Product) => {
  const size = product.sizes[0] || 'F'
  const color = product.colors[0] || { name: 'Mặc định', code: '#000' }
  addToCart(product, size, color, 1)
  showToast('Đã thêm vào giỏ!', `Đã chuyển ${product.name} vào giỏ hàng.`, 'success')
}
</script>

<template>
  <div v-if="isOpen" class="modal-backdrop" @click.self="emit('close')">
    <div class="wishlist-modal">
      <div class="modal-header">
        <div class="header-left">
          <i class="fa-solid fa-heart text-accent"></i>
          <h3>Sản Phẩm Yêu Thích</h3>
          <span class="badge-count">({{ favoriteProducts.length }})</span>
        </div>
        <button class="modal-close" @click="emit('close')">
          <i class="fa-solid fa-xmark"></i>
        </button>
      </div>

      <div class="modal-body">
        <div v-if="favoriteProducts.length === 0" class="empty-wishlist">
          <i class="fa-regular fa-heart empty-icon"></i>
          <h4>Chưa có sản phẩm yêu thích</h4>
          <p>Nhấp vào biểu tượng trái tim trên sản phẩm để lưu lại xem sau nhé!</p>
          <button class="btn btn-primary" @click="emit('close')">
            Xem Sản Phẩm
          </button>
        </div>

        <div v-else class="wishlist-grid">
          <div v-for="product in favoriteProducts" :key="product.id" class="wishlist-card">
            <img :src="product.image" :alt="product.name" class="card-img" />

            <div class="card-info">
              <h4 class="title" @click="emit('quickView', product)">{{ product.name }}</h4>
              <span class="category">{{ product.categoryName }}</span>
              <div class="price">{{ formatPrice(product.price) }}</div>
            </div>

            <div class="card-actions">
              <button
                class="btn-add-cart"
                @click="handleAddToCart(product)"
                title="Thêm vào giỏ"
              >
                <i class="fa-solid fa-cart-plus"></i>
              </button>
              <button
                class="btn-remove"
                @click="toggleWishlist(product.id)"
                title="Xóa khỏi yêu thích"
              >
                <i class="fa-solid fa-trash-can"></i>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.wishlist-modal {
  background: #ffffff;
  border-radius: var(--radius-lg);
  max-width: 600px;
  width: 100%;
  max-height: 85vh;
  display: flex;
  flex-direction: column;
  box-shadow: var(--shadow-xl);
  animation: slideUp 0.25s ease-out;
  overflow: hidden;
}

.modal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20px 24px;
  border-bottom: 1px solid var(--border);
}

.header-left {
  display: flex;
  align-items: center;
  gap: 10px;
}

.header-left h3 {
  font-size: 1.2rem;
  font-weight: 800;
  color: var(--dark);
}

.text-accent {
  color: var(--accent);
  font-size: 1.25rem;
}

.badge-count {
  font-size: 0.9rem;
  color: var(--text-muted);
}

.modal-close {
  width: 34px;
  height: 34px;
  border-radius: 50%;
  background: #f1f5f9;
  color: var(--text-muted);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1rem;
}

.modal-body {
  padding: 24px;
  overflow-y: auto;
  flex: 1;
}

.empty-wishlist {
  text-align: center;
  padding: 40px 20px;
}

.empty-icon {
  font-size: 3rem;
  color: #cbd5e1;
  margin-bottom: 16px;
}

.empty-wishlist h4 {
  font-size: 1.15rem;
  font-weight: 700;
  color: var(--dark);
  margin-bottom: 6px;
}

.empty-wishlist p {
  font-size: 0.88rem;
  color: var(--text-muted);
  margin-bottom: 20px;
}

.wishlist-grid {
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.wishlist-card {
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 12px;
  border-radius: var(--radius-md);
  border: 1px solid var(--border);
  background: #f8fafc;
  transition: var(--transition);
}

.wishlist-card:hover {
  border-color: #cbd5e1;
  background: #ffffff;
}

.card-img {
  width: 60px;
  height: 72px;
  border-radius: var(--radius-sm);
  object-fit: cover;
  flex-shrink: 0;
}

.card-info {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.title {
  font-size: 0.9rem;
  font-weight: 700;
  color: var(--text-main);
  cursor: pointer;
}

.title:hover {
  color: var(--primary);
}

.category {
  font-size: 0.75rem;
  color: var(--text-muted);
}

.price {
  font-size: 0.95rem;
  font-weight: 700;
  color: var(--accent);
  margin-top: 4px;
}

.card-actions {
  display: flex;
  align-items: center;
  gap: 8px;
}

.btn-add-cart {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: var(--primary-light);
  color: var(--primary);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.95rem;
  transition: var(--transition);
}
.btn-add-cart:hover {
  background: var(--primary);
  color: #ffffff;
}

.btn-remove {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  color: #94a3b8;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.95rem;
}
.btn-remove:hover {
  color: #ef4444;
  background: #fee2e2;
}
</style>

