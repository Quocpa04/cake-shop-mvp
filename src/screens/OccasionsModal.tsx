import { Ionicons } from '@expo/vector-icons';
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
import { useApp } from '../context/AppContext';
import { THEME } from '../theme/theme';

interface OccasionsModalProps {
  visible: boolean;
  onClose: () => void;
  onSelectOccasionForOrder?: (title: string) => void;
}

export const OccasionsModal: React.FC<OccasionsModalProps> = ({
  visible,
  onClose,
  onSelectOccasionForOrder,
}) => {
  const { occasions, addOccasion, deleteOccasion } = useApp();

  const [showAddForm, setShowAddForm] = useState(false);
  const [title, setTitle] = useState('');
  const [personName, setPersonName] = useState('');
  const [relationship, setRelationship] = useState('Mẹ');
  const [date, setDate] = useState('');
  const [remindDays, setRemindDays] = useState(7);

  const RELATIONSHIPS = ['Mẹ', 'Bố', 'Vợ / Chồng', 'Người yêu', 'Con', 'Bạn thân', 'Đồng nghiệp'];

  const handleSave = () => {
    if (!title.trim() || !personName.trim() || !date.trim()) {
      Alert.alert('Thiếu thông tin', 'Vui lòng nhập đầy đủ tên dịp, tên người thân và ngày diễn ra.');
      return;
    }
    addOccasion({
      title: title.trim(),
      personName: personName.trim(),
      relationship,
      date: date.trim(),
      remindDaysBefore: remindDays,
    });
    Alert.alert('Thành công', 'Đã lưu dịp đặc biệt! Miette sẽ gửi thông báo nhắc bạn đặt bánh trước ngày lễ.');
    setTitle('');
    setPersonName('');
    setDate('');
    setShowAddForm(false);
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
            <Text style={styles.headerTitle}>Đừng Quên Lời Thương</Text>
            <Text style={styles.headerSubtitle}>Nhắc lịch sinh nhật & kỷ niệm người thân</Text>
          </View>
          <TouchableOpacity
            style={styles.addIconBtn}
            onPress={() => setShowAddForm(!showAddForm)}
            activeOpacity={0.8}
          >
            <Ionicons name={showAddForm ? 'close' : 'add'} size={24} color={THEME.colors.primary} />
          </TouchableOpacity>
        </View>

        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
          {/* Add form */}
          {showAddForm && (
            <View style={styles.formCard}>
              <Text style={styles.formTitle}>Thêm dịp đặc biệt mới</Text>

              <Text style={styles.inputLabel}>Tên dịp lễ / sự kiện:</Text>
              <TextInput
                style={styles.input}
                placeholder="VD: Sinh nhật Mẹ Hoàng Yến"
                placeholderTextColor={THEME.colors.textMuted}
                value={title}
                onChangeText={setTitle}
              />

              <Text style={styles.inputLabel}>Tên người nhận:</Text>
              <TextInput
                style={styles.input}
                placeholder="VD: Hoàng Thị Yến"
                placeholderTextColor={THEME.colors.textMuted}
                value={personName}
                onChangeText={setPersonName}
              />

              <Text style={styles.inputLabel}>Mối quan hệ:</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.relScroll}>
                {RELATIONSHIPS.map((rel) => (
                  <TouchableOpacity
                    key={rel}
                    style={[styles.relPill, relationship === rel && styles.relPillActive]}
                    onPress={() => setRelationship(rel)}
                  >
                    <Text
                      style={[styles.relPillText, relationship === rel && styles.relPillTextActive]}
                    >
                      {rel}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>

              <Text style={styles.inputLabel}>Ngày diễn ra (Ngày/Tháng):</Text>
              <TextInput
                style={styles.input}
                placeholder="VD: 15/11"
                placeholderTextColor={THEME.colors.textMuted}
                value={date}
                onChangeText={setDate}
              />

              <Text style={styles.inputLabel}>Nhắc trước:</Text>
              <View style={styles.remindRow}>
                {[3, 7, 10].map((days) => (
                  <TouchableOpacity
                    key={days}
                    style={[styles.daysPill, remindDays === days && styles.daysPillActive]}
                    onPress={() => setRemindDays(days)}
                  >
                    <Text
                      style={[
                        styles.daysPillText,
                        remindDays === days && styles.daysPillTextActive,
                      ]}
                    >
                      Trước {days} ngày
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

              <TouchableOpacity style={styles.saveBtn} onPress={handleSave} activeOpacity={0.85}>
                <Text style={styles.saveBtnText}>Lưu dịp đặc biệt</Text>
              </TouchableOpacity>
            </View>
          )}

          {/* Occasions List */}
          <View style={styles.listHeaderRow}>
            <Text style={styles.listTitle}>Các ngày quan trọng sắp tới ({occasions.length})</Text>
          </View>

          {occasions.map((occ) => (
            <View key={occ.id} style={styles.occCard}>
              <View style={styles.dateBadge}>
                <Ionicons name="calendar" size={16} color={THEME.colors.primary} />
                <Text style={styles.dateBadgeText}>{occ.date}</Text>
              </View>

              <View style={styles.occInfoCol}>
                <Text style={styles.occTitle}>{occ.title}</Text>
                <Text style={styles.occSubtitle}>
                  {occ.personName} • {occ.relationship}
                </Text>
                <View style={styles.remindBadge}>
                  <Ionicons name="notifications-outline" size={12} color={THEME.colors.secondary} />
                  <Text style={styles.remindBadgeText}>Nhắc trước {occ.remindDaysBefore} ngày</Text>
                </View>
              </View>

              <View style={styles.actionCol}>
                <TouchableOpacity
                  style={styles.orderNowBtn}
                  onPress={() => {
                    onClose();
                    onSelectOccasionForOrder && onSelectOccasionForOrder(occ.title);
                  }}
                  activeOpacity={0.8}
                >
                  <Text style={styles.orderNowBtnText}>Đặt bánh</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.deleteBtn}
                  onPress={() => deleteOccasion(occ.id)}
                  activeOpacity={0.8}
                >
                  <Ionicons name="trash-outline" size={16} color="#DC2626" />
                </TouchableOpacity>
              </View>
            </View>
          ))}
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
  addIconBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: THEME.colors.surfaceSubtle,
    alignItems: 'center',
    justifyContent: 'center',
  },
  scrollContent: {
    padding: THEME.spacing.lg,
    paddingBottom: 40,
  },
  formCard: {
    backgroundColor: THEME.colors.surface,
    borderRadius: THEME.borderRadius.lg,
    padding: THEME.spacing.lg,
    marginBottom: THEME.spacing.lg,
    borderWidth: 1,
    borderColor: THEME.colors.cardBorder,
    ...THEME.shadows.md,
  },
  formTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: THEME.colors.textPrimary,
    marginBottom: 12,
  },
  inputLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: THEME.colors.textSecondary,
    marginTop: 10,
    marginBottom: 4,
  },
  input: {
    backgroundColor: THEME.colors.surfaceSubtle,
    borderWidth: 1,
    borderColor: THEME.colors.border,
    borderRadius: THEME.borderRadius.md,
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: 14,
    color: THEME.colors.textPrimary,
  },
  relScroll: {
    flexDirection: 'row',
    marginVertical: 4,
  },
  relPill: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: THEME.borderRadius.round,
    backgroundColor: THEME.colors.surfaceSubtle,
    marginRight: 6,
    borderWidth: 1,
    borderColor: THEME.colors.border,
  },
  relPillActive: {
    backgroundColor: THEME.colors.primary,
    borderColor: THEME.colors.primary,
  },
  relPillText: {
    fontSize: 12,
    color: THEME.colors.textPrimary,
  },
  relPillTextActive: {
    color: '#FFF',
    fontWeight: '700',
  },
  remindRow: {
    flexDirection: 'row',
    gap: 8,
    marginVertical: 4,
  },
  daysPill: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: THEME.borderRadius.round,
    backgroundColor: THEME.colors.surfaceSubtle,
    borderWidth: 1,
    borderColor: THEME.colors.border,
  },
  daysPillActive: {
    backgroundColor: THEME.colors.secondary,
    borderColor: THEME.colors.secondary,
  },
  daysPillText: {
    fontSize: 12,
    color: THEME.colors.textPrimary,
  },
  daysPillTextActive: {
    color: '#FFF',
    fontWeight: '700',
  },
  saveBtn: {
    backgroundColor: THEME.colors.primary,
    paddingVertical: 12,
    borderRadius: THEME.borderRadius.md,
    alignItems: 'center',
    marginTop: 16,
  },
  saveBtnText: {
    color: '#FFF',
    fontWeight: '700',
    fontSize: 14,
  },
  listHeaderRow: {
    marginBottom: 10,
  },
  listTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: THEME.colors.textSecondary,
    textTransform: 'uppercase',
  },
  occCard: {
    flexDirection: 'row',
    backgroundColor: THEME.colors.surface,
    borderRadius: THEME.borderRadius.lg,
    padding: THEME.spacing.md,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: THEME.colors.cardBorder,
    alignItems: 'center',
    ...THEME.shadows.sm,
  },
  dateBadge: {
    backgroundColor: '#FAF5F2',
    borderWidth: 1,
    borderColor: '#E6D7CC',
    borderRadius: THEME.borderRadius.md,
    paddingHorizontal: 10,
    paddingVertical: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dateBadgeText: {
    fontSize: 13,
    fontWeight: '800',
    color: THEME.colors.primary,
    marginTop: 2,
  },
  occInfoCol: {
    flex: 1,
    marginLeft: 12,
  },
  occTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: THEME.colors.textPrimary,
  },
  occSubtitle: {
    fontSize: 12,
    color: THEME.colors.textSecondary,
    marginTop: 2,
  },
  remindBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 4,
  },
  remindBadgeText: {
    fontSize: 11,
    color: THEME.colors.secondary,
  },
  actionCol: {
    alignItems: 'flex-end',
    gap: 8,
  },
  orderNowBtn: {
    backgroundColor: THEME.colors.primary,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: THEME.borderRadius.round,
  },
  orderNowBtnText: {
    color: '#FFF',
    fontSize: 11,
    fontWeight: '700',
  },
  deleteBtn: {
    padding: 4,
  },
});
