import React, { useState } from 'react';
import {
  ActivityIndicator,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { PRODUCTS } from '../data/mockData';
import { THEME } from '../theme/theme';
import { Product } from '../types';

interface GeminiAiModalProps {
  visible: boolean;
  onClose: () => void;
  onSelectRecommendedProduct: (product: Product) => void;
}

interface ChatMessage {
  id: string;
  sender: 'user' | 'gemini';
  text: string;
  recommendedProduct?: Product;
}

const QUICK_PROMPTS = [
  '🎂 Tư vấn bánh sinh nhật Mẹ ít ngọt dưới 500k',
  '🌹 Bánh kỷ niệm tình yêu lãng mạn cho bạn gái',
  '🌱 Bánh thuần chay cho người ăn kiêng/dị ứng sữa',
  '🍫 Bánh socola đậm vị cho tiệc sinh nhật bạn nam',
];

let msgSeq = 0;
const createMsgId = (prefix: string) => `${prefix}_${++msgSeq}`;

export const GeminiAiModal: React.FC<GeminiAiModalProps> = ({
  visible,
  onClose,
  onSelectRecommendedProduct,
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      sender: 'gemini',
      text: 'Xin chào! Tôi là Trợ lý AI Miette (Powered by Google Gemini). Bạn đang tìm bánh cho dịp gì, đối tượng nhận là ai, ngân sách và sở thích vị ngọt ra sao?',
    },
  ]);
  const [inputQuery, setInputQuery] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  const handleSendPrompt = (queryText: string) => {
    if (!queryText.trim()) return;

    const userMsg: ChatMessage = {
      id: createMsgId('u'),
      sender: 'user',
      text: queryText.trim(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputQuery('');
    setIsTyping(true);

    // AI Intelligence Response Simulation based on keyword matching
    setTimeout(() => {
      const q = queryText.toLowerCase();
      let matchedProduct = PRODUCTS[0];
      let aiAdvice = '';

      if (q.includes('mẹ') || q.includes('ít ngọt') || q.includes('dâu')) {
        matchedProduct = PRODUCTS[0]; // Bánh Dâu Tây Hoàng Gia
        aiAdvice =
          'Dựa trên mong muốn tặng Mẹ vị thanh nhẹ, tôi gợi ý cho bạn mẫu "Bánh Kem Dâu Tây Hoàng Gia". Bánh dùng kem whipping tươi Pháp ít ngọt, xen kẽ 3 lớp dâu tây Đà Lạt chua ngọt dịu dàng, rất tốt cho sức khỏe người lớn tuổi!';
      } else if (q.includes('chay') || q.includes('kiêng') || q.includes('dị ứng')) {
        matchedProduct = PRODUCTS[7]; // Bánh Thuần Chay Yến Mạch
        aiAdvice =
          'Với chế độ thuần chay hoặc dị ứng sữa/trứng, mẫu "Bánh Yến Mạch Thuần Chay Hạt Dẻ Cười" là lựa chọn số 1. Bánh 100% không sữa động vật, độ ngọt tự nhiên từ quả chà là thượng hạng.';
      } else if (q.includes('kỷ niệm') || q.includes('tình yêu') || q.includes('gái') || q.includes('hoa')) {
        matchedProduct = PRODUCTS[3]; // Red Velvet Hoa Hồng
        aiAdvice =
          'Dành cho ngày kỷ niệm lãng mạn, chiếc "Red Velvet Hoa Hồng & Cream Cheese" với màu đỏ nhung quý phái và vị kem phô mai New Zealand mềm mượt sẽ tạo nên khoảnh khắc vô cùng ngọt ngào!';
      } else if (q.includes('nam') || q.includes('socola') || q.includes('espresso') || q.includes('cafe')) {
        matchedProduct = PRODUCTS[1]; // Tiramisu Mascarpone
        aiAdvice =
          'Đối với phái mạnh hoặc tín đồ cà phê, "Tiramisu Mascarpone Truyền Thống" tẩm đẫm espresso rang mộc và rượu Marsala đậm chất Ý là sự kết hợp hoàn hảo nhất!';
      } else {
        matchedProduct = PRODUCTS[2]; // Chocolate Truffle
        aiAdvice =
          'Tôi đề xuất mẫu "Bánh Chocolate Truffle Bỉ Cổ Điển" 70% cacao giòn bùi hạnh nhân, rất sang trọng và phù hợp cho mọi bữa tiệc sum họp!';
      }

      const botMsg: ChatMessage = {
        id: createMsgId('g'),
        sender: 'gemini',
        text: aiAdvice,
        recommendedProduct: matchedProduct,
      };

      setMessages((prev) => [...prev, botMsg]);
      setIsTyping(false);
    }, 900);
  };

  return (
    <Modal visible={visible} animationType="slide" transparent={false} onRequestClose={onClose}>
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerTitleRow}>
            <View style={styles.aiIconBadge}>
              <Ionicons name="sparkles" size={18} color="#D4AF37" />
            </View>
            <View>
              <View style={styles.titleWithBadge}>
                <Text style={styles.headerTitle}>Miette AI Assistant</Text>
                <View style={styles.geminiBadge}>
                  <Text style={styles.geminiBadgeText}>Gemini 2.0</Text>
                </View>
              </View>
              <Text style={styles.headerSubtitle}>Trợ lý tư vấn chọn bánh thông minh</Text>
            </View>
          </View>
          <TouchableOpacity onPress={onClose} style={styles.closeBtn} activeOpacity={0.7}>
            <Ionicons name="close" size={22} color="#4B5563" />
          </TouchableOpacity>
        </View>

        {/* Quick Suggestion Chips */}
        <View style={styles.quickPromptsSection}>
          <Text style={styles.quickLabel}>Gợi ý câu hỏi nhanh:</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.quickChipsScroll}>
            {QUICK_PROMPTS.map((p, idx) => (
              <TouchableOpacity
                key={idx}
                style={styles.promptChip}
                onPress={() => handleSendPrompt(p)}
                activeOpacity={0.8}
              >
                <Text style={styles.promptChipText}>{p}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Chat Stream */}
        <ScrollView style={styles.chatScroll} contentContainerStyle={styles.chatContent}>
          {messages.map((msg) => (
            <View
              key={msg.id}
              style={[
                styles.messageRow,
                msg.sender === 'user' ? styles.userRow : styles.botRow,
              ]}
            >
              {msg.sender === 'gemini' && (
                <View style={styles.botAvatar}>
                  <Ionicons name="sparkles" size={14} color="#FFFFFF" />
                </View>
              )}
              <View
                style={[
                  styles.bubble,
                  msg.sender === 'user' ? styles.userBubble : styles.botBubble,
                ]}
              >
                <Text
                  style={[
                    styles.messageText,
                    msg.sender === 'user' ? styles.userText : styles.botText,
                  ]}
                >
                  {msg.text}
                </Text>

                {/* AI Product Card Recommendation */}
                {msg.recommendedProduct && (
                  <View style={styles.recommendedCard}>
                    <View style={styles.recHeaderRow}>
                      <Ionicons name="ribbon-outline" size={14} color="#D4AF37" />
                      <Text style={styles.recHeaderTitle}>Gợi ý phù hợp nhất:</Text>
                    </View>
                    <Text style={styles.recName}>{msg.recommendedProduct.name}</Text>
                    <Text style={styles.recPrice}>
                      {msg.recommendedProduct.variants[0]?.price.toLocaleString('vi-VN')}đ
                    </Text>
                    <TouchableOpacity
                      style={styles.recActionBtn}
                      onPress={() => {
                        onClose();
                        onSelectRecommendedProduct(msg.recommendedProduct!);
                      }}
                      activeOpacity={0.85}
                    >
                      <Text style={styles.recActionBtnText}>Xem chi tiết bánh</Text>
                      <Ionicons name="arrow-forward" size={14} color="#FFFFFF" />
                    </TouchableOpacity>
                  </View>
                )}
              </View>
            </View>
          ))}

          {isTyping && (
            <View style={[styles.messageRow, styles.botRow]}>
              <View style={styles.botAvatar}>
                <Ionicons name="sparkles" size={14} color="#FFFFFF" />
              </View>
              <View style={[styles.bubble, styles.botBubble, { flexDirection: 'row', alignItems: 'center', gap: 6 }]}>
                <ActivityIndicator size="small" color={THEME.colors.primary} />
                <Text style={styles.botText}>AI đang phân tích sở thích của bạn...</Text>
              </View>
            </View>
          )}
        </ScrollView>

        {/* Input Bar */}
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Hỏi Gemini: 'Tư vấn bánh cho bé trai 5 tuổi'..."
            value={inputQuery}
            onChangeText={setInputQuery}
            placeholderTextColor="#9CA3AF"
            onSubmitEditing={() => handleSendPrompt(inputQuery)}
          />
          <TouchableOpacity
            style={[styles.sendBtn, !inputQuery.trim() && styles.sendBtnDisabled]}
            disabled={!inputQuery.trim()}
            onPress={() => handleSendPrompt(inputQuery)}
            activeOpacity={0.8}
          >
            <Ionicons name="send" size={16} color="#FFFFFF" />
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9F6F0',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 48,
    paddingBottom: 12,
    backgroundColor: '#30171F',
  },
  headerTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  aiIconBadge: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(212, 175, 55, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#D4AF37',
  },
  titleWithBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  geminiBadge: {
    backgroundColor: '#4338CA',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  geminiBadgeText: {
    fontSize: 9,
    color: '#FFFFFF',
    fontWeight: '800',
  },
  headerSubtitle: {
    fontSize: 11,
    color: '#D1D5DB',
    marginTop: 1,
  },
  closeBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  quickPromptsSection: {
    paddingVertical: 10,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  quickLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: '#6B7280',
    paddingHorizontal: 16,
    marginBottom: 6,
  },
  quickChipsScroll: {
    paddingHorizontal: 16,
    gap: 8,
  },
  promptChip: {
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  promptChipText: {
    fontSize: 11,
    color: '#374151',
    fontWeight: '600',
  },
  chatScroll: {
    flex: 1,
  },
  chatContent: {
    padding: 16,
    gap: 12,
    paddingBottom: 24,
  },
  messageRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 8,
  },
  userRow: {
    justifyContent: 'flex-end',
  },
  botRow: {
    justifyContent: 'flex-start',
  },
  botAvatar: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: THEME.colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  bubble: {
    maxWidth: '82%',
    borderRadius: 16,
    padding: 12,
  },
  userBubble: {
    backgroundColor: THEME.colors.primary,
    borderBottomRightRadius: 4,
  },
  botBubble: {
    backgroundColor: '#FFFFFF',
    borderBottomLeftRadius: 4,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  messageText: {
    fontSize: 13,
    lineHeight: 19,
  },
  userText: {
    color: '#FFFFFF',
  },
  botText: {
    color: '#1F2937',
  },
  recommendedCard: {
    marginTop: 10,
    backgroundColor: '#FAF5F0',
    borderRadius: 12,
    padding: 10,
    borderWidth: 1,
    borderColor: '#EFE5DC',
  },
  recHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: 4,
  },
  recHeaderTitle: {
    fontSize: 11,
    fontWeight: '800',
    color: '#D4AF37',
  },
  recName: {
    fontSize: 13,
    fontWeight: '700',
    color: '#30171F',
  },
  recPrice: {
    fontSize: 12,
    fontWeight: '800',
    color: THEME.colors.primary,
    marginTop: 2,
  },
  recActionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
    backgroundColor: THEME.colors.primary,
    paddingVertical: 7,
    borderRadius: 8,
    marginTop: 8,
  },
  recActionBtnText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '700',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
    gap: 10,
  },
  input: {
    flex: 1,
    backgroundColor: '#F3F4F6',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
    fontSize: 13,
    color: '#1F2937',
  },
  sendBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: THEME.colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sendBtnDisabled: {
    backgroundColor: '#D1D5DB',
  },
});
