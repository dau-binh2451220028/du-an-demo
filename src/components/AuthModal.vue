<script setup lang="ts">
import { ref, reactive } from 'vue'
import { useAuth } from '../composables/useAuth'
import { useToast } from '../composables/useToast'

const props = defineProps<{
  isOpen: boolean
  initialTab?: 'login' | 'register'
}>()

const emit = defineEmits<{
  (e: 'close'): void
}>()

const activeTab = ref<'login' | 'register'>(props.initialTab || 'login')
const showPassword = ref(false)
const isSubmitting = ref(false)

const { login, register } = useAuth()
const { showToast } = useToast()

// Login form
const loginForm = reactive({
  email: '',
  password: '',
  remember: true
})

// Register form
const registerForm = reactive({
  fullName: '',
  email: '',
  phone: '',
  password: '',
  confirmPassword: '',
  address: '',
  agreeTerms: true
})

const errors = reactive<Record<string, string>>({})

const handleLogin = () => {
  errors.login = ''
  if (!loginForm.email.trim()) {
    errors.login = 'Vui lòng nhập địa chỉ email'
    return
  }
  if (!loginForm.password) {
    errors.login = 'Vui lòng nhập mật khẩu'
    return
  }

  isSubmitting.value = true
  setTimeout(() => {
    const res = login(loginForm.email, loginForm.password)
    isSubmitting.value = false
    if (res.success) {
      showToast('Đăng nhập thành công', res.message, 'success')
      emit('close')
    } else {
      errors.login = res.message
      showToast('Đăng nhập thất bại', res.message, 'error')
    }
  }, 400)
}

const handleQuickDemoLogin = (email: string) => {
  loginForm.email = email
  loginForm.password = '123456'
  handleLogin()
}

const handleRegister = () => {
  errors.reg = ''
  if (!registerForm.fullName.trim()) {
    errors.reg = 'Vui lòng nhập họ và tên'
    return
  }
  if (!registerForm.email.trim()) {
    errors.reg = 'Vui lòng nhập địa chỉ email hợp lệ'
    return
  }
  if (!registerForm.phone.trim()) {
    errors.reg = 'Vui lòng nhập số điện thoại'
    return
  }
  if (!registerForm.password || registerForm.password.length < 6) {
    errors.reg = 'Mật khẩu phải chứa ít nhất 6 ký tự'
    return
  }
  if (registerForm.password !== registerForm.confirmPassword) {
    errors.reg = 'Mật khẩu nhập lại không trùng khớp'
    return
  }
  if (!registerForm.agreeTerms) {
    errors.reg = 'Vui lòng đồng ý với điều khoản sử dụng'
    return
  }

  isSubmitting.value = true
  setTimeout(() => {
    const res = register(
      registerForm.fullName,
      registerForm.email,
      registerForm.phone,
      registerForm.password,
      registerForm.address
    )
    isSubmitting.value = false
    if (res.success) {
      showToast('Chúc mừng!', res.message, 'success')
      emit('close')
    } else {
      errors.reg = res.message
      showToast('Đăng ký không thành công', res.message, 'error')
    }
  }, 500)
}
</script>

<template>
  <div v-if="isOpen" class="modal-backdrop" @click.self="emit('close')">
    <div class="auth-modal">
      <button class="modal-close-btn" @click="emit('close')" title="Đóng">
        <i class="fa-solid fa-xmark"></i>
      </button>

      <!-- Brand Header -->
      <div class="auth-header">
        <div class="auth-logo">
          <i class="fa-solid fa-bag-shopping"></i>
        </div>
        <h3>BÌNH <span>FASHION</span></h3>
        <p class="auth-subtitle">Cửa hàng thời trang chính hãng 24CT1</p>
      </div>

      <!-- Tab Switcher -->
      <div class="auth-tabs">
        <button
          :class="['tab-btn', { active: activeTab === 'login' }]"
          @click="activeTab = 'login'"
        >
          <i class="fa-solid fa-arrow-right-to-bracket"></i> Đăng Nhập
        </button>
        <button
          :class="['tab-btn', { active: activeTab === 'register' }]"
          @click="activeTab = 'register'"
        >
          <i class="fa-solid fa-user-plus"></i> Đăng Ký
        </button>
      </div>

      <!-- TAB 1: LOGIN FORM -->
      <div v-if="activeTab === 'login'" class="form-container">
        <div v-if="errors.login" class="alert-error">
          <i class="fa-solid fa-circle-exclamation"></i>
          <span>{{ errors.login }}</span>
        </div>

        <form @submit.prevent="handleLogin">
          <div class="input-group">
            <label>Địa chỉ Email</label>
            <div class="input-field-wrap">
              <i class="fa-regular fa-envelope input-icon"></i>
              <input
                type="email"
                v-model="loginForm.email"
                placeholder="VD: demo@fashion.vn"
                required
              />
            </div>
          </div>

          <div class="input-group">
            <label>Mật khẩu</label>
            <div class="input-field-wrap">
              <i class="fa-solid fa-lock input-icon"></i>
              <input
                :type="showPassword ? 'text' : 'password'"
                v-model="loginForm.password"
                placeholder="Nhập mật khẩu..."
                required
              />
              <button
                type="button"
                class="toggle-pass-btn"
                @click="showPassword = !showPassword"
                title="Hiện/ẩn mật khẩu"
              >
                <i :class="showPassword ? 'fa-solid fa-eye-slash' : 'fa-solid fa-eye'"></i>
              </button>
            </div>
          </div>

          <div class="form-options">
            <label class="remember-me">
              <input type="checkbox" v-model="loginForm.remember" />
              <span>Ghi nhớ đăng nhập</span>
            </label>
            <a href="#" class="forgot-link" @click.prevent="showToast('Thông báo', 'Vui lòng sử dụng tài khoản mẫu hoặc đăng ký mới!', 'info')">
              Quên mật khẩu?
            </a>
          </div>

          <button type="submit" class="btn btn-primary btn-submit" :disabled="isSubmitting">
            <i v-if="isSubmitting" class="fa-solid fa-spinner fa-spin"></i>
            <span v-else>Đăng Nhập</span>
          </button>
        </form>

        <!-- Quick Demo Accounts -->
        <div class="demo-section">
          <div class="demo-divider">
            <span>Tài khoản thử nghiệm nhanh</span>
          </div>
          <div class="demo-buttons">
            <button class="btn-demo" @click="handleQuickDemoLogin('demo@fashion.vn')">
              <i class="fa-solid fa-user-check text-primary"></i>
              <span>Khách hàng (demo@fashion.vn)</span>
            </button>
            <button class="btn-demo" @click="handleQuickDemoLogin('binh24ct1@donga.edu.vn')">
              <i class="fa-solid fa-graduation-cap text-accent"></i>
              <span>Ngô Quang Bình (24CT1)</span>
            </button>
          </div>
        </div>
      </div>

      <!-- TAB 2: REGISTER FORM -->
      <div v-else class="form-container">
        <div v-if="errors.reg" class="alert-error">
          <i class="fa-solid fa-circle-exclamation"></i>
          <span>{{ errors.reg }}</span>
        </div>

        <form @submit.prevent="handleRegister">
          <div class="input-group">
            <label>Họ và tên <span class="req">*</span></label>
            <div class="input-field-wrap">
              <i class="fa-regular fa-user input-icon"></i>
              <input
                type="text"
                v-model="registerForm.fullName"
                placeholder="VD: Trần Hoàng Nam"
                required
              />
            </div>
          </div>

          <div class="form-row-2">
            <div class="input-group">
              <label>Email <span class="req">*</span></label>
              <div class="input-field-wrap">
                <i class="fa-regular fa-envelope input-icon"></i>
                <input
                  type="email"
                  v-model="registerForm.email"
                  placeholder="nam@gmail.com"
                  required
                />
              </div>
            </div>

            <div class="input-group">
              <label>Số điện thoại <span class="req">*</span></label>
              <div class="input-field-wrap">
                <i class="fa-solid fa-phone input-icon"></i>
                <input
                  type="tel"
                  v-model="registerForm.phone"
                  placeholder="0912345678"
                  required
                />
              </div>
            </div>
          </div>

          <div class="input-group">
            <label>Địa chỉ giao hàng mặc định</label>
            <div class="input-field-wrap">
              <i class="fa-solid fa-location-dot input-icon"></i>
              <input
                type="text"
                v-model="registerForm.address"
                placeholder="Số nhà, đường, quận/huyện..."
              />
            </div>
          </div>

          <div class="form-row-2">
            <div class="input-group">
              <label>Mật khẩu <span class="req">*</span></label>
              <div class="input-field-wrap">
                <i class="fa-solid fa-lock input-icon"></i>
                <input
                  :type="showPassword ? 'text' : 'password'"
                  v-model="registerForm.password"
                  placeholder="Từ 6 ký tự..."
                  required
                />
              </div>
            </div>

            <div class="input-group">
              <label>Xác nhận mật khẩu <span class="req">*</span></label>
              <div class="input-field-wrap">
                <i class="fa-solid fa-lock input-icon"></i>
                <input
                  :type="showPassword ? 'text' : 'password'"
                  v-model="registerForm.confirmPassword"
                  placeholder="Nhập lại mật khẩu..."
                  required
                />
              </div>
            </div>
          </div>

          <div class="form-options">
            <label class="remember-me">
              <input type="checkbox" v-model="registerForm.agreeTerms" />
              <span>Tôi đồng ý với Điều khoản dịch vụ & Chính sách bảo mật</span>
            </label>
          </div>

          <button type="submit" class="btn btn-primary btn-submit" :disabled="isSubmitting">
            <i v-if="isSubmitting" class="fa-solid fa-spinner fa-spin"></i>
            <span v-else>Tạo Tài Khoản Mới</span>
          </button>
        </form>
      </div>
    </div>
  </div>
</template>

<style scoped>
.auth-modal {
  background: #ffffff;
  border-radius: var(--radius-lg);
  max-width: 480px;
  width: 100%;
  max-height: 90vh;
  overflow-y: auto;
  position: relative;
  box-shadow: var(--shadow-xl);
  padding: 32px 28px;
  animation: slideUp 0.25s ease-out;
}

.modal-close-btn {
  position: absolute;
  top: 16px;
  right: 16px;
  width: 34px;
  height: 34px;
  border-radius: 50%;
  background: #f1f5f9;
  color: var(--text-muted);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1rem;
  transition: var(--transition);
}
.modal-close-btn:hover {
  background: #e2e8f0;
  color: var(--dark);
}

.auth-header {
  text-align: center;
  margin-bottom: 20px;
}

.auth-logo {
  width: 46px;
  height: 46px;
  border-radius: 12px;
  background: linear-gradient(135deg, #4f46e5 0%, #3b82f6 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  color: #ffffff;
  font-size: 1.3rem;
  margin: 0 auto 10px;
}

.auth-header h3 {
  font-size: 1.35rem;
  font-weight: 800;
  color: var(--dark);
}

.auth-header h3 span {
  color: var(--primary);
}

.auth-subtitle {
  font-size: 0.85rem;
  color: var(--text-muted);
}

/* Tabs */
.auth-tabs {
  display: flex;
  background: #f1f5f9;
  padding: 4px;
  border-radius: var(--radius-md);
  margin-bottom: 20px;
}

.tab-btn {
  flex: 1;
  padding: 10px;
  border-radius: var(--radius-sm);
  font-size: 0.9rem;
  font-weight: 700;
  color: var(--text-muted);
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  transition: var(--transition);
}

.tab-btn.active {
  background: #ffffff;
  color: var(--primary);
  box-shadow: var(--shadow-sm);
}

/* Form Styles */
.form-container {
  display: flex;
  flex-direction: column;
}

.alert-error {
  background: #fef2f2;
  border: 1px solid #fecaca;
  color: #ef4444;
  padding: 10px 14px;
  border-radius: var(--radius-md);
  font-size: 0.85rem;
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 16px;
}

.input-group {
  margin-bottom: 14px;
}

.input-group label {
  display: block;
  font-size: 0.85rem;
  font-weight: 600;
  color: var(--text-main);
  margin-bottom: 6px;
}

.req {
  color: #ef4444;
}

.input-field-wrap {
  position: relative;
  display: flex;
  align-items: center;
}

.input-icon {
  position: absolute;
  left: 14px;
  color: var(--text-muted);
  font-size: 0.95rem;
  pointer-events: none;
}

.input-field-wrap input {
  width: 100%;
  padding: 10px 38px 10px 40px;
  border-radius: var(--radius-md);
  border: 1px solid var(--border);
  background: #f8fafc;
  font-size: 0.9rem;
  color: var(--text-main);
  transition: var(--transition);
}

.input-field-wrap input:focus {
  border-color: var(--primary);
  background: #ffffff;
  box-shadow: 0 0 0 3px rgba(79, 70, 229, 0.12);
}

.toggle-pass-btn {
  position: absolute;
  right: 12px;
  color: var(--text-muted);
  padding: 4px;
}
.toggle-pass-btn:hover {
  color: var(--dark);
}

.form-row-2 {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
}

.form-options {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 20px;
  font-size: 0.85rem;
}

.remember-me {
  display: flex;
  align-items: center;
  gap: 6px;
  color: var(--text-muted);
  cursor: pointer;
}

.forgot-link {
  color: var(--primary);
  font-weight: 600;
}

.btn-submit {
  width: 100%;
  padding: 12px;
  font-size: 1rem;
}

/* Quick Demo section */
.demo-section {
  margin-top: 24px;
  padding-top: 16px;
  border-top: 1px dashed var(--border);
}

.demo-divider {
  text-align: center;
  margin-bottom: 12px;
}

.demo-divider span {
  font-size: 0.78rem;
  color: var(--text-muted);
  background: #ffffff;
  padding: 0 8px;
}

.demo-buttons {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.btn-demo {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 8px 14px;
  background: #f8fafc;
  border: 1px solid var(--border);
  border-radius: var(--radius-md);
  font-size: 0.85rem;
  font-weight: 600;
  color: var(--text-main);
  transition: var(--transition);
}

.btn-demo:hover {
  background: #ffffff;
  border-color: var(--primary);
  box-shadow: var(--shadow-sm);
}

.text-primary { color: var(--primary); }
.text-accent { color: var(--accent); }
</style>

