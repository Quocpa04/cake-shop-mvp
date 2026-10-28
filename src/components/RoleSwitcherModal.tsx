import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import {
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import { useApp } from '../context/AppContext';
import { THEME } from '../theme/theme';
import { UserRole } from '../types';

interface RoleSwitcherModalProps {
  visible: boolean;
  onClose: () => void;
}

export const RoleSwitcherModal: React.FC<RoleSwitcherModalProps> = ({ visible, onClose }) => {
  const { currentRole, setCurrentRole } = useApp();

  const handleSelectRole = (role: UserRole) => {
    setCurrentRole(role);
    onClose();
  };

  const appRoles: {
    key: UserRole;
    title: string;
    subtitle: string;
    icon: keyof typeof Ionicons.glyphMap;
    badgeColor: string;
    iconBg: string;
  }[] = [
    {
      key: 'CUSTOMER',
      title: 'Khách Hàng (Customer)',
      subtitle: 'Mua bánh, đặt bánh custom, tích điểm thành viên & theo dõi đơn',
      icon: 'sparkles-outline',
      badgeColor: THEME.colors.primary,
      iconBg: '#FDF2F4',
    },
    {
      key: 'KITCHEN',
      title: 'Thợ Làm Bánh (Bếp KDS)',
      subtitle: 'Theo dõi hàng đợi lò nướng, quy cách tạo hình, chữ kem & hoàn tất bánh',
      icon: 'restaurant-outline',
      badgeColor: '#D97706',
      iconBg: '#FEF3C7',
    },
    {
      key: 'SHIPPER',
      title: 'Nhân Viên Giao Hàng (Shipper)',
      subtitle: 'Nhận bánh thùng lạnh, định tuyến giao hàng, gọi khách & xác thực OTP',
      icon: 'bicycle-outline',
      badgeColor: '#059669',
      iconBg: '#D1FAE5',
    },
  ];

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.overlay}>
          <TouchableWithoutFeedback>
            <View style={styles.dialog}>
              {/* Header */}
              <View style={styles.header}>
                <View>
                  <Text style={styles.headerTitle}>Vai Trò Ứng Dụng</Text>
                  <Text style={styles.headerSub}>Chọn tài khoản làm việc trên ứng dụng di động</Text>
                </View>
                <TouchableOpacity onPress={onClose} style={styles.closeBtn} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
                  <Ionicons name="close" size={20} color={THEME.colors.textMuted} />
                </TouchableOpacity>
              </View>

              {/* Roles List */}
              <View style={styles.rolesList}>
                {appRoles.map((item) => {
                  const isSelected = currentRole === item.key;
                  return (
                    <TouchableOpacity
                      key={item.key}
                      style={[styles.roleCard, isSelected && styles.roleCardActive]}
                      onPress={() => handleSelectRole(item.key)}
                      activeOpacity={0.8}
                    >
                      <View style={[styles.iconBox, { backgroundColor: item.iconBg }]}>
                        <Ionicons name={item.icon} size={22} color={item.badgeColor} />
                      </View>
                      <View style={styles.roleTextCol}>
                        <View style={styles.roleTitleRow}>
                          <Text style={[styles.roleTitle, isSelected && { color: item.badgeColor }]}>
                            {item.title}
                          </Text>
                          {isSelected && (
                            <View style={[styles.activeTag, { backgroundColor: item.badgeColor }]}>
                              <Text style={styles.activeTagText}>Đang chọn</Text>
                            </View>
                          )}
                        </View>
                        <Text style={styles.roleSub}>{item.subtitle}</Text>
                      </View>
                    </TouchableOpacity>
                  );
                })}
              </View>

              {/* Web Portal Notice */}
              <View style={styles.webNoticeBox}>
                <Ionicons name="information-circle-outline" size={16} color="#6B7280" style={{ marginTop: 1 }} />
                <Text style={styles.webNoticeText}>
                  Các vai trò <Text style={{ fontWeight: '700' }}>Admin</Text>,{' '}
                  <Text style={{ fontWeight: '700' }}>Quản lý</Text> và{' '}
                  <Text style={{ fontWeight: '700' }}>Thu ngân POS</Text> được quản trị trực tiếp trên cổng Web Portal tại:{' '}
                  <Text style={{ fontWeight: '700', color: THEME.colors.primary }}>http://localhost:3000</Text>
                </Text>
              </View>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.45)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  dialog: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    width: '100%',
    maxWidth: 420,
    padding: 20,
    ...THEME.shadows.md,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: THEME.colors.textPrimary,
  },
  headerSub: {
    fontSize: 12,
    color: THEME.colors.textSecondary,
    marginTop: 2,
  },
  closeBtn: {
    padding: 4,
  },
  rolesList: {
    gap: 12,
    marginBottom: 16,
  },
  roleCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: '#E5E7EB',
    backgroundColor: '#FFFFFF',
  },
  roleCardActive: {
    borderColor: THEME.colors.primary,
    backgroundColor: '#FAF5F7',
  },
  iconBox: {
    width: 44,
    height: 44,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  roleTextCol: {
    flex: 1,
  },
  roleTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 3,
  },
  roleTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: THEME.colors.textPrimary,
  },
  activeTag: {
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: 6,
  },
  activeTagText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  roleSub: {
    fontSize: 11.5,
    color: THEME.colors.textSecondary,
    lineHeight: 16,
  },
  webNoticeBox: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#F9FAFB',
    padding: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    gap: 8,
  },
  webNoticeText: {
    flex: 1,
    fontSize: 11,
    color: '#6B7280',
    lineHeight: 16,
  },
});
