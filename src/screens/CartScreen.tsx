import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import {
  Alert,
  Image,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { useApp } from '../context/AppContext';
import { VOUCHERS } from '../data/mockData';
import { THEME } from '../theme/theme';
import { Order } from '../types';

interface CartScreenProps {
  onOrderCreated: (order: Order) => void;
  onExploreProducts: () => void;
}

const DELIVERY_SLOTS = [
  { id: 's1', time: 'Hôm nay, 15:00 - 16:00', available: true },
  { id: 's2', time: 'Hôm nay, 17:00 - 18:00', available: true },
  { id: 's3', time: 'Hôm nay, 19:00 - 20:00', available: true },
  { id: 's4', time: 'Ngày mai, 09:00 - 10:00', available: true },
  { id: 's5', time: 'Ngày mai, 14:00 - 15:00', available: true },
];

export const CartScreen: React.FC<CartScreenProps> = ({
  onOrderCreated,
  onExploreProducts,
}) => {
  const {
    cart,
    removeFromCart,
    updateQuantity,
    cartSubtotal,
    createOrder,
    appliedVoucher,
    applyVoucher,
    removeVoucher,
    user,
    selectedBranch,
  } = useApp();

  const [receiveMethod, setReceiveMethod] = useState<'delivery' | 'pickup'>('delivery');
  const [selectedSlot, setSelectedSlot] = useState<string>(DELIVERY_SLOTS[0].time);
  const [isSecretGift, setIsSecretGift] = useState<boolean>(false);
  const [receiverName, setReceiverName] = useState<string>(user.name);
  const [receiverPhone, setReceiverPhone] = useState<string>(user.phone);
  const [receiverAddress, setReceiverAddress] = useState<string>(user.defaultAddress);
  const [voucherInput, setVoucherInput] = useState<string>('');
  const [usePoints, setUsePoints] = useState<boolean>(false);
  const [paymentMethod, setPaymentMethod] = useState<'VNPAY_QR' | 'MOMO' | 'CARD' | 'COD'>('VNPAY_QR');

  // Calculations
  const deliveryFee = receiveMethod === 'delivery' ? 30000 : 0;
  let voucherDiscount = 0;
  if (appliedVoucher) {
    if (appliedVoucher.discountType === 'percentage') {
      voucherDiscount = Math.min((cartSubtotal * appliedVoucher.value) / 100, appliedVoucher.maxDiscount || Infinity);
    } else if (appliedVoucher.discountType === 'fixed') {
      voucherDiscount = appliedVoucher.value;
    } else if (appliedVoucher.discountType === 'free_shipping') {
      voucherDiscount = Math.min(deliveryFee, appliedVoucher.value);
    }
  }

  // Max 50% discount with points
  const maxPointsDiscount = (cartSubtotal + deliveryFee - voucherDiscount) * 0.5;
  const pointsDiscount = usePoints ? Math.min(user.points * 1000, maxPointsDiscount) : 0;
  const finalDiscount = voucherDiscount + pointsDiscount;
  const grandTotal = Math.max(0, cartSubtotal + deliveryFee - finalDiscount);

  const handleApplyVoucher = (codeToApply?: string) => {
    const code = codeToApply || voucherInput;
    if (!code.trim()) return;
    const res = applyVoucher(code);
    Alert.alert(res.success ? 'Thành công' : 'Không thể áp dụng', res.message);
    if (res.success) setVoucherInput('');
  };

  const handleCheckout = () => {
    if (cart.length === 0) {
      Alert.alert('Giỏ hàng trống', 'Vui lòng chọn bánh trước khi đặt hàng.');
      return;
    }
    if (receiveMethod === 'delivery' && (!receiverAddress.trim() || !receiverPhone.trim())) {
      Alert.alert('Thiếu thông tin nhận hàng', 'Vui lòng nhập địa chỉ và số điện thoại người nhận.');
      return;
    }

    const newOrder = createOrder({
      receiveMethod,
      receiveTime: selectedSlot,
      isSecretGift,
      receiverName: isSecretGift ? receiverName : (receiverName || user.name),
      receiverPhone: receiverPhone || user.phone,
      receiverAddress: receiveMethod === 'delivery' ? receiverAddress : selectedBranch.address,
      paymentMethod,
      usePoints,
    });

    Alert.alert(
      'Đặt Bánh Thành Công! 🎉',
      `Mã đơn: ${newOrder.code}\nCửa hàng đã nhận đơn và chuẩn bị bánh tươi thơm ngon cho bạn!`,
      [{ text: 'Xem tiến độ đơn', onPress: () => onOrderCreated(newOrder) }]
    );
  };

  if (cart.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Ionicons name="bag-handle-outline" size={72} color={THEME.colors.border} />
        <Text style={styles.emptyTitle}>Giỏ hàng của bạn đang trống</Text>
        <Text style={styles.emptySubtitle}>
          Khám phá những mẫu bánh tươi thơm ngọt ngào tại Miette ngay nào!
        </Text>
        <TouchableOpacity style={styles.exploreBtn} onPress={onExploreProducts} activeOpacity={0.85}>
          <Text style={styles.exploreBtnText}>Chọn bánh ngay</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Giỏ Hàng Của Bạn</Text>
        <Text style={styles.headerCount}>{cart.length} sản phẩm</Text>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {/* Cart Items List */}
        <View style={styles.card}>
          {cart.map((item) => {
            const optTotal = item.selectedOptions.reduce((s, o) => s + o.price, 0);
            return (
              <View key={item.id} style={styles.cartItemRow}>
                <Image source={{ uri: item.image }} style={styles.itemImage} />

                <View style={styles.itemInfoCol}>
                  <View style={styles.itemNameRow}>
                    <Text style={styles.itemName} numberOfLines={1}>
                      {item.productName}
                    </Text>
                    <TouchableOpacity onPress={() => removeFromCart(item.id)}>
                      <Ionicons name="trash-outline" size={18} color="#DC2626" />
                    </TouchableOpacity>
                  </View>

                  <Text style={styles.itemSize}>{item.variant.size}</Text>

                  {item.messageOnCake && (
                    <Text style={styles.itemMsg} numberOfLines={1}>
                      {`Chữ: "${item.messageOnCake}"`}
                    </Text>
                  )}

                  {item.selectedOptions.length > 0 && (
                    <Text style={styles.itemOpt} numberOfLines={1}>
                      + {item.selectedOptions.map((o) => o.name).join(', ')}
                    </Text>
                  )}

                  <View style={styles.itemBottomRow}>
                    <Text style={styles.itemPrice}>
                      {((item.variant.price + optTotal) * item.quantity).toLocaleString('vi-VN')}đ
                    </Text>

                    <View style={styles.qtyControl}>
                      <TouchableOpacity
                        style={styles.qtyBtn}
                        onPress={() => updateQuantity(item.id, -1)}
                      >
                        <Ionicons name="remove" size={14} color={THEME.colors.textPrimary} />
                      </TouchableOpacity>
                      <Text style={styles.qtyVal}>{item.quantity}</Text>
                      <TouchableOpacity
                        style={styles.qtyBtn}
                        onPress={() => updateQuantity(item.id, 1)}
                      >
                        <Ionicons name="add" size={14} color={THEME.colors.textPrimary} />
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
              </View>
            );
          })}
        </View>

        {/* Receive Method */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Phương thức nhận bánh</Text>
          <View style={styles.methodSwitcher}>
            <TouchableOpacity
              style={[styles.methodBtn, receiveMethod === 'delivery' && styles.methodBtnActive]}
              onPress={() => setReceiveMethod('delivery')}
              activeOpacity={0.8}
            >
              <Ionicons
                name="bicycle-outline"
                size={18}
                color={receiveMethod === 'delivery' ? '#FFF' : THEME.colors.primary}
              />
              <Text
                style={[
                  styles.methodBtnText,
                  receiveMethod === 'delivery' && styles.methodBtnTextActive,
                ]}
              >
                Giao tận nơi (30k)
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.methodBtn, receiveMethod === 'pickup' && styles.methodBtnActive]}
              onPress={() => setReceiveMethod('pickup')}
              activeOpacity={0.8}
            >
              <Ionicons
                name="storefront-outline"
                size={18}
                color={receiveMethod === 'pickup' ? '#FFF' : THEME.colors.primary}
              />
              <Text
                style={[
                  styles.methodBtnText,
                  receiveMethod === 'pickup' && styles.methodBtnTextActive,
                ]}
              >
                Nhận tại cửa hàng
              </Text>
            </TouchableOpacity>
          </View>

          {/* Time Slot Selector (BRD 3.2, 6.3) */}
          <Text style={styles.inputSubLabel}>Khung giờ nhận bánh:</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.slotScroll}>
            {DELIVERY_SLOTS.map((slot) => {
              const isSelected = selectedSlot === slot.time;
              return (
                <TouchableOpacity
                  key={slot.id}
                  style={[styles.slotPill, isSelected && styles.slotPillActive]}
                  onPress={() => setSelectedSlot(slot.time)}
                >
                  <Text style={[styles.slotText, isSelected && styles.slotTextActive]}>
                    {slot.time}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>

          {/* Secret Gift Toggle (BRD US-307) */}
          <View style={styles.secretGiftRow}>
            <View style={styles.secretGiftTextCol}>
              <View style={styles.secretGiftTitleWrap}>
                <Ionicons name="gift-outline" size={16} color="#7E22CE" />
                <Text style={styles.secretGiftLabel}>Giao bí mật (Tạo bất ngờ)</Text>
              </View>
              <Text style={styles.secretGiftHelp}>
                Ẩn tên người gửi trên hóa đơn & phiếu giao hàng.
              </Text>
            </View>
            <Switch
              value={isSecretGift}
              onValueChange={setIsSecretGift}
              trackColor={{ false: '#E2E8F0', true: '#C084FC' }}
              thumbColor={isSecretGift ? '#7E22CE' : '#FFFFFF'}
            />
          </View>

          {/* Receiver Info Fields */}
          <Text style={styles.inputSubLabel}>Người nhận bánh:</Text>
          <TextInput
            style={styles.textInput}
            placeholder="Họ và tên người nhận"
            placeholderTextColor={THEME.colors.textMuted}
            value={receiverName}
            onChangeText={setReceiverName}
          />

          <Text style={styles.inputSubLabel}>Số điện thoại:</Text>
          <TextInput
            style={styles.textInput}
            placeholder="Số điện thoại nhận hàng"
            placeholderTextColor={THEME.colors.textMuted}
            keyboardType="phone-pad"
            value={receiverPhone}
            onChangeText={setReceiverPhone}
          />

          {receiveMethod === 'delivery' && (
            <>
              <Text style={styles.inputSubLabel}>Địa chỉ giao hàng:</Text>
              <TextInput
                style={styles.textInput}
                placeholder="Số nhà, đường, phường, quận..."
                placeholderTextColor={THEME.colors.textMuted}
                value={receiverAddress}
                onChangeText={setReceiverAddress}
              />
            </>
          )}
        </View>

        {/* Voucher & Loyalty Points (BRD 6.4) */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Ưu đãi & Điểm thưởng</Text>

          {/* Voucher input */}
          <View style={styles.voucherInputRow}>
            <TextInput
              style={styles.voucherInput}
              placeholder="Nhập mã voucher (VD: FREESHIP50)"
              placeholderTextColor={THEME.colors.textMuted}
              autoCapitalize="characters"
              value={voucherInput}
              onChangeText={setVoucherInput}
            />
            <TouchableOpacity style={styles.applyVoucherBtn} onPress={() => handleApplyVoucher()}>
              <Text style={styles.applyVoucherBtnText}>Áp dụng</Text>
            </TouchableOpacity>
          </View>

          {appliedVoucher ? (
            <View style={styles.appliedVoucherBadge}>
              <Ionicons name="pricetag" size={14} color="#15803D" />
              <Text style={styles.appliedVoucherText}>
                Đang áp dụng: {appliedVoucher.code} (-{voucherDiscount.toLocaleString('vi-VN')}đ)
              </Text>
              <TouchableOpacity onPress={removeVoucher}>
                <Ionicons name="close-circle" size={18} color="#15803D" />
              </TouchableOpacity>
            </View>
          ) : (
            /* Quick Apply Voucher Suggestions */
            <View style={styles.quickVouchersList}>
              {VOUCHERS.map((v) => (
                <TouchableOpacity
                  key={v.id}
                  style={styles.quickVoucherPill}
                  onPress={() => handleApplyVoucher(v.code)}
                >
                  <Text style={styles.quickVoucherCode}>{v.code}</Text>
                  <Text style={styles.quickVoucherTitle}>: {v.title}</Text>
                </TouchableOpacity>
              ))}
            </View>
          )}

          {/* Loyalty Points deduction switch (BRD Section 6.4) */}
          <View style={styles.pointsRow}>
            <View style={styles.pointsTextCol}>
              <Text style={styles.pointsLabel}>Dùng điểm Miette Rewards</Text>
              <Text style={styles.pointsSub}>
                Bạn có {user.points.toLocaleString('vi-VN')} điểm ({user.tier}) • Tối đa giảm 50% đơn
              </Text>
            </View>
            <Switch
              value={usePoints}
              onValueChange={setUsePoints}
              trackColor={{ false: '#E2E8F0', true: THEME.colors.accentLight }}
              thumbColor={usePoints ? THEME.colors.accent : '#FFFFFF'}
            />
          </View>
          {usePoints && (
            <Text style={styles.pointsDeductionText}>
              Đã trừ: -{pointsDiscount.toLocaleString('vi-VN')}đ từ điểm thưởng
            </Text>
          )}
        </View>

        {/* Payment Method Selector (BRD 5.1-E) */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Phương thức thanh toán</Text>

          {[
            { id: 'VNPAY_QR', label: 'VNPAY QR (Quét mã mọi ngân hàng)', icon: 'qr-code-outline' },
            { id: 'MOMO', label: 'Ví MoMo', icon: 'wallet-outline' },
            { id: 'CARD', label: 'Thẻ Quốc Tế / Thẻ Nội Địa', icon: 'card-outline' },
            { id: 'COD', label: 'Thanh toán tiền mặt khi nhận bánh (COD)', icon: 'cash-outline' },
          ].map((pm) => {
            const isSelected = paymentMethod === pm.id;
            return (
              <TouchableOpacity
                key={pm.id}
                style={[styles.payMethodItem, isSelected && styles.payMethodItemActive]}
                onPress={() => setPaymentMethod(pm.id as any)}
                activeOpacity={0.8}
              >
                <Ionicons
                  name={pm.icon as any}
                  size={20}
                  color={isSelected ? THEME.colors.primary : THEME.colors.textSecondary}
                />
                <Text
                  style={[
                    styles.payMethodText,
                    isSelected && styles.payMethodTextActive,
                  ]}
                >
                  {pm.label}
                </Text>
                <View style={[styles.radio, isSelected && styles.radioActive]}>
                  {isSelected && <View style={styles.radioInner} />}
                </View>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Price Breakdown */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Tóm tắt đơn hàng</Text>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Tạm tính tiền bánh:</Text>
            <Text style={styles.summaryVal}>{cartSubtotal.toLocaleString('vi-VN')}đ</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Phí giao hàng:</Text>
            <Text style={styles.summaryVal}>
              {deliveryFee > 0 ? `${deliveryFee.toLocaleString('vi-VN')}đ` : '0đ'}
            </Text>
          </View>
          {finalDiscount > 0 && (
            <View style={styles.summaryRow}>
              <Text style={styles.summaryDiscountLabel}>Tổng giảm giá:</Text>
              <Text style={styles.summaryDiscountVal}>
                -{finalDiscount.toLocaleString('vi-VN')}đ
              </Text>
            </View>
          )}
          <View style={[styles.summaryRow, styles.grandTotalRow]}>
            <Text style={styles.grandTotalLabel}>Tổng thanh toán:</Text>
            <Text style={styles.grandTotalVal}>{grandTotal.toLocaleString('vi-VN')}đ</Text>
          </View>
        </View>

        {/* Submit Order Button */}
        <TouchableOpacity style={styles.checkoutBtn} onPress={handleCheckout} activeOpacity={0.85}>
          <Text style={styles.checkoutBtnText}>Xác nhận đặt bánh • {grandTotal.toLocaleString('vi-VN')}đ</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: THEME.colors.background,
  },
  header: {
    backgroundColor: THEME.colors.surface,
    paddingTop: 48,
    paddingBottom: 14,
    paddingHorizontal: THEME.spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: THEME.colors.border,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: THEME.colors.textPrimary,
  },
  headerCount: {
    fontSize: 12,
    color: THEME.colors.textMuted,
  },
  scrollContent: {
    padding: THEME.spacing.lg,
    paddingBottom: 60,
  },
  card: {
    backgroundColor: THEME.colors.surface,
    borderRadius: THEME.borderRadius.lg,
    padding: THEME.spacing.lg,
    marginBottom: THEME.spacing.md,
    borderWidth: 1,
    borderColor: THEME.colors.cardBorder,
    ...THEME.shadows.sm,
  },
  cardTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: THEME.colors.textPrimary,
    marginBottom: 12,
  },
  cartItemRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: THEME.colors.border,
    paddingBottom: 12,
    marginBottom: 12,
  },
  itemImage: {
    width: 72,
    height: 72,
    borderRadius: THEME.borderRadius.md,
  },
  itemInfoCol: {
    flex: 1,
    marginLeft: 12,
  },
  itemNameRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  itemName: {
    fontSize: 14,
    fontWeight: '700',
    color: THEME.colors.textPrimary,
    flex: 1,
    marginRight: 8,
  },
  itemSize: {
    fontSize: 12,
    color: THEME.colors.textSecondary,
    marginTop: 2,
  },
  itemMsg: {
    fontSize: 11,
    color: THEME.colors.secondary,
    fontStyle: 'italic',
    marginTop: 2,
  },
  itemOpt: {
    fontSize: 10,
    color: THEME.colors.textMuted,
    marginTop: 2,
  },
  itemBottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
  },
  itemPrice: {
    fontSize: 14,
    fontWeight: '700',
    color: THEME.colors.primary,
  },
  qtyControl: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: THEME.colors.surfaceSubtle,
    borderRadius: 6,
    padding: 2,
  },
  qtyBtn: {
    width: 24,
    height: 24,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFF',
    borderRadius: 4,
  },
  qtyVal: {
    fontSize: 13,
    fontWeight: '700',
    paddingHorizontal: 8,
    color: THEME.colors.textPrimary,
  },
  methodSwitcher: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 12,
  },
  methodBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 10,
    borderRadius: THEME.borderRadius.md,
    borderWidth: 1.5,
    borderColor: THEME.colors.border,
    backgroundColor: THEME.colors.surfaceSubtle,
  },
  methodBtnActive: {
    backgroundColor: THEME.colors.primary,
    borderColor: THEME.colors.primary,
  },
  methodBtnText: {
    fontSize: 12,
    fontWeight: '600',
    color: THEME.colors.textPrimary,
  },
  methodBtnTextActive: {
    color: '#FFF',
    fontWeight: '700',
  },
  inputSubLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: THEME.colors.textSecondary,
    marginTop: 10,
    marginBottom: 6,
  },
  slotScroll: {
    flexDirection: 'row',
    marginBottom: 10,
  },
  slotPill: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: THEME.borderRadius.round,
    backgroundColor: THEME.colors.surfaceSubtle,
    borderWidth: 1,
    borderColor: THEME.colors.border,
    marginRight: 8,
  },
  slotPillActive: {
    backgroundColor: THEME.colors.secondary,
    borderColor: THEME.colors.secondary,
  },
  slotText: {
    fontSize: 12,
    color: THEME.colors.textPrimary,
  },
  slotTextActive: {
    color: '#FFF',
    fontWeight: '700',
  },
  secretGiftRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FAF5FF',
    padding: 10,
    borderRadius: THEME.borderRadius.md,
    borderWidth: 1,
    borderColor: '#F3E8FF',
    marginVertical: 10,
  },
  secretGiftTextCol: {
    flex: 1,
    marginRight: 8,
  },
  secretGiftTitleWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  secretGiftLabel: {
    fontSize: 13,
    fontWeight: '700',
    color: '#6B21A8',
  },
  secretGiftHelp: {
    fontSize: 11,
    color: '#7E22CE',
    marginTop: 2,
  },
  textInput: {
    backgroundColor: THEME.colors.surfaceSubtle,
    borderWidth: 1,
    borderColor: THEME.colors.border,
    borderRadius: THEME.borderRadius.md,
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: 13,
    color: THEME.colors.textPrimary,
    marginBottom: 4,
  },
  voucherInputRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 10,
  },
  voucherInput: {
    flex: 1,
    backgroundColor: THEME.colors.surfaceSubtle,
    borderWidth: 1,
    borderColor: THEME.colors.border,
    borderRadius: THEME.borderRadius.md,
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: 13,
    color: THEME.colors.textPrimary,
  },
  applyVoucherBtn: {
    backgroundColor: THEME.colors.primary,
    paddingHorizontal: 16,
    justifyContent: 'center',
    borderRadius: THEME.borderRadius.md,
  },
  applyVoucherBtnText: {
    color: '#FFF',
    fontWeight: '700',
    fontSize: 13,
  },
  appliedVoucherBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#DCFCE7',
    padding: 10,
    borderRadius: THEME.borderRadius.md,
    gap: 6,
    justifyContent: 'space-between',
  },
  appliedVoucherText: {
    color: '#15803D',
    fontWeight: '700',
    fontSize: 12,
    flex: 1,
  },
  quickVouchersList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  quickVoucherPill: {
    flexDirection: 'row',
    backgroundColor: '#FAF5F2',
    borderWidth: 1,
    borderColor: '#E6D7CC',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  quickVoucherCode: {
    fontWeight: '700',
    color: THEME.colors.primary,
    fontSize: 11,
  },
  quickVoucherTitle: {
    fontSize: 11,
    color: THEME.colors.textSecondary,
  },
  pointsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 14,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: THEME.colors.border,
  },
  pointsTextCol: {
    flex: 1,
    marginRight: 8,
  },
  pointsLabel: {
    fontSize: 13,
    fontWeight: '700',
    color: THEME.colors.textPrimary,
  },
  pointsSub: {
    fontSize: 11,
    color: THEME.colors.textMuted,
    marginTop: 2,
  },
  pointsDeductionText: {
    fontSize: 12,
    color: '#B45309',
    fontWeight: '700',
    marginTop: 4,
  },
  payMethodItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: THEME.borderRadius.md,
    borderWidth: 1,
    borderColor: THEME.colors.border,
    backgroundColor: THEME.colors.surfaceSubtle,
    marginBottom: 8,
    gap: 10,
  },
  payMethodItemActive: {
    borderColor: THEME.colors.primary,
    backgroundColor: '#FAF5F2',
  },
  payMethodText: {
    flex: 1,
    fontSize: 13,
    color: THEME.colors.textPrimary,
  },
  payMethodTextActive: {
    fontWeight: '700',
    color: THEME.colors.primary,
  },
  radio: {
    width: 18,
    height: 18,
    borderRadius: 9,
    borderWidth: 2,
    borderColor: THEME.colors.textMuted,
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioActive: {
    borderColor: THEME.colors.primary,
  },
  radioInner: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: THEME.colors.primary,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  summaryLabel: {
    fontSize: 13,
    color: THEME.colors.textSecondary,
  },
  summaryVal: {
    fontSize: 13,
    fontWeight: '600',
    color: THEME.colors.textPrimary,
  },
  summaryDiscountLabel: {
    fontSize: 13,
    color: THEME.colors.secondary,
  },
  summaryDiscountVal: {
    fontSize: 13,
    fontWeight: '700',
    color: THEME.colors.secondary,
  },
  grandTotalRow: {
    borderTopWidth: 1,
    borderTopColor: THEME.colors.border,
    paddingTop: 10,
    marginTop: 6,
  },
  grandTotalLabel: {
    fontSize: 15,
    fontWeight: '800',
    color: THEME.colors.textPrimary,
  },
  grandTotalVal: {
    fontSize: 18,
    fontWeight: '800',
    color: THEME.colors.primary,
  },
  checkoutBtn: {
    backgroundColor: THEME.colors.primary,
    paddingVertical: 16,
    borderRadius: THEME.borderRadius.md,
    alignItems: 'center',
    marginTop: 10,
    ...THEME.shadows.md,
  },
  checkoutBtnText: {
    color: '#FFF',
    fontSize: 15,
    fontWeight: '800',
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 30,
    backgroundColor: THEME.colors.background,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: THEME.colors.textPrimary,
    marginTop: 16,
  },
  emptySubtitle: {
    fontSize: 13,
    color: THEME.colors.textSecondary,
    textAlign: 'center',
    marginTop: 6,
    lineHeight: 20,
  },
  exploreBtn: {
    backgroundColor: THEME.colors.primary,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: THEME.borderRadius.round,
    marginTop: 20,
  },
  exploreBtnText: {
    color: '#FFF',
    fontSize: 14,
    fontWeight: '700',
  },
});
