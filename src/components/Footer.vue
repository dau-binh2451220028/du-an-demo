<script setup lang="ts">
import { ref } from 'vue'
import { useToast } from '../composables/useToast'

const { showToast } = useToast()
const emailInput = ref('')

const handleSubscribe = () => {
  if (!emailInput.value || !emailInput.value.includes('@')) {
    showToast('Email không hợp lệ', 'Vui lòng nhập địa chỉ email chính xác để nhận ưu đãi.', 'warning')
    return
  }
  showToast('Đăng ký thành công!', 'Bạn sẽ là người đầu tiên nhận thông tin các bộ sưu tập mới nhất.', 'success')
  emailInput.value = ''
}
</script>

<template>
  <footer id="about-section" class="footer">
    <!-- Top Newsletter Row -->
    <div class="newsletter-bar">
      <div class="container newsletter-content">
        <div class="newsletter-text">
          <h3><i class="fa-solid fa-paper-plane text-accent"></i> Đăng Ký Nhận Bản Tin Khuyến Mãi</h3>
          <p>Nhận ngay mã voucher giảm 10% cho đơn hàng đầu tiên và cập nhật mẫu mới mỗi tuần.</p>
        </div>
        <form class="newsletter-form" @submit.prevent="handleSubscribe">
          <input
            type="email"
            v-model="emailInput"
            placeholder="Nhập email của bạn..."
            required
          />
          <button type="submit" class="btn btn-accent">
            Đăng Ký
          </button>
        </form>
      </div>
    </div>

    <!-- Main Footer Links Grid -->
    <div class="container main-footer">
      <div class="footer-grid">
        <!-- Brand Info -->
        <div class="footer-col brand-col">
          <div class="footer-brand">
            <div class="brand-icon">
              <i class="fa-solid fa-bag-shopping"></i>
            </div>
            <span class="brand-name">BÌNH <span>FASHION</span></span>
          </div>

          <p class="brand-desc">
            Hệ thống cửa hàng thời trang dành cho giới trẻ hiện đại. Luôn đón đầu xu hướng với thiết kế tinh tế và chất lượng vượt trội.
          </p>

          <div class="academic-badge">
            <i class="fa-solid fa-graduation-cap"></i>
            <div>
              <strong>Đồ án thực hành CNPM</strong>
              <p>SV: Ngô Quang Bình - Khóa 24CT1</p>
            </div>
          </div>
        </div>

        <!-- Quick Links -->
        <div class="footer-col">
          <h4 class="col-title">Danh Mục Sản Phẩm</h4>
          <ul class="footer-links">
            <li><a href="#products-section">Áo Thun Nam & Nữ</a></li>
            <li><a href="#products-section">Áo Sơ Mi Hàn Quốc</a></li>
            <li><a href="#products-section">Quần Jean Retro Denim</a></li>
            <li><a href="#products-section">Áo Khoác & Hoodie Boxy</a></li>
            <li><a href="#products-section">Váy Đầm Dạo Phố</a></li>
            <li><a href="#products-section">Phụ Kiện Nón & Túi Tote</a></li>
          </ul>
        </div>

        <!-- Customer Care -->
        <div class="footer-col">
          <h4 class="col-title">Chính Sách & Hỗ Trợ</h4>
          <ul class="footer-links">
            <li><a href="#">Bảng hướng dẫn chọn kích cỡ (Size Guide)</a></li>
            <li><a href="#">Chính sách đổi trả hàng trong 30 ngày</a></li>
            <li><a href="#">Chính sách bảo mật thông tin khách hàng</a></li>
            <li><a href="#">Phương thức thanh toán & Vận chuyển</a></li>
            <li><a href="#">Câu hỏi thường gặp (FAQ)</a></li>
          </ul>
        </div>

        <!-- Store Contact -->
        <div class="footer-col">
          <h4 class="col-title">Liên Hệ Trực Tiếp</h4>
          <ul class="contact-list">
            <li>
              <i class="fa-solid fa-location-dot"></i>
              <span>33 Xô Viết Nghệ Tĩnh, Q. Hải Châu, TP. Đà Nẵng</span>
            </li>
            <li>
              <i class="fa-solid fa-phone"></i>
              <span>Hotline tư vấn: 0988.24.CT1 (24/7)</span>
            </li>
            <li>
              <i class="fa-solid fa-envelope"></i>
              <span>Email: quangbinh.24ct1@donga.edu.vn</span>
            </li>
            <li>
              <i class="fa-solid fa-clock"></i>
              <span>Mở cửa: 08:00 - 22:00 tất cả các ngày</span>
            </li>
          </ul>

          <div class="social-links">
            <a href="#" class="social-btn" title="Facebook"><i class="fa-brands fa-facebook-f"></i></a>
            <a href="#" class="social-btn" title="Instagram"><i class="fa-brands fa-instagram"></i></a>
            <a href="#" class="social-btn" title="TikTok"><i class="fa-brands fa-tiktok"></i></a>
            <a href="#" class="social-btn" title="GitHub"><i class="fa-brands fa-github"></i></a>
          </div>
        </div>
      </div>
    </div>

    <!-- Copyright Bar -->
    <div class="copyright-bar">
      <div class="container copyright-content">
        <p>© 2026 <strong>Bình Fashion</strong>. Phát triển bởi sinh viên Ngô Quang Bình - Khóa 24CT1.</p>
        <div class="payment-badges">
          <i class="fa-brands fa-cc-visa" title="Visa"></i>
          <i class="fa-brands fa-cc-mastercard" title="Mastercard"></i>
          <i class="fa-solid fa-qrcode" title="VietQR"></i>
          <i class="fa-solid fa-money-bill-wave" title="COD"></i>
        </div>
      </div>
    </div>
  </footer>
</template>

<style scoped>
.footer {
  background: #0f172a;
  color: #94a3b8;
  margin-top: 60px;
}

/* Newsletter */
.newsletter-bar {
  background: #1e293b;
  border-bottom: 1px solid #334155;
  padding: 36px 0;
}

.newsletter-content {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 24px;
  flex-wrap: wrap;
}

.newsletter-text h3 {
  font-size: 1.25rem;
  font-weight: 700;
  color: #ffffff;
  margin-bottom: 6px;
  display: flex;
  align-items: center;
  gap: 10px;
}

.newsletter-text p {
  font-size: 0.9rem;
  color: #94a3b8;
}

.text-accent {
  color: var(--accent);
}

.newsletter-form {
  display: flex;
  gap: 10px;
  max-width: 420px;
  width: 100%;
}

.newsletter-form input {
  flex: 1;
  padding: 12px 18px;
  border-radius: var(--radius-md);
  border: 1px solid #475569;
  background: #0f172a;
  color: #ffffff;
  font-size: 0.9rem;
}

.newsletter-form input:focus {
  border-color: var(--primary);
}

/* Main Footer */
.main-footer {
  padding: 50px 20px 40px;
}

.footer-grid {
  display: grid;
  grid-template-columns: 1.4fr 1fr 1.1fr 1.2fr;
  gap: 40px;
}

.brand-col {
  display: flex;
  flex-direction: column;
}

.footer-brand {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 16px;
}

.brand-icon {
  width: 38px;
  height: 38px;
  border-radius: 10px;
  background: linear-gradient(135deg, #4f46e5 0%, #3b82f6 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  color: #ffffff;
  font-size: 1.1rem;
}

.brand-name {
  font-size: 1.3rem;
  font-weight: 800;
  color: #ffffff;
}

.brand-name span {
  color: #818cf8;
}

.brand-desc {
  font-size: 0.88rem;
  line-height: 1.6;
  margin-bottom: 20px;
}

.academic-badge {
  display: flex;
  align-items: center;
  gap: 12px;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  padding: 12px 16px;
  border-radius: var(--radius-md);
  color: #e2e8f0;
}

.academic-badge i {
  font-size: 1.4rem;
  color: #818cf8;
}

.academic-badge strong {
  display: block;
  font-size: 0.85rem;
  color: #ffffff;
}

.academic-badge p {
  font-size: 0.78rem;
  color: #94a3b8;
}

.col-title {
  font-size: 1rem;
  font-weight: 700;
  color: #ffffff;
  margin-bottom: 20px;
  position: relative;
  padding-bottom: 8px;
}

.col-title::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  width: 32px;
  height: 2px;
  background: var(--primary);
  border-radius: 2px;
}

.footer-links, .contact-list {
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.footer-links a {
  font-size: 0.88rem;
  transition: var(--transition);
}

.footer-links a:hover {
  color: #ffffff;
  padding-left: 4px;
}

.contact-list li {
  display: flex;
  align-items: flex-start;
  gap: 10px;
  font-size: 0.85rem;
  line-height: 1.4;
}

.contact-list i {
  color: #818cf8;
  margin-top: 3px;
  width: 16px;
}

.social-links {
  display: flex;
  gap: 10px;
  margin-top: 18px;
}

.social-btn {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: #1e293b;
  color: #cbd5e1;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.95rem;
  transition: var(--transition);
}

.social-btn:hover {
  background: var(--primary);
  color: #ffffff;
  transform: translateY(-2px);
}

/* Copyright */
.copyright-bar {
  border-top: 1px solid #1e293b;
  padding: 20px 0;
  font-size: 0.82rem;
}

.copyright-content {
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 12px;
}

.payment-badges {
  display: flex;
  align-items: center;
  gap: 14px;
  font-size: 1.3rem;
  color: #64748b;
}

@media (max-width: 992px) {
  .footer-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 600px) {
  .footer-grid {
    grid-template-columns: 1fr;
  }
  .newsletter-content {
    flex-direction: column;
    align-items: stretch;
  }
  .copyright-content {
    flex-direction: column;
    text-align: center;
  }
}
</style>

