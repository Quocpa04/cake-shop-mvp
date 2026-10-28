import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useApp } from '../context/AppContext';
import { THEME } from '../theme/theme';

interface HeaderProps {
  title?: string;
  subtitle?: string;
  showBranchPicker?: boolean;
  onOpenBranchPicker?: () => void;
  onOpenCart?: () => void;
  onOpenNotifications?: () => void;
  onOpenFavorites?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  title,
  subtitle,
  showBranchPicker = true,
  onOpenBranchPicker,
  onOpenCart,
  onOpenNotifications,
  onOpenFavorites,
}) => {
  const { selectedBranch, cartCount, favorites } = useApp();

  return (
    <View style={styles.container}>
      <View style={styles.topRow}>
        {showBranchPicker ? (
          <TouchableOpacity
            style={styles.branchSelector}
            onPress={onOpenBranchPicker}
            activeOpacity={0.8}
          >
            <View style={styles.pinIconContainer}>
              <Ionicons name="location" size={16} color={THEME.colors.primary} />
            </View>
            <View style={styles.branchTextContainer}>
              <View style={styles.branchTitleRow}>
                <Text style={styles.branchName} numberOfLines={1}>
                  {selectedBranch.name}
                </Text>
                <Ionicons name="chevron-down" size={14} color={THEME.colors.textSecondary} />
              </View>
              <Text style={styles.branchAddress} numberOfLines={1}>
                {selectedBranch.address} ({selectedBranch.distanceKm} km)
              </Text>
            </View>
          </TouchableOpacity>
        ) : (
          <View style={styles.titleContainer}>
            <Text style={styles.pageTitle}>{title || 'Miette'}</Text>
            {subtitle ? <Text style={styles.pageSubtitle}>{subtitle}</Text> : null}
          </View>
        )}

        <View style={styles.actionButtons}>
          {onOpenFavorites && (
            <TouchableOpacity style={styles.iconButton} onPress={onOpenFavorites} activeOpacity={0.7}>
              <Ionicons name="heart-outline" size={22} color={THEME.colors.primary} />
              {favorites.length > 0 && (
                <View style={[styles.cartBadge, { backgroundColor: '#EF4444' }]}>
                  <Text style={styles.cartBadgeText}>{favorites.length}</Text>
                </View>
              )}
            </TouchableOpacity>
          )}

          {onOpenNotifications && (
            <TouchableOpacity
              style={styles.iconButton}
              onPress={onOpenNotifications}
              activeOpacity={0.7}
            >
              <Ionicons name="notifications-outline" size={22} color={THEME.colors.primary} />
            </TouchableOpacity>
          )}

          {onOpenCart && (
            <TouchableOpacity style={styles.iconButton} onPress={onOpenCart} activeOpacity={0.7}>
              <Ionicons name="bag-handle-outline" size={22} color={THEME.colors.primary} />
              {cartCount > 0 && (
                <View style={styles.cartBadge}>
                  <Text style={styles.cartBadgeText}>{cartCount}</Text>
                </View>
              )}
            </TouchableOpacity>
          )}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: THEME.colors.surface,
    paddingHorizontal: THEME.spacing.lg,
    paddingTop: THEME.spacing.md,
    paddingBottom: THEME.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: THEME.colors.border,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  branchSelector: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginRight: THEME.spacing.md,
  },
  pinIconContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: THEME.colors.surfaceSubtle,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: THEME.spacing.sm,
  },
  branchTextContainer: {
    flex: 1,
  },
  branchTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  branchName: {
    fontSize: 14,
    fontWeight: '700',
    color: THEME.colors.textPrimary,
  },
  branchAddress: {
    fontSize: 11,
    color: THEME.colors.textMuted,
    marginTop: 1,
  },
  titleContainer: {
    flex: 1,
  },
  pageTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: THEME.colors.textPrimary,
  },
  pageSubtitle: {
    fontSize: 12,
    color: THEME.colors.textSecondary,
    marginTop: 2,
  },
  actionButtons: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  iconButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: THEME.colors.surfaceSubtle,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  cartBadge: {
    position: 'absolute',
    top: 4,
    right: 4,
    backgroundColor: THEME.colors.secondary,
    minWidth: 18,
    height: 18,
    borderRadius: 9,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 4,
  },
  cartBadgeText: {
    color: '#FFF',
    fontSize: 10,
    fontWeight: '800',
  },
});
