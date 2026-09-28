<script setup lang="ts">
import { ref } from 'vue'
import { useCart } from '../composables/useCart'
import { useWishlist } from '../composables/useWishlist'
import { useAuth } from '../composables/useAuth'
import { useToast } from '../composables/useToast'

const props = defineProps<{
  searchQuery: string
}>()

const emit = defineEmits<{
  (e: 'update:searchQuery', value: string): void
  (e: 'selectCategory', categoryId: string): void
  (e: 'openWishlist'): void
  (e: 'openAuth'): void
}>()

const { totalItemsCount, openCart, total, formatPrice } = useCart()
const { wishlistCount } = useWishlist()
const { currentUser, isAuthenticated, logout } = useAuth()
const { showToast } = useToast()

const isMobileMenuOpen = ref(false)
const isUserMenuOpen = ref(false)

const handleSearchInput = (e: Event) => {
  const target = e.target as HTMLInputElement
  emit('update:searchQuery', target.value)
}

const scrollToSection = (id: string) => {
  isMobileMenuOpen.value = false
  const element = document.getElementById(id)
  if (element) {
    element.scrollIntoView({ behavior: 'smooth' })
  }
}

const handleLogout = () => {
  logout()
  isUserMenuOpen.value = false
  showToast('Đã đăng xuất', 'Hẹn gặp lại bạn lần sau!', 'info')
}
</script>

<template>
  <header class="navbar-wrapper">
    <!-- Top Announcement Bar -->
    <div class="announcement-bar">
      <div class="container announcement-content">
        <span class="announcement-text">
          <i class="fa-solid fa-bolt text-yellow"></i>
          Ưu đãi khai trương: Nhập mã <strong>BINH20</strong> giảm ngay 20% cho đơn từ 300k!
        </span>
        <span class="student-tag">
          <i class="fa-solid fa-graduation-cap"></i> Ngô Quang Bình - Khóa 24CT1 (CNPM)
        </span>
      </div>
    </div>

    <!-- Main Header -->
    <nav class="navbar">
      <div class="container navbar-inner">
        <!-- Brand Logo -->
        <a href="#" class="brand-logo" @click.prevent="scrollToSection('hero-section')">
          <div class="logo-icon">
            <i class="fa-solid fa-bag-shopping"></i>
          </div>
          <div class="logo-text">
            <span class="logo-title">BÌNH <span>FASHION</span></span>
            <span class="logo-subtitle">24CT1 TRENDY STORE</span>
          </div>
        </a>

        <!-- Search Bar -->
        <div class="search-box">
          <i class="fa-solid fa-magnifying-glass search-icon"></i>
          <input
            type="text"
            placeholder="Tìm kiếm áo thun, sơ mi, quần jean..."
            :value="searchQuery"
            @input="handleSearchInput"
            class="search-input"
          />
          <button
            v-if="searchQuery"
            class="clear-search"
            @click="emit('update:searchQuery', '')"
            title="Xóa tìm kiếm"
          >
            <i class="fa-solid fa-xmark"></i>
          </button>
        </div>

        <!-- Navigation Links (Desktop) -->
        <ul class="nav-links">
          <li>
            <a href="#products-section" @click.prevent="scrollToSection('products-section')">
              Sản phẩm
            </a>
          </li>
          <li>
            <a href="#promotion-section" @click.prevent="scrollToSection('promotion-section')">
              Ưu đãi Hot
            </a>
          </li>
          <li>
            <a href="#about-section" @click.prevent="scrollToSection('about-section')">
              Về chúng tôi
            </a>
          </li>
        </ul>

        <!-- Action Buttons (Auth, Wishlist & Cart) -->
        <div class="nav-actions">
          <!-- Auth User Button or Dropdown -->
          <div v-if="isAuthenticated && currentUser" class="user-dropdown-wrapper">
            <button class="user-profile-btn" @click="isUserMenuOpen = !isUserMenuOpen">
              <img
                v-if="currentUser.avatar"
                :src="currentUser.avatar"
                :alt="currentUser.fullName"
                class="user-avatar"
              />
              <div v-else class="user-avatar-placeholder">
                {{ currentUser.fullName.charAt(0) }}
              </div>
              <span class="user-name">{{ currentUser.fullName.split(' ').slice(-1)[0] }}</span>
              <i class="fa-solid fa-chevron-down user-caret"></i>
            </button>

            <!-- Dropdown Menu -->
            <div v-if="isUserMenuOpen" class="user-dropdown-menu" @click.stop>
              <div class="user-menu-header">
                <strong>{{ currentUser.fullName }}</strong>
                <span>{{ currentUser.email }}</span>
              </div>
              <ul class="user-menu-list">
                <li>
                  <a href="#" @click.prevent="showToast('Thông tin', `SĐT: ${currentUser.phone} - ${currentUser.address || 'Đà Nẵng'}`, 'info'); isUserMenuOpen = false;">
                    <i class="fa-regular fa-user"></i> Tài khoản của tôi
                  </a>
                </li>
                <li>
                  <a href="#" @click.prevent="openCart(); isUserMenuOpen = false;">
                    <i class="fa-solid fa-bag-shopping"></i> Giỏ hàng của tôi
                  </a>
                </li>
                <li class="menu-divider"></li>
                <li>
                  <button class="logout-btn" @click="handleLogout">
                    <i class="fa-solid fa-arrow-right-from-bracket"></i> Đăng xuất
                  </button>
                </li>
              </ul>
            </div>
          </div>

          <!-- If not logged in: Login button -->
          <button v-else class="btn-auth-trigger" @click="emit('openAuth')">
            <i class="fa-regular fa-user"></i>
            <span>Đăng Nhập</span>
          </button>

          <!-- Wishlist Button -->
          <button
            class="action-btn"
            @click="emit('openWishlist')"
            title="Sản phẩm yêu thích"
          >
            <i class="fa-regular fa-heart"></i>
            <span v-if="wishlistCount > 0" class="action-badge">{{ wishlistCount }}</span>
          </button>

          <!-- Cart Button -->
          <button
            class="cart-btn"
            @click="openCart"
            title="Xem giỏ hàng"
          >
            <div class="cart-icon-wrap">
              <i class="fa-solid fa-cart-shopping"></i>
              <span v-if="totalItemsCount > 0" class="cart-badge">{{ totalItemsCount }}</span>
            </div>
            <div class="cart-info">
              <span class="cart-label">Giỏ hàng</span>
              <span class="cart-total">{{ formatPrice(total) }}</span>
            </div>
          </button>

          <!-- Mobile Hamburger Toggle -->
          <button
            class="mobile-toggle"
            @click="isMobileMenuOpen = !isMobileMenuOpen"
            aria-label="Toggle Menu"
          >
            <i :class="isMobileMenuOpen ? 'fa-solid fa-xmark' : 'fa-solid fa-bars'"></i>
          </button>
        </div>
      </div>

      <!-- Mobile Dropdown Menu -->
      <div v-if="isMobileMenuOpen" class="mobile-menu">
        <!-- Mobile User row -->
        <div v-if="isAuthenticated && currentUser" class="mobile-user-row">
          <div class="mobile-user-info">
            <img v-if="currentUser.avatar" :src="currentUser.avatar" class="user-avatar" />
            <div>
              <strong>{{ currentUser.fullName }}</strong>
              <p>{{ currentUser.email }}</p>
            </div>
          </div>
          <button class="btn btn-sm btn-outline" @click="handleLogout">
            Đăng xuất
          </button>
        </div>
        <div v-else class="mobile-auth-btn-wrap">
          <button class="btn btn-primary btn-sm" style="width: 100%;" @click="emit('openAuth'); isMobileMenuOpen = false;">
            <i class="fa-regular fa-user"></i> Đăng Nhập / Đăng Ký
          </button>
        </div>

        <div class="mobile-search">
          <input
            type="text"
            placeholder="Tìm kiếm quần áo..."
            :value="searchQuery"
            @input="handleSearchInput"
          />
        </div>

        <ul class="mobile-nav-links">
          <li>
            <a href="#products-section" @click.prevent="scrollToSection('products-section')">
              <i class="fa-solid fa-shirt"></i> Tất cả sản phẩm
            </a>
          </li>
          <li>
            <a href="#promotion-section" @click.prevent="scrollToSection('promotion-section')">
              <i class="fa-solid fa-fire text-orange"></i> Khuyến mãi nổi bật
            </a>
          </li>
          <li>
            <a href="#about-section" @click.prevent="scrollToSection('about-section')">
              <i class="fa-solid fa-circle-info"></i> Giới thiệu cửa hàng
            </a>
          </li>
        </ul>
      </div>
    </nav>
  </header>
</template>

<style scoped>
.navbar-wrapper {
  position: sticky;
  top: 0;
  z-index: 100;
  background: #ffffff;
  box-shadow: var(--shadow-sm);
}

.announcement-bar {
  background: linear-gradient(90deg, #1e1b4b 0%, #312e81 50%, #4338ca 100%);
  color: #ffffff;
  font-size: 0.8rem;
  padding: 6px 0;
}

.announcement-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 8px;
}

.text-yellow {
  color: #fbbf24;
}
.text-orange {
  color: #f97316;
}

.student-tag {
  background: rgba(255, 255, 255, 0.15);
  padding: 2px 10px;
  border-radius: var(--radius-full);
  font-size: 0.75rem;
}

.navbar {
  border-bottom: 1px solid var(--border);
  background: #ffffff;
}

.navbar-inner {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 20px;
  height: 72px;
}

/* Logo */
.brand-logo {
  display: flex;
  align-items: center;
  gap: 12px;
  text-decoration: none;
}

.logo-icon {
  width: 42px;
  height: 42px;
  border-radius: 12px;
  background: linear-gradient(135deg, #4f46e5 0%, #3b82f6 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  color: #ffffff;
  font-size: 1.2rem;
  box-shadow: 0 4px 10px rgba(79, 70, 229, 0.3);
}

.logo-text {
  display: flex;
  flex-direction: column;
}

.logo-title {
  font-size: 1.25rem;
  font-weight: 800;
  letter-spacing: -0.02em;
  color: var(--dark);
}

.logo-title span {
  color: var(--primary);
}

.logo-subtitle {
  font-size: 0.65rem;
  font-weight: 700;
  letter-spacing: 0.1em;
  color: var(--text-muted);
}

/* Search Bar */
.search-box {
  flex: 1;
  max-width: 400px;
  position: relative;
  display: flex;
  align-items: center;
}

.search-icon {
  position: absolute;
  left: 14px;
  color: var(--text-muted);
  font-size: 0.95rem;
  pointer-events: none;
}

.search-input {
  width: 100%;
  padding: 10px 38px 10px 40px;
  border-radius: var(--radius-full);
  border: 1.5px solid var(--border);
  background: #f8fafc;
  font-size: 0.9rem;
  color: var(--text-main);
  transition: var(--transition);
}

.search-input:focus {
  border-color: var(--primary);
  background: #ffffff;
  box-shadow: 0 0 0 3px rgba(79, 70, 229, 0.15);
}

.clear-search {
  position: absolute;
  right: 12px;
  color: var(--text-muted);
  font-size: 0.9rem;
  padding: 2px 6px;
  border-radius: 50%;
}
.clear-search:hover {
  color: var(--dark);
  background: #e2e8f0;
}

/* Nav Links */
.nav-links {
  display: flex;
  align-items: center;
  gap: 20px;
  list-style: none;
}

.nav-links a {
  font-weight: 600;
  font-size: 0.95rem;
  color: var(--text-main);
  transition: var(--transition);
  position: relative;
}

.nav-links a:hover {
  color: var(--primary);
}

/* Action Buttons */
.nav-actions {
  display: flex;
  align-items: center;
  gap: 12px;
}

/* Auth Trigger Button */
.btn-auth-trigger {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 14px;
  border-radius: var(--radius-full);
  border: 1px solid var(--border);
  background: #f8fafc;
  color: var(--text-main);
  font-size: 0.85rem;
  font-weight: 600;
  transition: var(--transition);
}
.btn-auth-trigger:hover {
  border-color: var(--primary);
  color: var(--primary);
  background: var(--primary-light);
}

/* User Dropdown */
.user-dropdown-wrapper {
  position: relative;
}

.user-profile-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 4px 10px 4px 4px;
  border-radius: var(--radius-full);
  border: 1px solid var(--border);
  background: #ffffff;
  transition: var(--transition);
}

.user-profile-btn:hover {
  border-color: var(--primary);
}

.user-avatar {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  object-fit: cover;
}

.user-avatar-placeholder {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: var(--primary);
  color: #ffffff;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  font-size: 0.85rem;
}

.user-name {
  font-size: 0.85rem;
  font-weight: 700;
  color: var(--dark);
}

.user-caret {
  font-size: 0.65rem;
  color: var(--text-muted);
}

.user-dropdown-menu {
  position: absolute;
  top: 46px;
  right: 0;
  width: 220px;
  background: #ffffff;
  border-radius: var(--radius-md);
  box-shadow: var(--shadow-lg);
  border: 1px solid var(--border);
  padding: 8px 0;
  z-index: 200;
  animation: slideUp 0.15s ease-out;
}

.user-menu-header {
  padding: 8px 16px 10px;
  border-bottom: 1px solid #f1f5f9;
  display: flex;
  flex-direction: column;
}

.user-menu-header strong {
  font-size: 0.88rem;
  color: var(--dark);
}

.user-menu-header span {
  font-size: 0.75rem;
  color: var(--text-muted);
}

.user-menu-list {
  list-style: none;
  padding: 6px 0;
}

.user-menu-list a, .logout-btn {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 8px 16px;
  font-size: 0.85rem;
  color: var(--text-main);
  width: 100%;
  transition: var(--transition);
}

.user-menu-list a:hover, .logout-btn:hover {
  background: #f8fafc;
  color: var(--primary);
}

.logout-btn {
  color: #ef4444;
}
.logout-btn:hover {
  background: #fef2f2;
  color: #ef4444;
}

.menu-divider {
  height: 1px;
  background: #f1f5f9;
  margin: 4px 0;
}

.action-btn {
  position: relative;
  width: 42px;
  height: 42px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid var(--border);
  color: var(--text-main);
  font-size: 1.1rem;
  transition: var(--transition);
  background: #ffffff;
}

.action-btn:hover {
  border-color: var(--primary);
  color: var(--primary);
  background: var(--primary-light);
}

.action-badge {
  position: absolute;
  top: -4px;
  right: -4px;
  background: var(--accent);
  color: #ffffff;
  font-size: 0.7rem;
  font-weight: 700;
  width: 19px;
  height: 19px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 2px solid #ffffff;
}

.cart-btn {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 6px 14px;
  background: linear-gradient(135deg, #4f46e5 0%, #3b82f6 100%);
  border-radius: var(--radius-full);
  color: #ffffff;
  transition: var(--transition);
  box-shadow: 0 4px 12px rgba(79, 70, 229, 0.25);
}

.cart-btn:hover {
  transform: translateY(-1px);
  box-shadow: 0 6px 16px rgba(79, 70, 229, 0.35);
}

.cart-icon-wrap {
  position: relative;
  font-size: 1.1rem;
}

.cart-badge {
  position: absolute;
  top: -8px;
  right: -10px;
  background: #ef4444;
  color: #ffffff;
  font-size: 0.7rem;
  font-weight: 700;
  min-width: 18px;
  height: 18px;
  padding: 0 4px;
  border-radius: var(--radius-full);
  display: flex;
  align-items: center;
  justify-content: center;
  border: 2px solid #4f46e5;
}

.cart-info {
  display: flex;
  flex-direction: column;
  text-align: left;
}

.cart-label {
  font-size: 0.68rem;
  opacity: 0.85;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.cart-total {
  font-size: 0.85rem;
  font-weight: 700;
}

.mobile-toggle {
  display: none;
  font-size: 1.3rem;
  color: var(--text-main);
  padding: 6px;
}

/* Mobile Dropdown */
.mobile-menu {
  display: none;
  background: #ffffff;
  border-top: 1px solid var(--border);
  padding: 16px 20px;
}

.mobile-user-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-bottom: 12px;
  margin-bottom: 12px;
  border-bottom: 1px solid var(--border);
}

.mobile-user-info {
  display: flex;
  align-items: center;
  gap: 10px;
}

.mobile-user-info strong {
  display: block;
  font-size: 0.9rem;
  color: var(--dark);
}

.mobile-user-info p {
  font-size: 0.75rem;
  color: var(--text-muted);
}

.mobile-auth-btn-wrap {
  margin-bottom: 14px;
}

.mobile-search input {
  width: 100%;
  padding: 10px 14px;
  border-radius: var(--radius-md);
  border: 1px solid var(--border);
  margin-bottom: 12px;
}

.mobile-nav-links {
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.mobile-nav-links a {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 1rem;
  font-weight: 600;
  color: var(--text-main);
  padding: 8px 0;
}

@media (max-width: 992px) {
  .nav-links, .cart-info {
    display: none;
  }
  .mobile-toggle {
    display: block;
  }
  .mobile-menu {
    display: block;
  }
  .search-box {
    display: none;
  }
}
</style>
