import { ref, computed } from 'vue'
import type { User } from '../types'

interface StoredAccount extends User {
  password: string
}

const AUTH_USER_KEY = 'binh_fashion_auth_user'
const USERS_LIST_KEY = 'binh_fashion_users_list'

// Default seed users
const INITIAL_USERS: StoredAccount[] = [
  {
    id: 'user_1',
    fullName: 'Nguyễn Văn An',
    email: 'demo@fashion.vn',
    password: '123456',
    phone: '0987654321',
    address: '123 Nguyễn Văn Linh',
    city: 'Đà Nẵng',
    district: 'Hải Châu',
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80'
  },
  {
    id: 'user_2',
    fullName: 'Ngô Quang Bình (24CT1)',
    email: 'binh24ct1@donga.edu.vn',
    password: '123456',
    phone: '0905123456',
    address: '33 Xô Viết Nghệ Tĩnh',
    city: 'Đà Nẵng',
    district: 'Hải Châu',
    avatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&w=150&q=80'
  }
]

// Initialize users from storage or seed
const storedUsersRaw = localStorage.getItem(USERS_LIST_KEY)
const registeredUsers: StoredAccount[] = storedUsersRaw
  ? JSON.parse(storedUsersRaw)
  : INITIAL_USERS

if (!storedUsersRaw) {
  localStorage.setItem(USERS_LIST_KEY, JSON.stringify(INITIAL_USERS))
}

// Current logged in user
const storedUser = localStorage.getItem(AUTH_USER_KEY)
const currentUser = ref<User | null>(storedUser ? JSON.parse(storedUser) : null)

export function useAuth() {
  const isAuthenticated = computed(() => currentUser.value !== null)

  const login = (email: string, password: string): { success: boolean; message: string } => {
    const cleanEmail = email.trim().toLowerCase()
    const users: StoredAccount[] = JSON.parse(localStorage.getItem(USERS_LIST_KEY) || '[]')
    
    const account = users.find((u) => u.email.toLowerCase() === cleanEmail)
    if (!account) {
      return { success: false, message: 'Email này chưa được đăng ký trong hệ thống.' }
    }

    if (account.password !== password) {
      return { success: false, message: 'Mật khẩu không chính xác. Vui lòng thử lại!' }
    }

    // Set authenticated user (omit password)
    const { password: _, ...userWithoutPass } = account
    currentUser.value = userWithoutPass
    localStorage.setItem(AUTH_USER_KEY, JSON.stringify(userWithoutPass))

    return { success: true, message: `Chào mừng bạn trở lại, ${account.fullName}!` }
  }

  const register = (
    fullName: string,
    email: string,
    phone: string,
    password: string,
    address = '',
    city = 'Đà Nẵng',
    district = 'Hải Châu'
  ): { success: boolean; message: string } => {
    const cleanEmail = email.trim().toLowerCase()
    const users: StoredAccount[] = JSON.parse(localStorage.getItem(USERS_LIST_KEY) || '[]')

    const exists = users.some((u) => u.email.toLowerCase() === cleanEmail)
    if (exists) {
      return { success: false, message: 'Email này đã tồn tại trên hệ thống. Vui lòng đăng nhập!' }
    }

    const newUser: StoredAccount = {
      id: 'user_' + Date.now(),
      fullName: fullName.trim(),
      email: cleanEmail,
      phone: phone.trim(),
      password,
      address: address.trim(),
      city,
      district,
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(fullName)}`
    }

    users.push(newUser)
    localStorage.setItem(USERS_LIST_KEY, JSON.stringify(users))

    // Automatically log in after registration
    const { password: _, ...userWithoutPass } = newUser
    currentUser.value = userWithoutPass
    localStorage.setItem(AUTH_USER_KEY, JSON.stringify(userWithoutPass))

    return { success: true, message: `Đăng ký tài khoản thành công! Xin chào ${fullName}.` }
  }

  const logout = () => {
    currentUser.value = null
    localStorage.removeItem(AUTH_USER_KEY)
  }

  return {
    currentUser,
    isAuthenticated,
    login,
    register,
    logout
  }
}
