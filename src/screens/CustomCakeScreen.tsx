import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import {
  Alert,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { useApp } from '../context/AppContext';
import { THEME } from '../theme/theme';

export const CustomCakeScreen: React.FC = () => {
  const { customRequests, submitCustomCake } = useApp();

  const [baseFlavor, setBaseFlavor] = useState('Chiffon Vani Pháp');
  const [filling, setFilling] = useState('Dâu tây tươi Đà Lạt');
  const [creamType, setCreamType] = useState('Whipping Cream Pháp ít ngọt');
  const [size, setSize] = useState('1 Tầng 18cm (6-8 người)');
  const [tiers, setTiers] = useState(1);
  const [themeColor, setThemeColor] = useState('Hồng Phấn Pastel & Hoa Sáp');
  const [message, setMessage] = useState('');
  const [notes, setNotes] = useState('');
  const [hasPhotos, setHasPhotos] = useState(false);

  const BASE_FLAVORS = ['Chiffon Vani Pháp', 'Socola Bỉ Đậm Đà', 'Red Velvet Củ Dền', 'Matcha Uji Nhật'];
  const FILLINGS = ['Dâu tây tươi Đà Lạt', 'Mứt Xoài Chanh Leo', 'Sốt Việt Quất Rừng', 'Hạt Phỉ Bùi Ngậy'];
  const CREAMS = ['Whipping Cream Pháp ít ngọt', 'Kem Bơ Thụy Sĩ mịn màng', 'Kem Cream Cheese béo chua'];
  const SIZES = [
    { label: '1 Tầng 14cm (2-4 người)', tiers: 1, basePrice: 420000 },
    { label: '1 Tầng 18cm (6-8 người)', tiers: 1, basePrice: 560000 },
    { label: '2 Tầng Dạ Yến (15-20 người)', tiers: 2, basePrice: 1350000 },
    { label: '3 Tầng Tiệc Cưới (30-40 người)', tiers: 3, basePrice: 2600000 },
  ];
  const THEMES = [
    { name: 'Hồng Phấn Pastel & Hoa Sáp', hex: '#F472B6' },
    { name: 'Burgundy & Vàng Kim Sang Trọng', hex: '#5A2C38' },
    { name: 'Trắng Ngọc Trai Thanh Khiết', hex: '#E2E8F0' },
    { name: 'Xanh Bơ & Đồ Chơi Bento', hex: '#34D399' },
  ];

  const currentSizeObj = SIZES.find((s) => s.label === size) || SIZES[1];

  const handleSubmit = () => {
    submitCustomCake({
      baseFlavor,
      filling,
      creamType,
      size,
      tiers,
      themeColor,
      message: message.trim(),
      notes: notes.trim(),
      images: hasPhotos
        ? [
            'https://images.unsplash.com/photo-1535254973040-607b474cb50d?w=800&q=80',
            'https://images.unsplash.com/photo-1586788680434-30d324b2d46f?w=800&q=80',
          ]
        : [],
    });

    Alert.alert(
      'Gửi Yêu Cầu Thành Công!',
      'Thợ làm bánh trưởng của Miette sẽ xem mẫu và phản hồi bảng báo giá chi tiết trong vòng 2-4 giờ.'
    );

    setMessage('');
    setNotes('');
    setHasPhotos(false);
  };

  return (
    <View style={styles.container}>
      <View style={styles.topHeader}>
        <Text style={styles.headerTitle}>Thiết Kế Bánh Riêng</Text>
        <Text style={styles.headerSubtitle}>Tự tay tạo nên chiếc bánh độc bản cho ngày kỷ niệm</Text>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {/* Visual Preview Card */}
        <View style={styles.previewCard}>
          <View style={styles.previewHeader}>
            <View style={styles.previewBadge}>
              <Ionicons name="color-wand-outline" size={14} color="#FFF" />
              <Text style={styles.previewBadgeText}>BẢN PHÁC THẢO Ý TƯỞNG</Text>
            </View>
            <Text style={styles.estimatePriceText}>
              Ước tính từ {currentSizeObj.basePrice.toLocaleString('vi-VN')}đ
            </Text>
          </View>

          <View style={styles.cakeIllustration}>
            <View style={[styles.cakeTier3, tiers >= 3 && styles.tierVisible]}>
              <Text style={styles.tierText}>Tầng 3 (14cm)</Text>
            </View>
            <View style={[styles.cakeTier2, tiers >= 2 && styles.tierVisible]}>
              <Text style={styles.tierText}>Tầng 2 (18cm)</Text>
            </View>
            <View style={styles.cakeTier1}>
              <Text style={styles.tierText}>{size.split('(')[0]}</Text>
              {message.length > 0 && (
                <Text style={styles.cakeTierMsg} numberOfLines={1}>
                  {`"${message}"`}
                </Text>
              )}
            </View>
            <View style={styles.cakeBasePlate} />
          </View>

          <View style={styles.summaryRow}>
            <Text style={styles.summaryItem}>Cốt {baseFlavor}</Text>
            <Text style={styles.summaryItem}>Nhân {filling}</Text>
            <Text style={styles.summaryItem}>Kem {creamType}</Text>
          </View>
        </View>

        {/* Form Sections */}
        <View style={styles.card}>
          {/* Size & Tiers */}
          <Text style={styles.sectionTitle}>1. Kích thước & Số tầng</Text>
          <View style={styles.optionsGrid}>
            {SIZES.map((s) => {
              const isSelected = size === s.label;
              return (
                <TouchableOpacity
                  key={s.label}
                  style={[styles.sizeOption, isSelected && styles.sizeOptionActive]}
                  onPress={() => {
                    setSize(s.label);
                    setTiers(s.tiers);
                  }}
                  activeOpacity={0.8}
                >
                  <Text style={[styles.sizeOptionTitle, isSelected && styles.sizeOptionTitleActive]}>
                    {s.label}
                  </Text>
                  <Text style={[styles.sizeOptionPrice, isSelected && styles.sizeOptionPriceActive]}>
                    từ {s.basePrice.toLocaleString('vi-VN')}đ
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>

          {/* Base Flavor */}
          <Text style={styles.sectionTitle}>2. Cốt bông lan bên trong</Text>
          <View style={styles.chipRow}>
            {BASE_FLAVORS.map((f) => {
              const isSelected = baseFlavor === f;
              return (
                <TouchableOpacity
                  key={f}
                  style={[styles.chip, isSelected && styles.chipActive]}
                  onPress={() => setBaseFlavor(f)}
                >
                  <Text style={[styles.chipText, isSelected && styles.chipTextActive]}>{f}</Text>
                </TouchableOpacity>
              );
            })}
          </View>

          {/* Filling */}
          <Text style={styles.sectionTitle}>3. Nhân bánh (Filling)</Text>
          <View style={styles.chipRow}>
            {FILLINGS.map((fl) => {
              const isSelected = filling === fl;
              return (
                <TouchableOpacity
                  key={fl}
                  style={[styles.chip, isSelected && styles.chipActive]}
                  onPress={() => setFilling(fl)}
                >
                  <Text style={[styles.chipText, isSelected && styles.chipTextActive]}>{fl}</Text>
                </TouchableOpacity>
              );
            })}
          </View>

          {/* Cream Type */}
          <Text style={styles.sectionTitle}>4. Lớp kem phủ bên ngoài</Text>
          <View style={styles.chipRow}>
            {CREAMS.map((c) => {
              const isSelected = creamType === c;
              return (
                <TouchableOpacity
                  key={c}
                  style={[styles.chip, isSelected && styles.chipActive]}
                  onPress={() => setCreamType(c)}
                >
                  <Text style={[styles.chipText, isSelected && styles.chipTextActive]}>{c}</Text>
                </TouchableOpacity>
              );
            })}
          </View>

          {/* Theme Color Palette */}
          <Text style={styles.sectionTitle}>5. Tone màu chủ đạo</Text>
          <View style={styles.themeList}>
            {THEMES.map((thm) => {
              const isSelected = themeColor === thm.name;
              return (
                <TouchableOpacity
                  key={thm.name}
                  style={[styles.themeItem, isSelected && styles.themeItemActive]}
                  onPress={() => setThemeColor(thm.name)}
                  activeOpacity={0.8}
                >
                  <View style={[styles.colorDot, { backgroundColor: thm.hex }]} />
                  <Text style={[styles.themeName, isSelected && styles.themeNameActive]}>
                    {thm.name}
                  </Text>
                  {isSelected && <Ionicons name="checkmark-circle" size={18} color={THEME.colors.primary} />}
                </TouchableOpacity>
              );
            })}
          </View>

          {/* Message on Cake */}
          <Text style={styles.sectionTitle}>6. Chữ ghi lên mặt bánh</Text>
          <TextInput
            style={styles.textInput}
            placeholder="VD: Chúc Mừng Sinh Nhật Minh Anh 18 Tuổi"
            placeholderTextColor={THEME.colors.textMuted}
            maxLength={45}
            value={message}
            onChangeText={setMessage}
          />

          {/* Upload sample photo (BRD Section 3.3) */}
          <Text style={styles.sectionTitle}>7. Ảnh mẫu tham khảo (tối đa 5 ảnh)</Text>
          <TouchableOpacity
            style={styles.uploadArea}
            onPress={() => setHasPhotos(!hasPhotos)}
            activeOpacity={0.8}
          >
            {hasPhotos ? (
              <View style={styles.photosGrid}>
                <Image
                  source={{
                    uri: 'https://images.unsplash.com/photo-1535254973040-607b474cb50d?w=800&q=80',
                  }}
                  style={styles.uploadedThumb}
                />
                <Image
                  source={{
                    uri: 'https://images.unsplash.com/photo-1586788680434-30d324b2d46f?w=800&q=80',
                  }}
                  style={styles.uploadedThumb}
                />
                <View style={styles.moreBadge}>
                  <Text style={styles.moreBadgeText}>2 ảnh đính kèm (Nhấn đổi)</Text>
                </View>
              </View>
            ) : (
              <View style={styles.uploadPlaceholder}>
                <Ionicons name="images-outline" size={32} color={THEME.colors.primary} />
                <Text style={styles.uploadTitle}>Chọn ảnh thiết kế từ điện thoại</Text>
                <Text style={styles.uploadDesc}>JPG, PNG dưới 10MB</Text>
              </View>
            )}
          </TouchableOpacity>

          {/* Additional Notes */}
          <Text style={styles.sectionTitle}>8. Yêu cầu chi tiết khác</Text>
          <TextInput
            style={[styles.textInput, styles.textArea]}
            placeholder="Mô tả chi tiết mong muốn của bạn về phụ kiện, hình dáng, hoặc thời gian giao..."
            placeholderTextColor={THEME.colors.textMuted}
            multiline
            numberOfLines={3}
            value={notes}
            onChangeText={setNotes}
          />

          <TouchableOpacity style={styles.submitBtn} onPress={handleSubmit} activeOpacity={0.85}>
            <Ionicons name="paper-plane-outline" size={20} color="#FFF" />
            <Text style={styles.submitBtnText}>Gửi yêu cầu thợ bánh báo giá</Text>
          </TouchableOpacity>
        </View>

        {/* Past custom requests */}
        {customRequests.length > 0 && (
          <View style={styles.requestsSection}>
            <Text style={styles.requestsTitle}>Yêu cầu custom đã gửi ({customRequests.length})</Text>
            {customRequests.map((req) => (
              <View key={req.id} style={styles.reqCard}>
                <View style={styles.reqHeader}>
                  <Text style={styles.reqId}>Yêu cầu #{req.id.slice(-5)}</Text>
                  <View style={styles.reqBadge}>
                    <Text style={styles.reqBadgeText}>Chờ tiệm báo giá</Text>
                  </View>
                </View>
                <Text style={styles.reqDetail}>
                  {req.size} • {req.baseFlavor} • {req.creamType}
                </Text>
                {req.message ? <Text style={styles.reqMsg}>{`Chữ: "${req.message}"`}</Text> : null}
              </View>
            ))}
          </View>
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: THEME.colors.background,
  },
  topHeader: {
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
  previewCard: {
    backgroundColor: THEME.colors.primary,
    borderRadius: THEME.borderRadius.xl,
    padding: THEME.spacing.lg,
    marginBottom: THEME.spacing.lg,
    ...THEME.shadows.md,
  },
  previewHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  previewBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  previewBadgeText: {
    color: '#FFF',
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  estimatePriceText: {
    color: THEME.colors.accentLight,
    fontWeight: '800',
    fontSize: 13,
  },
  cakeIllustration: {
    alignItems: 'center',
    marginVertical: 10,
  },
  cakeTier3: {
    display: 'none',
    width: 100,
    height: 35,
    backgroundColor: '#FFE4E6',
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    borderWidth: 2,
    borderColor: '#FECDD3',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cakeTier2: {
    display: 'none',
    width: 150,
    height: 40,
    backgroundColor: '#FDE047',
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
    borderWidth: 2,
    borderColor: '#FACC15',
    alignItems: 'center',
    justifyContent: 'center',
  },
  tierVisible: {
    display: 'flex',
  },
  cakeTier1: {
    width: 200,
    height: 55,
    backgroundColor: '#FFF7ED',
    borderTopLeftRadius: 14,
    borderTopRightRadius: 14,
    borderWidth: 2,
    borderColor: '#FFEDD5',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 10,
  },
  tierText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#7C2D12',
  },
  cakeTierMsg: {
    fontSize: 10,
    color: THEME.colors.primary,
    fontStyle: 'italic',
    fontWeight: '700',
    marginTop: 2,
  },
  cakeBasePlate: {
    width: 240,
    height: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.4)',
    borderRadius: 4,
    marginTop: 2,
  },
  summaryRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 14,
    justifyContent: 'center',
  },
  summaryItem: {
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    color: '#FFF',
    fontSize: 11,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  card: {
    backgroundColor: THEME.colors.surface,
    borderRadius: THEME.borderRadius.lg,
    padding: THEME.spacing.lg,
    borderWidth: 1,
    borderColor: THEME.colors.cardBorder,
    ...THEME.shadows.sm,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: THEME.colors.textPrimary,
    marginTop: 16,
    marginBottom: 8,
  },
  optionsGrid: {
    gap: 8,
  },
  sizeOption: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 12,
    borderRadius: THEME.borderRadius.md,
    borderWidth: 1.5,
    borderColor: THEME.colors.border,
    backgroundColor: THEME.colors.surfaceSubtle,
  },
  sizeOptionActive: {
    borderColor: THEME.colors.primary,
    backgroundColor: '#FAF5F2',
  },
  sizeOptionTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: THEME.colors.textPrimary,
  },
  sizeOptionTitleActive: {
    color: THEME.colors.primary,
    fontWeight: '700',
  },
  sizeOptionPrice: {
    fontSize: 12,
    fontWeight: '700',
    color: THEME.colors.textSecondary,
  },
  sizeOptionPriceActive: {
    color: THEME.colors.primary,
  },
  chipRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  chip: {
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: THEME.borderRadius.round,
    backgroundColor: THEME.colors.surfaceSubtle,
    borderWidth: 1,
    borderColor: THEME.colors.border,
  },
  chipActive: {
    backgroundColor: THEME.colors.primary,
    borderColor: THEME.colors.primary,
  },
  chipText: {
    fontSize: 12,
    color: THEME.colors.textPrimary,
  },
  chipTextActive: {
    color: '#FFF',
    fontWeight: '700',
  },
  themeList: {
    gap: 8,
  },
  themeItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderRadius: THEME.borderRadius.md,
    backgroundColor: THEME.colors.surfaceSubtle,
    borderWidth: 1,
    borderColor: THEME.colors.border,
  },
  themeItemActive: {
    borderColor: THEME.colors.primary,
    backgroundColor: '#FAF5F2',
  },
  colorDot: {
    width: 20,
    height: 20,
    borderRadius: 10,
    marginRight: 10,
  },
  themeName: {
    flex: 1,
    fontSize: 13,
    color: THEME.colors.textPrimary,
  },
  themeNameActive: {
    fontWeight: '700',
    color: THEME.colors.primary,
  },
  textInput: {
    backgroundColor: THEME.colors.surfaceSubtle,
    borderWidth: 1,
    borderColor: THEME.colors.border,
    borderRadius: THEME.borderRadius.md,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 13,
    color: THEME.colors.textPrimary,
  },
  textArea: {
    height: 80,
    textAlignVertical: 'top',
  },
  uploadArea: {
    borderWidth: 1.5,
    borderStyle: 'dashed',
    borderColor: THEME.colors.border,
    borderRadius: THEME.borderRadius.md,
    backgroundColor: THEME.colors.surfaceSubtle,
    padding: 16,
    alignItems: 'center',
  },
  uploadPlaceholder: {
    alignItems: 'center',
  },
  uploadTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: THEME.colors.primary,
    marginTop: 6,
  },
  uploadDesc: {
    fontSize: 11,
    color: THEME.colors.textMuted,
    marginTop: 2,
  },
  photosGrid: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  uploadedThumb: {
    width: 70,
    height: 70,
    borderRadius: 8,
  },
  moreBadge: {
    marginLeft: 6,
  },
  moreBadgeText: {
    fontSize: 12,
    fontWeight: '600',
    color: THEME.colors.primary,
  },
  submitBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: THEME.colors.primary,
    paddingVertical: 14,
    borderRadius: THEME.borderRadius.md,
    marginTop: 20,
    gap: 8,
  },
  submitBtnText: {
    color: '#FFF',
    fontSize: 15,
    fontWeight: '700',
  },
  requestsSection: {
    marginTop: THEME.spacing.xl,
  },
  requestsTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: THEME.colors.textSecondary,
    textTransform: 'uppercase',
    marginBottom: 8,
  },
  reqCard: {
    backgroundColor: THEME.colors.surface,
    padding: 12,
    borderRadius: THEME.borderRadius.md,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: THEME.colors.cardBorder,
  },
  reqHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  reqId: {
    fontSize: 13,
    fontWeight: '700',
    color: THEME.colors.textPrimary,
  },
  reqBadge: {
    backgroundColor: '#FFF8E1',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 4,
  },
  reqBadgeText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#B45309',
  },
  reqDetail: {
    fontSize: 12,
    color: THEME.colors.textSecondary,
    marginTop: 4,
  },
  reqMsg: {
    fontSize: 11,
    color: THEME.colors.secondary,
    fontStyle: 'italic',
    marginTop: 2,
  },
});
