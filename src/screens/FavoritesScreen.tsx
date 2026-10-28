import React, { useMemo, useState } from 'react';
import {
  Alert,
  FlatList,
  Image,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useApp } from '../context/AppContext';
import { PRODUCTS } from '../data/mockData';
import { THEME } from '../theme/theme';
import { Product } from '../types';

interface FavoritesScreenProps {
  onSelectProduct: (product: Product) => void;
  onNavigateHome: () => void;
}

export const FavoritesScreen: React.FC<FavoritesScreenProps> = ({
  onSelectProduct,
  onNavigateHome,
}) => {
  const { favorites, removeFavorite, clearAllFavorites } = useApp();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedBrand, setSelectedBrand] = useState('Tất cả');

  // Filter products that are in the user's favorites
  const favoriteProducts = useMemo(() => {
    return PRODUCTS.filter((p) => favorites.includes(p.id));
  }, [favorites]);

  // Extract distinct brands from favorite products
  const availableBrands = useMemo(() => {
    const brands = new Set<string>();
    brands.add('Tất cả');
    favoriteProducts.forEach((p) => {
      if (p.brand) brands.add(p.brand);
    });
    return Array.from(brands);
  }, [favoriteProducts]);

  // Filter by search query and brand
  const filteredFavorites = useMemo(() => {
    return favoriteProducts.filter((product) => {
      const matchesSearch =
        searchQuery.trim().length === 0 ||
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.subtitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (product.brand && product.brand.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchesBrand =
        selectedBrand === 'Tất cả' || product.brand === selectedBrand;

      return matchesSearch && matchesBrand;
    });
  }, [favoriteProducts, searchQuery, selectedBrand]);

  const handleConfirmClearAll = () => {
    if (favorites.length === 0) return;
    Alert.alert(
      'Xóa toàn bộ yêu thích?',
      'Hành động này sẽ xóa vĩnh viễn tất cả sản phẩm khỏi bộ nhớ thiết bị (AsyncStorage).',
      [
        { text: 'Hủy', style: 'cancel' },
        {
          text: 'Xóa tất cả',
          style: 'destructive',
          onPress: () => {
            clearAllFavorites();
          },
        },
      ]
    );
  };

  const handleRemoveSingle = (product: Product) => {
    Alert.alert(
      'Bỏ yêu thích',
      `Bạn có muốn bỏ "${product.name}" khỏi danh sách yêu thích?`,
      [
        { text: 'Hủy', style: 'cancel' },
        {
          text: 'Bỏ yêu thích',
          style: 'destructive',
          onPress: () => removeFavorite(product.id),
        },
      ]
    );
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <View style={styles.titleRow}>
            <Ionicons name="heart" size={22} color={THEME.colors.primary} />
            <Text style={styles.headerTitle}>Món Yêu Thích</Text>
          </View>
          <Text style={styles.headerSubtitle}>
            {favorites.length} sản phẩm • Lưu bộ nhớ thiết bị (AsyncStorage)
          </Text>
        </View>

        {favorites.length > 0 && (
          <TouchableOpacity
            style={styles.clearAllBtn}
            onPress={handleConfirmClearAll}
            activeOpacity={0.7}
          >
            <Ionicons name="trash-outline" size={15} color="#DC2626" />
            <Text style={styles.clearAllText}>Xóa tất cả</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Search Input (Task 3: Search the handbags) */}
      <View style={styles.searchBarContainer}>
        <Ionicons name="search" size={18} color={THEME.colors.textMuted} style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Tìm trong danh sách yêu thích..."
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholderTextColor="#9CA3AF"
          clearButtonMode="while-editing"
        />
        {searchQuery.length > 0 && (
          <TouchableOpacity onPress={() => setSearchQuery('')} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
            <Ionicons name="close-circle" size={18} color="#9CA3AF" />
          </TouchableOpacity>
        )}
      </View>

      {/* Brand Filters */}
      {availableBrands.length > 2 && (
        <View style={styles.brandsWrapper}>
          <FlatList
            horizontal
            showsHorizontalScrollIndicator={false}
            data={availableBrands}
            keyExtractor={(item) => item}
            contentContainerStyle={styles.brandsList}
            renderItem={({ item }) => {
              const isSelected = selectedBrand === item;
              return (
                <TouchableOpacity
                  style={[styles.brandChip, isSelected && styles.brandChipSelected]}
                  onPress={() => setSelectedBrand(item)}
                  activeOpacity={0.75}
                >
                  <Text style={[styles.brandChipText, isSelected && styles.brandChipTextSelected]}>
                    {item}
                  </Text>
                </TouchableOpacity>
              );
            }}
          />
        </View>
      )}

      {/* Content List */}
      {filteredFavorites.length === 0 ? (
        <View style={styles.emptyContainer}>
          <View style={styles.emptyIconBox}>
            <Ionicons name="heart-dislike-outline" size={56} color="#D1D5DB" />
          </View>
          <Text style={styles.emptyTitle}>
            {favorites.length === 0
              ? 'Chưa có món yêu thích nào'
              : 'Không tìm thấy sản phẩm phù hợp'}
          </Text>
          <Text style={styles.emptySubtitle}>
            {favorites.length === 0
              ? 'Hãy thả tim các mẫu bánh bạn yêu thích trên menu để lưu lại và đặt nhanh bất cứ lúc nào!'
              : 'Hãy thử tìm kiếm với từ khóa khác hoặc bỏ chọn bộ lọc thương hiệu.'}
          </Text>

          {favorites.length === 0 && (
            <TouchableOpacity
              style={styles.exploreBtn}
              onPress={onNavigateHome}
              activeOpacity={0.85}
            >
              <Ionicons name="sparkles" size={18} color="#FFFFFF" />
              <Text style={styles.exploreBtnText}>Khám phá Menu Ngay</Text>
            </TouchableOpacity>
          )}
        </View>
      ) : (
        <FlatList
          data={filteredFavorites}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => {
            const basePrice = item.variants[0]?.price || 0;
            const originalPrice = item.originalPrice || Math.round(basePrice * 1.25);
            const percentOffText = item.percentOff
              ? `-${Math.round(item.percentOff * 100)}%`
              : '-20%';

            return (
              <TouchableOpacity
                style={styles.favoriteCard}
                onPress={() => onSelectProduct(item)}
                activeOpacity={0.88}
              >
                <Image source={{ uri: item.image }} style={styles.cardImage} />

                {/* Percent Off Badge */}
                <View style={styles.percentBadge}>
                  <Text style={styles.percentText}>{percentOffText}</Text>
                </View>

                {/* Delete Single Favorite Button */}
                <TouchableOpacity
                  style={styles.cardTrashBtn}
                  onPress={() => handleRemoveSingle(item)}
                  activeOpacity={0.8}
                  hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                >
                  <Ionicons name="heart" size={20} color="#EF4444" />
                </TouchableOpacity>

                <View style={styles.cardDetails}>
                  {/* Brand & Gender */}
                  <View style={styles.brandRow}>
                    <Text style={styles.brandText}>{item.brand || 'Miette Special'}</Text>
                    {item.gender === false && (
                      <View style={styles.maleBadge}>
                        <Ionicons name="male" size={12} color="#1D4ED8" />
                        <Text style={styles.maleBadgeText}>Cho Phái Mạnh</Text>
                      </View>
                    )}
                  </View>

                  <Text style={styles.cardName} numberOfLines={1}>
                    {item.name}
                  </Text>
                  <Text style={styles.cardSubtitle} numberOfLines={1}>
                    {item.subtitle}
                  </Text>

                  {/* Rating */}
                  <View style={styles.ratingRow}>
                    <Ionicons name="star" size={13} color="#F59E0B" />
                    <Text style={styles.ratingText}>{item.rating.toFixed(1)}</Text>
                    <Text style={styles.reviewCountText}>({item.reviewCount} đánh giá)</Text>
                  </View>

                  {/* Price & Action */}
                  <View style={styles.priceRow}>
                    <View>
                      <Text style={styles.priceText}>
                        {basePrice.toLocaleString('vi-VN')}đ
                      </Text>
                      {originalPrice > basePrice && (
                        <Text style={styles.originalPriceText}>
                          {originalPrice.toLocaleString('vi-VN')}đ
                        </Text>
                      )}
                    </View>

                    <TouchableOpacity
                      style={styles.orderNowBtn}
                      onPress={() => onSelectProduct(item)}
                      activeOpacity={0.85}
                    >
                      <Text style={styles.orderNowText}>Tùy chỉnh</Text>
                      <Ionicons name="arrow-forward" size={14} color="#FFFFFF" />
                    </TouchableOpacity>
                  </View>
                </View>
              </TouchableOpacity>
            );
          }}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9F6F0',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 12,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: '#30171F',
    letterSpacing: -0.3,
  },
  headerSubtitle: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 2,
    fontWeight: '500',
  },
  clearAllBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: '#FEE2E2',
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#FCA5A5',
  },
  clearAllText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#DC2626',
  },
  searchBarContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    marginHorizontal: 16,
    marginBottom: 8,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: '#1F2937',
    paddingVertical: 0,
  },
  brandsWrapper: {
    marginBottom: 8,
  },
  brandsList: {
    paddingHorizontal: 16,
    gap: 8,
  },
  brandChip: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  brandChipSelected: {
    backgroundColor: THEME.colors.primary,
    borderColor: THEME.colors.primary,
  },
  brandChipText: {
    fontSize: 12,
    color: '#4B5563',
    fontWeight: '600',
  },
  brandChipTextSelected: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
  listContent: {
    paddingHorizontal: 16,
    paddingBottom: 40,
    gap: 12,
  },
  favoriteCard: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#F3E8E2',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    position: 'relative',
  },
  cardImage: {
    width: 120,
    height: 135,
    backgroundColor: '#F3F4F6',
  },
  percentBadge: {
    position: 'absolute',
    top: 8,
    left: 8,
    backgroundColor: '#DC2626',
    paddingHorizontal: 6,
    paddingVertical: 3,
    borderRadius: 6,
    zIndex: 2,
  },
  percentText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  cardTrashBtn: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: 'rgba(255, 255, 255, 0.92)',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  cardDetails: {
    flex: 1,
    padding: 12,
    justifyContent: 'space-between',
  },
  brandRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  brandText: {
    fontSize: 10,
    fontWeight: '800',
    color: THEME.colors.accent,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  maleBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
    backgroundColor: '#DBEAFE',
    paddingHorizontal: 5,
    paddingVertical: 1,
    borderRadius: 4,
  },
  maleBadgeText: {
    fontSize: 9,
    color: '#1E40AF',
    fontWeight: '700',
  },
  cardName: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1F2937',
    marginTop: 2,
  },
  cardSubtitle: {
    fontSize: 11,
    color: '#6B7280',
    marginTop: 1,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 3,
  },
  ratingText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#374151',
  },
  reviewCountText: {
    fontSize: 10,
    color: '#9CA3AF',
  },
  priceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    marginTop: 4,
  },
  priceText: {
    fontSize: 14,
    fontWeight: '800',
    color: THEME.colors.primary,
  },
  originalPriceText: {
    fontSize: 10,
    color: '#9CA3AF',
    textDecorationLine: 'line-through',
  },
  orderNowBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: THEME.colors.primary,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
  },
  orderNowText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 36,
  },
  emptyIconBox: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 17,
    fontWeight: '800',
    color: '#374151',
    textAlign: 'center',
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 13,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 19,
    marginBottom: 20,
  },
  exploreBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: THEME.colors.primary,
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 12,
    shadowColor: THEME.colors.primary,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 3,
  },
  exploreBtnText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#FFFFFF',
  },
});
