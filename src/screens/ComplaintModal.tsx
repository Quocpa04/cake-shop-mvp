import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
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
import { THEME } from '../theme/theme';
import { ComplaintTicket } from '../types';

interface ComplaintModalProps {
  visible: boolean;
  preselectedOrderCode?: string;
  onClose: () => void;
}

const ISSUE_TYPES: { id: ComplaintTicket['issueType']; label: string; icon: string }[] = [
  { id: 'damaged_cake', label: 'Bánh vỡ / móp méo', icon: 'heart-dislike-outline' },
  { id: 'wrong_text', label: 'Sai nội dung chữ ghi', icon: 'create-outline' },
  { id: 'late_delivery', label: 'Giao trễ giờ nghiêm trọng', icon: 'alarm-outline' },
  { id: 'wrong_flavor', label: 'Sai mẫu / hương vị', icon: 'refresh-outline' },
  { id: 'other', label: 'Lý do khác', icon: 'help-circle-outline' },
];

export const ComplaintModal: React.FC<ComplaintModalProps> = ({
  visible,
  preselectedOrderCode,
  onClose,
}) => {
  const { orders, complaints, submitComplaint } = useApp();

  const [orderCode, setOrderCode] = useState(
    preselectedOrderCode || (orders[0]?.code ?? 'BK26102600012')
  );
  const [issueType, setIssueType] = useState<ComplaintTicket['issueType']>('damaged_cake');
  const [description, setDescription] = useState('');
  const [hasPhoto, setHasPhoto] = useState(false);

  const handleSubmit = () => {
    if (!description.trim()) {
      Alert.alert('Vui lòng nhập mô tả', 'Xin vui lòng chia sẻ rõ tình trạng bánh để Miette hỗ trợ bạn ngay.');
      return;
    }

    submitComplaint({
      orderCode,
      issueType,
      description: description.trim(),
      photoUri: hasPhoto
        ? 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=800&q=80'
        : undefined,
    });

    Alert.alert(
      'Miette Đã Tiếp Nhận',
      'Cảm ơn bạn đã phản hồi. Đội ngũ Chăm sóc Khách hàng sẽ kiểm tra và liên hệ bồi hoàn hoặc giải quyết thỏa đáng trong vòng 24 giờ.'
    );

    setDescription('');
    setHasPhoto(false);
    onClose();
  };

  return (
    <Modal visible={visible} animationType="slide" transparent={false} onRequestClose={onClose}>
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity style={styles.backBtn} onPress={onClose} activeOpacity={0.8}>
            <Ionicons name="arrow-back" size={24} color={THEME.colors.textPrimary} />
          </TouchableOpacity>
          <View style={styles.titleCol}>
            <Text style={styles.headerTitle}>Miette Lắng Nghe Bạn</Text>
            <Text style={styles.headerSubtitle}>Phản ánh chất lượng bánh & dịch vụ</Text>
          </View>
        </View>

        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
          {/* Commitment banner */}
          <View style={styles.commitmentBanner}>
            <Ionicons name="shield-checkmark" size={22} color={THEME.colors.primary} />
            <View style={styles.bannerTextCol}>
              <Text style={styles.bannerTitle}>Cam kết chất lượng 100%</Text>
              <Text style={styles.bannerDesc}>
                Nếu bánh bị hư hại trong quá trình vận chuyển hoặc sai mẫu, Miette cam kết làm lại bánh mới hoặc bồi hoàn 100%.
              </Text>
            </View>
          </View>

          {/* Form */}
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Gửi yêu cầu hỗ trợ mới</Text>

            <Text style={styles.fieldLabel}>Mã đơn hàng gặp sự cố:</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.orderScroll}>
              {orders.map((ord) => (
                <TouchableOpacity
                  key={ord.id}
                  style={[styles.orderPill, orderCode === ord.code && styles.orderPillActive]}
                  onPress={() => setOrderCode(ord.code)}
                >
                  <Text
                    style={[
                      styles.orderPillText,
                      orderCode === ord.code && styles.orderPillTextActive,
                    ]}
                  >
                    {ord.code}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>

            <Text style={styles.fieldLabel}>Vấn đề bạn gặp phải:</Text>
            <View style={styles.issueGrid}>
              {ISSUE_TYPES.map((issue) => {
                const isSelected = issueType === issue.id;
                return (
                  <TouchableOpacity
                    key={issue.id}
                    style={[styles.issueItem, isSelected && styles.issueItemActive]}
                    onPress={() => setIssueType(issue.id)}
                    activeOpacity={0.8}
                  >
                    <Ionicons
                      name={issue.icon as any}
                      size={18}
                      color={isSelected ? '#FFF' : THEME.colors.primary}
                    />
                    <Text
                      style={[styles.issueItemText, isSelected && styles.issueItemTextActive]}
                      numberOfLines={1}
                    >
                      {issue.label}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>

            <Text style={styles.fieldLabel}>Mô tả chi tiết sự cố:</Text>
            <TextInput
              style={styles.textArea}
              placeholder="VD: Bánh bị va đập nghiêng thành kem bên trái, mong tiệm kiểm tra giúp..."
              placeholderTextColor={THEME.colors.textMuted}
              multiline
              numberOfLines={4}
              value={description}
              onChangeText={setDescription}
            />

            <Text style={styles.fieldLabel}>Ảnh chụp đối chứng:</Text>
            <TouchableOpacity
              style={styles.uploadBox}
              onPress={() => setHasPhoto(!hasPhoto)}
              activeOpacity={0.8}
            >
              {hasPhoto ? (
                <View style={styles.photoPreviewWrapper}>
                  <Image
                    source={{
                      uri: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=800&q=80',
                    }}
                    style={styles.uploadedImg}
                  />
                  <View style={styles.photoBadge}>
                    <Text style={styles.photoBadgeText}>Đã đính kèm ảnh chụp 📸 (Chạm để đổi)</Text>
                  </View>
                </View>
              ) : (
                <View style={styles.uploadPlaceholder}>
                  <Ionicons name="camera-outline" size={28} color={THEME.colors.primary} />
                  <Text style={styles.uploadPrompt}>Chụp ảnh bánh hoặc chọn từ thư viện</Text>
                  <Text style={styles.uploadSub}>Giúp nhân viên xử lý khiếu nại nhanh chóng</Text>
                </View>
              )}
            </TouchableOpacity>

            <TouchableOpacity style={styles.submitBtn} onPress={handleSubmit} activeOpacity={0.85}>
              <Text style={styles.submitBtnText}>Gửi khiếu nại cho tiệm</Text>
            </TouchableOpacity>
          </View>

          {/* Previous Complaints */}
          <View style={styles.historySection}>
            <Text style={styles.historyTitle}>Lịch sử phản ánh của bạn ({complaints.length})</Text>

            {complaints.map((ticket) => (
              <View key={ticket.id} style={styles.ticketCard}>
                <View style={styles.ticketHeader}>
                  <Text style={styles.ticketId}>{ticket.id}</Text>
                  <View
                    style={[
                      styles.ticketStatusBadge,
                      ticket.status === 'RESOLVED' && { backgroundColor: '#E8F5E9' },
                    ]}
                  >
                    <Text
                      style={[
                        styles.ticketStatusText,
                        ticket.status === 'RESOLVED' && { color: '#2E7D32' },
                      ]}
                    >
                      {ticket.status === 'RESOLVED' ? 'Đã giải quyết' : 'Đang xử lý'}
                    </Text>
                  </View>
                </View>

                <Text style={styles.ticketOrder}>Đơn hàng: {ticket.orderCode}</Text>
                <Text style={styles.ticketDesc}>{`"${ticket.description}"`}</Text>

                {ticket.resolutionNote && (
                  <View style={styles.resBox}>
                    <Text style={styles.resTitle}>Phản hồi từ Miette:</Text>
                    <Text style={styles.resText}>{ticket.resolutionNote}</Text>
                  </View>
                )}
              </View>
            ))}
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
  titleCol: {
    flex: 1,
    marginLeft: 8,
  },
  headerTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: THEME.colors.textPrimary,
  },
  headerSubtitle: {
    fontSize: 11,
    color: THEME.colors.textMuted,
  },
  scrollContent: {
    padding: THEME.spacing.lg,
    paddingBottom: 50,
  },
  commitmentBanner: {
    flexDirection: 'row',
    backgroundColor: '#FAF5F2',
    borderWidth: 1,
    borderColor: '#E6D7CC',
    borderRadius: THEME.borderRadius.lg,
    padding: THEME.spacing.md,
    marginBottom: THEME.spacing.md,
    alignItems: 'flex-start',
  },
  bannerTextCol: {
    flex: 1,
    marginLeft: 10,
  },
  bannerTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: THEME.colors.primary,
  },
  bannerDesc: {
    fontSize: 12,
    color: THEME.colors.textSecondary,
    marginTop: 2,
    lineHeight: 18,
  },
  card: {
    backgroundColor: THEME.colors.surface,
    borderRadius: THEME.borderRadius.lg,
    padding: THEME.spacing.lg,
    borderWidth: 1,
    borderColor: THEME.colors.cardBorder,
    ...THEME.shadows.sm,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: THEME.colors.textPrimary,
    marginBottom: 12,
  },
  fieldLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: THEME.colors.textSecondary,
    marginTop: 12,
    marginBottom: 6,
  },
  orderScroll: {
    flexDirection: 'row',
    marginBottom: 4,
  },
  orderPill: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: THEME.borderRadius.md,
    backgroundColor: THEME.colors.surfaceSubtle,
    borderWidth: 1,
    borderColor: THEME.colors.border,
    marginRight: 8,
  },
  orderPillActive: {
    backgroundColor: THEME.colors.primary,
    borderColor: THEME.colors.primary,
  },
  orderPillText: {
    fontSize: 12,
    fontWeight: '600',
    color: THEME.colors.textPrimary,
  },
  orderPillTextActive: {
    color: '#FFF',
  },
  issueGrid: {
    gap: 6,
  },
  issueItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: THEME.borderRadius.md,
    backgroundColor: THEME.colors.surfaceSubtle,
    borderWidth: 1,
    borderColor: THEME.colors.border,
  },
  issueItemActive: {
    backgroundColor: THEME.colors.primary,
    borderColor: THEME.colors.primary,
  },
  issueItemText: {
    fontSize: 13,
    color: THEME.colors.textPrimary,
    fontWeight: '600',
  },
  issueItemTextActive: {
    color: '#FFF',
  },
  textArea: {
    backgroundColor: THEME.colors.surfaceSubtle,
    borderWidth: 1,
    borderColor: THEME.colors.border,
    borderRadius: THEME.borderRadius.md,
    padding: 10,
    fontSize: 13,
    color: THEME.colors.textPrimary,
    height: 85,
    textAlignVertical: 'top',
  },
  uploadBox: {
    borderWidth: 1.5,
    borderStyle: 'dashed',
    borderColor: THEME.colors.border,
    borderRadius: THEME.borderRadius.md,
    backgroundColor: THEME.colors.surfaceSubtle,
    padding: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  uploadPlaceholder: {
    alignItems: 'center',
  },
  uploadPrompt: {
    fontSize: 13,
    fontWeight: '600',
    color: THEME.colors.primary,
    marginTop: 6,
  },
  uploadSub: {
    fontSize: 11,
    color: THEME.colors.textMuted,
    marginTop: 2,
  },
  photoPreviewWrapper: {
    width: '100%',
    alignItems: 'center',
  },
  uploadedImg: {
    width: '100%',
    height: 140,
    borderRadius: THEME.borderRadius.sm,
  },
  photoBadge: {
    marginTop: 8,
  },
  photoBadgeText: {
    fontSize: 12,
    color: THEME.colors.primary,
    fontWeight: '600',
  },
  submitBtn: {
    backgroundColor: THEME.colors.primary,
    paddingVertical: 14,
    borderRadius: THEME.borderRadius.md,
    alignItems: 'center',
    marginTop: 18,
  },
  submitBtnText: {
    color: '#FFF',
    fontSize: 14,
    fontWeight: '700',
  },
  historySection: {
    marginTop: THEME.spacing.xl,
  },
  historyTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: THEME.colors.textSecondary,
    textTransform: 'uppercase',
    marginBottom: 10,
  },
  ticketCard: {
    backgroundColor: THEME.colors.surface,
    borderRadius: THEME.borderRadius.md,
    padding: THEME.spacing.md,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: THEME.colors.cardBorder,
  },
  ticketHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  ticketId: {
    fontSize: 13,
    fontWeight: '700',
    color: THEME.colors.textPrimary,
  },
  ticketStatusBadge: {
    backgroundColor: '#FFF3E0',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: THEME.borderRadius.round,
  },
  ticketStatusText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#E65100',
  },
  ticketOrder: {
    fontSize: 12,
    color: THEME.colors.textMuted,
  },
  ticketDesc: {
    fontSize: 13,
    color: THEME.colors.textSecondary,
    fontStyle: 'italic',
    marginTop: 4,
  },
  resBox: {
    backgroundColor: '#FAF5F2',
    padding: 8,
    borderRadius: 6,
    marginTop: 8,
  },
  resTitle: {
    fontSize: 11,
    fontWeight: '700',
    color: THEME.colors.primary,
  },
  resText: {
    fontSize: 12,
    color: THEME.colors.textPrimary,
    marginTop: 2,
  },
});
