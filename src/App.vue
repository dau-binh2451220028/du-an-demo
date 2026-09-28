<script setup lang="ts">
import { ref, computed } from 'vue'
import type { Product, Order } from './types'
import { PRODUCTS } from './data/products'
import { useCart } from './composables/useCart'

import Navbar from './components/Navbar.vue'
import HeroBanner from './components/HeroBanner.vue'
import ProductFilter from './components/ProductFilter.vue'
import ProductCard from './components/ProductCard.vue'
import ProductQuickView from './components/ProductQuickView.vue'
import CartDrawer from './components/CartDrawer.vue'
import CheckoutModal from './components/CheckoutModal.vue'
import OrderSuccessModal from './components/OrderSuccessModal.vue'
import WishlistModal from './components/WishlistModal.vue'
import AuthModal from './components/AuthModal.vue'
import ChatBot from './components/ChatBot.vue'
import ToastNotification from './components/ToastNotification.vue'
import Footer from './components/Footer.vue'

// State for filtering & searching
const searchQuery = ref('')
const selectedCategory = ref('all')
const selectedPriceRange = ref('all')
const selectedGender = ref('all')
const sortBy = ref('popular')

// Modals State
const quickViewProduct = ref<Product | null>(null)
const isWishlistOpen = ref(false)
const isCheckoutOpen = ref(false)
const isAuthModalOpen = ref(false)
const completedOrder = ref<Order | null>(null)

const { openCart, formatPrice } = useCart()

// Filtered & Sorted Products
const filteredProducts = computed(() => {
  return PRODUCTS.filter((item) => {
    // 1. Search Query filter
    if (searchQuery.value.trim()) {
      const q = searchQuery.value.toLowerCase().trim()
      const matchName = item.name.toLowerCase().includes(q)
      const matchCategory = item.categoryName.toLowerCase().includes(q)
      const matchDesc = item.description.toLowerCase().includes(q)
      if (!matchName && !matchCategory && !matchDesc) return false
    }

    // 2. Category filter
    if (selectedCategory.value !== 'all' && item.category !== selectedCategory.value) {
      return false
    }

    // 3. Price range filter
    if (selectedPriceRange.value === 'under-200k' && item.price >= 200000) return false
    if (
      selectedPriceRange.value === '200k-400k' &&
      (item.price < 200000 || item.price > 400000)
    )
      return false
    if (selectedPriceRange.value === 'over-400k' && item.price <= 400000) return false

    // 4. Gender filter
    if (selectedGender.value !== 'all') {
      if (selectedGender.value === 'nam' && item.gender !== 'nam' && item.gender !== 'unisex')
        return false
      if (selectedGender.value === 'nu' && item.gender !== 'nu' && item.gender !== 'unisex')
        return false
      if (selectedGender.value === 'unisex' && item.gender !== 'unisex') return false
    }

    return true
  }).sort((a, b) => {
    if (sortBy.value === 'price-asc') return a.price - b.price
    if (sortBy.value === 'price-desc') return b.price - a.price
    if (sortBy.value === 'rating') return b.rating - a.rating
    if (sortBy.value === 'newest') return (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0)
    // Default 'popular':
    return b.soldCount - a.soldCount
  })
})

// Hot Deals items
const hotDeals = computed(() => {
  return PRODUCTS.filter((p) => p.isHot || (p.discountPercent && p.discountPercent >= 25)).slice(0, 4)
})

// Methods
const handleResetFilters = () => {
  searchQuery.value = ''
  selectedCategory.value = 'all'
  selectedPriceRange.value = 'all'
  selectedGender.value = 'all'
  sortBy.value = 'popular'
}

const handleOpenQuickView = (product: Product) => {
  quickViewProduct.value = product
}

const handleCloseQuickView = () => {
  quickViewProduct.value = null
}

const handleBuyNow = () => {
  quickViewProduct.value = null
  isCheckoutOpen.value = true
}

const handleProceedCheckout = () => {
  isCheckoutOpen.value = true
}

const handleOrderSuccess = (order: Order) => {
  completedOrder.value = order
}

const scrollToSection = (id: string) => {
  const el = document.getElementById(id)
  if (el) {
    el.scrollIntoView({ behavior: 'smooth' })
  }
}
</script>

<template>
  <div class="app-layout">
    <!-- Navbar Component -->
    <Navbar
      v-model:searchQuery="searchQuery"
      @openWishlist="isWishlistOpen = true"
      @openAuth="isAuthModalOpen = true"
    />

    <!-- Hero Banner Component -->
    <HeroBanner
      @explore="scrollToSection('products-section')"
      @viewPromo="scrollToSection('promotion-section')"
    />

    <!-- Hot Promotion Banner Section -->
    <section id="promotion-section" class="promo-section">
      <div class="container">
        <div class="section-header">
          <div class="header-badge">
            <i class="fa-solid fa-fire text-accent"></i>
            <span>Ưu Đãi Trong Tuần</span>
          </div>
          <h2 class="section-title">Săn Deal Giá Tốt - Giảm Đến 34%</h2>
          <p class="section-desc">Số lượng có hạn, nhanh tay sở hữu những trang phục phong cách nhất với mức giá cực hời!</p>
        </div>

        <div class="promo-grid">
          <ProductCard
            v-for="product in hotDeals"
            :key="product.id"
            :product="product"
            @quickView="handleOpenQuickView"
          />
        </div>
      </div>
    </section>

    <!-- Main Catalog Section -->
    <main id="products-section" class="catalog-section">
      <div class="container">
        <!-- Section Title -->
        <div class="section-header">
          <div class="header-badge">
            <i class="fa-solid fa-sparkles text-primary"></i>
            <span>Bộ Sưu Tập Chính Hãng</span>
          </div>
          <h2 class="section-title">Tất Cả Sản Phẩm Thời Trang</h2>
          <p class="section-desc">
            Dễ dàng lựa chọn trang phục ưng ý với bộ lọc theo danh mục, khoảng giá và phong cách.
          </p>
        </div>

        <!-- Filter Component -->
        <ProductFilter
          v-model:selectedCategory="selectedCategory"
          v-model:selectedPriceRange="selectedPriceRange"
          v-model:selectedGender="selectedGender"
          v-model:sortBy="sortBy"
          :totalResults="filteredProducts.length"
          @resetFilters="handleResetFilters"
        />

        <!-- Products Grid -->
        <div v-if="filteredProducts.length > 0" class="products-grid">
          <ProductCard
            v-for="product in filteredProducts"
            :key="product.id"
            :product="product"
            @quickView="handleOpenQuickView"
          />
        </div>

        <!-- Empty Results Message -->
        <div v-else class="empty-products">
          <div class="empty-icon-wrap">
            <i class="fa-solid fa-magnifying-glass"></i>
          </div>
          <h3>Không tìm thấy sản phẩm phù hợp!</h3>
          <p>
            Rất tiếc chúng tôi không tìm thấy món đồ nào khớp với bộ lọc hiện tại của bạn.
            Hãy thử tìm kiếm với từ khóa khác hoặc xóa bộ lọc nhé.
          </p>
          <button class="btn btn-primary" @click="handleResetFilters">
            <i class="fa-solid fa-rotate-left"></i> Xóa Bộ Lọc & Xem Tất Cả
          </button>
        </div>
      </div>
    </main>

    <!-- Footer Component -->
    <Footer />

    <!-- Modals & Overlays -->
    <ProductQuickView
      :product="quickViewProduct"
      @close="handleCloseQuickView"
      @buyNow="handleBuyNow"
    />

    <CartDrawer
      @proceedCheckout="handleProceedCheckout"
    />

    <CheckoutModal
      v-if="isCheckoutOpen"
      @close="isCheckoutOpen = false"
      @orderSuccess="handleOrderSuccess"
    />

    <OrderSuccessModal
      :order="completedOrder"
      @close="completedOrder = null"
    />

    <WishlistModal
      :isOpen="isWishlistOpen"
      @close="isWishlistOpen = false"
      @quickView="handleOpenQuickView"
    />

    <!-- User Authentication Modal -->
    <AuthModal
      :isOpen="isAuthModalOpen"
      @close="isAuthModalOpen = false"
    />

    <!-- AI Fashion Assistant ChatBot -->
    <ChatBot
      @quickView="handleOpenQuickView"
    />

    <!-- Global Floating Toast Notifications -->
    <ToastNotification />
  </div>
</template>

<style scoped>
.app-layout {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

/* Sections Header */
.section-header {
  text-align: center;
  max-width: 650px;
  margin: 0 auto 36px;
}

.header-badge {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 6px 14px;
  background: #ffffff;
  border: 1px solid var(--border);
  border-radius: var(--radius-full);
  font-size: 0.8rem;
  font-weight: 700;
  color: var(--text-muted);
  box-shadow: var(--shadow-sm);
  margin-bottom: 12px;
}

.section-title {
  font-size: 2.1rem;
  font-weight: 800;
  color: var(--dark);
  letter-spacing: -0.02em;
  margin-bottom: 10px;
}

.section-desc {
  font-size: 0.95rem;
  color: var(--text-muted);
  line-height: 1.5;
}

/* Promo Section */
.promo-section {
  padding: 60px 0 30px;
  background: #ffffff;
  border-bottom: 1px solid var(--border);
}

.promo-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 24px;
}

/* Catalog Section */
.catalog-section {
  padding: 60px 0 80px;
  background-color: var(--bg-main);
  flex: 1;
}

.products-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 24px;
}

/* Empty State */
.empty-products {
  background: #ffffff;
  border-radius: var(--radius-lg);
  border: 1px dashed #cbd5e1;
  padding: 60px 24px;
  text-align: center;
  max-width: 500px;
  margin: 40px auto;
}

.empty-icon-wrap {
  width: 72px;
  height: 72px;
  border-radius: 50%;
  background: #f1f5f9;
  color: #94a3b8;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.8rem;
  margin: 0 auto 16px;
}

.empty-products h3 {
  font-size: 1.25rem;
  font-weight: 700;
  color: var(--dark);
  margin-bottom: 8px;
}

.empty-products p {
  font-size: 0.9rem;
  color: var(--text-muted);
  line-height: 1.5;
  margin-bottom: 24px;
}

/* Responsive Grid */
@media (max-width: 1200px) {
  .promo-grid, .products-grid {
    grid-template-columns: repeat(3, 1fr);
  }
}

@media (max-width: 860px) {
  .promo-grid, .products-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 16px;
  }
}

@media (max-width: 520px) {
  .promo-grid, .products-grid {
    grid-template-columns: 1fr;
  }
  .section-title {
    font-size: 1.65rem;
  }
}
</style>
