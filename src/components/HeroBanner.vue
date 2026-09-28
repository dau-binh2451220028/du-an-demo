<script setup lang="ts">
const emit = defineEmits<{
  (e: 'explore'): void
  (e: 'viewPromo'): void
}>()
</script>

<template>
  <section id="hero-section" class="hero-section">
    <div class="container hero-container">
      <div class="hero-grid">
        <!-- Hero Text -->
        <div class="hero-content">
          <div class="hero-badge">
            <span class="pulse-dot"></span>
            <span>Bộ Sưu Tập Xu Hướng 2026</span>
          </div>

          <h1 class="hero-title">
            Nâng Tầm Phong Cách Với Thời Trang Hiện Đại
          </h1>

          <p class="hero-desc">
            Khám phá những thiết kế trang phục trẻ trung, năng động và thanh lịch nhất từ 
            <strong>Bình Fashion</strong>. Chất liệu vải cao cấp, phom dáng tôn đường nét, sẵn sàng đồng hành cùng bạn mỗi ngày.
          </p>

          <div class="hero-actions">
            <button class="btn btn-primary btn-lg" @click="emit('explore')">
              <i class="fa-solid fa-bag-shopping"></i> Khám Phá Ngay
            </button>
            <button class="btn btn-outline btn-lg" @click="emit('viewPromo')">
              <i class="fa-solid fa-tag text-accent"></i> Mã Giảm Giá
            </button>
          </div>

          <!-- Quick Stats -->
          <div class="hero-stats">
            <div class="stat-item">
              <span class="stat-number">5.000+</span>
              <span class="stat-label">Khách Hài Lòng</span>
            </div>
            <div class="stat-divider"></div>
            <div class="stat-item">
              <span class="stat-number">100+</span>
              <span class="stat-label">Mẫu Mới Mỗi Tuần</span>
            </div>
            <div class="stat-divider"></div>
            <div class="stat-item">
              <span class="stat-number">4.9 ★</span>
              <span class="stat-label">Đánh Giá Tích Cực</span>
            </div>
          </div>
        </div>

        <!-- Hero Images Banner Collage -->
        <div class="hero-visual">
          <div class="hero-card main-card">
            <img
              src="https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=800&q=80"
              alt="Fashion Model Trend"
              class="hero-img"
            />
            <div class="floating-badge discount-tag">
              <span class="tag-title">Giảm Đến</span>
              <span class="tag-value">-40%</span>
            </div>
          </div>

          <div class="hero-card secondary-card">
            <img
              src="https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=600&q=80"
              alt="Trendy Clothing Style"
              class="hero-img-small"
            />
            <div class="floating-badge author-badge">
              <i class="fa-solid fa-certificate"></i>
              <span>24CT1 Collection</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Feature Perks Bar -->
    <div id="features" class="features-bar">
      <div class="container features-grid">
        <div class="feature-item">
          <div class="feature-icon">
            <i class="fa-solid fa-truck-fast"></i>
          </div>
          <div class="feature-text">
            <h4>Miễn Phí Vận Chuyển</h4>
            <p>Cho mọi đơn hàng từ 499.000đ</p>
          </div>
        </div>

        <div class="feature-item">
          <div class="feature-icon">
            <i class="fa-solid fa-arrow-rotate-left"></i>
          </div>
          <div class="feature-text">
            <h4>Đổi Trả Trong 30 Ngày</h4>
            <p>Thủ tục đơn giản, nhanh chóng</p>
          </div>
        </div>

        <div class="feature-item">
          <div class="feature-icon">
            <i class="fa-solid fa-shield-halved"></i>
          </div>
          <div class="feature-text">
            <h4>100% Hàng Chính Hãng</h4>
            <p>Vải dệt cao cấp, bảo đảm chất lượng</p>
          </div>
        </div>

        <div class="feature-item">
          <div class="feature-icon">
            <i class="fa-solid fa-headset"></i>
          </div>
          <div class="feature-text">
            <h4>Hỗ Trợ Tận Tâm 24/7</h4>
            <p>Tư vấn chọn size & phối đồ chuẩn</p>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.hero-section {
  background: linear-gradient(180deg, #f8fafc 0%, #edf2f7 100%);
  padding-top: 40px;
  overflow: hidden;
}

.hero-container {
  padding-bottom: 50px;
}

.hero-grid {
  display: grid;
  grid-template-columns: 1.15fr 0.85fr;
  align-items: center;
  gap: 40px;
}

.hero-badge {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  background: #ffffff;
  padding: 6px 14px;
  border-radius: var(--radius-full);
  font-size: 0.82rem;
  font-weight: 700;
  color: var(--primary);
  box-shadow: var(--shadow-sm);
  border: 1px solid var(--border);
  margin-bottom: 20px;
}

.pulse-dot {
  width: 8px;
  height: 8px;
  background-color: var(--accent);
  border-radius: 50%;
  animation: pulse 1.5s infinite;
}

@keyframes pulse {
  0% { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(244, 63, 94, 0.7); }
  70% { transform: scale(1); box-shadow: 0 0 0 6px rgba(244, 63, 94, 0); }
  100% { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(244, 63, 94, 0); }
}

.hero-title {
  font-size: 3rem;
  line-height: 1.15;
  font-weight: 800;
  color: var(--dark);
  letter-spacing: -0.03em;
  margin-bottom: 18px;
}

.hero-desc {
  font-size: 1.05rem;
  color: var(--text-muted);
  line-height: 1.6;
  margin-bottom: 28px;
  max-width: 540px;
}

.hero-actions {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 36px;
  flex-wrap: wrap;
}

.text-accent {
  color: var(--accent);
}

.hero-stats {
  display: flex;
  align-items: center;
  gap: 24px;
}

.stat-item {
  display: flex;
  flex-direction: column;
}

.stat-number {
  font-size: 1.4rem;
  font-weight: 800;
  color: var(--dark);
}

.stat-label {
  font-size: 0.78rem;
  color: var(--text-muted);
  font-weight: 500;
}

.stat-divider {
  width: 1px;
  height: 32px;
  background-color: var(--border);
}

/* Visual Collage */
.hero-visual {
  position: relative;
  display: flex;
  justify-content: center;
}

.main-card {
  width: 320px;
  height: 420px;
  border-radius: 24px;
  overflow: hidden;
  box-shadow: 0 25px 50px -12px rgba(15, 23, 42, 0.25);
  position: relative;
  transform: rotate(-2deg);
  transition: var(--transition);
}

.main-card:hover {
  transform: rotate(0deg) scale(1.02);
}

.hero-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.secondary-card {
  position: absolute;
  right: -20px;
  bottom: -30px;
  width: 200px;
  height: 260px;
  border-radius: 20px;
  overflow: hidden;
  box-shadow: 0 20px 35px -8px rgba(0, 0, 0, 0.3);
  border: 4px solid #ffffff;
  transform: rotate(4deg);
  transition: var(--transition);
}

.secondary-card:hover {
  transform: rotate(0deg) scale(1.05);
}

.hero-img-small {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.floating-badge {
  position: absolute;
  backdrop-filter: blur(8px);
  padding: 8px 14px;
  border-radius: var(--radius-md);
  box-shadow: var(--shadow-lg);
}

.discount-tag {
  top: 20px;
  left: 20px;
  background: rgba(244, 63, 94, 0.95);
  color: #ffffff;
  display: flex;
  flex-direction: column;
  text-align: center;
  line-height: 1.1;
  border-radius: 12px;
}

.discount-tag .tag-title {
  font-size: 0.7rem;
  text-transform: uppercase;
  font-weight: 700;
}

.discount-tag .tag-value {
  font-size: 1.25rem;
  font-weight: 800;
}

.author-badge {
  bottom: 12px;
  left: 12px;
  right: 12px;
  background: rgba(15, 23, 42, 0.85);
  color: #ffffff;
  font-size: 0.75rem;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
}

/* Feature Perks */
.features-bar {
  background: #ffffff;
  border-top: 1px solid var(--border);
  border-bottom: 1px solid var(--border);
  padding: 24px 0;
}

.features-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 20px;
}

.feature-item {
  display: flex;
  align-items: center;
  gap: 14px;
}

.feature-icon {
  width: 46px;
  height: 46px;
  border-radius: 12px;
  background: var(--primary-light);
  color: var(--primary);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.25rem;
  flex-shrink: 0;
}

.feature-text h4 {
  font-size: 0.92rem;
  font-weight: 700;
  color: var(--dark);
  margin-bottom: 2px;
}

.feature-text p {
  font-size: 0.78rem;
  color: var(--text-muted);
}

@media (max-width: 992px) {
  .hero-grid {
    grid-template-columns: 1fr;
    text-align: center;
  }
  .hero-desc {
    margin-left: auto;
    margin-right: auto;
  }
  .hero-actions {
    justify-content: center;
  }
  .hero-stats {
    justify-content: center;
  }
  .hero-visual {
    margin-top: 20px;
  }
  .features-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 20px;
  }
}

@media (max-width: 576px) {
  .hero-title {
    font-size: 2.1rem;
  }
  .main-card {
    width: 260px;
    height: 340px;
  }
  .secondary-card {
    display: none;
  }
  .features-grid {
    grid-template-columns: 1fr;
  }
}
</style>

