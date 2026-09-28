<script setup lang="ts">
import { ref, computed } from 'vue'
import { useCart } from '../composables/useCart'
import { useToast } from '../composables/useToast'

const emit = defineEmits<{
  (e: 'proceedCheckout'): void
}>()

const {
  cartItems,
  isCartOpen,
  closeCart,
  updateQuantity,
  removeFromCart,
  clearCart,
  subtotal,
  discount,
  shippingFee,
  total,
  totalItemsCount,
  appliedVoucherCode,
  applyVoucher,
  removeVoucher,
  formatPrice
} = useCart()

const { showToast } = useToast()

const voucherInput = ref('')

const handleApplyVoucher = (code?: string) => {
  const codeToApply = code || voucherInput.value
  if (!codeToApply) {
    showToast('Lỗi', 'Vui lòng nhập mã giảm giá.', 'warning')
    return
  }

  const result = applyVoucher(codeToApply)
  if (result.success) {
    showToast('Áp dụng thành công!', result.message, 'success')
    voucherInput.value = ''
  } else {
    showToast('Không thành công', result.message, 'error')
  }
}

// Free shipping progress calculation (target: 499k)
const freeShipTarget = 499000
const amountLeftForFreeShip = computed(() => Math.max(0, freeShipTarget - subtotal.value))
const freeShipPercent = computed(() => {
  if (subtotal.value >= freeShipTarget || appliedVoucherCode.value === 'FREESHIP') return 100
  return Math.min(100, Math.round((subtotal.value / freeShipTarget) * 100))
})
</script>

<template>
  <div v-if="isCartOpen" class="cart-backdrop" @click.self="closeCart">
    <div class="cart-drawer">
      <!-- Drawer Header -->
      <div class="drawer-header">
        <div class="header-left">
          <i class="fa-solid fa-bag-shopping text-primary"></i>
          <h3>Giỏ Hàng</h3>
          <span class="item-count-badge">{{ totalItemsCount }}</span>
        </div>
        <button class="drawer-close" @click="closeCart" title="Đóng">
          <i class="fa-solid fa-xmark"></i>
        </button>
      </div>

      <!-- Free Shipping Goal Banner -->
      <div class="shipping-goal-bar">
        <div class="goal-text">
          <i class="fa-solid fa-truck-fast"></i>
          <span v-if="freeShipPercent >= 100">
            Tuyệt vời! Bạn đã được <strong>Miễn phí giao hàng</strong> toàn quốc!
          </span>
          <span v-else>
            Mua thêm <strong>{{ formatPrice(amountLeftForFreeShip) }}</strong> để được Freeship!
          </span>
        </div>
        <div class="progress-track">
          <div class="progress-fill" :style="{ width: `${freeShipPercent}%` }"></div>
        </div>
      </div>

      <!-- Drawer Body: Empty State or Items List -->
      <div class="drawer-body">
        <div v-if="cartItems.length === 0" class="empty-cart">
          <div class="empty-icon">
            <i class="fa-solid fa-cart-arrow-down"></i>
          </div>
          <h4>Giỏ hàng đang trống!</h4>
          <p>Hãy dạo một vòng và chọn cho mình những bộ trang phục thật đẹp nhé.</p>
          <button class="btn btn-primary" @click="closeCart">
            <i class="fa-solid fa-arrow-left"></i> Khám Phá Sản Phẩm
          </button>
        </div>

        <div v-else class="cart-items-list">
          <div v-for="item in cartItems" :key="item.cartId" class="cart-item">
            <img :src="item.image" :alt="item.name" class="item-image" />

            <div class="item-details">
              <h4 class="item-name">{{ item.name }}</h4>

              <div class="item-options">
                <span class="opt-tag">Size: {{ item.size }}</span>
                <span class="opt-tag color-opt">
                  <span class="color-dot" :style="{ backgroundColor: item.color.code }"></span>
                  {{ item.color.name }}
                </span>
              </div>

              <div class="item-price-qty">
                <span class="item-price">{{ formatPrice(item.price) }}</span>

                <div class="item-stepper">
                  <button
                    class="step-btn"
                    @click="updateQuantity(item.cartId, item.quantity - 1)"
                    title="Giảm"
                  >
                    <i class="fa-solid fa-minus"></i>
                  </button>
                  <span class="step-num">{{ item.quantity }}</span>
                  <button
                    class="step-btn"
                    @click="updateQuantity(item.cartId, item.quantity + 1)"
                    title="Tăng"
                  >
                    <i class="fa-solid fa-plus"></i>
                  </button>
                </div>
              </div>
            </div>

            <!-- Remove Item -->
            <button
              class="btn-remove"
              @click="removeFromCart(item.cartId)"
              title="Xóa sản phẩm"
            >
              <i class="fa-regular fa-trash-can"></i>
            </button>
          </div>
        </div>
      </div>

      <!-- Drawer Footer (Calculations & Checkout) -->
      <div v-if="cartItems.length > 0" class="drawer-footer">
        <!-- Voucher Section -->
        <div class="voucher-box">
          <div v-if="appliedVoucherCode" class="active-voucher">
            <div class="voucher-tag">
              <i class="fa-solid fa-tag"></i>
              <span>Mã <strong>{{ appliedVoucherCode }}</strong> đã áp dụng</span>
            </div>
            <button class="btn-remove-voucher" @click="removeVoucher" title="Bỏ mã">
              <i class="fa-solid fa-xmark"></i>
            </button>
          </div>

          <div v-else class="voucher-input-group">
            <input
              type="text"
              placeholder="Nhập mã giảm giá (VD: BINH20)..."
              v-model="voucherInput"
              @keyup.enter="handleApplyVoucher()"
            />
            <button class="btn-apply-voucher" @click="handleApplyVoucher()">
              Áp dụng
            </button>
          </div>

          <!-- Suggested Vouchers -->
          <div v-if="!appliedVoucherCode" class="suggested-vouchers">
            <span class="suggest-label">Gợi ý:</span>
            <button class="code-chip" @click="handleApplyVoucher('BINH20')">
              BINH20 (-20%)
            </button>
            <button class="code-chip" @click="handleApplyVoucher('FREESHIP')">
              FREESHIP
            </button>
          </div>
        </div>

        <!-- Calculations Table -->
        <div class="summary-breakdown">
          <div class="summary-row">
            <span>Tạm tính</span>
            <span class="font-medium">{{ formatPrice(subtotal) }}</span>
          </div>

          <div v-if="discount > 0" class="summary-row discount-row">
            <span>Giảm giá</span>
            <span>-{{ formatPrice(discount) }}</span>
          </div>

          <div class="summary-row">
            <span>Phí vận chuyển</span>
            <span v-if="shippingFee === 0" class="text-green font-medium">Miễn phí</span>
            <span v-else class="font-medium">{{ formatPrice(shippingFee) }}</span>
          </div>

          <div class="summary-divider"></div>

          <div class="summary-row total-row">
            <span>Tổng thanh toán</span>
            <span class="total-amount">{{ formatPrice(total) }}</span>
          </div>
        </div>

        <!-- Checkout Action Button -->
        <div class="footer-actions">
          <button class="btn btn-primary btn-lg checkout-btn" @click="emit('proceedCheckout')">
            <i class="fa-solid fa-lock"></i> Tiến Hành Đặt Hàng
          </button>
          <button class="clear-cart-btn" @click="clearCart">
            <i class="fa-regular fa-trash-can"></i> Làm trống giỏ hàng
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.cart-backdrop {
  position: fixed;
  inset: 0;
  background-color: rgba(15, 23, 42, 0.65);
  backdrop-filter: blur(4px);
  z-index: 1000;
  display: flex;
  justify-content: flex-end;
  animation: fadeIn 0.2s ease-out;
}

.cart-drawer {
  width: 100%;
  max-width: 460px;
  height: 100vh;
  background: #ffffff;
  display: flex;
  flex-direction: column;
  box-shadow: -10px 0 30px rgba(0, 0, 0, 0.2);
  animation: slideInRight 0.3s cubic-bezier(0.16, 1, 0.3, 1);
}

/* Header */
.drawer-header {
  padding: 20px 24px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-bottom: 1px solid var(--border);
}

.header-left {
  display: flex;
  align-items: center;
  gap: 10px;
}

.header-left h3 {
  font-size: 1.25rem;
  font-weight: 800;
  color: var(--dark);
}

.text-primary {
  color: var(--primary);
  font-size: 1.2rem;
}

.item-count-badge {
  background: var(--primary-light);
  color: var(--primary);
  font-size: 0.8rem;
  font-weight: 700;
  padding: 2px 8px;
  border-radius: var(--radius-full);
}

.drawer-close {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: #f1f5f9;
  color: var(--text-muted);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.1rem;
  transition: var(--transition);
}

.drawer-close:hover {
  background: #e2e8f0;
  color: var(--dark);
}

/* Free Shipping Goal */
.shipping-goal-bar {
  background: #f8fafc;
  padding: 12px 24px;
  border-bottom: 1px solid var(--border);
}

.goal-text {
  font-size: 0.82rem;
  color: #334155;
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 8px;
}

.goal-text i {
  color: var(--primary);
}

.progress-track {
  width: 100%;
  height: 6px;
  background: #e2e8f0;
  border-radius: var(--radius-full);
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, #4f46e5 0%, #10b981 100%);
  border-radius: var(--radius-full);
  transition: width 0.4s ease;
}

/* Body */
.drawer-body {
  flex: 1;
  overflow-y: auto;
  padding: 20px 24px;
}

.empty-cart {
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: 40px 20px;
}

.empty-icon {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background: var(--primary-light);
  color: var(--primary);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2.2rem;
  margin-bottom: 20px;
}

.empty-cart h4 {
  font-size: 1.2rem;
  font-weight: 700;
  color: var(--dark);
  margin-bottom: 8px;
}

.empty-cart p {
  font-size: 0.9rem;
  color: var(--text-muted);
  margin-bottom: 24px;
}

/* Cart Items */
.cart-items-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.cart-item {
  display: flex;
  gap: 14px;
  padding-bottom: 16px;
  border-bottom: 1px solid #f1f5f9;
  position: relative;
}

.item-image {
  width: 72px;
  height: 90px;
  border-radius: var(--radius-md);
  object-fit: cover;
  background: #f8fafc;
  flex-shrink: 0;
}

.item-details {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.item-name {
  font-size: 0.9rem;
  font-weight: 700;
  color: var(--text-main);
  line-height: 1.3;
  margin-bottom: 4px;
}

.item-options {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 8px;
}

.opt-tag {
  font-size: 0.75rem;
  background: #f1f5f9;
  color: #475569;
  padding: 2px 8px;
  border-radius: 4px;
  font-weight: 600;
}

.color-opt {
  display: flex;
  align-items: center;
  gap: 4px;
}

.color-dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  border: 1px solid rgba(0, 0, 0, 0.2);
}

.item-price-qty {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.item-price {
  font-size: 0.95rem;
  font-weight: 700;
  color: var(--accent);
}

.item-stepper {
  display: flex;
  align-items: center;
  border: 1px solid var(--border);
  border-radius: var(--radius-sm);
  background: #ffffff;
}

.step-btn {
  width: 28px;
  height: 28px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.75rem;
  color: var(--text-main);
}
.step-btn:hover {
  background: #f1f5f9;
}

.step-num {
  width: 30px;
  text-align: center;
  font-size: 0.85rem;
  font-weight: 700;
}

.btn-remove {
  color: #94a3b8;
  font-size: 1rem;
  align-self: flex-start;
  padding: 4px;
  transition: var(--transition);
}
.btn-remove:hover {
  color: #ef4444;
}

/* Footer */
.drawer-footer {
  border-top: 1px solid var(--border);
  background: #ffffff;
  padding: 20px 24px;
  box-shadow: 0 -4px 10px rgba(0, 0, 0, 0.03);
}

/* Voucher */
.voucher-box {
  margin-bottom: 16px;
}

.voucher-input-group {
  display: flex;
  gap: 8px;
}

.voucher-input-group input {
  flex: 1;
  padding: 8px 12px;
  border: 1px solid var(--border);
  border-radius: var(--radius-md);
  font-size: 0.85rem;
}

.voucher-input-group input:focus {
  border-color: var(--primary);
}

.btn-apply-voucher {
  background: var(--dark);
  color: #ffffff;
  font-weight: 600;
  font-size: 0.85rem;
  padding: 8px 16px;
  border-radius: var(--radius-md);
  transition: var(--transition);
}
.btn-apply-voucher:hover {
  background: #334155;
}

.active-voucher {
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: #ecfdf5;
  border: 1px solid #a7f3d0;
  padding: 8px 12px;
  border-radius: var(--radius-md);
}

.voucher-tag {
  display: flex;
  align-items: center;
  gap: 8px;
  color: #065f46;
  font-size: 0.85rem;
}

.btn-remove-voucher {
  color: #065f46;
  font-size: 0.9rem;
}

.suggested-vouchers {
  display: flex;
  align-items: center;
  gap: 6px;
  margin-top: 8px;
  flex-wrap: wrap;
}

.suggest-label {
  font-size: 0.75rem;
  color: var(--text-muted);
}

.code-chip {
  font-size: 0.75rem;
  font-weight: 700;
  background: var(--primary-light);
  color: var(--primary);
  padding: 2px 8px;
  border-radius: 4px;
  border: 1px dashed var(--primary);
  transition: var(--transition);
}
.code-chip:hover {
  background: var(--primary);
  color: #ffffff;
}

/* Calculations */
.summary-breakdown {
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-bottom: 20px;
}

.summary-row {
  display: flex;
  justify-content: space-between;
  font-size: 0.9rem;
  color: var(--text-muted);
}

.discount-row {
  color: #10b981;
  font-weight: 600;
}

.text-green {
  color: #10b981;
}

.font-medium {
  font-weight: 600;
  color: var(--dark);
}

.summary-divider {
  height: 1px;
  background: var(--border);
  margin: 4px 0;
}

.total-row {
  font-size: 1.1rem;
  font-weight: 800;
  color: var(--dark);
}

.total-amount {
  color: var(--accent);
  font-size: 1.25rem;
}

.footer-actions {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.checkout-btn {
  width: 100%;
}

.clear-cart-btn {
  font-size: 0.82rem;
  color: #94a3b8;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  padding: 4px;
}
.clear-cart-btn:hover {
  color: #ef4444;
}
</style>

