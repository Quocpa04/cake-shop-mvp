import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { THEME } from '../theme/theme';
import { MembershipTier, OrderStatus } from '../types';

interface OrderBadgeProps {
  status: OrderStatus;
}

export const OrderStatusBadge: React.FC<OrderBadgeProps> = ({ status }) => {
  const getStatusConfig = () => {
    switch (status) {
      case 'NEW':
        return { label: 'Mới tạo', bg: '#EDE7F6', text: '#5E35B1' };
      case 'PENDING_PAYMENT':
        return { label: 'Chờ thanh toán', bg: '#FFF3E0', text: '#E65100' };
      case 'CONFIRMED':
        return { label: 'Đã xác nhận', bg: '#E3F2FD', text: '#1565C0' };
      case 'QUOTING':
        return { label: 'Chờ báo giá', bg: '#FFF8E1', text: '#F57F17' };
      case 'IN_PRODUCTION':
        return { label: 'Bếp đang làm', bg: '#FCE4EC', text: '#C2185B' };
      case 'READY':
        return { label: 'Bánh sẵn sàng', bg: '#E8F5E9', text: '#2E7D32' };
      case 'DELIVERING':
        return { label: 'Đang giao hàng', bg: '#E0F7FA', text: '#00838F' };
      case 'COMPLETED':
        return { label: 'Hoàn tất', bg: '#E8F5E9', text: '#2E7D32' };
      case 'CANCELLED':
        return { label: 'Đã hủy', bg: '#FFEBEE', text: '#C62828' };
      case 'REFUNDED':
        return { label: 'Đã hoàn tiền', bg: '#ECEFF1', text: '#455A64' };
      case 'FAILED_DELIVERY':
        return { label: 'Giao thất bại', bg: '#FFEBEE', text: '#D32F2F' };
      default:
        return { label: status, bg: '#F5F5F5', text: '#616161' };
    }
  };

  const config = getStatusConfig();

  return (
    <View style={[styles.badge, { backgroundColor: config.bg }]}>
      <Text style={[styles.badgeText, { color: config.text }]}>{config.label}</Text>
    </View>
  );
};

export const TierBadge: React.FC<{ tier: MembershipTier }> = ({ tier }) => {
  const getTierColors = () => {
    switch (tier) {
      case 'Kim cương':
        return { bg: '#E0F7FA', text: '#006064', border: '#80DEEA' };
      case 'Vàng':
        return { bg: '#FFF8E1', text: '#B78103', border: '#FFE082' };
      case 'Bạc':
        return { bg: '#ECEFF1', text: '#455A64', border: '#CFD8DC' };
      default:
        return { bg: '#EFEBE9', text: '#6D4C41', border: '#D7CCC8' };
    }
  };

  const colors = getTierColors();

  return (
    <View style={[styles.tierBadge, { backgroundColor: colors.bg, borderColor: colors.border }]}>
      <Text style={[styles.tierBadgeText, { color: colors.text }]}>Hạng {tier}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  badge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: THEME.borderRadius.round,
    alignSelf: 'flex-start',
  },
  badgeText: {
    fontSize: 11,
    fontWeight: '700',
  },
  tierBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: THEME.borderRadius.round,
    borderWidth: 1,
  },
  tierBadgeText: {
    fontSize: 11,
    fontWeight: '800',
    textTransform: 'uppercase',
  },
});
