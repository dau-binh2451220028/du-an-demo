import { ref } from 'vue'
import type { ToastMessage } from '../types'

const toasts = ref<ToastMessage[]>([])

export function useToast() {
  const showToast = (title: string, message: string, type: ToastMessage['type'] = 'success', timeout = 3500) => {
    const id = Date.now().toString() + Math.random().toString(36).substring(2, 6)
    const toast: ToastMessage = { id, title, message, type, timeout }
    toasts.value.push(toast)

    if (timeout > 0) {
      setTimeout(() => {
        removeToast(id)
      }, timeout)
    }
  }

  const removeToast = (id: string) => {
    toasts.value = toasts.value.filter((t) => t.id !== id)
  }

  return {
    toasts,
    showToast,
    removeToast
  }
}

