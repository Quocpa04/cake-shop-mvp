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
import { Order, OrderStatus } from '../types';

interface KitchenScreenProps {
  onLogout?: () => void;
}

export const KitchenScreen: React.FC<KitchenScreenProps> = ({ onLogout }) => {
  const { orders, updateOrderStatus, selectedBranch } = useApp();
  const [filterTab, setFilterTab] = useState<'ALL' | 'PENDING' | 'IN_PRODUCTION' | 'READY'>('ALL');

  // Modal báo thiếu nguyên liệu
  const [shortageModalVisible, setShortageModalVisible] = useState(false);
  const [selectedOrderForShortage, setSelectedOrderForShortage] = useState<Order | null>(null);
  const [missingIngredient, setMissingIngredient] = useState('');

  // Lọc các đơn hàng liên quan đến bếp
  const kitchenOrders = orders.filter((order) => {
    if (filterTab === 'PENDING') return order.status === 'CONFIRMED' || order.status === 'NEW';
    if (filterTab === 'IN_PRODUCTION') return order.status === 'IN_PRODUCTION';
    if (filterTab === 'READY') return order.status === 'READY';
    return ['CONFIRMED', 'NEW', 'IN_PRODUCTION', 'READY', 'DELIVERING'].includes(order.status);
  });

  const handleStartBaking = (order: Order) => {
    Alert.alert(
      'Bắt đầu làm bánh',
      `Xác nhận bắt đầu chuẩn bị đơn ${order.code}? Khách hàng sẽ nhận thông báo đơn đang được nướng & trang trí.`,
      [
        { text: 'Hủy', style: 'cancel' },
        {
          text: 'Bắt đầu',
          onPress: () => {
            updateOrderStatus(order.id, 'IN_PRODUCTION', 'Thợ bánh đã tiếp nhận và đang tiến hành làm');
          },
        },
      ]
    );
  };

  const handleCompleteBaking = (order: Order) => {
    Alert.alert(
      'Hoàn tất bánh',
      `Đơn hàng ${order.code} đã hoàn thiện và sẵn sàng đóng hộp giao khách?`,
      [
        { text: 'Chưa xong', style: 'cancel' },
        {
          text: 'Xác nhận hoàn tất',
          onPress: () => {
            updateOrderStatus(order.id, 'READY', 'Bánh đã làm xong, đóng gói bảo quản lạnh chờ giao');
          },
        },
      ]
    );
  };

  const handleReportShortage = () => {
    if (!missingIngredient.trim()) {
      Alert.alert('Lỗi', 'Vui lòng nhập tên nguyên liệu đang thiếu');
      return;
    }
    Alert.alert(
      'Đã gửi báo cáo thiếu nguyên liệu',
      `Đã thông báo đến Quản lý chi nhánh ${selectedBranch.name}: Thiếu "${missingIngredient}" cho đơn ${selectedOrderForShortage?.code}. Quản lý sẽ hỗ trợ điều phối gấp!`,
      [{ text: 'Đồng ý' }]
    );
    setMissingIngredient('');
    setShortageModalVisible(false);
  };

  return (
    <View style={styles.container}>
      {/* Kitchen Top Header */}
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <View style={styles.kitchenBadge}>
            <Ionicons name="restaurant" size={18} color="#D97706" />
            <Text style={styles.kitchenBadgeText}>BẾP BÁNH (KDS)</Text>
          </View>

          <View style={styles.userLogoutRow}>
            <View style={styles.chefTag}>
              <Text style={styles.chefNameText}>Chef Minh Quân</Text>
            </View>
            <TouchableOpacity
              style={styles.logoutBtn}
              onPress={() => {
                Alert.alert(
                  'Đăng xuất',
                  'Đăng xuất khỏi tài khoản Thợ làm bánh?',
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
        </View>

        <View style={styles.branchRow}>
          <Text style={styles.branchTitle}>{selectedBranch.name}</Text>
          <View style={styles.liveIndicator}>
            <View style={styles.liveDot} />
            <Text style={styles.liveText}>Trực tiếp</Text>
          </View>
        </View>

        {/* Capacity Progress Bar */}
        <View style={styles.capacityCard}>
          <View style={styles.capacityHeader}>
            <Text style={styles.capacityLabel}>Công suất lò nướng hôm nay</Text>
            <Text style={styles.capacityValue}>7 / 12 mẻ bánh</Text>
          </View>
          <View style={styles.progressBarBg}>
            <View style={[styles.progressBarFill, { width: '58%' }]} />
          </View>
        </View>

        {/* Status Filter Tabs */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.tabsScroll}>
          {[
            { key: 'ALL', label: 'Tất cả đơn' },
            { key: 'PENDING', label: 'Chờ nướng (CONFIRMED)' },
            { key: 'IN_PRODUCTION', label: 'Đang làm bánh' },
            { key: 'READY', label: 'Đã hoàn tất' },
          ].map((tab) => {
            const active = filterTab === tab.key;
            return (
              <TouchableOpacity
                key={tab.key}
                style={[styles.filterPill, active && styles.filterPillActive]}
                onPress={() => setFilterTab(tab.key as any)}
                activeOpacity={0.8}
              >
                <Text style={[styles.filterPillText, active && styles.filterPillTextActive]}>
                  {tab.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      {/* Orders List */}
      <ScrollView contentContainerStyle={styles.contentContainer} showsVerticalScrollIndicator={false}>
        {kitchenOrders.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Ionicons name="sparkles-outline" size={48} color={THEME.colors.textMuted} />
            <Text style={styles.emptyTitle}>Hiện không có đơn nào ở trạng thái này</Text>
            <Text style={styles.emptySub}>Các đơn hàng mới sẽ tự động hiển thị ở đây</Text>
          </View>
        ) : (
          kitchenOrders.map((order) => {
            const isConfirmed = order.status === 'CONFIRMED' || order.status === 'NEW';
            const isInProd = order.status === 'IN_PRODUCTION';
            const isReady = order.status === 'READY';

            return (
              <View key={order.id} style={styles.orderCard}>
                {/* Order Top Bar */}
                <View style={styles.cardHeader}>
                  <View>
                    <Text style={styles.orderCode}>{order.code}</Text>
                    <Text style={styles.customerName}>
                      {order.receiverName} • {order.receiverPhone}
                    </Text>
                  </View>

                  {/* Delivery Countdown Alert */}
                  <View style={styles.countdownBadge}>
                    <Ionicons name="time-outline" size={14} color="#DC2626" />
                    <Text style={styles.countdownText}>Giao: {order.receiveTime}</Text>
                  </View>
                </View>

                {/* Cake Items List */}
                <View style={styles.itemsDivider} />
                {order.items.map((item, idx) => (
                  <View key={idx} style={styles.cakeItemRow}>
                    <View style={styles.cakeIcon}>
                      <Ionicons name="gift-outline" size={20} color={THEME.colors.primary} />
                    </View>
                    <View style={styles.cakeDetails}>
                      <Text style={styles.cakeName}>
                        {item.quantity}x {item.productName}
                      </Text>
                      <Text style={styles.cakeVariant}>
                        Kích thước: {item.size}
                      </Text>

                      {/* Custom Message Highlighted (BRD Highlight) */}
                      {item.messageOnCake ? (
                        <View style={styles.messageBox}>
                          <Ionicons name="text-outline" size={14} color="#B45309" />
                          <Text style={styles.messageText}>
                            Chữ viết trên bánh: "{item.messageOnCake}"
                          </Text>
                        </View>
                      ) : null}

                      {/* Options / Accessories */}
                      {item.options && item.options.length > 0 && (
                        <View style={styles.noteBox}>
                          <Ionicons name="sparkles-outline" size={14} color="#4B5563" />
                          <Text style={styles.noteText}>
                            Phụ kiện: {item.options.map((o) => o.name).join(', ')}
                          </Text>
                        </View>
                      )}
                    </View>
                  </View>
                ))}

                {/* Status Bar */}
                <View style={styles.statusRow}>
                  <Text style={styles.statusLabel}>Trạng thái hiện tại:</Text>
                  <View
                    style={[
                      styles.statusBadge,
                      isConfirmed && { backgroundColor: '#FEF3C7' },
                      isInProd && { backgroundColor: '#DBEAFE' },
                      isReady && { backgroundColor: '#D1FAE5' },
                    ]}
                  >
                    <Text
                      style={[
                        styles.statusBadgeText,
                        isConfirmed && { color: '#B45309' },
                        isInProd && { color: '#1E40AF' },
                        isReady && { color: '#065F46' },
                      ]}
                    >
                      {isConfirmed ? 'Chờ thợ nướng' : isInProd ? 'Đang làm trong bếp' : 'Đã hoàn tất'}
                    </Text>
                  </View>
                </View>

                {/* Action Buttons for Baker */}
                <View style={styles.actionsRow}>
                  {isConfirmed && (
                    <TouchableOpacity
                      style={styles.startBtn}
                      onPress={() => handleStartBaking(order)}
                      activeOpacity={0.8}
                    >
                      <Ionicons name="flame" size={18} color="#FFFFFF" />
                      <Text style={styles.startBtnText}>Bắt đầu làm bánh</Text>
                    </TouchableOpacity>
                  )}

                  {isInProd && (
                    <TouchableOpacity
                      style={styles.completeBtn}
                      onPress={() => handleCompleteBaking(order)}
                      activeOpacity={0.8}
                    >
                      <Ionicons name="checkmark-circle" size={18} color="#FFFFFF" />
                      <Text style={styles.completeBtnText}>Hoàn tất bánh</Text>
                    </TouchableOpacity>
                  )}

                  {isReady && (
                    <View style={styles.readyIndicator}>
                      <Ionicons name="checkmark-done" size={18} color="#059669" />
                      <Text style={styles.readyIndicatorText}>Sẵn sàng giao cho Shipper</Text>
                    </View>
                  )}

                  {/* Report Shortage */}
                  <TouchableOpacity
                    style={styles.shortageBtn}
                    onPress={() => {
                      setSelectedOrderForShortage(order);
                      setShortageModalVisible(true);
                    }}
                    activeOpacity={0.8}
                  >
                    <Ionicons name="alert-circle-outline" size={16} color="#DC2626" />
                    <Text style={styles.shortageBtnText}>Báo thiếu nguyên liệu</Text>
                  </TouchableOpacity>
                </View>
              </View>
            );
          })
        )}
      </ScrollView>

      {/* Modal Báo thiếu nguyên liệu */}
      <Modal visible={shortageModalVisible} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <View style={styles.modalHeader}>
              <Ionicons name="alert-circle" size={24} color="#DC2626" />
              <Text style={styles.modalTitle}>Báo Thiếu Nguyên Liệu</Text>
            </View>
            <Text style={styles.modalSub}>
              Đơn hàng: <Text style={{ fontWeight: '700' }}>{selectedOrderForShortage?.code}</Text>
            </Text>
            <Text style={styles.inputLabel}>Tên nguyên liệu đang thiếu:</Text>
            <TextInput
              style={styles.textInput}
              placeholder="VD: Kem whipping Anchor, Dâu tây Đà Lạt, Bột hạnh nhân..."
              value={missingIngredient}
              onChangeText={setMissingIngredient}
            />

            <View style={styles.quickOptions}>
              {['Kem tươi', 'Dâu tây', 'Trứng gà', 'Bột mì Pháp'].map((ing) => (
                <TouchableOpacity
                  key={ing}
                  style={styles.quickChip}
                  onPress={() => setMissingIngredient(ing)}
                >
                  <Text style={styles.quickChipText}>+ {ing}</Text>
                </TouchableOpacity>
              ))}
            </View>

            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={styles.cancelModalBtn}
                onPress={() => setShortageModalVisible(false)}
              >
                <Text style={styles.cancelModalBtnText}>Hủy</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.submitModalBtn}
                onPress={handleReportShortage}
              >
                <Text style={styles.submitModalBtnText}>Gửi báo cáo</Text>
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
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  kitchenBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#FEF3C7',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  kitchenBadgeText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#D97706',
    letterSpacing: 0.5,
  },
  userLogoutRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  chefTag: {
    backgroundColor: '#FAF7F2',
    borderWidth: 1,
    borderColor: '#EFEAE3',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  chefNameText: {
    fontSize: 11.5,
    fontWeight: '700',
    color: THEME.colors.textSecondary,
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
  branchRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 10,
  },
  branchTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: THEME.colors.textDark,
  },
  liveIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  liveDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#10B981',
  },
  liveText: {
    fontSize: 12,
    color: '#10B981',
    fontWeight: '600',
  },
  capacityCard: {
    backgroundColor: '#F9FAFB',
    padding: 10,
    borderRadius: 10,
    marginTop: 10,
  },
  capacityHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  capacityLabel: {
    fontSize: 12,
    color: '#6B7280',
  },
  capacityValue: {
    fontSize: 12,
    fontWeight: '700',
    color: THEME.colors.textDark,
  },
  progressBarBg: {
    height: 6,
    backgroundColor: '#E5E7EB',
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: '#D97706',
    borderRadius: 3,
  },
  tabsScroll: {
    marginTop: 12,
    marginBottom: 6,
  },
  filterPill: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: '#F3F4F6',
    marginRight: 8,
  },
  filterPillActive: {
    backgroundColor: '#D97706',
  },
  filterPillText: {
    fontSize: 13,
    color: '#4B5563',
    fontWeight: '600',
  },
  filterPillTextActive: {
    color: '#FFFFFF',
  },
  contentContainer: {
    padding: 16,
    gap: 14,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: THEME.colors.textDark,
    marginTop: 12,
  },
  emptySub: {
    fontSize: 13,
    color: THEME.colors.textMuted,
    marginTop: 4,
  },
  orderCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  orderCode: {
    fontSize: 16,
    fontWeight: '800',
    color: THEME.colors.textDark,
  },
  customerName: {
    fontSize: 12,
    color: THEME.colors.textMuted,
    marginTop: 2,
  },
  countdownBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#FEE2E2',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  countdownText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#DC2626',
  },
  itemsDivider: {
    height: 1,
    backgroundColor: '#F3F4F6',
    marginVertical: 12,
  },
  cakeItemRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 10,
  },
  cakeIcon: {
    width: 38,
    height: 38,
    borderRadius: 10,
    backgroundColor: `${THEME.colors.primary}10`,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cakeDetails: {
    flex: 1,
  },
  cakeName: {
    fontSize: 14,
    fontWeight: '700',
    color: THEME.colors.textDark,
  },
  cakeVariant: {
    fontSize: 12,
    color: THEME.colors.textMuted,
    marginTop: 2,
  },
  messageBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#FFFBEB',
    padding: 8,
    borderRadius: 8,
    marginTop: 6,
    borderLeftWidth: 3,
    borderLeftColor: '#F59E0B',
  },
  messageText: {
    fontSize: 12,
    color: '#B45309',
    fontWeight: '600',
  },
  noteBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#F3F4F6',
    padding: 6,
    borderRadius: 6,
    marginTop: 4,
  },
  noteText: {
    fontSize: 11,
    color: '#4B5563',
  },
  allergyBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#FEF2F2',
    padding: 6,
    borderRadius: 6,
    marginTop: 4,
  },
  allergyText: {
    fontSize: 11,
    color: '#DC2626',
    fontWeight: '600',
  },
  statusRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
    padding: 8,
    borderRadius: 8,
    marginTop: 6,
    marginBottom: 12,
  },
  statusLabel: {
    fontSize: 12,
    color: '#6B7280',
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  statusBadgeText: {
    fontSize: 11,
    fontWeight: '700',
  },
  actionsRow: {
    flexDirection: 'row',
    gap: 10,
    flexWrap: 'wrap',
  },
  startBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: '#D97706',
    paddingVertical: 10,
    borderRadius: 10,
  },
  startBtnText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 13,
  },
  completeBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: '#059669',
    paddingVertical: 10,
    borderRadius: 10,
  },
  completeBtnText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 13,
  },
  readyIndicator: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: '#ECFDF5',
    paddingVertical: 10,
    borderRadius: 10,
  },
  readyIndicatorText: {
    color: '#059669',
    fontWeight: '700',
    fontSize: 13,
  },
  shortageBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
    borderWidth: 1,
    borderColor: '#FECACA',
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 10,
    backgroundColor: '#FFF5F5',
  },
  shortageBtnText: {
    color: '#DC2626',
    fontSize: 12,
    fontWeight: '600',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalCard: {
    width: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 6,
  },
  modalTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: THEME.colors.textDark,
  },
  modalSub: {
    fontSize: 13,
    color: THEME.colors.textMuted,
    marginBottom: 12,
  },
  inputLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: THEME.colors.textDark,
    marginBottom: 6,
  },
  textInput: {
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
    color: THEME.colors.textDark,
    backgroundColor: '#F9FAFB',
  },
  quickOptions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginTop: 10,
  },
  quickChip: {
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 12,
  },
  quickChipText: {
    fontSize: 12,
    color: '#4B5563',
  },
  modalButtons: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 20,
  },
  cancelModalBtn: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    borderRadius: 10,
    backgroundColor: '#F3F4F6',
  },
  cancelModalBtnText: {
    color: '#4B5563',
    fontWeight: '600',
  },
  submitModalBtn: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    borderRadius: 10,
    backgroundColor: '#DC2626',
  },
  submitModalBtnText: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
});
