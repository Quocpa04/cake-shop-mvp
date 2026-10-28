import React, { useState } from 'react';
import {
  Alert,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useApp } from '../context/AppContext';
import { THEME } from '../theme/theme';
import { Order } from '../types';

interface ShipperScreenProps {
  onLogout?: () => void;
}

export const ShipperScreen: React.FC<ShipperScreenProps> = ({ onLogout }) => {
  const { orders, updateOrderStatus, selectedBranch } = useApp();

  const [otpModalVisible, setOtpModalVisible] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [otpInput, setOtpInput] = useState('');
  const [failReasonModalVisible, setFailReasonModalVisible] = useState(false);
  const [failReason, setFailReason] = useState('');

  // Orders that are relevant for Shipper
  const shipperOrders = orders.filter((o) =>
    ['READY', 'DELIVERING', 'COMPLETED', 'FAILED_DELIVERY'].includes(o.status)
  );

  const handlePickupOrder = (order: Order) => {
    Alert.alert(
      'Nhận bánh tại tiệm',
      `Xác nhận nhận đơn ${order.code} từ xưởng bánh ${selectedBranch.name}? Kiểm tra bánh đã đóng hộp nguyên vẹn và đưa vào thùng lạnh.`,
      [
        { text: 'Hủy', style: 'cancel' },
        {
          text: 'Đã nhận & Bắt đầu giao',
          onPress: () => {
            updateOrderStatus(
              order.id,
              'DELIVERING',
              'Shipper Hoàng Minh đã nhận bánh và bắt đầu di chuyển giao hàng'
            );
            Alert.alert('Bắt đầu giao', 'Trạng thái đã cập nhật: Đang giao hàng!');
          },
        },
      ]
    );
  };

  const handleVerifyOtpSuccess = () => {
    if (!selectedOrder) return;
    if (otpInput.length < 4) {
      Alert.alert('Lỗi', 'Vui lòng nhập mã OTP gồm 4 số do khách hàng cung cấp.');
      return;
    }
    updateOrderStatus(
      selectedOrder.id,
      'COMPLETED',
      `Hoàng Minh • OTP người nhận hợp lệ (${otpInput})`
    );
    setOtpModalVisible(false);
    setOtpInput('');
    Alert.alert('Giao thành công', `Đơn hàng ${selectedOrder.code} đã hoàn tất thành công!`);
  };

  const handleReportDeliveryFailure = () => {
    if (!selectedOrder) return;
    if (!failReason.trim()) {
      Alert.alert('Lỗi', 'Vui lòng nhập lý do giao thất bại (VD: Khách không nghe máy, xô lệch).');
      return;
    }
    updateOrderStatus(
      selectedOrder.id,
      'FAILED_DELIVERY',
      `Giao thất bại: ${failReason}`
    );
    setFailReasonModalVisible(false);
    setFailReason('');
    Alert.alert('Đã ghi nhận', `Đơn hàng ${selectedOrder.code} đã chuyển trạng thái Giao thất bại.`);
  };

  return (
    <View style={styles.container}>
      {/* Shipper Header */}
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <View style={styles.shipperBadge}>
            <Ionicons name="bicycle" size={18} color="#059669" />
            <Text style={styles.shipperBadgeText}>APP SHIPPER GIAO HÀNG</Text>
          </View>

          <TouchableOpacity
            style={styles.logoutBtn}
            onPress={() => {
              Alert.alert(
                'Đăng xuất',
                'Đăng xuất khỏi tài khoản Nhân viên giao hàng?',
                [
                  { text: 'Hủy', style: 'cancel' },
                  { text: 'Đăng xuất', style: 'destructive', onPress: onLogout },
                ]
              );
            }}
            activeOpacity={0.8}
          >
            <Ionicons name="log-out-outline" size={15} color="#DC2626" />
            <Text style={styles.logoutBtnText}>Đăng xuất</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.shipperProfileRow}>
          <View>
            <Text style={styles.shipperName}>Shipper: Hoàng Minh (MTE-SHP-08)</Text>
            <Text style={styles.shipperBranch}>Khu vực: {selectedBranch.name} • Thùng giữ lạnh</Text>
          </View>
          <View style={styles.onlineBadge}>
            <View style={styles.onlineDot} />
            <Text style={styles.onlineText}>Đang online</Text>
          </View>
        </View>
      </View>

      {/* Orders List */}
      <ScrollView contentContainerStyle={styles.contentContainer} showsVerticalScrollIndicator={false}>
        <Text style={styles.sectionHeading}>
          Đơn hàng cần giao hôm nay ({shipperOrders.length})
        </Text>

        {shipperOrders.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Ionicons name="bicycle-outline" size={44} color={THEME.colors.textMuted} />
            <Text style={styles.emptyTitle}>Chưa có đơn hàng nào sẵn sàng giao</Text>
            <Text style={styles.emptySub}>Khi bếp làm xong, đơn hàng sẽ hiển thị tại đây</Text>
          </View>
        ) : (
          shipperOrders.map((order) => {
            const isReady = order.status === 'READY';
            const isDelivering = order.status === 'DELIVERING';
            const isCompleted = order.status === 'COMPLETED';

            return (
              <View key={order.id} style={styles.orderCard}>
                <View style={styles.orderCardHeader}>
                  <View>
                    <Text style={styles.orderCode}>{order.code}</Text>
                    <Text style={styles.slotTime}>
                      Khung giờ giao: <Text style={{ fontWeight: '700' }}>{order.receiveTime}</Text>
                    </Text>
                  </View>

                  <View
                    style={[
                      styles.statusPill,
                      isReady && { backgroundColor: '#EFF6FF' },
                      isDelivering && { backgroundColor: '#FEF3C7' },
                      isCompleted && { backgroundColor: '#ECFDF5' },
                    ]}
                  >
                    <Text
                      style={[
                        styles.statusPillText,
                        isReady && { color: '#2563EB' },
                        isDelivering && { color: '#B45309' },
                        isCompleted && { color: '#059669' },
                      ]}
                    >
                      {isReady ? 'Sẵn sàng giao' : isDelivering ? 'Đang giao' : 'Đã giao xong'}
                    </Text>
                  </View>
                </View>

                {/* Receiver Info */}
                <View style={styles.receiverBox}>
                  <View style={styles.receiverRow}>
                    <Ionicons name="person" size={15} color={THEME.colors.primary} />
                    <Text style={styles.receiverName}>{order.receiverName}</Text>
                  </View>

                  <View style={styles.receiverRow}>
                    <Ionicons name="call" size={15} color="#059669" />
                    <Text style={styles.receiverPhone}>{order.receiverPhone}</Text>
                    <TouchableOpacity
                      style={styles.callBtn}
                      onPress={() => Alert.alert('Gọi điện', `Đang kết nối cuộc gọi tới ${order.receiverPhone}...`)}
                      activeOpacity={0.7}
                    >
                      <Text style={styles.callBtnText}>Gọi khách</Text>
                    </TouchableOpacity>
                  </View>

                  <View style={styles.receiverRow}>
                    <Ionicons name="location" size={15} color="#DC2626" />
                    <Text style={styles.receiverAddress}>{order.receiverAddress}</Text>
                  </View>
                </View>

                {/* Cake items */}
                <View style={styles.cakesList}>
                  {order.items.map((it, idx) => (
                    <Text key={idx} style={styles.cakeItemText}>
                      🍰 {it.quantity}x {it.productName} ({it.size})
                    </Text>
                  ))}
                  <Text style={styles.paymentInfoText}>
                    Thu hộ COD: {order.paymentMethod === 'COD' ? `${order.total.toLocaleString('vi-VN')} đ` : '0đ (Đã thanh toán Online)'}
                  </Text>
                </View>

                {/* Shipper Actions */}
                <View style={styles.actionsRow}>
                  {isReady && (
                    <TouchableOpacity
                      style={styles.pickupBtn}
                      onPress={() => handlePickupOrder(order)}
                      activeOpacity={0.8}
                    >
                      <Ionicons name="cube-outline" size={16} color="#FFFFFF" />
                      <Text style={styles.pickupBtnText}>Nhận bánh & Đi giao</Text>
                    </TouchableOpacity>
                  )}

                  {isDelivering && (
                    <>
                      <TouchableOpacity
                        style={styles.successBtn}
                        onPress={() => {
                          setSelectedOrder(order);
                          setOtpModalVisible(true);
                        }}
                        activeOpacity={0.8}
                      >
                        <Ionicons name="checkmark-done" size={16} color="#FFFFFF" />
                        <Text style={styles.successBtnText}>Nhập OTP • Giao xong</Text>
                      </TouchableOpacity>

                      <TouchableOpacity
                        style={styles.failBtn}
                        onPress={() => {
                          setSelectedOrder(order);
                          setFailReasonModalVisible(true);
                        }}
                        activeOpacity={0.8}
                      >
                        <Text style={styles.failBtnText}>Báo thất bại</Text>
                      </TouchableOpacity>
                    </>
                  )}
                </View>
              </View>
            );
          })
        )}
      </ScrollView>

      {/* OTP Verification Modal */}
      <Modal visible={otpModalVisible} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <View style={styles.modalHeader}>
              <Ionicons name="shield-checkmark" size={24} color="#059669" />
              <Text style={styles.modalTitle}>Xác Nhận Người Nhận Hợp Lệ</Text>
            </View>
            <Text style={styles.modalSub}>
              Nhập mã 4 số OTP do khách hàng cung cấp tại thời điểm giao bánh để hoàn tất đơn hàng {selectedOrder?.code}.
            </Text>

            <TextInput
              style={styles.otpInput}
              placeholder="Nhập 4 số OTP (VD: 8823)"
              value={otpInput}
              onChangeText={setOtpInput}
              keyboardType="number-pad"
              maxLength={4}
            />

            <View style={styles.modalBtns}>
              <TouchableOpacity
                style={styles.cancelModalBtn}
                onPress={() => setOtpModalVisible(false)}
              >
                <Text style={styles.cancelModalBtnText}>Hủy</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.submitOtpBtn}
                onPress={handleVerifyOtpSuccess}
              >
                <Text style={styles.submitOtpBtnText}>Xác nhận giao thành công</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Delivery Failure Modal */}
      <Modal visible={failReasonModalVisible} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>Báo Giao Hàng Thất Bại</Text>
            <Text style={styles.modalSub}>Đơn hàng: {selectedOrder?.code}</Text>

            <TextInput
              style={styles.modalInput}
              placeholder="Nhập lý do (VD: Gọi 3 cuộc không nghe máy, khách dời hẹn...)"
              value={failReason}
              onChangeText={setFailReason}
            />

            <View style={styles.modalBtns}>
              <TouchableOpacity
                style={styles.cancelModalBtn}
                onPress={() => setFailReasonModalVisible(false)}
              >
                <Text style={styles.cancelModalBtnText}>Hủy</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.submitFailBtn}
                onPress={handleReportDeliveryFailure}
              >
                <Text style={styles.submitFailBtnText}>Gửi báo cáo</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F3F4F6',
  },
  header: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  shipperBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#ECFDF5',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  shipperBadgeText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#059669',
  },
  logoutBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#FFF5F5',
    borderWidth: 1,
    borderColor: '#FECACA',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
  },
  logoutBtnText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#DC2626',
  },
  shipperProfileRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 10,
  },
  shipperName: {
    fontSize: 14,
    fontWeight: '800',
    color: '#1F2937',
  },
  shipperBranch: {
    fontSize: 11,
    color: '#6B7280',
    marginTop: 2,
  },
  onlineBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: '#ECFDF5',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  onlineDot: {
    width: 7,
    height: 7,
    borderRadius: 3.5,
    backgroundColor: '#10B981',
  },
  onlineText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#059669',
  },
  contentContainer: {
    padding: 14,
    gap: 12,
  },
  sectionHeading: {
    fontSize: 14,
    fontWeight: '700',
    color: '#374151',
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 50,
  },
  emptyTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#1F2937',
    marginTop: 10,
  },
  emptySub: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 4,
  },
  orderCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 14,
    elevation: 1,
    gap: 10,
  },
  orderCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  orderCode: {
    fontSize: 15,
    fontWeight: '800',
    color: '#1F2937',
  },
  slotTime: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 2,
  },
  statusPill: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  statusPillText: {
    fontSize: 11,
    fontWeight: '700',
  },
  receiverBox: {
    backgroundColor: '#F9FAFB',
    borderRadius: 8,
    padding: 10,
    gap: 6,
  },
  receiverRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  receiverName: {
    fontSize: 13,
    fontWeight: '700',
    color: '#1F2937',
  },
  receiverPhone: {
    fontSize: 12,
    fontWeight: '600',
    color: '#059669',
  },
  callBtn: {
    backgroundColor: '#E0F2FE',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
  },
  callBtnText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#0284C7',
  },
  receiverAddress: {
    fontSize: 12,
    color: '#374151',
    flex: 1,
  },
  cakesList: {
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
    paddingTop: 8,
    gap: 4,
  },
  cakeItemText: {
    fontSize: 12,
    color: '#1F2937',
    fontWeight: '500',
  },
  paymentInfoText: {
    fontSize: 11,
    color: '#DC2626',
    fontWeight: '700',
    marginTop: 2,
  },
  actionsRow: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 4,
  },
  pickupBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: '#2563EB',
    paddingVertical: 10,
    borderRadius: 8,
  },
  pickupBtnText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700',
  },
  successBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: '#059669',
    paddingVertical: 10,
    borderRadius: 8,
  },
  successBtnText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700',
  },
  failBtn: {
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#FECACA',
    backgroundColor: '#FEF2F2',
  },
  failBtnText: {
    color: '#DC2626',
    fontSize: 12,
    fontWeight: '600',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  modalCard: {
    width: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 16,
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  modalTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: '#1F2937',
  },
  modalSub: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 4,
    marginBottom: 12,
    lineHeight: 16,
  },
  otpInput: {
    borderWidth: 1.5,
    borderColor: '#059669',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 18,
    fontWeight: '800',
    textAlign: 'center',
    letterSpacing: 8,
    backgroundColor: '#F0FDF4',
  },
  modalInput: {
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 8,
    fontSize: 13,
    backgroundColor: '#F9FAFB',
  },
  modalBtns: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 14,
  },
  cancelModalBtn: {
    flex: 1,
    backgroundColor: '#F3F4F6',
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
  cancelModalBtnText: {
    fontSize: 12,
    color: '#4B5563',
    fontWeight: '600',
  },
  submitOtpBtn: {
    flex: 1.5,
    backgroundColor: '#059669',
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
  submitOtpBtnText: {
    fontSize: 12,
    color: '#FFFFFF',
    fontWeight: '700',
  },
  submitFailBtn: {
    flex: 1,
    backgroundColor: '#DC2626',
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
  submitFailBtnText: {
    fontSize: 12,
    color: '#FFFFFF',
    fontWeight: '700',
  },
});
