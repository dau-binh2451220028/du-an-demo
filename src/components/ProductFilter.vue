<script setup lang="ts">
import { CATEGORIES } from '../data/products'

const props = defineProps<{
  selectedCategory: string
  selectedPriceRange: string
  selectedGender: string
  sortBy: string
  totalResults: number
}>()

const emit = defineEmits<{
  (e: 'update:selectedCategory', value: string): void
  (e: 'update:selectedPriceRange', value: string): void
  (e: 'update:selectedGender', value: string): void
  (e: 'update:sortBy', value: string): void
  (e: 'resetFilters'): void
}>()

const priceRanges = [
  { id: 'all', label: 'Tất cả mức giá' },
  { id: 'under-200k', label: 'Dưới 200k' },
  { id: '200k-400k', label: '200k - 400k' },
  { id: 'over-400k', label: 'Trên 400k' }
]

const genders = [
  { id: 'all', label: 'Tất cả giới tính' },
  { id: 'nam', label: 'Nam' },
  { id: 'nu', label: 'Nữ' },
  { id: 'unisex', label: 'Unisex' }
]

const sortOptions = [
  { id: 'popular', label: 'Phổ biến / Bán chạy' },
  { id: 'newest', label: 'Mới nhất' },
  { id: 'price-asc', label: 'Giá: Thấp đến Cao' },
  { id: 'price-desc', label: 'Giá: Cao đến Thấp' },
  { id: 'rating', label: 'Đánh giá cao nhất' }
]

const hasActiveFilters = () => {
  return (
    props.selectedCategory !== 'all' ||
    props.selectedPriceRange !== 'all' ||
    props.selectedGender !== 'all' ||
    props.sortBy !== 'popular'
  )
}
</script>

<template>
  <div class="filter-section">
    <!-- Category Pills -->
    <div class="category-scroll-wrap">
      <div class="category-pills">
        <button
          v-for="cat in CATEGORIES"
          :key="cat.id"
          :class="['category-pill', { active: selectedCategory === cat.id }]"
          @click="emit('update:selectedCategory', cat.id)"
        >
          <i :class="cat.icon"></i>
          <span>{{ cat.name }}</span>
        </button>
      </div>
    </div>

    <!-- Sub Filters & Sort Bar -->
    <div class="filter-controls">
      <div class="filter-controls-left">
        <!-- Price Filter Dropdown -->
        <div class="select-wrapper">
          <i class="fa-solid fa-money-bill-wave select-icon"></i>
          <select
            :value="selectedPriceRange"
            @change="emit('update:selectedPriceRange', ($event.target as HTMLSelectElement).value)"
            class="custom-select"
          >
            <option v-for="price in priceRanges" :key="price.id" :value="price.id">
              {{ price.label }}
            </option>
          </select>
        </div>

        <!-- Gender Filter Dropdown -->
        <div class="select-wrapper">
          <i class="fa-solid fa-venus-mars select-icon"></i>
          <select
            :value="selectedGender"
            @change="emit('update:selectedGender', ($event.target as HTMLSelectElement).value)"
            class="custom-select"
          >
            <option v-for="gender in genders" :key="gender.id" :value="gender.id">
              {{ gender.label }}
            </option>
          </select>
        </div>

        <!-- Reset Button -->
        <button
          v-if="hasActiveFilters()"
          class="btn-reset"
          @click="emit('resetFilters')"
          title="Xóa bộ lọc"
        >
          <i class="fa-solid fa-rotate-left"></i> Xóa lọc
        </button>
      </div>

      <!-- Right: Sort & Count -->
      <div class="filter-controls-right">
        <span class="product-count">
          Tìm thấy <strong>{{ totalResults }}</strong> sản phẩm
        </span>

        <div class="select-wrapper">
          <i class="fa-solid fa-arrow-down-short-wide select-icon"></i>
          <select
            :value="sortBy"
            @change="emit('update:sortBy', ($event.target as HTMLSelectElement).value)"
            class="custom-select"
          >
            <option v-for="sort in sortOptions" :key="sort.id" :value="sort.id">
              {{ sort.label }}
            </option>
          </select>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.filter-section {
  margin-bottom: 32px;
}

/* Category Pills */
.category-scroll-wrap {
  overflow-x: auto;
  padding-bottom: 8px;
  margin-bottom: 20px;
}

.category-scroll-wrap::-webkit-scrollbar {
  height: 4px;
}

.category-pills {
  display: flex;
  gap: 10px;
  min-width: max-content;
}

.category-pill {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 18px;
  border-radius: var(--radius-full);
  background: #ffffff;
  border: 1.5px solid var(--border);
  color: var(--text-muted);
  font-size: 0.9rem;
  font-weight: 600;
  transition: var(--transition);
  white-space: nowrap;
}

.category-pill i {
  font-size: 1rem;
}

.category-pill:hover {
  border-color: var(--primary);
  color: var(--primary);
  background: var(--primary-light);
}

.category-pill.active {
  background: var(--primary);
  border-color: var(--primary);
  color: #ffffff;
  box-shadow: 0 4px 12px rgba(79, 70, 229, 0.3);
}

/* Filter Controls Bar */
.filter-controls {
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 16px;
  background: #ffffff;
  padding: 14px 20px;
  border-radius: var(--radius-lg);
  border: 1px solid var(--border);
  box-shadow: var(--shadow-sm);
}

.filter-controls-left {
  display: flex;
  align-items: center;
  gap: 12px;
  flex-wrap: wrap;
}

.filter-controls-right {
  display: flex;
  align-items: center;
  gap: 16px;
  flex-wrap: wrap;
}

.product-count {
  font-size: 0.9rem;
  color: var(--text-muted);
}

.product-count strong {
  color: var(--dark);
}

/* Custom Select Dropdowns */
.select-wrapper {
  position: relative;
  display: flex;
  align-items: center;
}

.select-icon {
  position: absolute;
  left: 12px;
  color: var(--text-muted);
  font-size: 0.85rem;
  pointer-events: none;
}

.custom-select {
  appearance: none;
  background-color: #f8fafc;
  border: 1px solid var(--border);
  border-radius: var(--radius-md);
  padding: 8px 32px 8px 34px;
  font-size: 0.88rem;
  font-weight: 600;
  color: var(--text-main);
  cursor: pointer;
  transition: var(--transition);
  background-image: url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%2364748b' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e");
  background-repeat: no-repeat;
  background-position: right 10px center;
  background-size: 14px;
}

.custom-select:focus {
  border-color: var(--primary);
  background-color: #ffffff;
  box-shadow: 0 0 0 3px rgba(79, 70, 229, 0.1);
}

.btn-reset {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 8px 12px;
  border-radius: var(--radius-md);
  font-size: 0.85rem;
  font-weight: 600;
  color: #ef4444;
  background: #fef2f2;
  transition: var(--transition);
}

.btn-reset:hover {
  background: #fee2e2;
}

@media (max-width: 768px) {
  .filter-controls {
    flex-direction: column;
    align-items: stretch;
  }
  .filter-controls-left, .filter-controls-right {
    justify-content: space-between;
    width: 100%;
  }
}
</style>

