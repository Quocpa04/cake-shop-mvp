import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useApp } from '../context/AppContext';
import { THEME } from '../theme/theme';
import { Product } from '../types';

interface ProductCardProps {
  product: Product;
  onPress: () => void;
  layout?: 'single' | 'grid';
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, onPress, layout = 'single' }) => {
  const { favorites, toggleFavorite } = useApp();
  const isFav = favorites.includes(product.id);
  const minPrice = Math.min(...product.variants.map((v) => v.price));

  if (layout === 'grid') {
    return (
      <TouchableOpacity style={styles.gridCard} onPress={onPress} activeOpacity={0.9}>
        <View style={styles.gridImageContainer}>
          <Image source={{ uri: product.image }} style={styles.gridImage} resizeMode="cover" />

          {/* Badges on image */}
          {product.percentOff && (
            <View style={styles.gridPercentBadge}>
              <Text style={styles.gridPercentBadgeText}>
                -{Math.round(product.percentOff * 100)}%
              </Text>
            </View>
          )}

          {/* Favorite heart */}
          <TouchableOpacity
            style={styles.gridFavButton}
            onPress={() => toggleFavorite(product.id)}
            activeOpacity={0.7}
          >
            <Ionicons
              name={isFav ? 'heart' : 'heart-outline'}
              size={16}
              color={isFav ? '#EF4444' : '#374151'}
            />
          </TouchableOpacity>
        </View>

        <View style={styles.gridInfoContainer}>
          {/* Brand & Gender */}
          <View style={styles.gridMetaRow}>
            {product.gender === false ? (
              <View style={styles.maleBadgeMini}>
                <Ionicons name="male" size={9} color="#1E40AF" />
                <Text style={styles.maleBadgeTextMini}>Phái mạnh</Text>
              </View>
            ) : product.gender === true ? (
              <View style={styles.femaleBadgeMini}>
                <Ionicons name="female" size={9} color="#BE185D" />
                <Text style={styles.femaleBadgeTextMini}>Phái đẹp</Text>
              </View>
            ) : null}
          </View>

          {/* Title */}
          <Text style={styles.gridName} numberOfLines={1}>
            {product.name}
          </Text>

          {/* Subtitle / Availability */}
          <Text style={styles.gridSubtitle} numberOfLines={1}>
            {product.leadTimeHours >= 24
              ? `Đặt trước • ${product.leadTimeHours / 24} ngày`
              : product.leadTimeHours > 0
              ? `Đặt trước • ${product.leadTimeHours} giờ`
              : 'Sẵn có • còn 8 bánh'}
          </Text>

          {/* Price */}
          <View style={styles.gridPriceRow}>
            <View style={styles.gridPriceCol}>
              <Text style={styles.gridPricePrefix}>
                Từ <Text style={styles.gridPrice}>{minPrice.toLocaleString('vi-VN')}đ</Text>
              </Text>
              {product.originalPrice && product.originalPrice > minPrice && (
                <Text style={styles.gridOriginalPrice}>
                  {product.originalPrice.toLocaleString('vi-VN')}đ
                </Text>
              )}
            </View>
            <View style={styles.gridAddButton}>
              <Ionicons name="add" size={16} color="#FFFFFF" />
            </View>
          </View>
        </View>
      </TouchableOpacity>
    );
  }

  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.9}>
      <View style={styles.imageContainer}>
        <Image source={{ uri: product.image }} style={styles.image} resizeMode="cover" />

        {/* Badges on image */}
        <View style={styles.badgeRow}>
          {product.percentOff && (
            <View style={[styles.badge, { backgroundColor: '#DC2626' }]}>
              <Text style={styles.badgeText}>
                -{Math.round(product.percentOff * 100)}%
              </Text>
            </View>
          )}
          {product.isBestSeller && (
            <View style={[styles.badge, { backgroundColor: THEME.colors.secondary }]}>
              <Text style={styles.badgeText}>Bán chạy</Text>
            </View>
          )}
          {product.isNew && (
            <View style={[styles.badge, { backgroundColor: THEME.colors.primary }]}>
              <Text style={styles.badgeText}>Mới</Text>
            </View>
          )}
          {product.leadTimeHours >= 24 && (
            <View style={[styles.badge, { backgroundColor: '#B78103' }]}>
              <Text style={styles.badgeText}>Đặt trước 24h</Text>
            </View>
          )}
        </View>

        {/* Favorite heart (MMA301 Task 3) */}
        <TouchableOpacity
          style={styles.favButton}
          onPress={() => toggleFavorite(product.id)}
          activeOpacity={0.7}
        >
          <Ionicons
            name={isFav ? 'heart' : 'heart-outline'}
            size={18}
            color={isFav ? '#EF4444' : THEME.colors.textPrimary}
          />
        </TouchableOpacity>
      </View>

      <View style={styles.infoContainer}>
        {/* Brand & Gender Standout Row (MMA301 Task 1) */}
        <View style={styles.brandGenderRow}>
          {product.gender === false ? (
            <View style={styles.maleBadge}>
              <Ionicons name="male" size={12} color="#1E40AF" />
              <Text style={styles.maleBadgeText}>Phái mạnh</Text>
            </View>
          ) : product.gender === true ? (
            <View style={styles.femaleBadge}>
              <Ionicons name="female" size={12} color="#BE185D" />
              <Text style={styles.femaleBadgeText}>Phái đẹp</Text>
            </View>
          ) : null}
        </View>

        <View style={styles.ratingRow}>
          <Ionicons name="star" size={13} color="#F59E0B" />
          <Text style={styles.ratingText}>{product.rating.toFixed(1)}</Text>
          <Text style={styles.reviewText}>({product.reviewCount})</Text>
          <View style={styles.dot} />
          <Ionicons name="time-outline" size={13} color={THEME.colors.textMuted} />
          <Text style={styles.leadTimeText}>
            {product.leadTimeHours >= 24 ? `${product.leadTimeHours / 24} ngày` : `${product.leadTimeHours} giờ`}
          </Text>
        </View>

        <Text style={styles.name} numberOfLines={1}>
          {product.name}
        </Text>
        <Text style={styles.subtitle} numberOfLines={1}>
          {product.subtitle}
        </Text>

        <View style={styles.bottomRow}>
          <View>
            <View style={styles.priceContainer}>
              <Text style={styles.pricePrefix}>Giá từ</Text>
              <Text style={styles.price}>{minPrice.toLocaleString('vi-VN')}đ</Text>
            </View>
            {product.originalPrice && product.originalPrice > minPrice && (
              <Text style={styles.originalPrice}>
                {product.originalPrice.toLocaleString('vi-VN')}đ
              </Text>
            )}
          </View>

          <View style={styles.addButton}>
            <Ionicons name="add" size={18} color="#FFFFFF" />
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: THEME.colors.surface,
    borderRadius: THEME.borderRadius.lg,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: THEME.colors.cardBorder,
    ...THEME.shadows.sm,
    marginBottom: THEME.spacing.md,
  },
  imageContainer: {
    width: '100%',
    height: 180,
    position: 'relative',
    backgroundColor: THEME.colors.surfaceSubtle,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  badgeRow: {
    position: 'absolute',
    top: 10,
    left: 10,
    flexDirection: 'row',
    gap: 6,
  },
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: THEME.borderRadius.sm,
  },
  badgeText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '700',
  },
  favButton: {
    position: 'absolute',
    top: 10,
    right: 10,
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  infoContainer: {
    padding: THEME.spacing.md,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  ratingText: {
    fontSize: 12,
    fontWeight: '700',
    color: THEME.colors.textPrimary,
    marginLeft: 3,
  },
  reviewText: {
    fontSize: 11,
    color: THEME.colors.textMuted,
    marginLeft: 2,
  },
  dot: {
    width: 3,
    height: 3,
    borderRadius: 1.5,
    backgroundColor: THEME.colors.textMuted,
    marginHorizontal: 6,
  },
  leadTimeText: {
    fontSize: 11,
    color: THEME.colors.textMuted,
    marginLeft: 3,
  },
  name: {
    fontSize: 16,
    fontWeight: '700',
    color: THEME.colors.textPrimary,
    marginTop: 2,
  },
  subtitle: {
    fontSize: 12,
    color: THEME.colors.textSecondary,
    marginTop: 2,
  },
  bottomRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    marginTop: THEME.spacing.md,
    paddingTop: THEME.spacing.sm,
    borderTopWidth: 1,
    borderTopColor: THEME.colors.border,
  },
  pricePrefix: {
    fontSize: 10,
    color: THEME.colors.textMuted,
    textTransform: 'uppercase',
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 4,
  },
  price: {
    fontSize: 17,
    fontWeight: '800',
    color: THEME.colors.primary,
  },
  originalPrice: {
    fontSize: 11,
    color: '#9CA3AF',
    textDecorationLine: 'line-through',
    marginTop: 1,
  },
  brandGenderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 4,
  },
  brandTag: {
    fontSize: 10,
    fontWeight: '800',
    color: THEME.colors.accent,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  maleBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    backgroundColor: '#DBEAFE',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  maleBadgeText: {
    fontSize: 9,
    fontWeight: '700',
    color: '#1E40AF',
  },
  femaleBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    backgroundColor: '#FCE7F3',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  femaleBadgeText: {
    fontSize: 9,
    fontWeight: '700',
    color: '#9D174D',
  },
  addButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: THEME.colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  // 2-Column Grid Layout Styles (Figma 100%)
  gridCard: {
    width: '48.2%',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#F3E8E2',
    ...THEME.shadows.sm,
  },
  gridImageContainer: {
    width: '100%',
    height: 155,
    position: 'relative',
    backgroundColor: THEME.colors.surfaceSubtle,
  },
  gridImage: {
    width: '100%',
    height: '100%',
  },
  gridPercentBadge: {
    position: 'absolute',
    top: 8,
    left: 8,
    backgroundColor: '#DC2626',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  gridPercentBadgeText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '800',
  },
  gridFavButton: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: 'rgba(255, 255, 255, 0.92)',
    alignItems: 'center',
    justifyContent: 'center',
    ...THEME.shadows.sm,
  },
  gridInfoContainer: {
    padding: 10,
  },
  gridMetaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  gridBrandTag: {
    fontSize: 9,
    fontWeight: '800',
    color: THEME.colors.accent,
    textTransform: 'uppercase',
  },
  maleBadgeMini: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
    backgroundColor: '#DBEAFE',
    paddingHorizontal: 4,
    paddingVertical: 1,
    borderRadius: 4,
  },
  maleBadgeTextMini: {
    fontSize: 8,
    fontWeight: '700',
    color: '#1E40AF',
  },
  femaleBadgeMini: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
    backgroundColor: '#FCE7F3',
    paddingHorizontal: 4,
    paddingVertical: 1,
    borderRadius: 4,
  },
  femaleBadgeTextMini: {
    fontSize: 8,
    fontWeight: '700',
    color: '#9D174D',
  },
  gridName: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1F2937',
    marginTop: 1,
  },
  gridSubtitle: {
    fontSize: 11,
    color: '#6B7280',
    marginTop: 2,
    marginBottom: 6,
  },
  gridPriceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 6,
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
  },
  gridPriceCol: {
    flex: 1,
  },
  gridPricePrefix: {
    fontSize: 12,
    color: '#6B7280',
  },
  gridPrice: {
    fontSize: 13,
    fontWeight: '800',
    color: THEME.colors.primary,
  },
  gridOriginalPrice: {
    fontSize: 9,
    color: '#9CA3AF',
    textDecorationLine: 'line-through',
  },
  gridAddButton: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: THEME.colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
