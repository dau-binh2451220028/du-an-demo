<script setup lang="ts">
import { ref, reactive, nextTick, onMounted } from 'vue'
import type { ChatMessage, Product } from '../types'
import { PRODUCTS } from '../data/products'

const emit = defineEmits<{
  (e: 'quickView', product: Product): void
}>()

const isOpen = ref(false)
const isTyping = ref(false)
const inputMessage = ref('')
const chatBodyRef = ref<HTMLElement | null>(null)
const unreadHint = ref(true)

const messages = reactive<ChatMessage[]>([
  {
    id: 'msg_welcome',
    sender: 'bot',
    text: 'Xin chào bạn! Mình là Trợ lý ảo AI của Bình Fashion (24CT1). Mình có thể giúp bạn chọn size chuẩn, tìm kiếm trang phục hoặc cung cấp mã giảm giá hot hôm nay!',
    timestamp: 'Vừa xong',
    quickOptions: [
      '📏 Tư vấn chọn size áo / quần',
      '🎁 Có mã giảm giá nào hôm nay?',
      '👕 Gợi ý mẫu áo thun hot',
      '🔄 Chính sách đổi trả như thế nào?'
    ]
  }
])

const scrollToBottom = () => {
  nextTick(() => {
    if (chatBodyRef.value) {
      chatBodyRef.value.scrollTop = chatBodyRef.value.scrollHeight
    }
  })
}

const toggleChat = () => {
  isOpen.value = !isOpen.value
  if (isOpen.value) {
    unreadHint.value = false
    scrollToBottom()
  }
}

// Logic AI Response Engine
const generateBotReply = (userQuery: string) => {
  const query = userQuery.toLowerCase().trim()

  // 1. Height and Weight size advisor
  // Checks formats like "1m70 65kg", "cao 175 nang 70", "1m68 55kg"
  const heightMatch = query.match(/(?:cao\s*)?(\d{1,3}(?:\.\d{1,2}|m\d{1,2}|cm)?)/i)
  const weightMatch = query.match(/(?:nặng\s*)?(\d{2,3})\s*(?:kg|kí|cân)?/i)

  if (query.includes('size') || (heightMatch && weightMatch && (query.includes('cao') || query.includes('nặng') || query.includes('m')))) {
    // Try to extract exact numbers
    let height = 0
    let weight = 0

    const rawHeightNum = query.match(/(\d{1,3}(?:\.\d{1,2}|m\d{2})?)/)
    const rawWeightNum = query.match(/(\d{2,3})\s*(?:kg|kí|cân)/)

    // Parse height in cm
    if (rawHeightNum) {
      const hStr = rawHeightNum[0].replace('m', '.')
      const hVal = parseFloat(hStr)
      if (hVal < 3) height = Math.round(hVal * 100) // 1.70m -> 170cm
      else height = hVal
    }

    // Parse weight in kg
    if (rawWeightNum && rawWeightNum[1]) {
      weight = parseInt(rawWeightNum[1], 10)
    }

    if (height > 100 && weight > 30) {
      let recommendedSize = 'M'
      let note = ''

      if (weight < 52 && height < 162) {
        recommendedSize = 'S'
        note = 'Dáng người vừa vặn nhỏ gọn, mặc size S sẽ ôm đẹp tôn dáng.'
      } else if (weight <= 63 && height <= 170) {
        recommendedSize = 'M'
        note = 'Phom dáng chuẩn người Việt Nam, mặc size M vừa vặn thoải mái.'
      } else if (weight <= 73 && height <= 178) {
        recommendedSize = 'L'
        note = 'Mặc size L chuẩn đẹp. Nếu bạn thích mặc phong cách Oversize rộng rãi thì có thể cân nhắc lên size XL nhé!'
      } else if (weight <= 84 && height <= 185) {
        recommendedSize = 'XL'
        note = 'Size XL sẽ mang lại cảm giác cử động thoải mái nhất.'
      } else {
        recommendedSize = 'XXL'
        note = 'Size XXL rộng rãi, thoáng mát thích hợp phong cách Streetwear phóng khoáng.'
      }

      return {
        text: `📊 Dựa trên chiều cao **${height}cm** và cân nặng **${weight}kg**, size trang phục chuẩn nhất dành cho bạn là **SIZE ${recommendedSize}**!\n\n💡 Lời khuyên: ${note}`,
        quickOptions: ['Xem áo thun Size ' + recommendedSize, 'Xem quần jean', 'Mã giảm giá hôm nay']
      }
    } else {
      return {
        text: '📏 Để mình tư vấn size chính xác nhất, bạn vui lòng nhập rõ chiều cao và cân nặng nhé!\n\nVí dụ: *"Mình cao 1m72 nặng 65kg mặc size gì?"* hoặc *"1m60 50kg"*',
        quickOptions: ['Cao 1m65 nặng 55kg', 'Cao 1m70 nặng 65kg', 'Cao 1m75 nặng 72kg']
      }
    }
  }

  // 2. Vouchers & Discounts
  if (query.includes('giảm giá') || query.includes('voucher') || query.includes('mã') || query.includes('sale') || query.includes('khuyến mãi')) {
    return {
      text: '🎉 Hôm nay Bình Fashion đang có các mã giảm giá siêu hấp dẫn dành cho bạn:\n\n' +
        '1. **BINH20**: Giảm ngay **20%** cho đơn hàng từ 300.000đ.\n' +
        '2. **FREESHIP**: Miễn phí vận chuyển toàn quốc cho mọi đơn hàng.\n' +
        '3. **FASHION10**: Giảm **10%** cho đơn hàng đầu tiên.\n\n' +
        '👉 Bạn hãy bấm vào Giỏ hàng và nhập mã tại ô Voucher để được áp dụng ngay nhé!',
      quickOptions: ['Xem giỏ hàng', 'Gợi ý áo thun hot', 'Tư vấn chọn size']
    }
  }

  // 3. Product categories recommendations
  if (query.includes('áo thun') || query.includes('t-shirt') || query.includes('phông')) {
    const matched = PRODUCTS.filter((p) => p.category === 'ao-thun')
    return {
      text: `🔥 Dưới đây là mẫu áo thun Cotton Compact bán chạy nhất của shop, chất liệu cotton 240gsm cực kỳ thoáng mát:`,
      suggestedProducts: matched,
      quickOptions: ['Tư vấn size áo thun', 'Có mã giảm giá không?', 'Xem áo sơ mi']
    }
  }

  if (query.includes('sơ mi') || query.includes('so mi')) {
    const matched = PRODUCTS.filter((p) => p.category === 'so-mi')
    return {
      text: `👔 Đây là các mẫu áo sơ mi phong cách Oxford & Lụa cao cấp cực thanh lịch:`,
      suggestedProducts: matched,
      quickOptions: ['Tư vấn size sơ mi', 'Xem quần jean phối cùng']
    }
  }

  if (query.includes('jean') || query.includes('quần') || query.includes('bò')) {
    const matched = PRODUCTS.filter((p) => p.category === 'quan-jean')
    return {
      text: `👖 Quần jean denim wash phong cách vintage ống suông và ống rộng hack dáng cực đỉnh:`,
      suggestedProducts: matched,
      quickOptions: ['Tư vấn size quần', 'Xem áo khoác bomber']
    }
  }

  if (query.includes('khoác') || query.includes('hoodie') || query.includes('bomber') || query.includes('áo ấm')) {
    const matched = PRODUCTS.filter((p) => p.category === 'ao-khoac')
    return {
      text: `🧥 Bộ sưu tập áo khoác Bomber 2 lớp và Hoodie nỉ chân cua form Boxy siêu chất:`,
      suggestedProducts: matched,
      quickOptions: ['Tư vấn chọn size', 'Mã giảm giá hôm nay']
    }
  }

  if (query.includes('váy') || query.includes('đầm') || query.includes('nữ')) {
    const matched = PRODUCTS.filter((p) => p.category === 'vay-dam')
    return {
      text: `👗 Mẫu đầm hoa nhí cổ V phong cách Pháp tiểu thư dịu dàng tôn dáng:`,
      suggestedProducts: matched,
      quickOptions: ['Chính sách đổi trả', 'Phí vận chuyển bao nhiêu?']
    }
  }

  if (query.includes('phụ kiện') || query.includes('mũ') || query.includes('nón') || query.includes('túi')) {
    const matched = PRODUCTS.filter((p) => p.category === 'phu-kien')
    return {
      text: `🧢 Phụ kiện mũ lưỡi trai thêu chữ ký và túi tote canvas retro đựng vừa laptop:`,
      suggestedProducts: matched,
      quickOptions: ['Xem tất cả sản phẩm', 'Mã giảm giá hôm nay']
    }
  }

  // 4. Policies
  if (query.includes('đổi trả') || query.includes('bảo hành') || query.includes('lỗi')) {
    return {
      text: '🛡️ **Chính sách đổi trả 30 ngày tại Bình Fashion:**\n\n' +
        '• Đổi size miễn phí tận nhà trong vòng 30 ngày kể từ khi nhận hàng.\n' +
        '• Sản phẩm đổi phải còn nguyên tem mác, chưa qua giặt ủi.\n' +
        '• Nếu sản phẩm có lỗi từ nhà sản xuất, shop hỗ trợ 1 đổi 1 ngay lập tức hoàn toàn miễn phí!',
      quickOptions: ['Thời gian giao hàng bao lâu?', 'Mã giảm giá hôm nay', 'Tư vấn chọn size']
    }
  }

  if (query.includes('ship') || query.includes('vận chuyển') || query.includes('giao hàng') || query.includes('bao lâu')) {
    return {
      text: '🚚 **Thông tin vận chuyển & giao nhận:**\n\n' +
        '• Nội thành Đà Nẵng: Giao hỏa tốc trong 2 - 4 tiếng hoặc trong ngày.\n' +
        '• Các tỉnh thành khác (Hà Nội, TP.HCM,...): Từ 2 - 3 ngày làm việc.\n' +
        '• **Freeship toàn quốc** cho đơn hàng từ 499.000đ (hoặc dùng mã **FREESHIP**)!',
      quickOptions: ['Mã giảm giá hôm nay', 'Phương thức thanh toán']
    }
  }

  if (query.includes('thanh toán') || query.includes('chuyển khoản') || query.includes('vietqr') || query.includes('cod')) {
    return {
      text: '💳 **Phương thức thanh toán hỗ trợ:**\n\n' +
        '1. **COD**: Kiểm tra hàng ưng ý mới thanh toán tiền mặt cho shipper.\n' +
        '2. **Chuyển khoản VietQR**: Quét mã QR thanh toán nhanh qua ứng dụng ngân hàng MB Bank.\n' +
        '3. **Ví điện tử**: MoMo hoặc VNPAY.',
      quickOptions: ['Xem tất cả sản phẩm', 'Tư vấn chọn size']
    }
  }

  if (query.includes('tác giả') || query.includes('ngô quang bình') || query.includes('24ct1') || query.includes('sinh viên')) {
    return {
      text: '🎓 Website và hệ thống Chatbot này được xây dựng bởi **Ngô Quang Bình**, sinh viên lớp **24CT1** chuyên ngành Công nghệ Phần mềm (CNPM). Rất vui được đồng hành cùng bạn!',
      quickOptions: ['Xem tất cả sản phẩm', '🎁 Có mã giảm giá nào hôm nay?']
    }
  }

  // Fallback polite reply
  return {
    text: `Dạ mình đã ghi nhận câu hỏi của bạn! Bạn có thể hỏi mình về **tư vấn chọn size** (nhập chiều cao, cân nặng), **mã giảm giá**, hoặc tìm các mẫu trang phục (*áo thun, sơ mi, quần jean, áo khoác, váy*)...`,
    quickOptions: [
      '📏 Tư vấn chọn size áo / quần',
      '🎁 Có mã giảm giá nào hôm nay?',
      '👕 Gợi ý mẫu áo thun hot',
      '🔄 Chính sách đổi trả như thế nào?'
    ]
  }
}

const handleSendMessage = (textToSend?: string) => {
  const content = textToSend || inputMessage.value.trim()
  if (!content) return

  // Push user message
  messages.push({
    id: 'user_' + Date.now(),
    sender: 'user',
    text: content,
    timestamp: 'Vừa xong'
  })

  inputMessage.value = ''
  scrollToBottom()

  // Simulate bot thinking
  isTyping.value = true
  setTimeout(() => {
    isTyping.value = false
    const botReply = generateBotReply(content)
    messages.push({
      id: 'bot_' + Date.now(),
      sender: 'bot',
      text: botReply.text,
      timestamp: 'Vừa xong',
      suggestedProducts: botReply.suggestedProducts,
      quickOptions: botReply.quickOptions
    })
    scrollToBottom()
  }, 600)
}

const handleQuickOptionClick = (optionText: string) => {
  handleSendMessage(optionText)
}

const clearConversation = () => {
  messages.length = 0
  messages.push({
    id: 'msg_welcome_reset',
    sender: 'bot',
    text: 'Cuộc trò chuyện đã được làm mới! Mình có thể giúp gì thêm cho bạn?',
    timestamp: 'Vừa xong',
    quickOptions: [
      '📏 Tư vấn chọn size áo / quần',
      '🎁 Có mã giảm giá nào hôm nay?',
      '👕 Gợi ý mẫu áo thun hot'
    ]
  })
}
</script>

<template>
  <div class="chatbot-wrapper">
    <!-- Floating Trigger Bubble -->
    <button
      class="chatbot-bubble"
      :class="{ 'bubble-active': isOpen }"
      @click="toggleChat"
      title="Tư vấn trực tuyến 24/7"
      aria-label="Mở khung chat hỗ trợ"
    >
      <i v-if="!isOpen" class="fa-solid fa-headset bubble-icon"></i>
      <i v-else class="fa-solid fa-chevron-down bubble-icon"></i>

      <span class="active-status-dot"></span>

      <!-- Unread Speech Hint -->
      <div v-if="!isOpen && unreadHint" class="bubble-tooltip">
        <span>Cần tư vấn size & nhận mã giảm giá? Chat ngay!</span>
      </div>
    </button>

    <!-- Chat Box Window -->
    <Transition name="chat-window">
      <div v-if="isOpen" class="chat-window">
        <!-- Header -->
        <div class="chat-header">
          <div class="bot-profile">
            <div class="bot-avatar">
              <i class="fa-solid fa-robot"></i>
              <span class="online-indicator"></span>
            </div>
            <div class="bot-info">
              <h4>Trợ Lý Bình Fashion</h4>
              <span class="bot-status">
                <i class="fa-solid fa-circle text-green"></i> Đang trực tuyến (24CT1)
              </span>
            </div>
          </div>

          <div class="header-tools">
            <button class="tool-btn" @click="clearConversation" title="Làm mới cuộc trò chuyện">
              <i class="fa-solid fa-rotate-right"></i>
            </button>
            <button class="tool-btn" @click="isOpen = false" title="Thu nhỏ">
              <i class="fa-solid fa-xmark"></i>
            </button>
          </div>
        </div>

        <!-- Message Body -->
        <div class="chat-body" ref="chatBodyRef">
          <div
            v-for="msg in messages"
            :key="msg.id"
            :class="['msg-row', msg.sender === 'user' ? 'msg-user' : 'msg-bot']"
          >
            <!-- Bot Avatar for bot messages -->
            <div v-if="msg.sender === 'bot'" class="msg-avatar">
              <i class="fa-solid fa-robot"></i>
            </div>

            <div class="msg-bubble-wrap">
              <div class="msg-bubble">
                <p class="msg-text" style="white-space: pre-line;">{{ msg.text }}</p>
              </div>

              <!-- Suggested Products Carousel inside chat -->
              <div v-if="msg.suggestedProducts && msg.suggestedProducts.length > 0" class="bot-products">
                <div
                  v-for="prod in msg.suggestedProducts"
                  :key="prod.id"
                  class="bot-prod-card"
                  @click="emit('quickView', prod)"
                >
                  <img :src="prod.image" :alt="prod.name" class="bot-prod-img" />
                  <div class="bot-prod-info">
                    <span class="bot-prod-title">{{ prod.name }}</span>
                    <span class="bot-prod-price">{{ prod.price.toLocaleString('vi-VN') }}đ</span>
                  </div>
                  <button class="btn-view-prod" title="Xem nhanh">
                    <i class="fa-solid fa-arrow-right"></i>
                  </button>
                </div>
              </div>

              <!-- Quick Action Chips -->
              <div v-if="msg.quickOptions && msg.quickOptions.length > 0" class="quick-chips">
                <button
                  v-for="opt in msg.quickOptions"
                  :key="opt"
                  class="chip-btn"
                  @click="handleQuickOptionClick(opt)"
                >
                  {{ opt }}
                </button>
              </div>

              <span class="msg-time">{{ msg.timestamp }}</span>
            </div>
          </div>

          <!-- Typing dots indicator -->
          <div v-if="isTyping" class="msg-row msg-bot">
            <div class="msg-avatar">
              <i class="fa-solid fa-robot"></i>
            </div>
            <div class="typing-indicator">
              <span></span>
              <span></span>
              <span></span>
            </div>
          </div>
        </div>

        <!-- Input Footer -->
        <div class="chat-footer">
          <form class="chat-input-form" @submit.prevent="handleSendMessage()">
            <input
              type="text"
              placeholder="Nhập câu hỏi (VD: cao 1m70 65kg size gì?)..."
              v-model="inputMessage"
            />
            <button
              type="submit"
              class="send-btn"
              :disabled="!inputMessage.trim()"
              title="Gửi tin nhắn"
            >
              <i class="fa-solid fa-paper-plane"></i>
            </button>
          </form>
          <div class="footer-caption">
            Hỗ trợ tư vấn thông minh bởi <strong>Bình Fashion - 24CT1</strong>
          </div>
        </div>
      </div>
    </Transition>
  </div>
</template>

<style scoped>
.chatbot-wrapper {
  position: fixed;
  bottom: 28px;
  right: 28px;
  z-index: 990;
}

/* Floating Bubble */
.chatbot-bubble {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background: linear-gradient(135deg, #4f46e5 0%, #3b82f6 100%);
  color: #ffffff;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  box-shadow: 0 10px 25px -3px rgba(79, 70, 229, 0.45);
  position: relative;
  transition: var(--transition);
}

.chatbot-bubble:hover {
  transform: scale(1.08) translateY(-2px);
  box-shadow: 0 14px 28px rgba(79, 70, 229, 0.55);
}

.bubble-active {
  background: #1e293b;
  box-shadow: 0 8px 20px rgba(15, 23, 42, 0.3);
}

.active-status-dot {
  position: absolute;
  top: 3px;
  right: 3px;
  width: 14px;
  height: 14px;
  border-radius: 50%;
  background-color: #10b981;
  border: 2.5px solid #ffffff;
}

/* Tooltip */
.bubble-tooltip {
  position: absolute;
  right: 72px;
  bottom: 10px;
  background: #1e293b;
  color: #ffffff;
  padding: 8px 14px;
  border-radius: var(--radius-md);
  font-size: 0.82rem;
  font-weight: 600;
  white-space: nowrap;
  box-shadow: var(--shadow-lg);
  animation: fadeIn 0.3s ease;
  pointer-events: none;
}

.bubble-tooltip::after {
  content: '';
  position: absolute;
  right: -6px;
  top: 50%;
  transform: translateY(-50%);
  border-width: 6px 0 6px 6px;
  border-style: solid;
  border-color: transparent transparent transparent #1e293b;
}

/* Chat Window */
.chat-window {
  position: absolute;
  bottom: 75px;
  right: 0;
  width: 380px;
  height: 540px;
  background: #ffffff;
  border-radius: 20px;
  box-shadow: 0 20px 40px -10px rgba(0, 0, 0, 0.25);
  border: 1px solid var(--border);
  display: flex;
  flex-direction: column;
  overflow: hidden;
  animation: slideUp 0.25s ease-out;
}

/* Header */
.chat-header {
  background: linear-gradient(135deg, #1e1b4b 0%, #312e81 100%);
  color: #ffffff;
  padding: 16px 20px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.bot-profile {
  display: flex;
  align-items: center;
  gap: 12px;
}

.bot-avatar {
  width: 38px;
  height: 38px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.15);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.1rem;
  position: relative;
}

.online-indicator {
  position: absolute;
  bottom: 0;
  right: 0;
  width: 10px;
  height: 10px;
  background-color: #10b981;
  border-radius: 50%;
  border: 2px solid #312e81;
}

.bot-info h4 {
  font-size: 0.95rem;
  font-weight: 700;
  margin-bottom: 2px;
}

.bot-status {
  font-size: 0.72rem;
  color: #cbd5e1;
  display: flex;
  align-items: center;
  gap: 5px;
}

.text-green {
  color: #10b981;
  font-size: 0.5rem;
}

.header-tools {
  display: flex;
  align-items: center;
  gap: 6px;
}

.tool-btn {
  width: 30px;
  height: 30px;
  border-radius: 50%;
  color: #cbd5e1;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.9rem;
  transition: var(--transition);
}
.tool-btn:hover {
  background: rgba(255, 255, 255, 0.15);
  color: #ffffff;
}

/* Chat Body */
.chat-body {
  flex: 1;
  padding: 18px 16px;
  overflow-y: auto;
  background-color: #f8fafc;
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.msg-row {
  display: flex;
  gap: 8px;
  align-items: flex-end;
}

.msg-bot {
  align-self: flex-start;
}

.msg-user {
  align-self: flex-end;
  flex-direction: row-reverse;
}

.msg-avatar {
  width: 28px;
  height: 28px;
  border-radius: 50%;
  background: var(--primary);
  color: #ffffff;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.75rem;
  flex-shrink: 0;
  margin-bottom: 4px;
}

.msg-bubble-wrap {
  display: flex;
  flex-direction: column;
  max-width: 80%;
}

.msg-user .msg-bubble-wrap {
  align-items: flex-end;
}

.msg-bubble {
  padding: 10px 14px;
  border-radius: 16px;
  font-size: 0.88rem;
  line-height: 1.45;
  word-break: break-word;
}

.msg-bot .msg-bubble {
  background: #ffffff;
  color: var(--text-main);
  border-bottom-left-radius: 4px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.05);
  border: 1px solid #e2e8f0;
}

.msg-user .msg-bubble {
  background: linear-gradient(135deg, #4f46e5 0%, #3b82f6 100%);
  color: #ffffff;
  border-bottom-right-radius: 4px;
}

.msg-time {
  font-size: 0.68rem;
  color: var(--text-muted);
  margin-top: 4px;
  padding: 0 4px;
}

/* Suggested Products */
.bot-products {
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-top: 8px;
}

.bot-prod-card {
  display: flex;
  align-items: center;
  gap: 10px;
  background: #ffffff;
  border: 1px solid #e2e8f0;
  padding: 8px 10px;
  border-radius: 10px;
  cursor: pointer;
  transition: var(--transition);
}

.bot-prod-card:hover {
  border-color: var(--primary);
  transform: translateX(4px);
  box-shadow: var(--shadow-sm);
}

.bot-prod-img {
  width: 44px;
  height: 52px;
  border-radius: 6px;
  object-fit: cover;
}

.bot-prod-info {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.bot-prod-title {
  font-size: 0.8rem;
  font-weight: 700;
  color: var(--text-main);
  line-height: 1.2;
}

.bot-prod-price {
  font-size: 0.82rem;
  font-weight: 700;
  color: var(--accent);
}

.btn-view-prod {
  color: var(--primary);
  font-size: 0.85rem;
  padding: 4px;
}

/* Quick Chips */
.quick-chips {
  display: flex;
  flex-direction: column;
  gap: 6px;
  margin-top: 10px;
}

.chip-btn {
  background: #ffffff;
  border: 1px solid #cbd5e1;
  border-radius: var(--radius-full);
  padding: 6px 12px;
  font-size: 0.78rem;
  font-weight: 600;
  color: var(--primary);
  text-align: left;
  transition: var(--transition);
}

.chip-btn:hover {
  background: var(--primary-light);
  border-color: var(--primary);
}

/* Typing Dots */
.typing-indicator {
  display: flex;
  align-items: center;
  gap: 5px;
  background: #ffffff;
  padding: 10px 14px;
  border-radius: 16px;
  border-bottom-left-radius: 4px;
  border: 1px solid #e2e8f0;
}

.typing-indicator span {
  width: 6px;
  height: 6px;
  background: #94a3b8;
  border-radius: 50%;
  animation: bounce 1.2s infinite ease-in-out;
}

.typing-indicator span:nth-child(1) { animation-delay: 0s; }
.typing-indicator span:nth-child(2) { animation-delay: 0.2s; }
.typing-indicator span:nth-child(3) { animation-delay: 0.4s; }

@keyframes bounce {
  0%, 80%, 100% { transform: translateY(0); }
  40% { transform: translateY(-6px); }
}

/* Footer */
.chat-footer {
  padding: 12px 16px;
  background: #ffffff;
  border-top: 1px solid var(--border);
}

.chat-input-form {
  display: flex;
  align-items: center;
  gap: 8px;
}

.chat-input-form input {
  flex: 1;
  padding: 10px 14px;
  border-radius: var(--radius-full);
  border: 1px solid var(--border);
  font-size: 0.88rem;
  background: #f8fafc;
  transition: var(--transition);
}

.chat-input-form input:focus {
  border-color: var(--primary);
  background: #ffffff;
}

.send-btn {
  width: 38px;
  height: 38px;
  border-radius: 50%;
  background: var(--primary);
  color: #ffffff;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.95rem;
  transition: var(--transition);
  flex-shrink: 0;
}

.send-btn:disabled {
  background: #cbd5e1;
  cursor: not-allowed;
}

.send-btn:hover:not(:disabled) {
  background: var(--primary-hover);
  transform: scale(1.05);
}

.footer-caption {
  text-align: center;
  font-size: 0.68rem;
  color: var(--text-muted);
  margin-top: 6px;
}

@media (max-width: 480px) {
  .chat-window {
    width: calc(100vw - 32px);
    right: -12px;
    height: 480px;
  }
}
</style>
