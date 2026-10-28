import { Ionicons } from '@expo/vector-icons';
import React, { useRef, useState } from 'react';
import {
  Alert,
  Image,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { useApp } from '../context/AppContext';
import { ALLERGENS, PRODUCT_OPTIONS } from '../data/mockData';
import { THEME } from '../theme/theme';
import { CartItem, Product, ProductOption, ProductVariant } from '../types';

interface ProductDetailModalProps {
  visible: boolean;
  product: Product | null;
  onClose: () => void;
  onAddToCart: (item: CartItem) => void;
}

const TEXT_COLORS = [
  { name: 'Nâu Socola', hex: '#3E2723' },
  { name: 'Đỏ Rượu', hex: '#5A2C38' },
  { name: 'Hồng Pastel', hex: '#D81B60' },
  { name: 'Xanh Matcha', hex: '#2E7D32' },
  { name: 'Vàng Kim', hex: '#F59E0B' },
];

const ProductDetailInner: React.FC<{
  visible: boolean;
  product: Product;
  onClose: () => void;
  onAddToCart: (item: CartItem) => void;
}> = ({ visible, product, onClose, onAddToCart }) => {
  const { isFavorite, toggleFavorite } = useApp();
  const isFav = isFavorite(product.id);
  const scrollViewRef = useRef<any>(null);
  const feedbackYRef = useRef<number>(0);

  const [selectedVariant, setSelectedVariant] = useState<ProductVariant>(product.variants[0]);
  const [quantity, setQuantity] = useState<number>(1);
  const [messageOnCake, setMessageOnCake] = useState<string>('');
  const [textColor, setTextColor] = useState<string>(TEXT_COLORS[0].hex);
  const [cardMessage, setCardMessage] = useState<string>('');
  const [selectedOptions, setSelectedOptions] = useState<ProductOption[]>([]);
  const [notes, setNotes] = useState<string>('');

  // Feedback state (MMA301 Task 2)
  const [newComment, setNewComment] = useState<string>('');
  const [newRating, setNewRating] = useState<number>(5);
  const [reviewsList, setReviewsList] = useState(product.reviews || []);

  const jumpToFeedback = () => {
    scrollViewRef.current?.scrollTo({ y: feedbackYRef.current || 900, animated: true });
  };

  const toggleOption = (opt: ProductOption) => {
    setSelectedOptions((prev) =>
      prev.find((o) => o.id === opt.id) ? prev.filter((o) => o.id !== opt.id) : [...prev, opt]
    );
  };

  const optionsTotal = selectedOptions.reduce((sum, opt) => sum + opt.price, 0);
  const itemTotal = (selectedVariant.price + optionsTotal) * quantity;

  const handleAdd = () => {
    if (messageOnCake.length > 40) {
      Alert.alert('Lưu ý', 'Nội dung chữ trên bánh tối đa 40 ký tự.');
      return;
    }
    const cartItem: CartItem = {
      id: `cart_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      productId: product.id,
      productName: product.name,
      image: product.image,
      variant: selectedVariant,
      quantity,
      messageOnCake: messageOnCake.trim() || undefined,
      cakeTextColor: textColor,
      cardMessage: cardMessage.trim() || undefined,
      selectedOptions,
      notes: notes.trim() || undefined,
    };
    onAddToCart(cartItem);
    onClose();
    // Reset state
    setMessageOnCake('');
    setCardMessage('');
    setNotes('');
    setSelectedOptions([]);
    setQuantity(1);
  };

  return (
    <Modal visible={visible} animationType="slide" transparent={false} onRequestClose={onClose}>
      <View style={styles.container}>
        {/* Floating Actions: Close & Favorite Heart (MMA301 Task 3) */}
        <View style={styles.topActionsRow}>
          <TouchableOpacity style={styles.closeBtn} onPress={onClose} activeOpacity={0.8}>
            <Ionicons name="close" size={24} color={THEME.colors.textPrimary} />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.favoriteDetailBtn}
            onPress={() => toggleFavorite(product.id)}
            activeOpacity={0.8}
          >
            <Ionicons
              name={isFav ? "heart" : "heart-outline"}
              size={22}
              color={isFav ? "#EF4444" : THEME.colors.textPrimary}
            />
          </TouchableOpacity>
        </View>

        <ScrollView
          ref={scrollViewRef}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {/* Hero Image */}
          <View style={styles.imageWrapper}>
            <Image source={{ uri: product.image }} style={styles.heroImage} resizeMode="cover" />
          </View>

          <View style={styles.content}>
            {/* Title & Price Header */}
            <View style={styles.headerRow}>
              <View style={styles.titleCol}>
                <Text style={styles.productName}>{product.name}</Text>
                <Text style={styles.productSubtitle}>{product.subtitle}</Text>
              </View>
              <Text style={styles.heroPrice}>{selectedVariant.price.toLocaleString('vi-VN')}đ</Text>
            </View>

            {/* Ratings & Lead Time */}
            <View style={styles.metaRow}>
              <TouchableOpacity
                style={styles.metaBadge}
                onPress={jumpToFeedback}
                activeOpacity={0.7}
              >
                <Ionicons name="star" size={14} color="#F59E0B" />
                <Text style={styles.metaText}>
                  {product.rating.toFixed(1)} ({product.reviewCount} đánh giá • Xem nhận xét ↓)
                </Text>
              </TouchableOpacity>
              <View style={styles.metaBadge}>
                <Ionicons name="time-outline" size={14} color={THEME.colors.primary} />
                <Text style={styles.metaText}>Chuẩn bị {product.leadTimeHours} giờ</Text>
              </View>
            </View>

            {/* Description */}
            <Text style={styles.description}>{product.description}</Text>

            {/* Allergen Warning Box (BRD Section 6.6) */}
            <View style={styles.allergenBox}>
              <View style={styles.allergenHeader}>
                <Ionicons name="alert-circle-outline" size={18} color="#C2410C" />
                <Text style={styles.allergenTitle}>Thông tin dị ứng thực phẩm</Text>
              </View>
              <View style={styles.allergenTags}>
                {product.allergens.map((algId) => {
                  const alg = ALLERGENS.find((a) => a.id === algId);
                  return (
                    <View key={algId} style={styles.allergenPill}>
                      <Ionicons name={(alg?.icon as any) || 'leaf'} size={12} color="#C2410C" />
                      <Text style={styles.allergenPillText}>{alg?.name || algId}</Text>
                    </View>
                  );
                })}
              </View>
              <Text style={styles.storageNote}>{product.storageInstructions}</Text>
            </View>

            {/* Variant / Size Selector */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Chọn kích thước & khẩu phần</Text>
              <View style={styles.variantList}>
                {product.variants.map((v) => {
                  const isSelected = selectedVariant.id === v.id;
                  return (
                    <TouchableOpacity
                      key={v.id}
                      style={[styles.variantItem, isSelected && styles.variantItemActive]}
                      onPress={() => setSelectedVariant(v)}
                      activeOpacity={0.8}
                    >
                      <View>
                        <Text style={[styles.variantSize, isSelected && styles.variantSizeActive]}>
                          {v.size}
                        </Text>
                        <Text style={[styles.variantPrice, isSelected && styles.variantPriceActive]}>
                          {v.price.toLocaleString('vi-VN')}đ
                        </Text>
                      </View>
                      <View style={[styles.radio, isSelected && styles.radioActive]}>
                        {isSelected && <View style={styles.radioInner} />}
                      </View>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>

            {/* Custom Cake Writing with Live Preview (BRD US-302) */}
            <View style={styles.section}>
              <View style={styles.sectionHeaderBetween}>
                <Text style={styles.sectionTitle}>Viết chữ lên mặt bánh</Text>
                <Text style={styles.counterText}>{messageOnCake.length}/40 ký tự</Text>
              </View>

              <TextInput
                style={styles.textInput}
                placeholder="VD: Happy Birthday Mẹ Yêu 15/11"
                placeholderTextColor={THEME.colors.textMuted}
                maxLength={40}
                value={messageOnCake}
                onChangeText={setMessageOnCake}
              />

              {/* Live Preview on Cake Plate */}
              {messageOnCake.length > 0 && (
                <View style={styles.cakePreviewPlate}>
                  <View style={styles.cakePlateInner}>
                    <Text style={[styles.cakePlateText, { color: textColor }]}>
                      {`✨ "${messageOnCake}" ✨`}
                    </Text>
                  </View>
                </View>
              )}

              {/* Text Color Picker */}
              <Text style={styles.subLabel}>Màu chữ kem:</Text>
              <View style={styles.colorRow}>
                {TEXT_COLORS.map((c) => (
                  <TouchableOpacity
                    key={c.name}
                    style={[
                      styles.colorCircle,
                      { backgroundColor: c.hex },
                      textColor === c.hex && styles.colorCircleActive,
                    ]}
                    onPress={() => setTextColor(c.hex)}
                    activeOpacity={0.8}
                  >
                    {textColor === c.hex && <Ionicons name="checkmark" size={14} color="#FFF" />}
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Card message (120 chars) */}
            <View style={styles.section}>
              <View style={styles.sectionHeaderBetween}>
                <Text style={styles.sectionTitle}>Lời chúc viết trên thiệp</Text>
                <Text style={styles.counterText}>{cardMessage.length}/120 ký tự</Text>
              </View>
              <TextInput
                style={[styles.textInput, styles.textArea]}
                placeholder="Nhập lời chúc đong đầy yêu thương gửi kèm thiệp..."
                placeholderTextColor={THEME.colors.textMuted}
                multiline
                numberOfLines={3}
                maxLength={120}
                value={cardMessage}
                onChangeText={setCardMessage}
              />
            </View>

            {/* Addon Accessories */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Phụ kiện sinh nhật kèm theo</Text>
              {PRODUCT_OPTIONS.map((opt) => {
                const isChecked = selectedOptions.some((o) => o.id === opt.id);
                return (
                  <TouchableOpacity
                    key={opt.id}
                    style={styles.optionRow}
                    onPress={() => toggleOption(opt)}
                    activeOpacity={0.8}
                  >
                    <View style={[styles.checkbox, isChecked && styles.checkboxActive]}>
                      {isChecked && <Ionicons name="checkmark" size={14} color="#FFF" />}
                    </View>
                    <Text style={styles.optionName}>{opt.name}</Text>
                    <Text style={styles.optionPrice}>+{opt.price.toLocaleString('vi-VN')}đ</Text>
                  </TouchableOpacity>
                );
              })}
            </View>

            {/* Special Instructions for Baker */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Ghi chú thêm cho thợ bánh</Text>
              <TextInput
                style={styles.textInput}
                placeholder="VD: Giảm 30% đường, trang trí nơ hồng..."
                placeholderTextColor={THEME.colors.textMuted}
                value={notes}
                onChangeText={setNotes}
              />
            </View>

            {/* Feedback & Ratings Breakdown Section (MMA301 Task 2) */}
            <View
              style={styles.feedbackSection}
              onLayout={(e) => {
                feedbackYRef.current = e.nativeEvent.layout.y;
              }}
            >
              <View style={styles.feedbackHeader}>
                <Ionicons name="chatbubbles-outline" size={20} color={THEME.colors.primary} />
                <Text style={styles.feedbackTitle}>Đánh Giá & Nhận Xét Từ Khách Hàng</Text>
              </View>

              {/* Big Rating Summary */}
              <View style={styles.ratingSummaryCard}>
                <View style={styles.ratingScoreCol}>
                  <Text style={styles.ratingBigNumber}>{product.rating.toFixed(1)}</Text>
                  <View style={styles.starRow}>
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Ionicons
                        key={star}
                        name={star <= Math.round(product.rating) ? 'star' : 'star-outline'}
                        size={15}
                        color="#F59E0B"
                      />
                    ))}
                  </View>
                  <Text style={styles.reviewTotalSub}>{product.reviewCount} lượt đánh giá</Text>
                </View>

                {/* Ratings Grouped by Value (5★, 4★, 3★, 2★, 1★) */}
                <View style={styles.ratingBarsCol}>
                  {[5, 4, 3, 2, 1].map((val) => {
                    const breakdown = product.ratingBreakdown || { 5: 80, 4: 15, 3: 4, 2: 1, 1: 0 };
                    const count = (breakdown as any)[val] || 0;
                    const total = product.reviewCount || 100;
                    const pct = Math.min(100, Math.round((count / total) * 100));

                    return (
                      <View key={val} style={styles.ratingBarRow}>
                        <Text style={styles.starValueLabel}>{val}★</Text>
                        <View style={styles.progressBarTrack}>
                          <View style={[styles.progressBarFill, { width: `${pct}%` }]} />
                        </View>
                        <Text style={styles.starCountLabel}>{count}</Text>
                      </View>
                    );
                  })}
                </View>
              </View>

              {/* Customer Comments List */}
              <View style={styles.reviewsList}>
                {reviewsList.map((rev) => (
                  <View key={rev.id} style={styles.reviewItemCard}>
                    <View style={styles.reviewTopRow}>
                      <View style={styles.reviewUserCol}>
                        <View style={styles.userAvatarMini}>
                          <Text style={styles.avatarMiniText}>{rev.userName.charAt(0)}</Text>
                        </View>
                        <View>
                          <Text style={styles.reviewUserName}>{rev.userName}</Text>
                          {rev.verifiedPurchase && (
                            <View style={styles.verifiedRow}>
                              <Ionicons name="checkmark-circle" size={11} color="#059669" />
                              <Text style={styles.verifiedText}>Đã mua bánh</Text>
                            </View>
                          )}
                        </View>
                      </View>
                      <Text style={styles.reviewDate}>{rev.date}</Text>
                    </View>

                    <View style={styles.reviewStarRow}>
                      {[1, 2, 3, 4, 5].map((s) => (
                        <Ionicons
                          key={s}
                          name={s <= rev.rating ? 'star' : 'star-outline'}
                          size={13}
                          color="#F59E0B"
                        />
                      ))}
                    </View>
                    <Text style={styles.reviewComment}>{rev.comment}</Text>
                  </View>
                ))}
              </View>

              {/* Write New Review / Feedback Form */}
              <View style={styles.addReviewBox}>
                <Text style={styles.addReviewTitle}>Viết đánh giá của bạn:</Text>
                <View style={styles.starSelectRow}>
                  {[1, 2, 3, 4, 5].map((s) => (
                    <TouchableOpacity
                      key={s}
                      onPress={() => setNewRating(s)}
                      hitSlop={{ top: 6, bottom: 6, left: 6, right: 6 }}
                    >
                      <Ionicons
                        name={s <= newRating ? 'star' : 'star-outline'}
                        size={24}
                        color="#F59E0B"
                      />
                    </TouchableOpacity>
                  ))}
                </View>
                <TextInput
                  style={styles.reviewInput}
                  placeholder="Chia sẻ trải nghiệm hương vị và hình thức bánh..."
                  value={newComment}
                  onChangeText={setNewComment}
                  placeholderTextColor="#9CA3AF"
                />
                <TouchableOpacity
                  style={styles.submitReviewBtn}
                  onPress={() => {
                    if (!newComment.trim()) {
                      Alert.alert('Lưu ý', 'Vui lòng nhập nội dung đánh giá.');
                      return;
                    }
                    const newRev = {
                      id: `rev_${Date.now()}`,
                      userName: 'Bạn (Khách hàng)',
                      rating: newRating,
                      date: 'Hôm nay',
                      comment: newComment.trim(),
                      verifiedPurchase: true,
                    };
                    setReviewsList([newRev, ...reviewsList]);
                    setNewComment('');
                    Alert.alert('Cảm ơn bạn', 'Đánh giá của bạn đã được gửi thành công!');
                  }}
                  activeOpacity={0.8}
                >
                  <Text style={styles.submitReviewBtnText}>Gửi Đánh Giá</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </ScrollView>

        {/* Sticky Bottom Action Bar */}
        <View style={styles.bottomBar}>
          {/* Quantity Controls */}
          <View style={styles.quantityContainer}>
            <TouchableOpacity
              style={styles.qtyBtn}
              onPress={() => setQuantity((q) => Math.max(1, q - 1))}
            >
              <Ionicons name="remove" size={18} color={THEME.colors.textPrimary} />
            </TouchableOpacity>
            <Text style={styles.qtyText}>{quantity}</Text>
            <TouchableOpacity style={styles.qtyBtn} onPress={() => setQuantity((q) => q + 1)}>
              <Ionicons name="add" size={18} color={THEME.colors.textPrimary} />
            </TouchableOpacity>
          </View>

          {/* Add Button */}
          <TouchableOpacity style={styles.addCartButton} onPress={handleAdd} activeOpacity={0.85}>
            <View>
              <Text style={styles.addCartBtnText}>Thêm vào giỏ</Text>
              <Text style={styles.addCartBtnSub}>{itemTotal.toLocaleString('vi-VN')}đ</Text>
            </View>
            <Ionicons name="arrow-forward" size={20} color="#FFFFFF" />
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

export const ProductDetailModal: React.FC<ProductDetailModalProps> = ({
  visible,
  product,
  onClose,
  onAddToCart,
}) => {
  if (!visible || !product) return null;
  return (
    <ProductDetailInner
      key={product.id}
      visible={visible}
      product={product}
      onClose={onClose}
      onAddToCart={onAddToCart}
    />
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: THEME.colors.background,
  },
  topActionsRow: {
    position: 'absolute',
    top: 48,
    left: 20,
    right: 20,
    zIndex: 99,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  closeBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    alignItems: 'center',
    justifyContent: 'center',
    ...THEME.shadows.md,
  },
  favoriteDetailBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    alignItems: 'center',
    justifyContent: 'center',
    ...THEME.shadows.md,
  },
  scrollContent: {
    paddingBottom: 110,
  },
  imageWrapper: {
    width: '100%',
    height: 320,
    backgroundColor: THEME.colors.surfaceSubtle,
  },
  heroImage: {
    width: '100%',
    height: '100%',
  },
  content: {
    padding: THEME.spacing.lg,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  titleCol: {
    flex: 1,
    marginRight: THEME.spacing.md,
  },
  productName: {
    fontSize: 22,
    fontWeight: '800',
    color: THEME.colors.textPrimary,
  },
  productSubtitle: {
    fontSize: 13,
    color: THEME.colors.textSecondary,
    marginTop: 2,
  },
  heroPrice: {
    fontSize: 22,
    fontWeight: '800',
    color: THEME.colors.primary,
  },
  metaRow: {
    flexDirection: 'row',
    gap: 12,
    marginTop: THEME.spacing.md,
  },
  metaBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: THEME.colors.surface,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: THEME.borderRadius.round,
    borderWidth: 1,
    borderColor: THEME.colors.border,
  },
  metaText: {
    fontSize: 12,
    fontWeight: '600',
    color: THEME.colors.textPrimary,
  },
  description: {
    fontSize: 14,
    color: THEME.colors.textSecondary,
    lineHeight: 22,
    marginTop: THEME.spacing.md,
  },
  allergenBox: {
    backgroundColor: '#FFF7ED',
    borderWidth: 1,
    borderColor: '#FFEDD5',
    borderRadius: THEME.borderRadius.md,
    padding: THEME.spacing.md,
    marginTop: THEME.spacing.md,
  },
  allergenHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  allergenTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#9A3412',
  },
  allergenTags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginTop: 8,
  },
  allergenPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#FFEDD5',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: THEME.borderRadius.round,
  },
  allergenPillText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#9A3412',
  },
  storageNote: {
    fontSize: 11,
    color: '#7C2D12',
    marginTop: 8,
    fontStyle: 'italic',
  },
  section: {
    marginTop: THEME.spacing.xl,
  },
  sectionHeaderBetween: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: THEME.colors.textPrimary,
    marginBottom: 8,
  },
  counterText: {
    fontSize: 12,
    color: THEME.colors.textMuted,
  },
  variantList: {
    gap: 8,
  },
  variantItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: THEME.colors.surface,
    padding: THEME.spacing.md,
    borderRadius: THEME.borderRadius.md,
    borderWidth: 1.5,
    borderColor: THEME.colors.border,
  },
  variantItemActive: {
    borderColor: THEME.colors.primary,
    backgroundColor: '#FAF5F2',
  },
  variantSize: {
    fontSize: 14,
    fontWeight: '600',
    color: THEME.colors.textPrimary,
  },
  variantSizeActive: {
    color: THEME.colors.primary,
    fontWeight: '700',
  },
  variantPrice: {
    fontSize: 13,
    color: THEME.colors.textSecondary,
    marginTop: 2,
  },
  variantPriceActive: {
    color: THEME.colors.primary,
    fontWeight: '700',
  },
  radio: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: THEME.colors.textMuted,
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioActive: {
    borderColor: THEME.colors.primary,
  },
  radioInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: THEME.colors.primary,
  },
  textInput: {
    backgroundColor: THEME.colors.surface,
    borderWidth: 1,
    borderColor: THEME.colors.border,
    borderRadius: THEME.borderRadius.md,
    paddingHorizontal: THEME.spacing.md,
    paddingVertical: 10,
    fontSize: 14,
    color: THEME.colors.textPrimary,
  },
  textArea: {
    height: 70,
    textAlignVertical: 'top',
  },
  cakePreviewPlate: {
    backgroundColor: '#F5ECE3',
    borderRadius: THEME.borderRadius.lg,
    padding: 12,
    marginTop: 8,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E6D7CC',
  },
  cakePlateInner: {
    backgroundColor: '#FFFBF7',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: THEME.borderRadius.round,
    borderWidth: 1,
    borderColor: '#DFD1C4',
  },
  cakePlateText: {
    fontSize: 14,
    fontWeight: '700',
    fontStyle: 'italic',
  },
  subLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: THEME.colors.textSecondary,
    marginTop: 10,
    marginBottom: 6,
  },
  colorRow: {
    flexDirection: 'row',
    gap: 12,
  },
  colorCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  colorCircleActive: {
    borderWidth: 2,
    borderColor: '#FFFFFF',
    transform: [{ scale: 1.15 }],
    ...THEME.shadows.sm,
  },
  optionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: THEME.colors.surface,
    padding: 12,
    borderRadius: THEME.borderRadius.md,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: THEME.colors.border,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: THEME.colors.textMuted,
    marginRight: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxActive: {
    backgroundColor: THEME.colors.primary,
    borderColor: THEME.colors.primary,
  },
  optionName: {
    flex: 1,
    fontSize: 13,
    color: THEME.colors.textPrimary,
  },
  optionPrice: {
    fontSize: 13,
    fontWeight: '700',
    color: THEME.colors.primary,
  },
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: THEME.colors.surface,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: THEME.spacing.lg,
    paddingVertical: THEME.spacing.md,
    borderTopWidth: 1,
    borderTopColor: THEME.colors.border,
    ...THEME.shadows.lg,
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: THEME.colors.surfaceSubtle,
    borderRadius: THEME.borderRadius.md,
    padding: 4,
    marginRight: THEME.spacing.md,
  },
  qtyBtn: {
    width: 34,
    height: 34,
    borderRadius: THEME.borderRadius.sm,
    backgroundColor: THEME.colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  qtyText: {
    fontSize: 15,
    fontWeight: '700',
    paddingHorizontal: 12,
    color: THEME.colors.textPrimary,
  },
  addCartButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: THEME.colors.primary,
    paddingVertical: 12,
    paddingHorizontal: 18,
    borderRadius: THEME.borderRadius.md,
  },
  addCartBtnText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
  },
  addCartBtnSub: {
    color: 'rgba(255, 255, 255, 0.85)',
    fontSize: 12,
    fontWeight: '500',
    marginTop: 1,
  },
  detailBrandBadge: {
    fontSize: 12,
    fontWeight: '700',
    color: THEME.colors.accent,
    textTransform: 'uppercase',
    marginTop: 3,
    letterSpacing: 0.5,
  },
  feedbackSection: {
    marginTop: 24,
    paddingTop: 20,
    borderTopWidth: 1,
    borderTopColor: '#F3E8E2',
    paddingBottom: 20,
  },
  feedbackHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 16,
  },
  feedbackTitle: {
    fontSize: 17,
    fontWeight: '800',
    color: '#30171F',
  },
  ratingSummaryCard: {
    flexDirection: 'row',
    backgroundColor: '#FAF5F0',
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#EFE5DC',
  },
  ratingScoreCol: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingRight: 16,
    borderRightWidth: 1,
    borderRightColor: '#E5D8CE',
    width: 110,
  },
  ratingBigNumber: {
    fontSize: 36,
    fontWeight: '900',
    color: '#30171F',
  },
  starRow: {
    flexDirection: 'row',
    gap: 2,
    marginVertical: 4,
  },
  reviewTotalSub: {
    fontSize: 11,
    color: '#6B7280',
    fontWeight: '500',
  },
  ratingBarsCol: {
    flex: 1,
    paddingLeft: 14,
    gap: 6,
  },
  ratingBarRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  starValueLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: '#4B5563',
    width: 22,
  },
  progressBarTrack: {
    flex: 1,
    height: 6,
    backgroundColor: '#E5E7EB',
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: '#F59E0B',
    borderRadius: 3,
  },
  starCountLabel: {
    fontSize: 10,
    color: '#6B7280',
    width: 22,
    textAlign: 'right',
  },
  reviewsList: {
    gap: 12,
    marginBottom: 16,
  },
  reviewItemCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 14,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  reviewTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  reviewUserCol: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  userAvatarMini: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: `${THEME.colors.primary}18`,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarMiniText: {
    fontSize: 12,
    fontWeight: '800',
    color: THEME.colors.primary,
  },
  reviewUserName: {
    fontSize: 13,
    fontWeight: '700',
    color: '#1F2937',
  },
  verifiedRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    marginTop: 1,
  },
  verifiedText: {
    fontSize: 10,
    color: '#059669',
    fontWeight: '600',
  },
  reviewDate: {
    fontSize: 11,
    color: '#9CA3AF',
  },
  reviewStarRow: {
    flexDirection: 'row',
    gap: 2,
    marginBottom: 6,
  },
  reviewComment: {
    fontSize: 13,
    color: '#374151',
    lineHeight: 19,
  },
  addReviewBox: {
    backgroundColor: '#F9FAFB',
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  addReviewTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#374151',
    marginBottom: 8,
  },
  starSelectRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 10,
  },
  reviewInput: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: 13,
    color: '#1F2937',
    marginBottom: 10,
  },
  submitReviewBtn: {
    backgroundColor: THEME.colors.primary,
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
  submitReviewBtnText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '700',
  },
});
