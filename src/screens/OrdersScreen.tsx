import { Ionicons } from '@expo/vector-icons';
import React, { useMemo, useState } from 'react';
import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { OrderStatusBadge } from '../components/Badge';
import { useApp } from '../context/AppContext';
import { THEME } from '../theme/theme';
import { Order } from '../types';
import { OrderDetailModal } from './OrderDetailModal';

interface OrdersScreenProps {
  onOpenComplaint?: (orderCode: string) => void;
  onNavigateToCart?: () => void;
}

export const OrdersScreen: React.FC<OrdersScreenProps> = ({
  onOpenComplaint,
  onNavigateToCart,
}) => {
  const { orders, addToCart } = useApp();

  const [activeTab, setActiveTab] = useState<'all' | 'processing' | 'completed'>('all');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  const filteredOrders = useMemo(() => {
    if (activeTab === 'processing') {
      return orders.filter(
        (o) => o.status !== 'COMPLETED' && o.status !== 'CANCELLED' && o.status !== 'REFUNDED'
      );
    }
    if (activeTab === 'completed') {
      return orders.filter((o) => o.status === 'COMPLETED');
    }
    return orders;
  }, [orders, activeTab]);

  const handleReorder = (order: Order) => {
    order.items.forEach((item) => {
      addToCart({
        id: `cart_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
        productId: 'reorder',
        productName: item.productName,
        image: 'https://images.unsplash.com/photo-1565958011703-44f9829ba187?w=800&q=80',
        variant: {
          id: item.variantId,
          size: item.size,
          price: item.price,
          sku: 'REORDER',
        },
        quantity: item.quantity,
        messageOnCake: item.messageOnCake,
        cakeTextColor: item.cakeTextColor,
        selectedOptions: item.options,
      });
    });

    Alert.alert(
      'Đã Thêm Vào Giỏ!',
      `Đã sao chép ${order.items.length} món từ đơn ${order.code} vào giỏ hàng của bạn.`,
      [{ text: 'Đến giỏ hàng', onPress: () => onNavigateToCart && onNavigateToCart() }]
    );
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Đơn Hàng Của Bạn</Text>
        <Text style={styles.headerSubtitle}>Theo dõi quá trình làm bánh & lịch sử giao nhận</Text>
      </View>

      {/* Tabs */}
      <View style={styles.tabBar}>
        {[
          { key: 'all', label: `Tất cả (${orders.length})` },
          {
            key: 'processing',
            label: `Đang xử lý (${
              orders.filter(
                (o) => o.status !== 'COMPLETED' && o.status !== 'CANCELLED' && o.status !== 'REFUNDED'
              ).length
            })`,
          },
          {
            key: 'completed',
            label: `Đã xong (${orders.filter((o) => o.status === 'COMPLETED').length})`,
          },
        ].map((tab) => (
          <TouchableOpacity
            key={tab.key}
            style={[styles.tabItem, activeTab === tab.key && styles.tabItemActive]}
            onPress={() => setActiveTab(tab.key as any)}
            activeOpacity={0.8}
          >
            <Text style={[styles.tabText, activeTab === tab.key && styles.tabTextActive]}>
              {tab.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {filteredOrders.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Ionicons name="receipt-outline" size={60} color={THEME.colors.border} />
            <Text style={styles.emptyTitle}>Chưa có đơn hàng nào</Text>
            <Text style={styles.emptySub}>Mọi đơn hàng bạn đặt sẽ được lưu trữ và cập nhật tại đây.</Text>
          </View>
        ) : (
          filteredOrders.map((order) => {
            const isProcessing =
              order.status !== 'COMPLETED' && order.status !== 'CANCELLED' && order.status !== 'REFUNDED';

            return (
              <View key={order.id} style={styles.orderCard}>
                {/* Header row: Code & Status */}
                <View style={styles.orderCardHeader}>
                  <View>
                    <Text style={styles.orderCode}>{order.code}</Text>
                    <Text style={styles.orderTime}>{order.createdAt}</Text>
                  </View>
                  <OrderStatusBadge status={order.status} />
                </View>

                {/* Secret Gift Tag */}
                {order.isSecretGift && (
                  <View style={styles.secretTag}>
                    <Ionicons name="gift" size={13} color="#7E22CE" />
                    <Text style={styles.secretTagText}>Giao Bí Mật cho {order.receiverName}</Text>
                  </View>
                )}

                {/* Items summary */}
                <View style={styles.itemsSummary}>
                  {order.items.map((item, idx) => (
                    <View key={idx} style={styles.orderItemLine}>
                      <Text style={styles.orderItemQty}>{item.quantity}x</Text>
                      <View style={styles.orderItemNameCol}>
                        <Text style={styles.orderItemName} numberOfLines={1}>
                          {item.productName} ({item.size})
                        </Text>
                        {item.messageOnCake ? (
                          <Text style={styles.orderItemMsg} numberOfLines={1}>
                            {`Chữ: "${item.messageOnCake}"`}
                          </Text>
                        ) : null}
                      </View>
                      <Text style={styles.orderItemPrice}>
                        {(item.price * item.quantity).toLocaleString('vi-VN')}đ
                      </Text>
                    </View>
                  ))}
                </View>

                {/* Total and actions */}
                <View style={styles.orderCardFooter}>
                  <View>
                    <Text style={styles.totalPrefix}>Tổng thanh toán</Text>
                    <Text style={styles.totalText}>{order.total.toLocaleString('vi-VN')}đ</Text>
                  </View>

                  <View style={styles.actionButtonsRow}>
                    <TouchableOpacity
                      style={styles.detailBtn}
                      onPress={() => setSelectedOrder(order)}
                      activeOpacity={0.8}
                    >
                      <Text style={styles.detailBtnText}>
                        {isProcessing ? 'Theo dõi đơn' : 'Chi tiết'}
                      </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      style={styles.reorderBtn}
                      onPress={() => handleReorder(order)}
                      activeOpacity={0.8}
                    >
                      <Ionicons name="repeat-outline" size={16} color={THEME.colors.primary} />
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            );
          })
        )}
      </ScrollView>

      {/* Order Detail & Tracking Modal */}
      <OrderDetailModal
        visible={!!selectedOrder}
        order={selectedOrder}
        onClose={() => setSelectedOrder(null)}
        onOpenComplaint={(code) => {
          onOpenComplaint && onOpenComplaint(code);
        }}
      />
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
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: THEME.colors.textPrimary,
  },
  headerSubtitle: {
    fontSize: 12,
    color: THEME.colors.textSecondary,
    marginTop: 2,
  },
  tabBar: {
    flexDirection: 'row',
    backgroundColor: THEME.colors.surface,
    paddingHorizontal: THEME.spacing.lg,
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: THEME.colors.border,
  },
  tabItem: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: THEME.borderRadius.round,
    marginRight: 8,
    backgroundColor: THEME.colors.surfaceSubtle,
  },
  tabItemActive: {
    backgroundColor: THEME.colors.primary,
  },
  tabText: {
    fontSize: 12,
    color: THEME.colors.textSecondary,
    fontWeight: '600',
  },
  tabTextActive: {
    color: '#FFF',
    fontWeight: '700',
  },
  scrollContent: {
    padding: THEME.spacing.lg,
    paddingBottom: 50,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 50,
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: THEME.colors.textPrimary,
    marginTop: 10,
  },
  emptySub: {
    fontSize: 12,
    color: THEME.colors.textMuted,
    marginTop: 4,
  },
  orderCard: {
    backgroundColor: THEME.colors.surface,
    borderRadius: THEME.borderRadius.lg,
    padding: THEME.spacing.lg,
    marginBottom: THEME.spacing.md,
    borderWidth: 1,
    borderColor: THEME.colors.cardBorder,
    ...THEME.shadows.sm,
  },
  orderCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: THEME.colors.border,
  },
  orderCode: {
    fontSize: 14,
    fontWeight: '700',
    color: THEME.colors.textPrimary,
  },
  orderTime: {
    fontSize: 11,
    color: THEME.colors.textMuted,
    marginTop: 2,
  },
  secretTag: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FAF5FF',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    marginTop: 8,
    gap: 4,
    alignSelf: 'flex-start',
  },
  secretTagText: {
    fontSize: 11,
    color: '#7E22CE',
    fontWeight: '600',
  },
  itemsSummary: {
    paddingVertical: 10,
  },
  orderItemLine: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  orderItemQty: {
    fontSize: 12,
    fontWeight: '700',
    color: THEME.colors.textSecondary,
    width: 24,
  },
  orderItemNameCol: {
    flex: 1,
    marginRight: 8,
  },
  orderItemName: {
    fontSize: 13,
    fontWeight: '600',
    color: THEME.colors.textPrimary,
  },
  orderItemMsg: {
    fontSize: 11,
    color: THEME.colors.secondary,
    fontStyle: 'italic',
  },
  orderItemPrice: {
    fontSize: 13,
    fontWeight: '700',
    color: THEME.colors.textPrimary,
  },
  orderCardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: THEME.colors.border,
  },
  totalPrefix: {
    fontSize: 10,
    color: THEME.colors.textMuted,
    textTransform: 'uppercase',
  },
  totalText: {
    fontSize: 16,
    fontWeight: '800',
    color: THEME.colors.primary,
  },
  actionButtonsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  detailBtn: {
    backgroundColor: THEME.colors.primary,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: THEME.borderRadius.round,
  },
  detailBtnText: {
    color: '#FFF',
    fontSize: 12,
    fontWeight: '700',
  },
  reorderBtn: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: THEME.colors.surfaceSubtle,
    borderWidth: 1,
    borderColor: THEME.colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
