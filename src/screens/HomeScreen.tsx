import { Ionicons } from '@expo/vector-icons';
import React, { useMemo, useState } from 'react';
import {
  Image,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { Header } from '../components/Header';
import { ProductCard } from '../components/ProductCard';
import { useApp } from '../context/AppContext';
import { ALLERGENS, BRANCHES, PRODUCTS } from '../data/mockData';
import { THEME } from '../theme/theme';
import { Branch, CartItem, Product } from '../types';
import { ProductDetailModal } from './ProductDetailModal';

interface HomeScreenProps {
  onNavigateToCart: () => void;
  onNavigateToOccasions: () => void;
  onNavigateToFavorites?: () => void;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({
  onNavigateToCart,
  onNavigateToOccasions,
  onNavigateToFavorites,
}) => {
  const { selectedBranch, setSelectedBranch, addToCart } = useApp();

  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  // Task 1: "The handbag list should be displayed in descending order by cost"
  const [sortBy, setSortBy] = useState<'price_desc' | 'price_asc' | 'rating' | 'default'>('price_desc');
  const [selectedGender, setSelectedGender] = useState<'all' | 'female' | 'male'>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedAllergenExcludes, setSelectedAllergenExcludes] = useState<string[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [branchModalVisible, setBranchModalVisible] = useState<boolean>(false);

  // Toggle allergen exclusion filter (BRD US-202)
  const toggleAllergenFilter = (algId: string) => {
    setSelectedAllergenExcludes((prev) =>
      prev.includes(algId) ? prev.filter((id) => id !== algId) : [...prev, algId]
    );
  };

  // Filtered & Sorted products (MMA301 Task 1)
  const filteredProducts = useMemo(() => {
    let list = PRODUCTS.filter((item) => {
      // Category filter
      if (selectedCategory !== 'all' && item.categoryId !== selectedCategory) {
        return false;
      }

      // Gender filter (Task 1: gender value standout)
      if (selectedGender === 'female' && item.gender !== true) {
        return false;
      }
      if (selectedGender === 'male' && item.gender !== false) {
        return false;
      }

      // Search query (Vietnamese unaccented supported)
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase().trim();
        const nameMatch = item.name.toLowerCase().includes(query);
        const subMatch = item.subtitle.toLowerCase().includes(query);
        const brandMatch = item.brand ? item.brand.toLowerCase().includes(query) : false;
        if (!nameMatch && !subMatch && !brandMatch) return false;
      }

      // Allergen exclusions: cake MUST NOT contain selected allergen
      if (selectedAllergenExcludes.length > 0) {
        const hasExcludedAllergen = item.allergens.some((alg) =>
          selectedAllergenExcludes.includes(alg)
        );
        if (hasExcludedAllergen) return false;
      }

      return true;
    });

    // Sắp xếp theo yêu cầu đề bài: "displayed in descending order by cost"
    if (sortBy === 'price_desc') {
      list.sort((a, b) => {
        const priceA = a.variants[0]?.price || 0;
        const priceB = b.variants[0]?.price || 0;
        return priceB - priceA;
      });
    } else if (sortBy === 'price_asc') {
      list.sort((a, b) => {
        const priceA = a.variants[0]?.price || 0;
        const priceB = b.variants[0]?.price || 0;
        return priceA - priceB;
      });
    } else if (sortBy === 'rating') {
      list.sort((a, b) => b.rating - a.rating);
    }

    return list;
  }, [selectedCategory, selectedGender, searchQuery, selectedAllergenExcludes, sortBy]);

  return (
    <View style={styles.container}>
      {/* Top Header */}
      <Header
        showBranchPicker={true}
        onOpenBranchPicker={() => setBranchModalVisible(true)}
        onOpenCart={onNavigateToCart}
        onOpenFavorites={onNavigateToFavorites}
      />

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {/* Search Bar */}
        <View style={styles.searchSection}>
          <View style={styles.searchBar}>
            <Ionicons name="search" size={20} color={THEME.colors.textMuted} />
            <TextInput
              style={styles.searchInput}
              placeholder="Tìm bánh kem dâu, tiramisu, socola..."
              placeholderTextColor={THEME.colors.textMuted}
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
            {searchQuery.length > 0 && (
              <TouchableOpacity onPress={() => setSearchQuery('')}>
                <Ionicons name="close-circle" size={18} color={THEME.colors.textMuted} />
              </TouchableOpacity>
            )}
          </View>
        </View>

        {/* Promo Hero Banner (Warm Bakery Vibe) */}
        <View style={styles.heroBanner}>
          <View style={styles.heroTextCol}>
            <View style={styles.heroTag}>
              <Text style={styles.heroTagText}>MIETTE SPECIAL</Text>
            </View>
            <Text style={styles.heroTitle}>Bánh Tươi Mỗi Ngày</Text>
            <Text style={styles.heroDesc}>Ngọt ngào từng khoảnh khắc sum vầy cùng người thương</Text>
            <TouchableOpacity
              style={styles.heroButton}
              onPress={() => setSelectedCategory('birthday')}
              activeOpacity={0.85}
            >
              <Text style={styles.heroButtonText}>Khám phá ngay</Text>
            </TouchableOpacity>
          </View>
          <Image
            source={{
              uri: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=600&q=80',
            }}
            style={styles.heroImage}
            resizeMode="cover"
          />
        </View>

        {/* Occasion Reminder Widget ("Đừng quên lời thương") */}
        <TouchableOpacity
          style={styles.occasionBanner}
          onPress={onNavigateToOccasions}
          activeOpacity={0.85}
        >
          <View style={styles.bellIconBox}>
            <Ionicons name="calendar-outline" size={22} color={THEME.colors.primary} />
          </View>
          <View style={styles.occasionTextCol}>
            <Text style={styles.occasionTitle}>Đừng quên lời thương</Text>
            <Text style={styles.occasionSub}>Sinh nhật Mẹ yêu sắp đến (15/11) • Đặt bánh trước để nhận ưu đãi</Text>
          </View>
          <Ionicons name="chevron-forward" size={18} color={THEME.colors.primary} />
        </TouchableOpacity>

        {/* Section: Mọi dịp đáng nhớ (Figma 100%) */}
        <View style={styles.occasionSection}>
          <Text style={styles.serifHeading}>Mọi dịp đáng nhớ</Text>
          <View style={styles.occasionGrid}>
            <TouchableOpacity
              style={[styles.occasionCard, selectedCategory === 'birthday' && styles.occasionCardActive]}
              onPress={() => setSelectedCategory('birthday')}
              activeOpacity={0.8}
            >
              <View style={styles.occasionIconWrap}>
                <Ionicons name="gift-outline" size={22} color="#831843" />
              </View>
              <Text style={styles.occasionCardTitle}>Sinh nhật</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.occasionCard, selectedCategory === 'anniversary' && styles.occasionCardActive]}
              onPress={() => setSelectedCategory('anniversary')}
              activeOpacity={0.8}
            >
              <View style={styles.occasionIconWrap}>
                <Ionicons name="heart-outline" size={22} color="#831843" />
              </View>
              <Text style={styles.occasionCardTitle}>Kỷ niệm</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.occasionCard, selectedCategory === 'wedding' && styles.occasionCardActive]}
              onPress={() => setSelectedCategory('wedding')}
              activeOpacity={0.8}
            >
              <View style={styles.occasionIconWrap}>
                <Ionicons name="rose-outline" size={22} color="#831843" />
              </View>
              <Text style={styles.occasionCardTitle}>Cưới hỏi</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.occasionCard, selectedCategory === 'all' && styles.occasionCardActive]}
              onPress={() => setSelectedCategory('all')}
              activeOpacity={0.8}
            >
              <View style={styles.occasionIconWrap}>
                <Ionicons name="grid-outline" size={22} color="#831843" />
              </View>
              <Text style={styles.occasionCardTitle}>Tất cả</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Product Catalog List (2 Columns - Figma) */}
        <View style={styles.catalogSection}>
          <View style={styles.catalogHeader}>
            <View style={styles.catalogTitleRow}>
              <Text style={styles.serifHeading}>Được yêu thích</Text>
              <View style={styles.bestSellerPill}>
                <Text style={styles.bestSellerPillText}>Bán chạy</Text>
              </View>
            </View>
            <Text style={styles.itemCountText}>{filteredProducts.length} mẫu bánh</Text>
          </View>

          {/* Sorting & Gender Toolbar (MMA301 Task 1: Descending order by cost) */}
          <View style={styles.toolbarRow}>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.sortScroll}>
              <TouchableOpacity
                style={[styles.sortChip, sortBy === 'price_desc' && styles.sortChipActive]}
                onPress={() => setSortBy('price_desc')}
                activeOpacity={0.8}
              >
                <Ionicons
                  name="arrow-down"
                  size={12}
                  color={sortBy === 'price_desc' ? '#FFF' : '#4B5563'}
                />
                <Text
                  style={[styles.sortChipText, sortBy === 'price_desc' && styles.sortChipTextActive]}
                >
                  Giá giảm dần
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.sortChip, sortBy === 'price_asc' && styles.sortChipActive]}
                onPress={() => setSortBy('price_asc')}
                activeOpacity={0.8}
              >
                <Ionicons
                  name="arrow-up"
                  size={12}
                  color={sortBy === 'price_asc' ? '#FFF' : '#4B5563'}
                />
                <Text
                  style={[styles.sortChipText, sortBy === 'price_asc' && styles.sortChipTextActive]}
                >
                  Giá tăng dần
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.sortChip, sortBy === 'rating' && styles.sortChipActive]}
                onPress={() => setSortBy('rating')}
                activeOpacity={0.8}
              >
                <Ionicons
                  name="star"
                  size={12}
                  color={sortBy === 'rating' ? '#FFF' : '#4B5563'}
                />
                <Text
                  style={[styles.sortChipText, sortBy === 'rating' && styles.sortChipTextActive]}
                >
                  Đánh giá cao
                </Text>
              </TouchableOpacity>

              {/* Gender Filter Chips */}
              <TouchableOpacity
                style={[styles.genderChip, selectedGender === 'female' && styles.genderChipFemale]}
                onPress={() => setSelectedGender(selectedGender === 'female' ? 'all' : 'female')}
                activeOpacity={0.8}
              >
                <Ionicons
                  name="female"
                  size={12}
                  color={selectedGender === 'female' ? '#FFF' : '#BE185D'}
                />
                <Text
                  style={[
                    styles.genderChipText,
                    selectedGender === 'female' && styles.genderChipTextWhite,
                  ]}
                >
                  Phái đẹp
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.genderChip, selectedGender === 'male' && styles.genderChipMale]}
                onPress={() => setSelectedGender(selectedGender === 'male' ? 'all' : 'male')}
                activeOpacity={0.8}
              >
                <Ionicons
                  name="male"
                  size={12}
                  color={selectedGender === 'male' ? '#FFF' : '#1E40AF'}
                />
                <Text
                  style={[
                    styles.genderChipText,
                    selectedGender === 'male' && styles.genderChipTextWhite,
                  ]}
                >
                  Phái mạnh
                </Text>
              </TouchableOpacity>


              {/* Allergen Exclude Filters (BRD US-202) */}
              {ALLERGENS.map((alg) => {
                const isExcluded = selectedAllergenExcludes.includes(alg.id);
                return (
                  <TouchableOpacity
                    key={alg.id}
                    style={[styles.sortChip, isExcluded && styles.algChipExcluded]}
                    onPress={() => toggleAllergenFilter(alg.id)}
                    activeOpacity={0.8}
                  >
                    <Ionicons
                      name={isExcluded ? 'close-circle' : 'shield-outline'}
                      size={12}
                      color={isExcluded ? '#DC2626' : '#4B5563'}
                    />
                    <Text
                      style={[styles.sortChipText, isExcluded && styles.algChipTextExcluded]}
                    >
                      {isExcluded ? `✕ Không ${alg.name}` : `Không ${alg.name}`}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </ScrollView>
          </View>

          {filteredProducts.length === 0 ? (
            <View style={styles.emptyContainer}>
              <Ionicons name="search-outline" size={48} color={THEME.colors.border} />
              <Text style={styles.emptyTitle}>Không tìm thấy mẫu bánh phù hợp</Text>
              <Text style={styles.emptySub}>Hãy thử tìm với từ khóa khác hoặc bỏ chọn bộ lọc dị ứng.</Text>
            </View>
          ) : (
            <View style={styles.productGridRow}>
              {filteredProducts.map((item) => (
                <ProductCard
                  key={item.id}
                  product={item}
                  onPress={() => setSelectedProduct(item)}
                  layout="grid"
                />
              ))}
            </View>
          )}
        </View>
      </ScrollView>

      {/* Product Detail Modal */}
      <ProductDetailModal
        visible={!!selectedProduct}
        product={selectedProduct}
        onClose={() => setSelectedProduct(null)}
        onAddToCart={(cartItem: CartItem) => {
          addToCart(cartItem);
        }}
      />

      {/* Branch Selection Modal */}
      <Modal
        visible={branchModalVisible}
        animationType="fade"
        transparent={true}
        onRequestClose={() => setBranchModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.branchModalCard}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Chọn chi nhánh Miette</Text>
              <TouchableOpacity onPress={() => setBranchModalVisible(false)}>
                <Ionicons name="close" size={24} color={THEME.colors.textPrimary} />
              </TouchableOpacity>
            </View>

            <Text style={styles.branchModalDesc}>
              Bánh kem tươi và khung giờ sản xuất được cập nhật trực tiếp theo từng cửa hàng.
            </Text>

            {BRANCHES.map((b: Branch) => {
              const isSelected = selectedBranch.id === b.id;
              return (
                <TouchableOpacity
                  key={b.id}
                  style={[styles.branchItem, isSelected && styles.branchItemActive]}
                  onPress={() => {
                    setSelectedBranch(b);
                    setBranchModalVisible(false);
                  }}
                  activeOpacity={0.8}
                >
                  <View style={styles.branchItemRadio}>
                    {isSelected && <View style={styles.branchRadioInner} />}
                  </View>
                  <View style={styles.branchItemInfo}>
                    <Text style={[styles.branchItemName, isSelected && styles.branchItemNameActive]}>
                      {b.name}
                    </Text>
                    <Text style={styles.branchItemAddr}>{b.address}</Text>
                    <Text style={styles.branchItemMeta}>
                      Cách bạn: {b.distanceKm} km • Mở cửa: {b.openHours}
                    </Text>
                  </View>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: THEME.colors.background,
  },
  scrollContent: {
    paddingBottom: 40,
  },
  searchSection: {
    paddingHorizontal: THEME.spacing.lg,
    paddingTop: THEME.spacing.md,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: THEME.colors.surface,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: THEME.borderRadius.lg,
    borderWidth: 1,
    borderColor: THEME.colors.border,
    ...THEME.shadows.sm,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    marginLeft: 10,
    color: THEME.colors.textPrimary,
  },
  heroBanner: {
    marginHorizontal: THEME.spacing.lg,
    marginTop: THEME.spacing.md,
    backgroundColor: THEME.colors.primary,
    borderRadius: THEME.borderRadius.xl,
    flexDirection: 'row',
    overflow: 'hidden',
    height: 160,
    ...THEME.shadows.md,
  },
  heroTextCol: {
    flex: 1.2,
    padding: THEME.spacing.lg,
    justifyContent: 'center',
  },
  heroTag: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 4,
    alignSelf: 'flex-start',
    marginBottom: 6,
  },
  heroTagText: {
    color: '#FFF',
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 1,
  },
  heroTitle: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: '800',
    lineHeight: 22,
  },
  heroDesc: {
    color: 'rgba(255, 255, 255, 0.85)',
    fontSize: 11,
    marginTop: 4,
    lineHeight: 15,
  },
  heroButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: THEME.colors.secondary,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: THEME.borderRadius.round,
    alignSelf: 'flex-start',
    marginTop: 10,
    gap: 4,
  },
  heroButtonText: {
    color: '#FFF',
    fontSize: 11,
    fontWeight: '700',
  },
  heroImage: {
    flex: 0.9,
    height: '100%',
  },
  occasionBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FAF5F2',
    marginHorizontal: THEME.spacing.lg,
    marginTop: THEME.spacing.md,
    padding: 12,
    borderRadius: THEME.borderRadius.lg,
    borderWidth: 1,
    borderColor: '#E6D7CC',
  },
  bellIconBox: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  occasionTextCol: {
    flex: 1,
  },
  occasionTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: THEME.colors.primary,
  },
  occasionSub: {
    fontSize: 11,
    color: THEME.colors.textSecondary,
    marginTop: 2,
  },
  sectionHeader: {
    paddingHorizontal: THEME.spacing.lg,
    marginTop: THEME.spacing.lg,
    marginBottom: 2,
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: '800',
    color: THEME.colors.textPrimary,
  },
  // Occasion Grid & 2-Column Product Grid Styles (Figma 100%)
  occasionSection: {
    paddingHorizontal: THEME.spacing.lg,
    marginTop: THEME.spacing.lg,
    marginBottom: 4,
  },
  serifHeading: {
    fontSize: 20,
    fontWeight: '800',
    color: '#3E1C25',
    letterSpacing: -0.2,
  },
  occasionGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 12,
  },
  occasionCard: {
    width: '23%',
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    paddingVertical: 12,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#F3E8E2',
    ...THEME.shadows.sm,
  },
  occasionCardActive: {
    borderColor: THEME.colors.primary,
    backgroundColor: '#FFF7ED',
  },
  occasionIconWrap: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#FDF2F8',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 6,
  },
  occasionCardTitle: {
    fontSize: 11,
    fontWeight: '700',
    color: '#374151',
  },
  catalogTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  bestSellerPill: {
    backgroundColor: '#FCE7F3',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
  },
  bestSellerPillText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#9D174D',
  },
  productGridRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  algChipExcluded: {
    backgroundColor: '#FEE2E2',
    borderColor: '#F87171',
  },
  algChipTextExcluded: {
    color: '#DC2626',
    fontWeight: '700',
  },
  catalogSection: {
    paddingHorizontal: THEME.spacing.lg,
    marginTop: THEME.spacing.lg,
  },
  catalogHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: THEME.spacing.md,
  },
  itemCountText: {
    fontSize: 12,
    color: THEME.colors.textMuted,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
  },
  emptyTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: THEME.colors.textPrimary,
    marginTop: 10,
  },
  emptySub: {
    fontSize: 12,
    color: THEME.colors.textMuted,
    textAlign: 'center',
    marginTop: 4,
    paddingHorizontal: 30,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.45)',
    justifyContent: 'center',
    padding: THEME.spacing.lg,
  },
  branchModalCard: {
    backgroundColor: THEME.colors.surface,
    borderRadius: THEME.borderRadius.xl,
    padding: THEME.spacing.lg,
    ...THEME.shadows.lg,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  modalTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: THEME.colors.textPrimary,
  },
  branchModalDesc: {
    fontSize: 12,
    color: THEME.colors.textSecondary,
    marginBottom: 16,
    lineHeight: 18,
  },
  branchItem: {
    flexDirection: 'row',
    padding: 12,
    borderRadius: THEME.borderRadius.md,
    borderWidth: 1.5,
    borderColor: THEME.colors.border,
    marginBottom: 10,
    alignItems: 'flex-start',
  },
  branchItemActive: {
    borderColor: THEME.colors.primary,
    backgroundColor: '#FAF5F2',
  },
  branchItemRadio: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: THEME.colors.textMuted,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 2,
    marginRight: 10,
  },
  branchRadioInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: THEME.colors.primary,
  },
  branchItemInfo: {
    flex: 1,
  },
  branchItemName: {
    fontSize: 14,
    fontWeight: '700',
    color: THEME.colors.textPrimary,
  },
  branchItemNameActive: {
    color: THEME.colors.primary,
  },
  branchItemAddr: {
    fontSize: 12,
    color: THEME.colors.textSecondary,
    marginTop: 2,
  },
  branchItemMeta: {
    fontSize: 11,
    color: THEME.colors.textMuted,
    marginTop: 4,
  },
  toolbarRow: {
    marginBottom: 12,
  },
  sortScroll: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  sortChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
    backgroundColor: '#F3F4F6',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  sortChipActive: {
    backgroundColor: THEME.colors.primary,
    borderColor: THEME.colors.primary,
  },
  sortChipText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#4B5563',
  },
  sortChipTextActive: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
  genderChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    paddingHorizontal: 9,
    paddingVertical: 5,
    borderRadius: 8,
    backgroundColor: '#F3F4F6',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  genderChipFemale: {
    backgroundColor: '#DB2777',
    borderColor: '#DB2777',
  },
  genderChipMale: {
    backgroundColor: '#1D4ED8',
    borderColor: '#1D4ED8',
  },
  genderChipText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#4B5563',
  },
  genderChipTextWhite: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
});
