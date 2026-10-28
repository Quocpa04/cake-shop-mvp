import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import {
  Alert,
  KeyboardAvoidingView,
  Modal,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import { useApp } from '../context/AppContext';
import { THEME } from '../theme/theme';
import { UserRole } from '../types';

interface LoginModalProps {
  visible: boolean;
  onClose: () => void;
  onSuccessRole?: (role: UserRole) => void;
}

interface AccountOption {
  key: UserRole;
  email: string;
  username: string;
  name: string;
  roleTitle: string;
  badge: string;
  badgeColor: string;
  badgeBg: string;
  description: string;
  icon: keyof typeof Ionicons.glyphMap;
}

const DEMO_ACCOUNTS: AccountOption[] = [
  {
    key: 'CUSTOMER',
    email: 'customer@miette.vn',
    username: 'customer',
    name: 'Lê Thanh Tú (Hạng Vàng)',
    roleTitle: 'Khách Hàng (Customer)',
    badge: 'Thành viên VIP',
    badgeColor: THEME.colors.primary,
    badgeBg: '#FDF2F4',
    description: 'Mua bánh, đặt bánh custom theo yêu cầu, tích điểm & ưu đãi',
    icon: 'sparkles',
  },
  {
    key: 'KITCHEN',
    email: 'baker@miette.vn',
    username: 'baker',
    name: 'Chef Minh Quân (Trưởng Bếp)',
    roleTitle: 'Thợ Làm Bánh (Bếp KDS)',
    badge: 'Bếp KDS',
    badgeColor: '#D97706',
    badgeBg: '#FEF3C7',
    description: 'Điều phối lò nướng, quy cách bắt kem chữ và hoàn tất bánh',
    icon: 'restaurant',
  },
  {
    key: 'SHIPPER',
    email: 'shipper@miette.vn',
    username: 'shipper',
    name: 'Hoàng Minh (MTE-SHP-08)',
    roleTitle: 'Nhân Viên Giao Hàng (Shipper)',
    badge: 'Giao hàng',
    badgeColor: '#059669',
    badgeBg: '#D1FAE5',
    description: 'Nhận bánh thùng lạnh, định tuyến, gọi khách & xác thực OTP',
    icon: 'bicycle',
  },
];

export const LoginModal: React.FC<LoginModalProps> = ({ visible, onClose, onSuccessRole }) => {
  const { setCurrentRole } = useApp();
  const [emailInput, setEmailInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleLoginSubmit = () => {
    const cleanEmail = emailInput.trim().toLowerCase();
    const cleanPw = passwordInput.trim();

    if (!cleanEmail) {
      setErrorMessage('Vui lòng nhập email hoặc tài khoản');
      return;
    }

    // Match with one of the roles
    const matched = DEMO_ACCOUNTS.find(
      (acc) =>
        acc.email.toLowerCase() === cleanEmail ||
        acc.username.toLowerCase() === cleanEmail
    );

    if (matched) {
      setErrorMessage('');
      setCurrentRole(matched.key);
      onSuccessRole?.(matched.key);
      onClose();
      Alert.alert(
        'Đăng nhập thành công',
        `Chào mừng ${matched.name} vào hệ thống ${matched.roleTitle}!`
      );
    } else {
      setErrorMessage('Tài khoản không tồn tại. Thử chọn nhanh tài khoản mẫu bên dưới.');
    }
  };

  const handleQuickLogin = (acc: AccountOption) => {
    setEmailInput(acc.email);
    setPasswordInput('123');
    setErrorMessage('');
    setCurrentRole(acc.key);
    onSuccessRole?.(acc.key);
    onClose();
  };

  const handleGuestContinue = () => {
    setCurrentRole('GUEST');
    onClose();
  };

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.overlay}>
          <TouchableWithoutFeedback>
            <KeyboardAvoidingView
              behavior={Platform.OS === 'ios' ? 'padding' : undefined}
              style={styles.dialog}
            >
              {/* Brand Header */}
              <View style={styles.brandHeader}>
                <View style={styles.brandTitleRow}>
                  <Text style={styles.brandTitle}>miette.</Text>
                  <TouchableOpacity onPress={onClose} style={styles.closeBtn} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
                    <Ionicons name="close" size={22} color={THEME.colors.textMuted} />
                  </TouchableOpacity>
                </View>
                <Text style={styles.brandSub}>ĐĂNG NHẬP PHÂN QUYỀN HỆ THỐNG</Text>
              </View>

              <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollBody}>
                {/* Notice Box */}
                <View style={styles.noticeBox}>
                  <Ionicons name="shield-checkmark-outline" size={16} color={THEME.colors.primary} />
                  <Text style={styles.noticeText}>
                    Đăng nhập tài khoản chuyên biệt để tự động chuyển đúng vào giao diện làm việc. Không cần chuyển vai trò thủ công trong giao diện.
                  </Text>
                </View>

                {/* Form Input */}
                <View style={styles.formGroup}>
                  <Text style={styles.inputLabel}>Email hoặc Tên tài khoản</Text>
                  <TextInput
                    style={styles.textInput}
                    placeholder="VD: customer@miette.vn, baker, shipper"
                    placeholderTextColor={THEME.colors.textMuted}
                    value={emailInput}
                    onChangeText={(t) => {
                      setEmailInput(t);
                      if (errorMessage) setErrorMessage('');
                    }}
                    autoCapitalize="none"
                  />
                </View>

                <View style={styles.formGroup}>
                  <Text style={styles.inputLabel}>Mật khẩu</Text>
                  <TextInput
                    style={styles.textInput}
                    placeholder="Mật khẩu (mặc định: 123)"
                    placeholderTextColor={THEME.colors.textMuted}
                    secureTextEntry
                    value={passwordInput}
                    onChangeText={(t) => {
                      setPasswordInput(t);
                      if (errorMessage) setErrorMessage('');
                    }}
                  />
                </View>

                {!!errorMessage && <Text style={styles.errorText}>{errorMessage}</Text>}

                {/* Submit Button */}
                <TouchableOpacity
                  style={styles.loginBtn}
                  onPress={handleLoginSubmit}
                  activeOpacity={0.85}
                >
                  <Text style={styles.loginBtnText}>ĐĂNG NHẬP VÀO HỆ THỐNG</Text>
                </TouchableOpacity>

                {/* Quick Select Accounts */}
                <View style={styles.quickSection}>
                  <Text style={styles.quickTitle}>TÀI KHOẢN CẤP SẴN (BẤM ĐĂNG NHẬP NHANH)</Text>

                  {DEMO_ACCOUNTS.map((acc) => (
                    <TouchableOpacity
                      key={acc.key}
                      style={styles.accCard}
                      onPress={() => handleQuickLogin(acc)}
                      activeOpacity={0.8}
                    >
                      <View style={[styles.accIconBox, { backgroundColor: acc.badgeBg }]}>
                        <Ionicons name={acc.icon} size={20} color={acc.badgeColor} />
                      </View>
                      <View style={styles.accInfoCol}>
                        <View style={styles.accRoleRow}>
                          <Text style={styles.accRoleName}>{acc.roleTitle}</Text>
                          <View style={[styles.accTag, { backgroundColor: acc.badgeBg }]}>
                            <Text style={[styles.accTagText, { color: acc.badgeColor }]}>{acc.badge}</Text>
                          </View>
                        </View>
                        <Text style={styles.accEmail}>{acc.email} • MK: 123</Text>
                        <Text style={styles.accDesc} numberOfLines={1}>{acc.description}</Text>
                      </View>
                      <Ionicons name="chevron-forward" size={16} color={THEME.colors.textMuted} />
                    </TouchableOpacity>
                  ))}
                </View>

                {/* Footer Web Portal Notice */}
                <View style={styles.webNoteBox}>
                  <Text style={styles.webNoteText}>
                    * Các vai trò <Text style={{ fontWeight: '700' }}>Admin</Text>, <Text style={{ fontWeight: '700' }}>Quản lý</Text> và <Text style={{ fontWeight: '700' }}>Thu ngân POS</Text> được quản trị trực tiếp trên cổng Web Portal tại:{' '}
                    <Text style={{ fontWeight: '700', color: THEME.colors.primary }}>http://localhost:3000</Text>
                  </Text>
                </View>

                {/* Guest Continue Button */}
                <TouchableOpacity
                  style={styles.guestBtn}
                  onPress={handleGuestContinue}
                  activeOpacity={0.7}
                >
                  <Text style={styles.guestBtnText}>Duyệt bánh với tư cách Khách vãng lai</Text>
                </TouchableOpacity>
              </ScrollView>
            </KeyboardAvoidingView>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(31, 25, 29, 0.65)',
    justifyContent: 'flex-end',
  },
  dialog: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: '92%',
    paddingBottom: Platform.OS === 'ios' ? 36 : 24,
  },
  brandHeader: {
    paddingHorizontal: 24,
    paddingTop: 20,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F3ECE5',
  },
  brandTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  brandTitle: {
    fontFamily: Platform.OS === 'ios' ? 'Georgia' : 'serif',
    fontSize: 28,
    fontWeight: '700',
    color: THEME.colors.primary,
    letterSpacing: -0.5,
  },
  closeBtn: {
    padding: 6,
  },
  brandSub: {
    fontSize: 10.5,
    fontWeight: '700',
    letterSpacing: 1.5,
    color: THEME.colors.textMuted,
    marginTop: 2,
  },
  scrollBody: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 24,
  },
  noticeBox: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#FAF7F2',
    borderLeftWidth: 3,
    borderLeftColor: THEME.colors.primary,
    padding: 12,
    borderRadius: 8,
    gap: 8,
    marginBottom: 16,
  },
  noticeText: {
    flex: 1,
    fontSize: 12,
    color: THEME.colors.textSecondary,
    lineHeight: 17,
  },
  formGroup: {
    marginBottom: 12,
  },
  inputLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: THEME.colors.textPrimary,
    marginBottom: 6,
  },
  textInput: {
    backgroundColor: '#FAF7F2',
    borderWidth: 1,
    borderColor: '#EFEAE3',
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 10,
    fontSize: 14,
    color: THEME.colors.textPrimary,
  },
  errorText: {
    fontSize: 12,
    color: '#DC2626',
    fontWeight: '600',
    marginBottom: 10,
  },
  loginBtn: {
    backgroundColor: THEME.colors.primary,
    borderRadius: 10,
    paddingVertical: 13,
    alignItems: 'center',
    marginTop: 4,
    shadowColor: THEME.colors.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 2,
  },
  loginBtnText: {
    color: '#FFFFFF',
    fontSize: 13.5,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  quickSection: {
    marginTop: 22,
    paddingTop: 18,
    borderTopWidth: 1,
    borderTopColor: '#F3ECE5',
  },
  quickTitle: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 1,
    color: THEME.colors.textMuted,
    marginBottom: 12,
  },
  accCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    backgroundColor: '#FAF7F2',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#EFEAE3',
    marginBottom: 10,
  },
  accIconBox: {
    width: 40,
    height: 40,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  accInfoCol: {
    flex: 1,
    marginRight: 6,
  },
  accRoleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 2,
  },
  accRoleName: {
    fontSize: 13,
    fontWeight: '700',
    color: THEME.colors.textPrimary,
  },
  accTag: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  accTagText: {
    fontSize: 10,
    fontWeight: '700',
  },
  accEmail: {
    fontSize: 11.5,
    fontWeight: '600',
    color: THEME.colors.primary,
    marginBottom: 2,
  },
  accDesc: {
    fontSize: 11,
    color: THEME.colors.textMuted,
  },
  webNoteBox: {
    marginTop: 10,
    padding: 10,
    backgroundColor: '#FAF7F2',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#EFEAE3',
  },
  webNoteText: {
    fontSize: 11,
    color: THEME.colors.textMuted,
    lineHeight: 16,
    textAlign: 'center',
  },
  guestBtn: {
    alignItems: 'center',
    paddingVertical: 12,
    marginTop: 8,
  },
  guestBtnText: {
    fontSize: 12.5,
    fontWeight: '600',
    color: THEME.colors.textMuted,
    textDecorationLine: 'underline',
  },
});
