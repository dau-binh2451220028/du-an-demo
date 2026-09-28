import type { Product } from '../types'

export const PRODUCTS: Product[] = [
  {
    id: 1,
    name: 'Áo Thun Cotton Compact Phom Rộng Basic',
    category: 'ao-thun',
    categoryName: 'Áo Thun',
    gender: 'unisex',
    price: 189000,
    originalPrice: 250000,
    discountPercent: 24,
    image: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=800&q=80',
    images: [
      'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?auto=format&fit=crop&w=800&q=80'
    ],
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    colors: [
      { name: 'Trắng tinh khôi', code: '#ffffff' },
      { name: 'Đen huyền bí', code: '#1f2937' },
      { name: 'Xám tiêu', code: '#9ca3af' },
      { name: 'Xanh rêu', code: '#4b5563' }
    ],
    rating: 4.9,
    reviewsCount: 142,
    soldCount: 850,
    isHot: true,
    isNew: false,
    description: 'Áo thun phong cách tối giản với chất liệu 100% Cotton Compact 220gsm chống nhăn, thấm hút mồ hôi cực tốt. Phom áo Oversize hiện đại phù hợp đi học, đi chơi dạo phố.',
    details: {
      material: '100% Cotton 2 chiều cao cấp định lượng 240gsm',
      fit: 'Oversize / Phom rộng thoải mái',
      origin: 'Sản xuất tại Việt Nam',
      instructions: 'Giặt máy chế độ nhẹ, lộn trái khi giặt và phơi trong bóng râm.'
    }
  },
  {
    id: 2,
    name: 'Áo Sơ Mi Oxford Dài Tay Form Regular',
    category: 'so-mi',
    categoryName: 'Áo Sơ Mi',
    gender: 'nam',
    price: 320000,
    originalPrice: 420000,
    discountPercent: 24,
    image: 'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?auto=format&fit=crop&w=800&q=80',
    images: [
      'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&w=800&q=80'
    ],
    sizes: ['M', 'L', 'XL'],
    colors: [
      { name: 'Xanh da trời', code: '#bfdbfe' },
      { name: 'Trắng công sở', code: '#ffffff' },
      { name: 'Xanh Navy', code: '#1e3a8a' }
    ],
    rating: 4.8,
    reviewsCount: 98,
    soldCount: 430,
    isHot: true,
    isNew: false,
    description: 'Chiếc sơ mi Oxford kinh điển dành cho phái mạnh. Thiết kế cổ bẻ cài nút thanh lịch, vạt áo lượn nhẹ giúp bạn dễ dàng sơ vin hoặc thả ngoài năng động.',
    details: {
      material: 'Vải dệt sợi Oxford 100% Cotton tự nhiên',
      fit: 'Regular fit vừa vặn tôn dáng',
      origin: 'Việt Nam chất lượng cao',
      instructions: 'Ủi ở nhiệt độ trung bình, tránh dùng chất tẩy mạnh.'
    }
  },
  {
    id: 3,
    name: 'Quần Jean Nam Ống Suông Vintage Denim',
    category: 'quan-jean',
    categoryName: 'Quần Jean',
    gender: 'nam',
    price: 399000,
    originalPrice: 550000,
    discountPercent: 27,
    image: 'https://images.unsplash.com/photo-1542272604-787c3835535d?auto=format&fit=crop&w=800&q=80',
    images: [
      'https://images.unsplash.com/photo-1542272604-787c3835535d?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?auto=format&fit=crop&w=800&q=80'
    ],
    sizes: ['29', '30', '31', '32', '34'],
    colors: [
      { name: 'Xanh Wash Cổ Điển', code: '#3b82f6' },
      { name: 'Xanh Đậm Indigo', code: '#1e3a8a' },
      { name: 'Đen Khói', code: '#374151' }
    ],
    rating: 4.7,
    reviewsCount: 215,
    soldCount: 980,
    isHot: true,
    isNew: true,
    description: 'Quần bò denim ống suông thoải mái, công nghệ wash tạo màu sắc cổ điển thời thượng. Khóa kéo YKK đồng bền bỉ, đường may chỉ đôi chắc chắn.',
    details: {
      material: 'Denim Cotton 13oz có pha 2% spandex co giãn nhẹ',
      fit: 'Straight Leg (Ống suông thẳng đứng)',
      origin: 'Việt Nam',
      instructions: 'Giặt riêng lần đầu với nước muối loãng để giữ màu bền lâu.'
    }
  },
  {
    id: 4,
    name: 'Áo Khoác Bomber Kaki 2 Lớp Chống Gió',
    category: 'ao-khoac',
    categoryName: 'Áo Khoác',
    gender: 'unisex',
    price: 480000,
    originalPrice: 650000,
    discountPercent: 26,
    image: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?auto=format&fit=crop&w=800&q=80',
    images: [
      'https://images.unsplash.com/photo-1551028719-00167b16eac5?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1548883354-7622d03aca27?auto=format&fit=crop&w=800&q=80'
    ],
    sizes: ['M', 'L', 'XL'],
    colors: [
      { name: 'Xanh Rêu Quân Đội', code: '#3f4f38' },
      { name: 'Đen Nhám', code: '#111827' },
      { name: 'Màu Be Cát', code: '#d4b996' }
    ],
    rating: 4.9,
    reviewsCount: 76,
    soldCount: 310,
    isHot: false,
    isNew: true,
    description: 'Bomber Kaki thời trang dạo phố, có lót lớp dù gió bên trong giữ ấm và chắn gió vượt trội. Thiết kế bo chun tay và gấu áo dệt kim cao cấp.',
    details: {
      material: 'Vải Kaki dệt mật độ cao + Lớp lót gió Polyeste',
      fit: 'Bomber Fit cá tính',
      origin: 'Việt Nam',
      instructions: 'Nên giặt khô hoặc giặt nhẹ, không sấy nhiệt độ cao.'
    }
  },
  {
    id: 5,
    name: 'Váy Đầm Hoa Nhí Cổ V Dáng Xòe Tiểu Thư',
    category: 'vay-dam',
    categoryName: 'Váy & Đầm',
    gender: 'nu',
    price: 349000,
    originalPrice: 490000,
    discountPercent: 29,
    image: 'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?auto=format&fit=crop&w=800&q=80',
    images: [
      'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?auto=format&fit=crop&w=800&q=80'
    ],
    sizes: ['S', 'M', 'L'],
    colors: [
      { name: 'Vàng Kem Nhạt', code: '#fef08a' },
      { name: 'Hồng Pastel', code: '#fbcfe8' },
      { name: 'Xanh Bơ', code: '#bbf7d0' }
    ],
    rating: 4.9,
    reviewsCount: 188,
    soldCount: 720,
    isHot: true,
    isNew: true,
    description: 'Mẫu đầm phong cách Pháp dịu dàng thanh lịch, thiết kế thắt eo nhẹ nhàng tôn dáng với chất liệu voan tơ 2 lớp bồng bềnh.',
    details: {
      material: 'Voan tơ lụa cao cấp có lót lụa habutai mềm mát',
      fit: 'Dáng xòe A-line nhẹ nhàng',
      origin: 'Việt Nam',
      instructions: 'Giặt tay nhẹ nhàng hoặc dùng túi giặt khi giặt máy.'
    }
  },
  {
    id: 6,
    name: 'Áo Hoodie Nỉ Bông Chân Cua Form Boxy',
    category: 'ao-khoac',
    categoryName: 'Áo Khoác',
    gender: 'unisex',
    price: 350000,
    originalPrice: 450000,
    discountPercent: 22,
    image: 'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&w=800&q=80',
    images: [
      'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1578632767115-351597cf2477?auto=format&fit=crop&w=800&q=80'
    ],
    sizes: ['M', 'L', 'XL'],
    colors: [
      { name: 'Xám Chuột', code: '#6b7280' },
      { name: 'Đen Basic', code: '#111827' },
      { name: 'Nâu Cà Phê', code: '#78350f' }
    ],
    rating: 4.8,
    reviewsCount: 134,
    soldCount: 540,
    isHot: false,
    isNew: true,
    description: 'Áo nỉ chui đầu có nón 2 lớp dày dặn, form dáng Boxy năng động chuẩn phong cách Streetwear hiện đại trẻ trung.',
    details: {
      material: 'Nỉ chân cua 380gsm không xù lông',
      fit: 'Boxy Fit rộng ngang, dài vừa phải',
      origin: 'Việt Nam',
      instructions: 'Tránh phơi dưới nắng gắt trực tiếp, không tẩy clo.'
    }
  },
  {
    id: 7,
    name: 'Quần Jean Nữ Cạp Cao Ống Rộng Wide Leg',
    category: 'quan-jean',
    categoryName: 'Quần Jean',
    gender: 'nu',
    price: 330000,
    originalPrice: 450000,
    discountPercent: 27,
    image: 'https://images.unsplash.com/photo-1582418702059-97ebafb35d09?auto=format&fit=crop&w=800&q=80',
    images: [
      'https://images.unsplash.com/photo-1582418702059-97ebafb35d09?auto=format&fit=crop&w=800&q=80'
    ],
    sizes: ['S', 'M', 'L'],
    colors: [
      { name: 'Xanh Nhạt Vintage', code: '#93c5fd' },
      { name: 'Đen Tuyền', code: '#18181b' }
    ],
    rating: 4.7,
    reviewsCount: 92,
    soldCount: 390,
    isHot: false,
    isNew: false,
    description: 'Mẫu quần jean "hack dáng" kéo dài đôi chân cực đỉnh. Cạp quần ôm khít vòng eo, ống rộng thả suông tạo phong cách thời thượng.',
    details: {
      material: '100% Jean Denim dệt dày dặn',
      fit: 'High-waisted Wide Leg',
      origin: 'Việt Nam',
      instructions: 'Lộn mặt trái khi phơi để màu quần luôn như mới.'
    }
  },
  {
    id: 8,
    name: 'Mũ Lưỡi Trai Thêu Chữ Ký Phong Cách Hàn Quốc',
    category: 'phu-kien',
    categoryName: 'Phụ Kiện',
    gender: 'unisex',
    price: 99000,
    originalPrice: 150000,
    discountPercent: 34,
    image: 'https://images.unsplash.com/photo-1588850561407-ed78c282e89b?auto=format&fit=crop&w=800&q=80',
    images: [
      'https://images.unsplash.com/photo-1588850561407-ed78c282e89b?auto=format&fit=crop&w=800&q=80'
    ],
    sizes: ['Free Size'],
    colors: [
      { name: 'Đen Trơn', code: '#111827' },
      { name: 'Trắng Kem', code: '#f3f4f6' },
      { name: 'Xanh Đậm Navy', code: '#1e3a8a' }
    ],
    rating: 4.8,
    reviewsCount: 310,
    soldCount: 1500,
    isHot: true,
    isNew: false,
    description: 'Nón kết form mềm chuẩn thời trang Streetwear, chất vải Kaki dệt thoáng khí, khóa kim loại tăng giảm vòng đầu phía sau tiện dụng.',
    details: {
      material: 'Kaki cotton 100%',
      fit: 'Có khóa gài điều chỉnh kích cỡ tự do (54 - 60cm)',
      origin: 'Việt Nam',
      instructions: 'Giặt bằng bàn chải mềm với nước xà phòng loãng.'
    }
  },
  {
    id: 9,
    name: 'Áo Sơ Mi Lụa Cổ Bèo Nơ Nữ Điệu Đà',
    category: 'so-mi',
    categoryName: 'Áo Sơ Mi',
    gender: 'nu',
    price: 290000,
    originalPrice: 380000,
    discountPercent: 23,
    image: 'https://images.unsplash.com/photo-1564257631407-4deb1f99d992?auto=format&fit=crop&w=800&q=80',
    images: [
      'https://images.unsplash.com/photo-1564257631407-4deb1f99d992?auto=format&fit=crop&w=800&q=80'
    ],
    sizes: ['S', 'M', 'L'],
    colors: [
      { name: 'Trắng Sữa', code: '#fdfbf7' },
      { name: 'Hồng Phấn', code: '#fce7f3' }
    ],
    rating: 4.6,
    reviewsCount: 45,
    soldCount: 180,
    isHot: false,
    isNew: true,
    description: 'Thiết kế tinh tế dành cho nàng công sở hoặc dạo phố cuối tuần, phối nơ cổ thắt linh hoạt tạo điểm nhấn dịu dàng, sang trọng.',
    details: {
      material: 'Lụa tuyết nhung mềm mịn chống nhăn',
      fit: 'Regular dịu dàng',
      origin: 'Việt Nam',
      instructions: 'Giặt nhẹ tay, ủi hơi nước.'
    }
  },
  {
    id: 10,
    name: 'Túi Tote Vải Canvas In Họa Tiết Retro 24CT1',
    category: 'phu-kien',
    categoryName: 'Phụ Kiện',
    gender: 'unisex',
    price: 120000,
    originalPrice: 180000,
    discountPercent: 33,
    image: 'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=800&q=80',
    images: [
      'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=800&q=80'
    ],
    sizes: ['Free Size (38x42cm)'],
    colors: [
      { name: 'Trắng Ngà Tự Nhiên', code: '#f5f5dc' },
      { name: 'Đen Cá Tính', code: '#1f2937' }
    ],
    rating: 4.9,
    reviewsCount: 88,
    soldCount: 650,
    isHot: false,
    isNew: true,
    description: 'Túi tote đựng vừa laptop 15.6 inch và giáo trình đại học, có khóa kéo miệng và ngăn nhỏ đựng chìa khóa, điện thoại vô cùng tiện lợi.',
    details: {
      material: 'Canvas thô dày dặn mộc mạc',
      fit: 'Kích thước rộng rãi đựng nhiều đồ dùng học tập',
      origin: 'Việt Nam',
      instructions: 'Giặt nước lạnh, tránh ngâm lâu.'
    }
  }
]

export const CATEGORIES = [
  { id: 'all', name: 'Tất cả sản phẩm', icon: 'fa-solid fa-border-all' },
  { id: 'ao-thun', name: 'Áo Thun', icon: 'fa-solid fa-shirt' },
  { id: 'so-mi', name: 'Áo Sơ Mi', icon: 'fa-solid fa-vest' },
  { id: 'quan-jean', name: 'Quần Jean', icon: 'fa-solid fa-person' },
  { id: 'ao-khoac', name: 'Áo Khoác', icon: 'fa-solid fa-snowflake' },
  { id: 'vay-dam', name: 'Váy & Đầm', icon: 'fa-solid fa-person-dress' },
  { id: 'phu-kien', name: 'Phụ Kiện', icon: 'fa-solid fa-hat-cowboy' }
]

export const VOUCHERS: Record<string, { discountPercent: number; minOrder: number; description: string }> = {
  BINH20: { discountPercent: 20, minOrder: 300000, description: 'Giảm 20% cho đơn từ 300.000đ' },
  FASHION10: { discountPercent: 10, minOrder: 200000, description: 'Giảm 10% cho đơn hàng đầu tiên' },
  FREESHIP: { discountPercent: 0, minOrder: 0, description: 'Miễn phí vận chuyển toàn quốc' }
}

