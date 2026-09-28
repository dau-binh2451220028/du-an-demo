<script setup lang="ts">
import type { Order } from '../types'
import { useCart } from '../composables/useCart'

const props = defineProps<{
  order: Order | null
}>()

const emit = defineEmits<{
  (e: 'close'): void
}>()

const { formatPrice } = useCart()

const handlePrint = () => {
  window.print()
}
</script>

<template>
  <div v-if="order" class="modal-backdrop" @click.self="emit('close')">
    <div class="success-modal">
      <button class="modal-close" @click="emit('close')" title="Đóng">
        <i class="fa-solid fa-xmark"></i>
      </button>

      <!-- Success Animation / Header -->
      <div class="success-header">
        <div class="success-icon-wrap">
          <i class="fa-solid fa-check"></i>
        </div>
        <h2>Đặt Hàng Thành Công!</h2>
        <p class="success-subtitle">
          Cảm ơn bạn đã mua sắm tại <strong>Bình Fashion</strong>. Mã đơn hàng của bạn là:
          <span class="order-code">{{ order.orderId }}</span>
        </p>
      </div>

      <!-- Banking VietQR Section if Banking is selected -->
      <div v-if="order.customer.paymentMethod === 'banking'" class="qr-payment-card">
        <div class="qr-header">
          <i class="fa-solid fa-qrcode text-blue"></i>
          <h4>Thông Tin Chuyển Khoản Qua VietQR</h4>
        </div>

        <div class="qr-body">
          <div class="qr-image-wrap">
            <!-- Simulated QR code image -->
            <img
              :src="`https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=24CT1_FASHION_${order.orderId}_${order.total}`"
              alt="Mã QR Chuyển Khoản"
              class="qr-code-img"
            />
            <span class="qr-hint">Quét mã bằng app ngân hàng</span>
          </div>

          <div class="bank-details">
            <div class="bank-row">
              <span class="label">Ngân hàng:</span>
              <span class="value">MB Bank (Ngân hàng Quân Đội)</span>
            </div>
            <div class="bank-row">
              <span class="label">Số tài khoản:</span>
              <span class="value highlight">0988 24CT1 999</span>
            </div>
            <div class="bank-row">
              <span class="label">Chủ tài khoản:</span>
              <span class="value">NGO QUANG BINH</span>
            </div>
            <div class="bank-row">
              <span class="label">Số tiền:</span>
              <span class="value highlight-price">{{ formatPrice(order.total) }}</span>
            </div>
            <div class="bank-row">
              <span class="label">Nội dung CK:</span>
              <span class="value badge-content">{{ order.orderId }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Delivery Details -->
      <div class="order-summary-box">
        <h4>Chi Tiết Giao Hàng</h4>
        <div class="info-grid">
          <div><strong>Người nhận:</strong> {{ order.customer.fullName }}</div>
          <div><strong>Số điện thoại:</strong> {{ order.customer.phone }}</div>
          <div><strong>Địa chỉ:</strong> {{ order.customer.address }}, {{ order.customer.district }}, {{ order.customer.city }}</div>
          <div>
            <strong>Hình thức:</strong>
            <span v-if="order.customer.paymentMethod === 'cod'"> COD (Thu tiền khi nhận hàng)</span>
            <span v-else-if="order.customer.paymentMethod === 'banking'"> Chuyển khoản VietQR</span>
            <span v-else> Ví MoMo / VNPAY</span>
          </div>
        </div>

        <div class="purchased-items">
          <h5>Sản phẩm đã chọn ({{ order.items.length }} món):</h5>
          <div v-for="item in order.items" :key="item.cartId" class="item-receipt">
            <span>{{ item.name }} (Size: {{ item.size }}, {{ item.color.name }}) × {{ item.quantity }}</span>
            <span class="font-bold">{{ formatPrice(item.price * item.quantity) }}</span>
          </div>
        </div>

        <div class="order-final-price">
          <span>Tổng thanh toán đã xác nhận:</span>
          <span class="final-amount">{{ formatPrice(order.total) }}</span>
        </div>
      </div>

      <!-- Action Buttons -->
      <div class="modal-actions">
        <button class="btn btn-outline" @click="handlePrint">
          <i class="fa-solid fa-print"></i> In Hóa Đơn
        </button>
        <button class="btn btn-primary" @click="emit('close')">
          <i class="fa-solid fa-bag-shopping"></i> Tiếp Tục Mua Sắm
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.success-modal {
  background: #ffffff;
  border-radius: var(--radius-lg);
  max-width: 650px;
  width: 100%;
  max-height: 90vh;
  overflow-y: auto;
  position: relative;
  box-shadow: var(--shadow-xl);
  padding: 36px 32px;
  animation: slideUp 0.25s ease-out;
}

.modal-close {
  position: absolute;
  top: 18px;
  right: 18px;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: #f1f5f9;
  color: var(--text-muted);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.1rem;
}
.modal-close:hover {
  background: #e2e8f0;
  color: var(--dark);
}

.success-header {
  text-align: center;
  margin-bottom: 24px;
}

.success-icon-wrap {
  width: 70px;
  height: 70px;
  border-radius: 50%;
  background: #ecfdf5;
  color: #10b981;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2rem;
  margin: 0 auto 16px;
  box-shadow: 0 0 0 8px #f0fdf4;
}

.success-header h2 {
  font-size: 1.5rem;
  font-weight: 800;
  color: var(--dark);
  margin-bottom: 8px;
}

.success-subtitle {
  font-size: 0.92rem;
  color: var(--text-muted);
}

.order-code {
  display: inline-block;
  background: var(--primary-light);
  color: var(--primary);
  font-weight: 800;
  padding: 2px 10px;
  border-radius: 6px;
  margin-left: 4px;
}

/* QR Card */
.qr-payment-card {
  background: #f8fafc;
  border: 1.5px dashed #cbd5e1;
  border-radius: var(--radius-md);
  padding: 20px;
  margin-bottom: 24px;
}

.qr-header {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 16px;
}

.qr-header h4 {
  font-size: 0.95rem;
  font-weight: 700;
  color: var(--dark);
}

.text-blue {
  color: #3b82f6;
}

.qr-body {
  display: grid;
  grid-template-columns: 140px 1fr;
  gap: 20px;
  align-items: center;
}

.qr-image-wrap {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
}

.qr-code-img {
  width: 130px;
  height: 130px;
  border-radius: 8px;
  border: 1px solid #e2e8f0;
  background: #ffffff;
  padding: 6px;
}

.qr-hint {
  font-size: 0.72rem;
  color: var(--text-muted);
}

.bank-details {
  display: flex;
  flex-direction: column;
  gap: 6px;
  font-size: 0.85rem;
}

.bank-row {
  display: flex;
  justify-content: space-between;
}

.bank-row .label {
  color: var(--text-muted);
}

.bank-row .value {
  font-weight: 600;
  color: var(--dark);
}

.highlight {
  color: var(--primary) !important;
  font-weight: 700 !important;
}

.highlight-price {
  color: var(--accent) !important;
  font-weight: 800 !important;
}

.badge-content {
  background: #f1f5f9;
  padding: 2px 8px;
  border-radius: 4px;
  font-weight: 800 !important;
}

/* Summary Box */
.order-summary-box {
  background: #ffffff;
  border: 1px solid var(--border);
  border-radius: var(--radius-md);
  padding: 20px;
  margin-bottom: 24px;
}

.order-summary-box h4 {
  font-size: 1rem;
  font-weight: 700;
  margin-bottom: 12px;
  color: var(--dark);
}

.info-grid {
  display: flex;
  flex-direction: column;
  gap: 6px;
  font-size: 0.88rem;
  color: #475569;
  margin-bottom: 16px;
}

.purchased-items {
  border-top: 1px solid #f1f5f9;
  padding-top: 12px;
  margin-bottom: 16px;
}

.purchased-items h5 {
  font-size: 0.85rem;
  font-weight: 700;
  color: var(--text-muted);
  margin-bottom: 8px;
}

.item-receipt {
  display: flex;
  justify-content: space-between;
  font-size: 0.85rem;
  padding: 4px 0;
  color: var(--text-main);
}

.font-bold {
  font-weight: 700;
}

.order-final-price {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  border-top: 1px solid var(--border);
  padding-top: 12px;
  font-weight: 700;
}

.final-amount {
  font-size: 1.25rem;
  color: var(--accent);
}

.modal-actions {
  display: flex;
  gap: 12px;
  justify-content: flex-end;
}

@media (max-width: 576px) {
  .qr-body {
    grid-template-columns: 1fr;
    text-align: center;
  }
  .modal-actions {
    flex-direction: column;
  }
}
</style>

