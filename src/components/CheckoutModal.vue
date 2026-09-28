<script setup lang="ts">
import { reactive, ref, onMounted } from 'vue'
import { useCart } from '../composables/useCart'
import { useToast } from '../composables/useToast'
import { useAuth } from '../composables/useAuth'
import type { Order, OrderCustomer } from '../types'

const emit = defineEmits<{
  (e: 'close'): void
  (e: 'orderSuccess', order: Order): void
}>()

const {
  cartItems,
  subtotal,
  discount,
  shippingFee,
  total,
  appliedVoucherCode,
  clearCart,
  formatPrice
} = useCart()

const { showToast } = useToast()
const { currentUser } = useAuth()

const form = reactive<OrderCustomer>({
  fullName: currentUser.value?.fullName || '',
  phone: currentUser.value?.phone || '',
  email: currentUser.value?.email || '',
  address: currentUser.value?.address || '',
  city: currentUser.value?.city || 'Đà Nẵng',
  district: currentUser.value?.district || 'Hải Châu',
  notes: '',
  paymentMethod: 'cod'
})

const isSubmitting = ref(false)
const errors = reactive<Record<string, string>>({})

const validateForm = () => {
  let valid = true
  errors.fullName = ''
  errors.phone = ''
  errors.address = ''

  if (!form.fullName.trim()) {
    errors.fullName = 'Vui lòng nhập họ và tên của bạn'
    valid = false
  }

  const phoneRegex = /(84|0[3|5|7|8|9])+([0-9]{8})\b/
  if (!form.phone.trim()) {
    errors.phone = 'Vui lòng nhập số điện thoại'
    valid = false
  } else if (!phoneRegex.test(form.phone.trim())) {
    errors.phone = 'Số điện thoại không đúng định dạng (VD: 0912345678)'
    valid = false
  }

  if (!form.address.trim()) {
    errors.address = 'Vui lòng nhập số nhà, tên đường'
    valid = false
  }

  return valid
}

const handleSubmitOrder = () => {
  if (!validateForm()) {
    showToast('Thông tin chưa đủ', 'Vui lòng kiểm tra lại các trường đánh dấu đỏ.', 'error')
    return
  }

  if (cartItems.value.length === 0) {
    showToast('Lỗi giỏ hàng', 'Giỏ hàng của bạn đang trống!', 'warning')
    return
  }

  isSubmitting.value = true

  // Simulate order creation delay
  setTimeout(() => {
    const orderId = 'BF-' + Math.floor(100000 + Math.random() * 900000)
    const newOrder: Order = {
      orderId,
      createdAt: new Date().toLocaleString('vi-VN'),
      customer: { ...form },
      items: [...cartItems.value],
      subtotal: subtotal.value,
      discount: discount.value,
      shippingFee: shippingFee.value,
      total: total.value,
      voucherCode: appliedVoucherCode.value || undefined
    }

    clearCart()
    isSubmitting.value = false
    emit('close')
    emit('orderSuccess', newOrder)
  }, 700)
}
</script>

<template>
  <div class="modal-backdrop" @click.self="emit('close')">
    <div class="checkout-modal">
      <button class="modal-close" @click="emit('close')" title="Đóng">
        <i class="fa-solid fa-xmark"></i>
      </button>

      <div class="checkout-header">
        <div class="header-icon">
          <i class="fa-solid fa-credit-card"></i>
        </div>
        <div>
          <h2>Xác Nhận & Đặt Hàng</h2>
          <p>Vui lòng điền thông tin để chúng tôi giao trang phục tới bạn nhanh nhất</p>
        </div>
      </div>

      <div class="checkout-grid">
        <!-- Left: Form Details -->
        <div class="form-col">
          <h3 class="section-heading">
            <i class="fa-solid fa-location-dot"></i> 1. Thông Tin Nhận Hàng
          </h3>

          <div class="form-group">
            <label>Họ và tên người nhận <span class="req">*</span></label>
            <input
              type="text"
              v-model="form.fullName"
              placeholder="VD: Nguyễn Văn A"
              :class="{ 'input-error': errors.fullName }"
            />
            <span v-if="errors.fullName" class="error-msg">{{ errors.fullName }}</span>
          </div>

          <div class="form-row">
            <div class="form-group">
              <label>Số điện thoại <span class="req">*</span></label>
              <input
                type="tel"
                v-model="form.phone"
                placeholder="VD: 0987654321"
                :class="{ 'input-error': errors.phone }"
              />
              <span v-if="errors.phone" class="error-msg">{{ errors.phone }}</span>
            </div>

            <div class="form-group">
              <label>Email (nhận hóa đơn điện tử)</label>
              <input
                type="email"
                v-model="form.email"
                placeholder="VD: email@example.com"
              />
            </div>
          </div>

          <div class="form-row">
            <div class="form-group">
              <label>Tỉnh / Thành phố</label>
              <select v-model="form.city">
                <option value="Đà Nẵng">Đà Nẵng</option>
                <option value="Hà Nội">Hà Nội</option>
                <option value="TP. Hồ Chí Minh">TP. Hồ Chí Minh</option>
                <option value="Huế">Huế</option>
                <option value="Quảng Nam">Quảng Nam</option>
                <option value="Cần Thơ">Cần Thơ</option>
              </select>
            </div>

            <div class="form-group">
              <label>Quận / Huyện</label>
              <input
                type="text"
                v-model="form.district"
                placeholder="VD: Hải Châu, Ngũ Hành Sơn..."
              />
            </div>
          </div>

          <div class="form-group">
            <label>Địa chỉ cụ thể (Số nhà, tên đường, phường/xã) <span class="req">*</span></label>
            <input
              type="text"
              v-model="form.address"
              placeholder="VD: 33 Xô Viết Nghệ Tĩnh, P. Hòa Cường Nam"
              :class="{ 'input-error': errors.address }"
            />
            <span v-if="errors.address" class="error-msg">{{ errors.address }}</span>
          </div>

          <div class="form-group">
            <label>Ghi chú cho shipper</label>
            <textarea
              v-model="form.notes"
              rows="2"
              placeholder="VD: Giao giờ hành chính, gọi trước khi đến..."
            ></textarea>
          </div>

          <!-- Payment Methods -->
          <h3 class="section-heading mt-4">
            <i class="fa-solid fa-wallet"></i> 2. Phương Thức Thanh Toán
          </h3>

          <div class="payment-methods">
            <label class="payment-card" :class="{ selected: form.paymentMethod === 'cod' }">
              <input type="radio" value="cod" v-model="form.paymentMethod" />
              <div class="payment-info">
                <i class="fa-solid fa-hand-holding-dollar payment-icon text-green"></i>
                <div>
                  <strong>Thanh toán khi nhận hàng (COD)</strong>
                  <p>Kiểm tra hàng trước, thanh toán tiền mặt cho shipper khi nhận hàng</p>
                </div>
              </div>
            </label>

            <label class="payment-card" :class="{ selected: form.paymentMethod === 'banking' }">
              <input type="radio" value="banking" v-model="form.paymentMethod" />
              <div class="payment-info">
                <i class="fa-solid fa-qrcode payment-icon text-blue"></i>
                <div>
                  <strong>Chuyển khoản Ngân hàng (Quét mã VietQR)</strong>
                  <p>Hệ thống tự động hiển thị mã QR thanh toán nhanh sau khi đặt</p>
                </div>
              </div>
            </label>

            <label class="payment-card" :class="{ selected: form.paymentMethod === 'momo' }">
              <input type="radio" value="momo" v-model="form.paymentMethod" />
              <div class="payment-info">
                <i class="fa-solid fa-mobile-screen payment-icon text-pink"></i>
                <div>
                  <strong>Ví điện tử MoMo / VNPAY</strong>
                  <p>Thanh toán tiện lợi qua cổng ví điện tử liên kết</p>
                </div>
              </div>
            </label>
          </div>
        </div>

        <!-- Right: Order Items & Total -->
        <div class="summary-col">
          <h3 class="section-heading">
            <i class="fa-solid fa-receipt"></i> Đơn Hàng Của Bạn
          </h3>

          <div class="order-preview-list">
            <div v-for="item in cartItems" :key="item.cartId" class="preview-item">
              <img :src="item.image" :alt="item.name" class="preview-thumb" />
              <div class="preview-details">
                <span class="preview-name">{{ item.name }}</span>
                <span class="preview-meta">
                  Size: {{ item.size }} | {{ item.color.name }} × {{ item.quantity }}
                </span>
              </div>
              <span class="preview-price">
                {{ formatPrice(item.price * item.quantity) }}
              </span>
            </div>
          </div>

          <div class="order-pricing">
            <div class="price-line">
              <span>Tạm tính:</span>
              <span>{{ formatPrice(subtotal) }}</span>
            </div>
            <div v-if="discount > 0" class="price-line discount-text">
              <span>Mã giảm giá ({{ appliedVoucherCode }}):</span>
              <span>-{{ formatPrice(discount) }}</span>
            </div>
            <div class="price-line">
              <span>Phí vận chuyển:</span>
              <span>{{ shippingFee === 0 ? 'Miễn phí' : formatPrice(shippingFee) }}</span>
            </div>
            <div class="price-line grand-total">
              <span>Tổng thanh toán:</span>
              <span class="amount">{{ formatPrice(total) }}</span>
            </div>
          </div>

          <div class="checkout-guarantee">
            <i class="fa-solid fa-shield-check"></i>
            <span>Bảo mật thông tin đơn hàng 100%. Hỗ trợ đổi trả miễn phí trong 30 ngày.</span>
          </div>

          <button
            class="btn btn-primary btn-lg submit-order-btn"
            @click="handleSubmitOrder"
            :disabled="isSubmitting"
          >
            <i v-if="isSubmitting" class="fa-solid fa-spinner fa-spin"></i>
            <i v-else class="fa-solid fa-check"></i>
            {{ isSubmitting ? 'Đang Xử Lý Đơn Hàng...' : 'Xác Nhận Đặt Hàng Ngay' }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.checkout-modal {
  background: #ffffff;
  border-radius: var(--radius-lg);
  max-width: 950px;
  width: 100%;
  max-height: 92vh;
  overflow-y: auto;
  position: relative;
  box-shadow: var(--shadow-xl);
  animation: slideUp 0.25s ease-out;
  padding: 32px;
}

.modal-close {
  position: absolute;
  top: 20px;
  right: 20px;
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
.modal-close:hover {
  background: #e2e8f0;
  color: var(--dark);
}

.checkout-header {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 28px;
  border-bottom: 1px solid var(--border);
  padding-bottom: 20px;
}

.header-icon {
  width: 48px;
  height: 48px;
  border-radius: 12px;
  background: var(--primary-light);
  color: var(--primary);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.4rem;
}

.checkout-header h2 {
  font-size: 1.4rem;
  font-weight: 800;
  color: var(--dark);
}

.checkout-header p {
  font-size: 0.88rem;
  color: var(--text-muted);
}

.checkout-grid {
  display: grid;
  grid-template-columns: 1.2fr 0.8fr;
  gap: 32px;
}

.section-heading {
  font-size: 1.05rem;
  font-weight: 700;
  color: var(--dark);
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 16px;
}

.mt-4 {
  margin-top: 24px;
}

.req {
  color: #ef4444;
}

/* Forms */
.form-group {
  display: flex;
  flex-direction: column;
  gap: 6px;
  margin-bottom: 14px;
}

.form-group label {
  font-size: 0.85rem;
  font-weight: 600;
  color: var(--text-main);
}

.form-group input,
.form-group select,
.form-group textarea {
  padding: 10px 14px;
  border-radius: var(--radius-md);
  border: 1px solid var(--border);
  background: #f8fafc;
  font-size: 0.9rem;
  transition: var(--transition);
}

.form-group input:focus,
.form-group select:focus,
.form-group textarea:focus {
  border-color: var(--primary);
  background: #ffffff;
  box-shadow: 0 0 0 3px rgba(79, 70, 229, 0.1);
}

.input-error {
  border-color: #ef4444 !important;
  background-color: #fef2f2 !important;
}

.error-msg {
  font-size: 0.78rem;
  color: #ef4444;
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 14px;
}

/* Payment Cards */
.payment-methods {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.payment-card {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  padding: 14px;
  border-radius: var(--radius-md);
  border: 1.5px solid var(--border);
  background: #f8fafc;
  cursor: pointer;
  transition: var(--transition);
}

.payment-card:hover {
  border-color: #cbd5e1;
}

.payment-card.selected {
  border-color: var(--primary);
  background: var(--primary-light);
}

.payment-card input[type="radio"] {
  margin-top: 4px;
}

.payment-info {
  display: flex;
  gap: 12px;
}

.payment-icon {
  font-size: 1.3rem;
  margin-top: 2px;
}

.payment-info strong {
  display: block;
  font-size: 0.92rem;
  color: var(--dark);
  margin-bottom: 2px;
}

.payment-info p {
  font-size: 0.78rem;
  color: var(--text-muted);
  line-height: 1.3;
}

.text-green { color: #10b981; }
.text-blue { color: #3b82f6; }
.text-pink { color: #ec4899; }

/* Right Summary */
.summary-col {
  background: #f8fafc;
  padding: 24px;
  border-radius: var(--radius-lg);
  border: 1px solid var(--border);
  display: flex;
  flex-direction: column;
}

.order-preview-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
  max-height: 220px;
  overflow-y: auto;
  margin-bottom: 20px;
  padding-right: 4px;
}

.preview-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding-bottom: 10px;
  border-bottom: 1px solid #e2e8f0;
}

.preview-thumb {
  width: 48px;
  height: 58px;
  border-radius: var(--radius-sm);
  object-fit: cover;
}

.preview-details {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.preview-name {
  font-size: 0.85rem;
  font-weight: 700;
  color: var(--text-main);
  line-height: 1.2;
}

.preview-meta {
  font-size: 0.75rem;
  color: var(--text-muted);
}

.preview-price {
  font-size: 0.88rem;
  font-weight: 700;
  color: var(--dark);
}

.order-pricing {
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 16px 0;
  border-top: 1px solid var(--border);
  border-bottom: 1px solid var(--border);
  margin-bottom: 16px;
}

.price-line {
  display: flex;
  justify-content: space-between;
  font-size: 0.9rem;
  color: var(--text-muted);
}

.discount-text {
  color: #10b981;
  font-weight: 600;
}

.grand-total {
  font-size: 1.1rem;
  font-weight: 800;
  color: var(--dark);
  padding-top: 6px;
}

.grand-total .amount {
  color: var(--accent);
  font-size: 1.3rem;
}

.checkout-guarantee {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 0.78rem;
  color: #059669;
  background: #ecfdf5;
  padding: 10px 12px;
  border-radius: var(--radius-md);
  margin-bottom: 20px;
}

.submit-order-btn {
  width: 100%;
}

@media (max-width: 850px) {
  .checkout-grid {
    grid-template-columns: 1fr;
  }
}
</style>

