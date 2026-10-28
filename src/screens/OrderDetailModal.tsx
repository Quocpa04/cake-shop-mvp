import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import {
  Alert,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { OrderStatusBadge } from '../components/Badge';
import { OrderTimeline } from '../components/OrderTimeline';
import { useApp } from '../context/AppContext';
import { THEME } from '../theme/theme';
import { Order } from '../types';

interface OrderDetailModalProps {
  visible: boolean;
  order: Order | null;
  onClose: () => void;
  onOpenComplaint?: (orderCode: string) => void;
}

export const OrderDetailModal: React.FC<OrderDetailModalProps> = ({
  visible,
  order,
  onClose,
  onOpenComplaint,
}) => {
  const { advanceOrderStatus, cancelOrder } = useApp();

  if (!order) return null;

  const canCancel = order.status === 'NEW' || order.status === 'PENDING_PAYMENT' || order.status === 'CONFIRMED';

  const handleCancel = () => {
    Alert.alert(
      'Xác nhận hủy đơn',
      'Bạn có chắc chắn muốn hủy đơn hàng này? Tiền đã thanh toán sẽ được hoàn về tài khoản trong 3-5 ngày làm việc.',
      [
        { text: 'Quay lại', style: 'cancel' },
        {
          text: 'Đồng ý hủy',
          style: 'destructive',
          onPress: () => {
            cancelOrder(order.id, 'Khách hàng yêu cầu hủy qua ứng dụng');
            Alert.alert('Thành công', 'Đơn hàng đã được hủy.');
          },
        },
      ]
    );
  };

  return (
    <Modal visible={visible} animationType="slide" transparent={false} onRequestClose={onClose}>
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity style={styles.backBtn} onPress={onClose} activeOpacity={0.8}>
            <Ionicons name="arrow-back" size={24} color={THEME.colors.textPrimary} />
          </TouchableOpacity>
          <View style={styles.headerTitleContainer}>
            <Text style={styles.headerTitle}>Chi tiết đơn hàng</Text>
            <Text style={styles.headerCode}>{order.code}</Text>
          </View>
          <OrderStatusBadge status={order.status} />
        </View>

        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
          {/* Secret Gift Alert Banner */}
          {order.isSecretGift && (
            <View style={styles.secretGiftBanner}>
              <Ionicons name="gift" size={20} color="#7E22CE" />
              <View style={styles.secretGiftTextCol}>
                <Text style={styles.secretGiftTitle}>Đơn hàng Giao Bí Mật</Text>
                <Text style={styles.secretGiftDesc}>
                  Thông tin người gửi được bảo mật hoàn toàn. Shipper sẽ liên hệ người nhận như món quà bất ngờ.
                </Text>
              </View>
            </View>
          )}

          {/* Real-time Order Tracking Timeline */}
          <OrderTimeline currentStatus={order.status} logs={order.timelineLogs} />

          {/* Interactive Simulation Button (Demo requirement for BRD/SRS status lifecycle) */}
          {order.status !== 'COMPLETED' && order.status !== 'CANCELLED' && (
            <TouchableOpacity
              style={styles.advanceStatusBtn}
              onPress={() => advanceOrderStatus(order.id)}
              activeOpacity={0.85}
            >
              <Ionicons name="flash-outline" size={18} color="#FFFFFF" />
              <Text style={styles.advanceStatusBtnText}>Mô phỏng bước trạng thái tiếp theo</Text>
            </TouchableOpacity>
          )}

          {/* Delivery & Receiver Info */}
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Thông tin nhận bánh</Text>

            <View style={styles.infoRow}>
              <Ionicons name="location-outline" size={18} color={THEME.colors.primary} />
              <View style={styles.infoTextCol}>
                <Text style={styles.infoLabel}>Địa chỉ nhận:</Text>
                <Text style={styles.infoValue}>{order.receiverAddress}</Text>
              </View>
            </View>

            <View style={styles.infoRow}>
              <Ionicons name="person-outline" size={18} color={THEME.colors.primary} />
              <View style={styles.infoTextCol}>
                <Text style={styles.infoLabel}>Người nhận:</Text>
                <Text style={styles.infoValue}>
                  {order.receiverName} - {order.receiverPhone}
                </Text>
              </View>
            </View>

            <View style={styles.infoRow}>
              <Ionicons name="time-outline" size={18} color={THEME.colors.primary} />
              <View style={styles.infoTextCol}>
                <Text style={styles.infoLabel}>Thời gian nhận:</Text>
                <Text style={styles.infoValue}>{order.receiveTime}</Text>
              </View>
            </View>

            <View style={styles.infoRow}>
              <Ionicons name="business-outline" size={18} color={THEME.colors.primary} />
              <View style={styles.infoTextCol}>
                <Text style={styles.infoLabel}>Chi nhánh sản xuất:</Text>
                <Text style={styles.infoValue}>{order.branchName}</Text>
              </View>
            </View>

            {order.otpCode && order.status === 'DELIVERING' && (
              <View style={styles.otpBox}>
                <Text style={styles.otpLabel}>MÃ OTP XÁC THỰC KHI NHẬN HÀNG:</Text>
                <Text style={styles.otpCode}>{order.otpCode}</Text>
                <Text style={styles.otpNote}>Đọc mã này cho shipper khi bạn nhận đúng bánh</Text>
              </View>
            )}
          </View>

          {/* Order Items */}
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Danh sách món ({order.items.length})</Text>
            {order.items.map((item, idx) => (
              <View key={idx} style={styles.itemRow}>
                <View style={styles.itemHeader}>
                  <Text style={styles.itemName}>
                    {item.quantity}x {item.productName}
                  </Text>
                  <Text style={styles.itemPrice}>
                    {(item.price * item.quantity).toLocaleString('vi-VN')}đ
                  </Text>
                </View>

                <Text style={styles.itemSize}>Kích cỡ: {item.size}</Text>

                {item.messageOnCake ? (
                  <View style={styles.cakeTextBox}>
                    <Ionicons name="pencil-outline" size={14} color={THEME.colors.secondary} />
                    <Text style={styles.cakeTextVal}>{`"${item.messageOnCake}"`}</Text>
                  </View>
                ) : null}

                {item.options && item.options.length > 0 ? (
                  <View style={styles.optionsList}>
                    {item.options.map((opt) => (
                      <Text key={opt.id} style={styles.optionItemText}>
                        + {opt.name} ({opt.price.toLocaleString('vi-VN')}đ)
                      </Text>
                    ))}
                  </View>
                ) : null}
              </View>
            ))}
          </View>

          {/* Payment Summary */}
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Chi tiết thanh toán</Text>

            <View style={styles.priceRow}>
              <Text style={styles.priceLabel}>Tạm tính</Text>
              <Text style={styles.priceVal}>{order.subtotal.toLocaleString('vi-VN')}đ</Text>
            </View>

            <View style={styles.priceRow}>
              <Text style={styles.priceLabel}>Phí giao hàng</Text>
              <Text style={styles.priceVal}>
                {order.deliveryFee > 0 ? `${order.deliveryFee.toLocaleString('vi-VN')}đ` : 'Miễn phí'}
              </Text>
            </View>

            {order.discount > 0 && (
              <View style={styles.priceRow}>
                <Text style={styles.discountLabel}>Giảm giá (Voucher & Điểm)</Text>
                <Text style={styles.discountVal}>-{order.discount.toLocaleString('vi-VN')}đ</Text>
              </View>
            )}

            <View style={[styles.priceRow, styles.totalRow]}>
              <Text style={styles.totalLabel}>Tổng thanh toán</Text>
              <Text style={styles.totalVal}>{order.total.toLocaleString('vi-VN')}đ</Text>
            </View>

            <View style={styles.paymentMethodRow}>
              <Ionicons name="card-outline" size={16} color={THEME.colors.textSecondary} />
              <Text style={styles.paymentMethodText}>
                Phương thức: {order.paymentMethod === 'VNPAY_QR' ? 'VNPAY QR' : order.paymentMethod} (
                {order.paymentStatus === 'PAID' ? 'Đã thanh toán' : 'Chưa thanh toán'})
              </Text>
            </View>
          </View>

          {/* Action Buttons */}
          <View style={styles.actionsContainer}>
            {canCancel && (
              <TouchableOpacity style={styles.cancelBtn} onPress={handleCancel} activeOpacity={0.8}>
                <Text style={styles.cancelBtnText}>Hủy đơn hàng</Text>
              </TouchableOpacity>
            )}

            <TouchableOpacity
              style={styles.complaintBtn}
              onPress={() => {
                onClose();
                onOpenComplaint && onOpenComplaint(order.code);
              }}
              activeOpacity={0.8}
            >
              <Ionicons name="chatbox-ellipses-outline" size={18} color={THEME.colors.primary} />
              <Text style={styles.complaintBtnText}>Khiếu nại / Phản ánh đơn này</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: THEME.colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: THEME.colors.surface,
    paddingTop: 48,
    paddingBottom: 14,
    paddingHorizontal: THEME.spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: THEME.colors.border,
  },
  backBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitleContainer: {
    flex: 1,
    marginLeft: 12,
  },
  headerTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: THEME.colors.textPrimary,
  },
  headerCode: {
    fontSize: 12,
    color: THEME.colors.textMuted,
    marginTop: 2,
  },
  scrollContent: {
    padding: THEME.spacing.lg,
    paddingBottom: 50,
  },
  secretGiftBanner: {
    flexDirection: 'row',
    backgroundColor: '#F3E8FF',
    borderWidth: 1,
    borderColor: '#E9D5FF',
    borderRadius: THEME.borderRadius.md,
    padding: THEME.spacing.md,
    marginBottom: THEME.spacing.md,
    alignItems: 'flex-start',
  },
  secretGiftTextCol: {
    flex: 1,
    marginLeft: 10,
  },
  secretGiftTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#6B21A8',
  },
  secretGiftDesc: {
    fontSize: 12,
    color: '#7E22CE',
    marginTop: 2,
    lineHeight: 18,
  },
  advanceStatusBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: THEME.colors.secondary,
    paddingVertical: 12,
    borderRadius: THEME.borderRadius.md,
    marginVertical: THEME.spacing.sm,
    gap: 8,
  },
  advanceStatusBtnText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 13,
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
    marginBottom: THEME.spacing.md,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  infoTextCol: {
    flex: 1,
    marginLeft: 10,
  },
  infoLabel: {
    fontSize: 11,
    color: THEME.colors.textMuted,
  },
  infoValue: {
    fontSize: 13,
    fontWeight: '600',
    color: THEME.colors.textPrimary,
    marginTop: 1,
  },
  otpBox: {
    backgroundColor: '#FEF3C7',
    borderWidth: 1,
    borderColor: '#FDE68A',
    borderRadius: THEME.borderRadius.md,
    padding: 12,
    alignItems: 'center',
    marginTop: 10,
  },
  otpLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: '#92400E',
  },
  otpCode: {
    fontSize: 24,
    fontWeight: '800',
    letterSpacing: 4,
    color: '#B45309',
    marginVertical: 4,
  },
  otpNote: {
    fontSize: 11,
    color: '#92400E',
  },
  itemRow: {
    borderBottomWidth: 1,
    borderBottomColor: THEME.colors.border,
    paddingBottom: 10,
    marginBottom: 10,
  },
  itemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  itemName: {
    fontSize: 14,
    fontWeight: '700',
    color: THEME.colors.textPrimary,
    flex: 1,
  },
  itemPrice: {
    fontSize: 14,
    fontWeight: '700',
    color: THEME.colors.primary,
  },
  itemSize: {
    fontSize: 12,
    color: THEME.colors.textSecondary,
    marginTop: 2,
  },
  cakeTextBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FAF5F2',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    marginTop: 6,
    gap: 6,
  },
  cakeTextVal: {
    fontSize: 12,
    fontStyle: 'italic',
    color: THEME.colors.secondary,
    fontWeight: '600',
  },
  optionsList: {
    marginTop: 4,
  },
  optionItemText: {
    fontSize: 11,
    color: THEME.colors.textMuted,
  },
  priceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  priceLabel: {
    fontSize: 13,
    color: THEME.colors.textSecondary,
  },
  priceVal: {
    fontSize: 13,
    fontWeight: '600',
    color: THEME.colors.textPrimary,
  },
  discountLabel: {
    fontSize: 13,
    color: THEME.colors.secondary,
  },
  discountVal: {
    fontSize: 13,
    fontWeight: '700',
    color: THEME.colors.secondary,
  },
  totalRow: {
    borderTopWidth: 1,
    borderTopColor: THEME.colors.border,
    paddingTop: 10,
    marginTop: 6,
  },
  totalLabel: {
    fontSize: 15,
    fontWeight: '800',
    color: THEME.colors.textPrimary,
  },
  totalVal: {
    fontSize: 18,
    fontWeight: '800',
    color: THEME.colors.primary,
  },
  paymentMethodRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 10,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: THEME.colors.border,
  },
  paymentMethodText: {
    fontSize: 12,
    color: THEME.colors.textSecondary,
  },
  actionsContainer: {
    gap: 12,
    marginTop: 10,
  },
  cancelBtn: {
    backgroundColor: '#FEE2E2',
    paddingVertical: 12,
    borderRadius: THEME.borderRadius.md,
    alignItems: 'center',
  },
  cancelBtnText: {
    color: '#DC2626',
    fontWeight: '700',
    fontSize: 14,
  },
  complaintBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: THEME.colors.surface,
    borderWidth: 1,
    borderColor: THEME.colors.primary,
    paddingVertical: 12,
    borderRadius: THEME.borderRadius.md,
    gap: 6,
  },
  complaintBtnText: {
    color: THEME.colors.primary,
    fontWeight: '700',
    fontSize: 14,
  },
});
