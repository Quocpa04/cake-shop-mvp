import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import React, { useState } from 'react';
import {
  Alert,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { TierBadge } from '../components/Badge';
import { useApp } from '../context/AppContext';
import { THEME } from '../theme/theme';

interface ProfileScreenProps {
  onOpenOccasions: () => void;
  onOpenComplaints: () => void;
  onNavigateToOrders: () => void;
  onNavigateToFavorites?: () => void;
  onOpenLogin?: () => void;
}

export const ProfileScreen: React.FC<ProfileScreenProps> = ({
  onOpenOccasions,
  onOpenComplaints,
  onNavigateToOrders,
  onNavigateToFavorites,
  onOpenLogin,
}) => {
  const { user, occasions, complaints, currentRole, setCurrentRole, favorites } = useApp();
  const isGuest = currentRole === 'GUEST';
  const [avatarUri, setAvatarUri] = useState<string>(user.avatar);

  const nextTierTarget = 40000000; // 40m for Diamond Tier
  const progressPercent = Math.min(100, Math.round((user.totalSpent / nextTierTarget) * 100));

  const handlePickAvatar = async () => {
    try {
      const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (!permissionResult.granted) {
        Alert.alert('Quyền truy cập', 'Vui lòng cấp quyền truy cập thư viện ảnh để đổi ảnh đại diện.');
        return;
      }
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'],
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });
      if (!result.canceled && result.assets && result.assets.length > 0) {
        setAvatarUri(result.assets[0].uri);
        Alert.alert('Thành công', 'Đã cập nhật ảnh đại diện mới!');
      }
    } catch {
      Alert.alert('Thông báo', 'Không thể chọn ảnh lúc này.');
    }
  };

  const handleDeleteAccount = () => {
    Alert.alert(
      'Yêu cầu xóa tài khoản',
      'Theo Nghị định 13/2023/NĐ-CP, việc xóa tài khoản sẽ hủy toàn bộ điểm thưởng tích lũy (1.250 điểm) và các voucher chưa dùng. Dữ liệu giao dịch được ẩn danh hóa và lưu trữ phục vụ nghĩa vụ thuế. Bạn có chắc chắn muốn xóa?',
      [
        { text: 'Hủy bỏ', style: 'cancel' },
        {
          text: 'Xác nhận xóa',
          style: 'destructive',
          onPress: () => Alert.alert('Đã tiếp nhận', 'Yêu cầu xóa tài khoản đã được ghi nhận.'),
        },
      ]
    );
  };

  return (
    <View style={styles.container}>
      {/* Top Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Góc Nhỏ Của Bạn</Text>
        <Text style={styles.headerSubtitle}>
          {isGuest ? 'Khách vãng lai • Đặt nhanh' : 'Tài khoản thành viên & Dịch vụ khách hàng'}
        </Text>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {/* User Card */}
        <View style={styles.userCard}>
          <TouchableOpacity
            onPress={handlePickAvatar}
            activeOpacity={0.8}
            style={styles.avatarWrapper}
          >
            {isGuest ? (
              <View style={[styles.avatar, { backgroundColor: '#F3F4F6', alignItems: 'center', justifyContent: 'center' }]}>
                <Ionicons name="person-outline" size={32} color="#6B7280" />
              </View>
            ) : (
              <Image source={{ uri: avatarUri }} style={styles.avatar} />
            )}
            <View style={styles.cameraIconBadge}>
              <Ionicons name="camera" size={12} color="#FFFFFF" />
            </View>
          </TouchableOpacity>
          <View style={styles.userInfoCol}>
            <View style={styles.userNameRow}>
              <Text style={styles.userName}>{isGuest ? 'Khách Vãng Lai' : user.name}</Text>
              {!isGuest && <TierBadge tier={user.tier} />}
            </View>
            <Text style={styles.userPhone}>{isGuest ? 'Chưa đăng ký tài khoản' : user.phone}</Text>
            <Text style={styles.userEmail}>{isGuest ? 'Đặt bánh nhanh không cần tài khoản' : user.email}</Text>
            <Text style={styles.avatarHint}>Chạm vào ảnh để đổi avatar (ImagePicker)</Text>
          </View>
        </View>

        {/* Loyalty VIP Member Card or Guest Welcome Card */}
        {isGuest ? (
          <View style={[styles.loyaltyCard, { borderColor: '#E5E7EB' }]}>
            <View style={styles.loyaltyCardHeader}>
              <View style={styles.loyaltyTitleRow}>
                <Ionicons name="gift-outline" size={16} color={THEME.colors.primary} />
                <Text style={[styles.loyaltyCardTitle, { color: THEME.colors.primary }]}>ĐĂNG KÝ THÀNH VIÊN</Text>
              </View>
            </View>
            <Text style={{ fontSize: 13, color: '#374151', marginVertical: 6, lineHeight: 18 }}>
              Tạo tài khoản Miette Bakery để nhận ngay 100 điểm thưởng tích lũy, lưu sổ địa chỉ giao hàng và nhận voucher ưu đãi ngày sinh nhật!
            </Text>
          </View>
        ) : (
          <View style={styles.loyaltyCard}>
            <View style={styles.loyaltyCardHeader}>
              <View style={styles.loyaltyTitleRow}>
                <Ionicons name="sparkles" size={16} color={THEME.colors.accent} />
                <Text style={styles.loyaltyCardTitle}>MIETTE PRIVILEGE</Text>
              </View>
              <Text style={styles.tierName}>Hạng {user.tier}</Text>
            </View>

            <View style={styles.pointsDisplayRow}>
              <View>
                <Text style={styles.pointsLabel}>Điểm thưởng khả dụng</Text>
                <Text style={styles.pointsValue}>{user.points.toLocaleString('vi-VN')} điểm</Text>
              </View>
              <View style={styles.pointsEquivalentBox}>
                <Text style={styles.pointsEqText}>
                  = {(user.points * 1000).toLocaleString('vi-VN')}đ
                </Text>
              </View>
            </View>

            {/* Progress bar to Diamond Tier */}
            <View style={styles.progressContainer}>
              <View style={styles.progressTextRow}>
                <Text style={styles.progressLabel}>Tiến trình lên Hạng Kim Cương</Text>
                <Text style={styles.progressPercent}>{progressPercent}%</Text>
              </View>
              <View style={styles.progressBarTrack}>
                <View style={[styles.progressBarFill, { width: `${progressPercent}%` }]} />
              </View>
              <Text style={styles.progressNote}>
                Chi tiêu thêm {((nextTierTarget - user.totalSpent) / 1000000).toFixed(1)} triệu để thăng hạng
              </Text>
            </View>

            {/* Privileges bullet points */}
            <View style={styles.privilegesList}>
              <Text style={styles.privilegeItem}>• Tích lũy 1% giá trị mọi đơn hàng thành công</Text>
              <Text style={styles.privilegeItem}>• Tặng voucher 50.000đ vào ngày sinh nhật</Text>
              <Text style={styles.privilegeItem}>• Ưu tiên đặt trước 24h các dịp cao điểm lễ</Text>
            </View>
          </View>
        )}

        {/* Quick Actions Menu */}
        <View style={styles.menuCard}>
          <Text style={styles.menuSectionTitle}>Dịch vụ & Tiện ích</Text>


          {/* Món Yêu Thích (AsyncStorage - MMA301 Task 3) */}
          <TouchableOpacity
            style={styles.menuItem}
            onPress={onNavigateToFavorites}
            activeOpacity={0.8}
          >
            <View style={[styles.menuIconBox, { backgroundColor: '#FEE2E2' }]}>
              <Ionicons name="heart" size={20} color="#DC2626" />
            </View>
            <View style={styles.menuTextCol}>
              <Text style={styles.menuItemTitle}>Món Yêu Thích (AsyncStorage)</Text>
              <Text style={styles.menuItemSub}>
                Lưu trữ thiết bị offline • {favorites.length} sản phẩm đã thích
              </Text>
            </View>
            <View style={styles.badgePill}>
              <Text style={styles.badgePillText}>{favorites.length}</Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color={THEME.colors.textMuted} />
          </TouchableOpacity>

          {/* Backend MockAPI & Offline Sync Info */}
          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => {
              Alert.alert(
                'Tích hợp Backend MockAPI.io & REST API',
                'Hệ thống kết nối REST API MockAPI.io với kiến trúc Offline-First (AsyncStorage fallback).\n\nDữ liệu sản phẩm mẫu đã export chuẩn 100% trong mockapi_data.json để bạn nạp vào MockAPI.io bất cứ lúc nào.'
              );
            }}
            activeOpacity={0.8}
          >
            <View style={[styles.menuIconBox, { backgroundColor: '#ECFDF5' }]}>
              <Ionicons name="cloud-done-outline" size={20} color="#059669" />
            </View>
            <View style={styles.menuTextCol}>
              <Text style={styles.menuItemTitle}>Backend MockAPI & Đồng Bộ</Text>
              <Text style={styles.menuItemSub}>
                REST API online & AsyncStorage offline-first
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color={THEME.colors.textMuted} />
          </TouchableOpacity>

          {/* Special Occasion reminder */}
          <TouchableOpacity
            style={styles.menuItem}
            onPress={onOpenOccasions}
            activeOpacity={0.8}
          >
            <View style={[styles.menuIconBox, { backgroundColor: '#FDF2F8' }]}>
              <Ionicons name="calendar-outline" size={20} color={THEME.colors.secondary} />
            </View>
            <View style={styles.menuTextCol}>
              <Text style={styles.menuItemTitle}>Đừng Quên Lời Thương</Text>
              <Text style={styles.menuItemSub}>
                Nhắc lịch sinh nhật, ngày kỷ niệm ({occasions.length} sự kiện)
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color={THEME.colors.textMuted} />
          </TouchableOpacity>

          {/* Complaints & Feedback ("Miette lắng nghe bạn") */}
          <TouchableOpacity
            style={styles.menuItem}
            onPress={onOpenComplaints}
            activeOpacity={0.8}
          >
            <View style={[styles.menuIconBox, { backgroundColor: '#FAF5FF' }]}>
              <Ionicons name="heart-half-outline" size={20} color="#7E22CE" />
            </View>
            <View style={styles.menuTextCol}>
              <Text style={styles.menuItemTitle}>Miette Lắng Nghe Bạn</Text>
              <Text style={styles.menuItemSub}>
                Gửi phản ánh, bảo hành bánh & hoàn tiền ({complaints.length} phiếu)
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color={THEME.colors.textMuted} />
          </TouchableOpacity>

          {/* Order History */}
          <TouchableOpacity
            style={[styles.menuItem, { borderBottomWidth: 0 }]}
            onPress={onNavigateToOrders}
            activeOpacity={0.8}
          >
            <View style={[styles.menuIconBox, { backgroundColor: '#F0FDF4' }]}>
              <Ionicons name="receipt-outline" size={20} color="#15803D" />
            </View>
            <View style={styles.menuTextCol}>
              <Text style={styles.menuItemTitle}>Lịch Sử Đơn Hàng</Text>
              <Text style={styles.menuItemSub}>Theo dõi hóa đơn và đánh giá</Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color={THEME.colors.textMuted} />
          </TouchableOpacity>
        </View>

        {/* Account Authentication & Session */}
        <View style={styles.menuCard}>
          <Text style={styles.menuSectionTitle}>Tài Khoản & Phiên Làm Việc</Text>

          <TouchableOpacity
            style={styles.menuItem}
            onPress={onOpenLogin}
            activeOpacity={0.8}
          >
            <View style={[styles.menuIconBox, { backgroundColor: '#FDF2F4' }]}>
              <Ionicons name="swap-horizontal" size={20} color={THEME.colors.primary} />
            </View>
            <View style={styles.menuTextCol}>
              <Text style={styles.menuItemTitle}>Đổi Tài Khoản / Đăng Nhập Vai Trò</Text>
              <Text style={styles.menuItemSub}>
                {isGuest ? 'Đăng nhập tài khoản thành viên hoặc nhân viên' : `Đang đăng nhập: ${user.name} (Khách hàng)`}
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color={THEME.colors.textMuted} />
          </TouchableOpacity>

          {!isGuest && (
            <TouchableOpacity
              style={[styles.menuItem, { borderBottomWidth: 0 }]}
              onPress={() => {
                Alert.alert(
                  'Đăng xuất',
                  'Bạn có chắc chắn muốn đăng xuất khỏi tài khoản hiện tại?',
                  [
                    { text: 'Hủy', style: 'cancel' },
                    {
                      text: 'Đăng xuất',
                      style: 'destructive',
                      onPress: () => {
                        setCurrentRole('GUEST');
                        onOpenLogin?.();
                      },
                    },
                  ]
                );
              }}
              activeOpacity={0.8}
            >
              <View style={[styles.menuIconBox, { backgroundColor: '#FFF5F5' }]}>
                <Ionicons name="log-out-outline" size={20} color="#DC2626" />
              </View>
              <View style={styles.menuTextCol}>
                <Text style={[styles.menuItemTitle, { color: '#DC2626' }]}>Đăng Xuất</Text>
                <Text style={styles.menuItemSub}>Trở về màn hình đăng nhập</Text>
              </View>
              <Ionicons name="chevron-forward" size={18} color={THEME.colors.textMuted} />
            </TouchableOpacity>
          )}
        </View>

        {/* Address & Policy */}
        <View style={styles.menuCard}>
          <Text style={styles.menuSectionTitle}>Hồ sơ & Chính sách</Text>

          <View style={styles.menuItem}>
            <View style={[styles.menuIconBox, { backgroundColor: '#F1F5F9' }]}>
              <Ionicons name="location-outline" size={20} color={THEME.colors.primary} />
            </View>
            <View style={styles.menuTextCol}>
              <Text style={styles.menuItemTitle}>Sổ Địa Chỉ Nhận Bánh</Text>
              <Text style={styles.menuItemSub} numberOfLines={1}>
                {user.defaultAddress}
              </Text>
            </View>
          </View>

          <View style={styles.menuItem}>
            <View style={[styles.menuIconBox, { backgroundColor: '#FFFBEB' }]}>
              <Ionicons name="shield-checkmark-outline" size={20} color="#B45309" />
            </View>
            <View style={styles.menuTextCol}>
              <Text style={styles.menuItemTitle}>Chính Sách Cam Kết 100%</Text>
              <Text style={styles.menuItemSub}>Đổi trả hoặc hoàn tiền 100% nếu bánh hỏng khi giao</Text>
            </View>
          </View>

          <TouchableOpacity
            style={[styles.menuItem, { borderBottomWidth: 0 }]}
            onPress={handleDeleteAccount}
            activeOpacity={0.8}
          >
            <View style={[styles.menuIconBox, { backgroundColor: '#FEF2F2' }]}>
              <Ionicons name="trash-outline" size={20} color="#DC2626" />
            </View>
            <View style={styles.menuTextCol}>
              <Text style={[styles.menuItemTitle, { color: '#DC2626' }]}>Xóa Tài Khoản</Text>
              <Text style={styles.menuItemSub}>Tuân thủ quyền riêng tư dữ liệu cá nhân</Text>
            </View>
          </TouchableOpacity>
        </View>

        {/* Footer info */}
        <View style={styles.footer}>
          <Text style={styles.footerBrand}>Miette Bakery v1.0.0</Text>
          <Text style={styles.footerContact}>Hotline CSKH: 1900 6868 (08:00 - 21:30)</Text>
        </View>
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
  scrollContent: {
    padding: THEME.spacing.lg,
    paddingBottom: 50,
  },
  userCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: THEME.colors.surface,
    borderRadius: THEME.borderRadius.lg,
    padding: THEME.spacing.lg,
    marginBottom: THEME.spacing.md,
    borderWidth: 1,
    borderColor: THEME.colors.cardBorder,
    ...THEME.shadows.sm,
  },
  avatarWrapper: {
    position: 'relative',
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    borderWidth: 2,
    borderColor: THEME.colors.primary,
  },
  cameraIconBadge: {
    position: 'absolute',
    bottom: -2,
    right: -2,
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: THEME.colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  avatarHint: {
    fontSize: 10,
    color: THEME.colors.primary,
    fontWeight: '600',
    marginTop: 4,
  },
  badgePill: {
    backgroundColor: '#FEE2E2',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
    marginRight: 6,
  },
  badgePillText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#DC2626',
  },
  userInfoCol: {
    flex: 1,
    marginLeft: 14,
  },
  userNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  userName: {
    fontSize: 16,
    fontWeight: '700',
    color: THEME.colors.textPrimary,
  },
  userPhone: {
    fontSize: 13,
    color: THEME.colors.textSecondary,
    marginTop: 2,
  },
  userEmail: {
    fontSize: 11,
    color: THEME.colors.textMuted,
  },
  loyaltyCard: {
    backgroundColor: '#3E1C25',
    borderRadius: THEME.borderRadius.xl,
    padding: THEME.spacing.lg,
    marginBottom: THEME.spacing.lg,
    ...THEME.shadows.md,
  },
  loyaltyCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  loyaltyTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  loyaltyCardTitle: {
    color: THEME.colors.accentLight,
    fontWeight: '800',
    fontSize: 12,
    letterSpacing: 1,
  },
  tierName: {
    color: '#FFF',
    fontSize: 12,
    fontWeight: '700',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
  },
  pointsDisplayRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    marginBottom: 14,
  },
  pointsLabel: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: 11,
  },
  pointsValue: {
    color: '#FFF',
    fontSize: 22,
    fontWeight: '800',
    marginTop: 2,
  },
  pointsEquivalentBox: {
    backgroundColor: 'rgba(212, 175, 55, 0.25)',
    borderWidth: 1,
    borderColor: THEME.colors.accent,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
  },
  pointsEqText: {
    color: THEME.colors.accentLight,
    fontWeight: '700',
    fontSize: 12,
  },
  progressContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: THEME.borderRadius.md,
    padding: 10,
    marginBottom: 12,
  },
  progressTextRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  progressLabel: {
    color: '#FFF',
    fontSize: 11,
  },
  progressPercent: {
    color: THEME.colors.accentLight,
    fontWeight: '700',
    fontSize: 11,
  },
  progressBarTrack: {
    height: 6,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: THEME.colors.accent,
    borderRadius: 3,
  },
  progressNote: {
    color: 'rgba(255, 255, 255, 0.7)',
    fontSize: 10,
    marginTop: 4,
  },
  privilegesList: {
    gap: 4,
    marginTop: 4,
  },
  privilegeItem: {
    color: 'rgba(255, 255, 255, 0.85)',
    fontSize: 11,
  },
  menuCard: {
    backgroundColor: THEME.colors.surface,
    borderRadius: THEME.borderRadius.lg,
    padding: THEME.spacing.lg,
    marginBottom: THEME.spacing.md,
    borderWidth: 1,
    borderColor: THEME.colors.cardBorder,
    ...THEME.shadows.sm,
  },
  menuSectionTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: THEME.colors.textMuted,
    textTransform: 'uppercase',
    marginBottom: 8,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: THEME.colors.border,
  },
  menuIconBox: {
    width: 38,
    height: 38,
    borderRadius: 19,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  menuTextCol: {
    flex: 1,
  },
  menuItemTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: THEME.colors.textPrimary,
  },
  menuItemSub: {
    fontSize: 11,
    color: THEME.colors.textSecondary,
    marginTop: 2,
  },
  footer: {
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 10,
  },
  footerBrand: {
    fontSize: 12,
    fontWeight: '700',
    color: THEME.colors.textMuted,
  },
  footerContact: {
    fontSize: 11,
    color: THEME.colors.textMuted,
    marginTop: 2,
  },
});
