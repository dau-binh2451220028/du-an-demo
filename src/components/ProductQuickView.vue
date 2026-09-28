<script setup lang="ts">
import { ref, computed } from 'vue'
import type { Product } from '../types'
import { useCart } from '../composables/useCart'
import { useToast } from '../composables/useToast'

const props = defineProps<{
  product: Product | null
}>()

const emit = defineEmits<{
  (e: 'close'): void
  (e: 'buyNow'): void
}>()

const { addToCart, formatPrice } = useCart()
const { showToast } = useToast()

const selectedImage = ref<string>('')
const selectedSize = ref<string>('')
const selectedColor = ref<{ name: string; code: string }>({ name: '', code: '' })
const quantity = ref<number>(1)

// Initialize defaults when modal opens
if (props.product) {
  selectedImage.value = props.product.images[0] || props.product.image
  selectedSize.value = props.product.sizes[0] || 'F'
  selectedColor.value = props.product.colors[0] || { name: 'Mặc định', code: '#000000' }
  quantity.value = 1
}

const handleAddToCart = () => {
  if (!props.product) return

  addToCart(props.product, selectedSize.value, selectedColor.value, quantity.value)
  showToast(
    'Thêm vào giỏ thành công!',
    `Đã thêm ${quantity.value}x ${props.product.name} (Size ${selectedSize.value}, Màu ${selectedColor.value.name}) vào giỏ hàng.`,
    'success'
  )
}

const handleBuyNow = () => {
  if (!props.product) return
  addToCart(props.product, selectedSize.value, selectedColor.value, quantity.value)
  emit('close')
  emit('buyNow')
}

const increaseQty = () => {
  quantity.value++
}

const decreaseQty = () => {
  if (quantity.value > 1) {
    quantity.value--
  }
}
</script>

<template>
  <div v-if="product" class="modal-backdrop" @click.self="emit('close')">
    <div class="quickview-modal">
      <!-- Close Button -->
      <button class="modal-close-btn" @click="emit('close')" title="Đóng">
        <i class="fa-solid fa-xmark"></i>
      </button>

      <div class="modal-grid">
        <!-- Left: Image Gallery -->
        <div class="gallery-col">
          <div class="main-image-wrap">
            <img :src="selectedImage || product.image" :alt="product.name" class="main-image" />
            <span v-if="product.discountPercent" class="badge badge-sale modal-discount-badge">
              Giảm {{ product.discountPercent }}%
            </span>
          </div>

          <!-- Thumbnails -->
          <div v-if="product.images.length > 1" class="thumbnails-row">
            <div
              v-for="(img, idx) in product.images"
              :key="idx"
              :class="['thumbnail-item', { active: selectedImage === img }]"
              @click="selectedImage = img"
            >
              <img :src="img" :alt="product.name" />
            </div>
          </div>
        </div>

        <!-- Right: Info & Actions -->
        <div class="info-col">
          <div class="badge-category">{{ product.categoryName }}</div>

          <h2 class="modal-title">{{ product.name }}</h2>

          <!-- Rating & Sales -->
          <div class="meta-row">
            <div class="stars">
              <i class="fa-solid fa-star star-filled"></i>
              <span class="rating-num">{{ product.rating }}</span>
            </div>
            <span class="divider">|</span>
            <span class="review-text">{{ product.reviewsCount }} đánh giá</span>
            <span class="divider">|</span>
            <span class="sold-text">Đã bán {{ product.soldCount }}</span>
          </div>

          <!-- Price -->
          <div class="price-row">
            <span class="price-now">{{ formatPrice(product.price) }}</span>
            <span v-if="product.originalPrice > product.price" class="price-old">
              {{ formatPrice(product.originalPrice) }}
            </span>
            <span v-if="product.discountPercent" class="savings-tag">
              Tiết kiệm {{ formatPrice(product.originalPrice - product.price) }}
            </span>
          </div>

          <p class="product-description">{{ product.description }}</p>

          <!-- Color Selector -->
          <div class="selector-group">
            <div class="selector-label">
              Màu sắc: <strong>{{ selectedColor.name }}</strong>
            </div>
            <div class="color-options">
              <button
                v-for="color in product.colors"
                :key="color.name"
                :class="['color-btn', { active: selectedColor.name === color.name }]"
                :title="color.name"
                @click="selectedColor = color"
              >
                <span class="color-preview" :style="{ backgroundColor: color.code }"></span>
                <span>{{ color.name }}</span>
              </button>
            </div>
          </div>

          <!-- Size Selector -->
          <div class="selector-group">
            <div class="selector-label">
              Kích cỡ: <strong>Size {{ selectedSize }}</strong>
            </div>
            <div class="size-options">
              <button
                v-for="size in product.sizes"
                :key="size"
                :class="['size-btn', { active: selectedSize === size }]"
                @click="selectedSize = size"
              >
                {{ size }}
              </button>
            </div>
          </div>

          <!-- Quantity Selector -->
          <div class="selector-group">
            <div class="selector-label">Số lượng:</div>
            <div class="quantity-control">
              <button class="qty-btn" @click="decreaseQty" :disabled="quantity <= 1">
                <i class="fa-solid fa-minus"></i>
              </button>
              <span class="qty-display">{{ quantity }}</span>
              <button class="qty-btn" @click="increaseQty">
                <i class="fa-solid fa-plus"></i>
              </button>
            </div>
          </div>

          <!-- Action Buttons -->
          <div class="modal-actions">
            <button class="btn btn-outline btn-lg action-grow" @click="handleAddToCart">
              <i class="fa-solid fa-cart-plus"></i> Thêm Vào Giỏ
            </button>
            <button class="btn btn-primary btn-lg action-grow" @click="handleBuyNow">
              <i class="fa-solid fa-bolt"></i> Mua Ngay
            </button>
          </div>

          <!-- Details & Policy Accordion / Specs -->
          <div class="product-specs">
            <div class="spec-item">
              <i class="fa-solid fa-certificate"></i>
              <span><strong>Chất liệu:</strong> {{ product.details.material }}</span>
            </div>
            <div class="spec-item">
              <i class="fa-solid fa-arrows-to-dot"></i>
              <span><strong>Phom dáng:</strong> {{ product.details.fit }}</span>
            </div>
            <div class="spec-item">
              <i class="fa-solid fa-shield-halved"></i>
              <span><strong>Đổi trả:</strong> Hỗ trợ đổi size miễn phí trong 30 ngày</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.quickview-modal {
  background: #ffffff;
  border-radius: var(--radius-lg);
  max-width: 900px;
  width: 100%;
  max-height: 90vh;
  overflow-y: auto;
  position: relative;
  box-shadow: var(--shadow-xl);
  animation: slideUp 0.25s ease-out;
}

.modal-close-btn {
  position: absolute;
  top: 16px;
  right: 16px;
  width: 38px;
  height: 38px;
  border-radius: 50%;
  background: #f1f5f9;
  color: var(--text-muted);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.1rem;
  z-index: 10;
  transition: var(--transition);
}

.modal-close-btn:hover {
  background: #e2e8f0;
  color: var(--dark);
  transform: rotate(90deg);
}

.modal-grid {
  display: grid;
  grid-template-columns: 1fr 1.2fr;
  gap: 32px;
  padding: 32px;
}

/* Gallery */
.gallery-col {
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.main-image-wrap {
  position: relative;
  width: 100%;
  padding-top: 120%;
  border-radius: var(--radius-md);
  overflow: hidden;
  background: #f8fafc;
}

.main-image {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.modal-discount-badge {
  position: absolute;
  top: 12px;
  left: 12px;
  font-size: 0.85rem;
}

.thumbnails-row {
  display: flex;
  gap: 10px;
}

.thumbnail-item {
  width: 64px;
  height: 64px;
  border-radius: var(--radius-sm);
  overflow: hidden;
  border: 2px solid transparent;
  cursor: pointer;
  transition: var(--transition);
}

.thumbnail-item img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.thumbnail-item:hover, .thumbnail-item.active {
  border-color: var(--primary);
  transform: scale(1.05);
}

/* Info Column */
.info-col {
  display: flex;
  flex-direction: column;
}

.badge-category {
  display: inline-block;
  font-size: 0.8rem;
  font-weight: 700;
  text-transform: uppercase;
  color: var(--primary);
  letter-spacing: 0.05em;
  margin-bottom: 6px;
}

.modal-title {
  font-size: 1.45rem;
  font-weight: 800;
  color: var(--dark);
  line-height: 1.3;
  margin-bottom: 10px;
}

.meta-row {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 0.88rem;
  color: var(--text-muted);
  margin-bottom: 16px;
}

.stars {
  display: flex;
  align-items: center;
  gap: 4px;
}

.star-filled {
  color: #f59e0b;
}

.rating-num {
  font-weight: 700;
  color: var(--dark);
}

.divider {
  color: #cbd5e1;
}

.price-row {
  display: flex;
  align-items: baseline;
  gap: 12px;
  margin-bottom: 16px;
  padding: 12px 16px;
  background: #f8fafc;
  border-radius: var(--radius-md);
}

.price-now {
  font-size: 1.6rem;
  font-weight: 800;
  color: var(--accent);
}

.price-old {
  font-size: 1rem;
  color: var(--text-muted);
  text-decoration: line-through;
}

.savings-tag {
  font-size: 0.8rem;
  font-weight: 600;
  color: #10b981;
  background: #ecfdf5;
  padding: 2px 8px;
  border-radius: 4px;
}

.product-description {
  font-size: 0.92rem;
  color: #475569;
  line-height: 1.6;
  margin-bottom: 20px;
}

/* Selectors */
.selector-group {
  margin-bottom: 16px;
}

.selector-label {
  font-size: 0.88rem;
  color: var(--text-muted);
  margin-bottom: 8px;
}

.selector-label strong {
  color: var(--dark);
}

.color-options {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.color-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 6px 14px;
  border-radius: var(--radius-full);
  border: 1.5px solid var(--border);
  font-size: 0.85rem;
  font-weight: 600;
  color: var(--text-main);
  background: #ffffff;
  transition: var(--transition);
}

.color-preview {
  width: 14px;
  height: 14px;
  border-radius: 50%;
  border: 1px solid rgba(0, 0, 0, 0.15);
}

.color-btn:hover {
  border-color: var(--primary);
}

.color-btn.active {
  border-color: var(--primary);
  background: var(--primary-light);
  color: var(--primary);
}

.size-options {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.size-btn {
  min-width: 44px;
  height: 40px;
  padding: 0 12px;
  border-radius: var(--radius-md);
  border: 1.5px solid var(--border);
  font-size: 0.9rem;
  font-weight: 700;
  color: var(--text-main);
  background: #ffffff;
  transition: var(--transition);
}

.size-btn:hover {
  border-color: var(--primary);
}

.size-btn.active {
  border-color: var(--primary);
  background: var(--primary);
  color: #ffffff;
}

/* Quantity Control */
.quantity-control {
  display: inline-flex;
  align-items: center;
  border: 1.5px solid var(--border);
  border-radius: var(--radius-md);
  background: #ffffff;
}

.qty-btn {
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--text-main);
  font-size: 0.85rem;
  transition: var(--transition);
}

.qty-btn:hover:not(:disabled) {
  background: #f1f5f9;
}

.qty-btn:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

.qty-display {
  width: 44px;
  text-align: center;
  font-weight: 700;
  font-size: 0.95rem;
}

/* Modal Actions */
.modal-actions {
  display: flex;
  gap: 12px;
  margin-top: 10px;
  margin-bottom: 24px;
}

.action-grow {
  flex: 1;
}

/* Specs */
.product-specs {
  border-top: 1px solid var(--border);
  padding-top: 16px;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.spec-item {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 0.85rem;
  color: var(--text-muted);
}

.spec-item i {
  color: var(--primary);
  width: 18px;
}

.spec-item strong {
  color: var(--text-main);
}

@media (max-width: 768px) {
  .modal-grid {
    grid-template-columns: 1fr;
    padding: 20px;
    gap: 20px;
  }
  .modal-actions {
    flex-direction: column;
  }
}
</style>

