import { ref, computed } from 'vue'

const WISHLIST_STORAGE_KEY = 'binh_fashion_wishlist'

// Load saved wishlist from localStorage
const savedWishlist = localStorage.getItem(WISHLIST_STORAGE_KEY)
const wishlistIds = ref<number[]>(savedWishlist ? JSON.parse(savedWishlist) : [])

const saveWishlist = () => {
  localStorage.setItem(WISHLIST_STORAGE_KEY, JSON.stringify(wishlistIds.value))
}

export function useWishlist() {
  const isInWishlist = (productId: number) => {
    return wishlistIds.value.includes(productId)
  }

  const toggleWishlist = (productId: number) => {
    const index = wishlistIds.value.indexOf(productId)
    if (index > -1) {
      wishlistIds.value.splice(index, 1)
    } else {
      wishlistIds.value.push(productId)
    }
    saveWishlist()
  }

  const wishlistCount = computed(() => wishlistIds.value.length)

  return {
    wishlistIds,
    wishlistCount,
    isInWishlist,
    toggleWishlist
  }
}

