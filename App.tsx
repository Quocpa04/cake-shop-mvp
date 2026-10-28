import { Ionicons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';
import React, { useState } from 'react';
import {
  KeyboardAvoidingView,
  LogBox,
  Platform,
  SafeAreaView,
  StatusBar as RNStatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { AppProvider, useApp } from './src/context/AppContext';

LogBox.ignoreAllLogs();
import { GeminiAiModal } from './src/components/GeminiAiModal';
import { LoginModal } from './src/components/LoginModal';
import { CartScreen } from './src/screens/CartScreen';
import { ComplaintModal } from './src/screens/ComplaintModal';
import { CustomCakeScreen } from './src/screens/CustomCakeScreen';
import { FavoritesScreen } from './src/screens/FavoritesScreen';
import { HomeScreen } from './src/screens/HomeScreen';
import { KitchenScreen } from './src/screens/KitchenScreen';
import { OccasionsModal } from './src/screens/OccasionsModal';
import { OrderDetailModal } from './src/screens/OrderDetailModal';
import { OrdersScreen } from './src/screens/OrdersScreen';
import { ProductDetailModal } from './src/screens/ProductDetailModal';
import { ProfileScreen } from './src/screens/ProfileScreen';
import { ShipperScreen } from './src/screens/ShipperScreen';
import { THEME } from './src/theme/theme';
import { Order, Product } from './src/types';

type TabKey = 'home' | 'favorites' | 'custom' | 'cart' | 'orders' | 'profile';

const MainAppContent: React.FC = () => {
  const { cartCount, orders, currentRole, favorites, addToCart } = useApp();
  const [currentTab, setCurrentTab] = useState<TabKey>('home');

  // Modals state
  const [loginModalVisible, setLoginModalVisible] = useState(false);
  const [occasionsVisible, setOccasionsVisible] = useState(false);
  const [complaintVisible, setComplaintVisible] = useState(false);
  const [complaintOrderCode, setComplaintOrderCode] = useState<string | undefined>(undefined);
  const [activeCreatedOrder, setActiveCreatedOrder] = useState<Order | null>(null);
  const [selectedDetailProduct, setSelectedDetailProduct] = useState<Product | null>(null);
  const [geminiAiVisible, setGeminiAiVisible] = useState(false);

  const activeOrdersCount = orders.filter(
    (o) => o.status !== 'COMPLETED' && o.status !== 'CANCELLED' && o.status !== 'REFUNDED'
  ).length;

  const handleOpenComplaint = (orderCode?: string) => {
    setComplaintOrderCode(orderCode);
    setComplaintVisible(true);
  };

  // 1. Thợ làm bánh (Bếp KDS) trên Mobile App
  if (currentRole === 'KITCHEN') {
    return (
      <SafeAreaView style={styles.safeArea}>
        <StatusBar style="dark" />
        <KitchenScreen onLogout={() => setLoginModalVisible(true)} />
        <LoginModal
          visible={loginModalVisible}
          onClose={() => setLoginModalVisible(false)}
        />
      </SafeAreaView>
    );
  }

  // 2. Giao hàng (Shipper) trên Mobile App
  if (currentRole === 'SHIPPER') {
    return (
      <SafeAreaView style={styles.safeArea}>
        <StatusBar style="dark" />
        <ShipperScreen onLogout={() => setLoginModalVisible(true)} />
        <LoginModal
          visible={loginModalVisible}
          onClose={() => setLoginModalVisible(false)}
        />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar style="dark" />

      <KeyboardAvoidingView
        style={styles.keyboardContainer}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        {/* Guest Banner if Browsing as Guest */}
        {currentRole === 'GUEST' && (
          <View style={styles.guestBanner}>
            <Ionicons name="cart-outline" size={14} color="#6B7280" />
            <Text style={styles.guestBannerText}>
              Khách vãng lai: Đặt nhanh không cần tài khoản
            </Text>
          </View>
        )}

        {/* Customer / Guest Main Tab Screens */}
        <View style={styles.screenContainer}>
          {currentTab === 'home' && (
            <HomeScreen
              onNavigateToCart={() => setCurrentTab('cart')}
              onNavigateToOccasions={() => setOccasionsVisible(true)}
              onNavigateToFavorites={() => setCurrentTab('favorites')}
            />
          )}

          {currentTab === 'favorites' && (
            <FavoritesScreen
              onSelectProduct={(p) => setSelectedDetailProduct(p)}
              onNavigateHome={() => setCurrentTab('home')}
            />
          )}

          {currentTab === 'custom' && <CustomCakeScreen />}

          {currentTab === 'cart' && (
            <CartScreen
              onOrderCreated={(order) => {
                setActiveCreatedOrder(order);
                setCurrentTab('orders');
              }}
              onExploreProducts={() => setCurrentTab('home')}
            />
          )}

          {currentTab === 'orders' && (
            <OrdersScreen
              onOpenComplaint={handleOpenComplaint}
              onNavigateToCart={() => setCurrentTab('cart')}
            />
          )}

          {currentTab === 'profile' && (
            <ProfileScreen
              onOpenOccasions={() => setOccasionsVisible(true)}
              onOpenComplaints={() => handleOpenComplaint()}
              onNavigateToOrders={() => setCurrentTab('orders')}
              onNavigateToFavorites={() => setCurrentTab('favorites')}
              onOpenLogin={() => setLoginModalVisible(true)}
            />
          )}

          {/* Floating AI Button */}
          <View style={styles.floatingActionsCol}>
            <TouchableOpacity
              style={styles.floatingAiBtn}
              onPress={() => setGeminiAiVisible(true)}
              activeOpacity={0.85}
            >
              <Text style={styles.floatingAiBtnText}>AI</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Global Bottom Tab Bar (MMA301 Navigation) */}
        <View style={styles.tabBar}>
          {[
            {
              key: 'home',
              label: 'Trang Chủ',
              icon: 'storefront-outline',
              activeIcon: 'storefront',
            },
            {
              key: 'custom',
              label: 'Bánh Custom',
              icon: 'color-wand-outline',
              activeIcon: 'color-wand',
            },
            {
              key: 'cart',
              label: 'Giỏ Hàng',
              icon: 'bag-handle-outline',
              activeIcon: 'bag-handle',
              badge: cartCount > 0 ? cartCount : undefined,
            },
            {
              key: 'orders',
              label: 'Đơn Hàng',
              icon: 'receipt-outline',
              activeIcon: 'receipt',
              badge: activeOrdersCount > 0 ? activeOrdersCount : undefined,
            },
            {
              key: 'profile',
              label: 'Góc Nhỏ',
              icon: 'person-outline',
              activeIcon: 'person',
            },
          ].map((tab) => {
            const isActive = currentTab === tab.key;
            return (
              <TouchableOpacity
                key={tab.key}
                style={styles.tabButton}
                onPress={() => setCurrentTab(tab.key as TabKey)}
                activeOpacity={0.7}
              >
                <View style={styles.tabIconWrapper}>
                  <Ionicons
                    name={(isActive ? tab.activeIcon : tab.icon) as any}
                    size={21}
                    color={isActive ? THEME.colors.primary : THEME.colors.textMuted}
                  />
                  {tab.badge !== undefined && (
                    <View style={styles.tabBadge}>
                      <Text style={styles.tabBadgeText}>{tab.badge}</Text>
                    </View>
                  )}
                </View>
                <Text style={[styles.tabLabel, isActive && styles.tabLabelActive]}>
                  {tab.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </KeyboardAvoidingView>

      {/* Global Modals */}
      <GeminiAiModal
        visible={geminiAiVisible}
        onClose={() => setGeminiAiVisible(false)}
        onSelectRecommendedProduct={(p) => setSelectedDetailProduct(p)}
      />

      <OccasionsModal
        visible={occasionsVisible}
        onClose={() => setOccasionsVisible(false)}
        onSelectOccasionForOrder={(_title) => {
          setCurrentTab('home');
        }}
      />

      <ComplaintModal
        visible={complaintVisible}
        preselectedOrderCode={complaintOrderCode}
        onClose={() => {
          setComplaintVisible(false);
          setComplaintOrderCode(undefined);
        }}
      />

      {activeCreatedOrder && (
        <OrderDetailModal
          visible={!!activeCreatedOrder}
          order={activeCreatedOrder}
          onClose={() => setActiveCreatedOrder(null)}
          onOpenComplaint={(code) => {
            setActiveCreatedOrder(null);
            handleOpenComplaint(code);
          }}
        />
      )}

      {selectedDetailProduct && (
        <ProductDetailModal
          visible={!!selectedDetailProduct}
          product={selectedDetailProduct}
          onClose={() => setSelectedDetailProduct(null)}
          onAddToCart={(item) => {
            addToCart(item);
            setSelectedDetailProduct(null);
          }}
        />
      )}

      <LoginModal
        visible={loginModalVisible}
        onClose={() => setLoginModalVisible(false)}
      />
    </SafeAreaView>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainAppContent />
    </AppProvider>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    paddingTop: Platform.OS === 'android' ? RNStatusBar.currentHeight || 0 : 0,
  },
  keyboardContainer: {
    flex: 1,
    backgroundColor: THEME.colors.background,
  },
  screenContainer: {
    flex: 1,
    position: 'relative',
  },
  tabBar: {
    flexDirection: 'row',
    height: 64,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#F0EBE6',
    paddingBottom: 6,
    paddingTop: 6,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
  },
  tabButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabIconWrapper: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabBadge: {
    position: 'absolute',
    top: -4,
    right: -10,
    backgroundColor: THEME.colors.primary,
    borderRadius: 10,
    minWidth: 16,
    height: 16,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 3,
  },
  tabBadgeText: {
    color: '#FFFFFF',
    fontSize: 9,
    fontWeight: '800',
  },
  tabLabel: {
    fontSize: 10,
    fontWeight: '500',
    color: THEME.colors.textMuted,
    marginTop: 2,
  },
  tabLabelActive: {
    color: THEME.colors.primary,
    fontWeight: '700',
  },
  floatingActionsCol: {
    position: 'absolute',
    bottom: 16,
    right: 16,
    flexDirection: 'column',
    gap: 8,
    alignItems: 'flex-end',
    zIndex: 999,
  },
  floatingAiBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#4338CA',
    width: 36,
    height: 36,
    borderRadius: 18,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.25,
    shadowRadius: 5,
    elevation: 5,
  },
  floatingAiBtnText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '800',
  },
  guestBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
    gap: 6,
  },
  guestBannerText: {
    fontSize: 11,
    color: '#4B5563',
    fontWeight: '500',
  },
});
