<script setup lang="ts">
import type { Product } from '../types'
import { useCart } from '../composables/useCart'
import { useWishlist } from '../composables/useWishlist'
import { useToast } from '../composables/useToast'

const props = defineProps<{
  product: Product
}>()

const emit = defineEmits<{
  (e: 'quickView', product: Product): void
}>()

const { addToCart, formatPrice } = useCart()
const { isInWishlist, toggleWishlist } = useWishlist()
const { showToast } = useToast()

const handleDirectAddToCart = () => {
  // Use first available size and color by default
  const defaultSize = props.product.sizes[0] || 'F'
  const defaultColor = props.product.colors[0] || { name: 'Mặc định', code: '#000000' }
  
  addToCart(props.product, defaultSize, defaultColor, 1)
  showToast(
    'Đã thêm vào giỏ!',
    `${props.product.name} (Size: ${defaultSize}) đã có trong giỏ hàng.`,
    'success'
  )
}

const handleToggleWishlist = () => {
  const isLiked = isInWishlist(props.product.id)
  toggleWishlist(props.product.id)
  if (!isLiked) {
    showToast('Đã thích!', `Đã thêm ${props.product.name} vào mục yêu thích.`, 'info')
  } else {
    showToast('Đã gỡ!', `Đã xóa khỏi mục yêu thích.`, 'warning')
  }
}
</script>

<template>
  <div class="product-card">
    <!-- Image & Overlay Actions -->
    <div class="card-media">
      <img :src="product.image" :alt="product.name" class="product-image" loading="lazy" />

      <!-- Badges -->
      <div class="card-badges">
        <span v-if="product.discountPercent" class="badge badge-sale">
          -{{ product.discountPercent }}%
        </span>
        <span v-if="product.isHot" class="badge badge-hot">
          Hot
        </span>
        <span v-if="product.isNew" class="badge badge-new">
          Mới
        </span>
      </div>

      <!-- Wishlist Button -->
      <button
        class="card-wishlist"
        :class="{ active: isInWishlist(product.id) }"
        @click.stop="handleToggleWishlist"
        :title="isInWishlist(product.id) ? 'Bỏ yêu thích' : 'Thêm vào yêu thích'"
      >
        <i :class="isInWishlist(product.id) ? 'fa-solid fa-heart' : 'fa-regular fa-heart'"></i>
      </button>

      <!-- Quick View Hover Button -->
      <div class="card-hover-actions">
        <button class="btn-quick-view" @click="emit('quickView', product)">
          <i class="fa-solid fa-eye"></i> Xem nhanh
        </button>
      </div>
    </div>

    <!-- Product Details -->
    <div class="card-body">
      <div class="category-meta">
        <span class="product-category">{{ product.categoryName }}</span>
        <span class="product-gender">
          <i v-if="product.gender === 'nam'" class="fa-solid fa-mars text-blue"></i>
          <i v-else-if="product.gender === 'nu'" class="fa-solid fa-venus text-pink"></i>
          <span v-else class="unisex-tag">Unisex</span>
        </span>
      </div>

      <h3 class="product-title" :title="product.name" @click="emit('quickView', product)">
        {{ product.name }}
      </h3>

      <!-- Ratings & Sold stats -->
      <div class="rating-bar">
        <div class="stars">
          <i class="fa-solid fa-star star-filled"></i>
          <span class="rating-value">{{ product.rating }}</span>
        </div>
        <span class="dot-separator">•</span>
        <span class="sold-count">Đã bán {{ product.soldCount }}</span>
      </div>

      <!-- Available Colors Preview -->
      <div class="color-swatches">
        <span
          v-for="color in product.colors.slice(0, 4)"
          :key="color.name"
          class="color-dot"
          :style="{ backgroundColor: color.code }"
          :title="color.name"
        ></span>
        <span v-if="product.colors.length > 4" class="more-colors">
          +{{ product.colors.length - 4 }}
        </span>
      </div>

      <!-- Price & Add To Cart Button -->
      <div class="card-footer">
        <div class="price-box">
          <span class="price-current">{{ formatPrice(product.price) }}</span>
          <span v-if="product.originalPrice > product.price" class="price-original">
            {{ formatPrice(product.originalPrice) }}
          </span>
        </div>

        <button
          class="btn-add-cart"
          @click="handleDirectAddToCart"
          title="Thêm nhanh vào giỏ hàng"
        >
          <i class="fa-solid fa-cart-plus"></i>
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.product-card {
  background: #ffffff;
  border-radius: var(--radius-lg);
  border: 1px solid var(--border);
  overflow: hidden;
  display: flex;
  flex-direction: column;
  transition: var(--transition);
  position: relative;
}

.product-card:hover {
  transform: translateY(-4px);
  box-shadow: var(--shadow-lg);
  border-color: #cbd5e1;
}

/* Card Media */
.card-media {
  position: relative;
  width: 100%;
  padding-top: 115%; /* Aspect ratio ~ 1:1.15 */
  overflow: hidden;
  background-color: #f1f5f9;
}

.product-image {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.5s ease;
}

.product-card:hover .product-image {
  transform: scale(1.06);
}

.card-badges {
  position: absolute;
  top: 12px;
  left: 12px;
  display: flex;
  flex-direction: column;
  gap: 6px;
  z-index: 2;
}

.card-wishlist {
  position: absolute;
  top: 12px;
  right: 12px;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1rem;
  color: #64748b;
  transition: var(--transition);
  z-index: 2;
  box-shadow: var(--shadow-sm);
}

.card-wishlist:hover {
  transform: scale(1.1);
  color: var(--accent);
}

.card-wishlist.active {
  color: var(--accent);
  background: #ffffff;
}

/* Quick View on Hover */
.card-hover-actions {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 12px;
  background: linear-gradient(0deg, rgba(15, 23, 42, 0.6) 0%, transparent 100%);
  display: flex;
  justify-content: center;
  opacity: 0;
  transform: translateY(10px);
  transition: var(--transition);
  z-index: 3;
}

.product-card:hover .card-hover-actions {
  opacity: 1;
  transform: translateY(0);
}

.btn-quick-view {
  background: #ffffff;
  color: var(--dark);
  font-weight: 700;
  font-size: 0.85rem;
  padding: 8px 18px;
  border-radius: var(--radius-full);
  display: inline-flex;
  align-items: center;
  gap: 6px;
  box-shadow: var(--shadow-md);
  transition: var(--transition);
}

.btn-quick-view:hover {
  background: var(--primary);
  color: #ffffff;
}

/* Card Body */
.card-body {
  padding: 16px;
  display: flex;
  flex-direction: column;
  flex: 1;
}

.category-meta {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 6px;
}

.product-category {
  font-size: 0.75rem;
  font-weight: 700;
  color: var(--primary);
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.text-blue {
  color: #3b82f6;
}

.text-pink {
  color: #ec4899;
}

.unisex-tag {
  font-size: 0.7rem;
  background: #f1f5f9;
  color: var(--text-muted);
  padding: 2px 6px;
  border-radius: 4px;
}

.product-title {
  font-size: 0.98rem;
  font-weight: 700;
  color: var(--text-main);
  line-height: 1.4;
  margin-bottom: 8px;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  cursor: pointer;
  transition: var(--transition);
}

.product-title:hover {
  color: var(--primary);
}

/* Ratings */
.rating-bar {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 0.82rem;
  color: var(--text-muted);
  margin-bottom: 10px;
}

.stars {
  display: flex;
  align-items: center;
  gap: 4px;
}

.star-filled {
  color: #f59e0b;
}

.rating-value {
  font-weight: 700;
  color: var(--dark);
}

.dot-separator {
  color: #cbd5e1;
}

/* Color Swatches */
.color-swatches {
  display: flex;
  align-items: center;
  gap: 6px;
  margin-bottom: 14px;
}

.color-dot {
  width: 14px;
  height: 14px;
  border-radius: 50%;
  border: 1px solid rgba(0, 0, 0, 0.15);
}

.more-colors {
  font-size: 0.7rem;
  color: var(--text-muted);
}

/* Footer & Price */
.card-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: auto;
  padding-top: 10px;
  border-top: 1px solid #f1f5f9;
}

.price-box {
  display: flex;
  flex-direction: column;
}

.btn-add-cart {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: var(--primary-light);
  color: var(--primary);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1rem;
  transition: var(--transition);
}

.btn-add-cart:hover {
  background: var(--primary);
  color: #ffffff;
  transform: scale(1.08);
}
</style>

