import React from 'react';
import { ActivityIndicator, Pressable, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useApp } from '../context/AppContext';
import { colors } from '../theme';
import LoginScreen from '../screens/LoginScreen';
import HomeScreen from '../screens/HomeScreen';
import ProductScreen from '../screens/ProductScreen';
import CartScreen from '../screens/CartScreen';
import CheckoutScreen from '../screens/CheckoutScreen';
import PaymentScreen from '../screens/PaymentScreen';
import OrdersScreen from '../screens/OrdersScreen';
import OrderDetailScreen from '../screens/OrderDetailScreen';
import ProfileScreen from '../screens/ProfileScreen';

const Stack = createNativeStackNavigator(), Tab = createBottomTabNavigator();
function CartButton({ navigation }) { const { cart } = useApp(), count = cart.reduce((sum, item) => sum + item.quantity, 0); return <Pressable hitSlop={10} onPress={() => navigation.navigate('Cart')} style={s.cart}><Ionicons name="bag-handle-outline" size={24} color={colors.primary} />{!!count && <View style={s.badge}><Text style={s.badgeText}>{count}</Text></View>}</Pressable>; }
function Tabs() { return <Tab.Navigator screenOptions={({ route }) => ({ headerStyle: { backgroundColor: colors.surface }, headerShadowVisible: false, headerTitleStyle: { color: colors.primaryDark, fontWeight: '900' }, tabBarActiveTintColor: colors.primary, tabBarInactiveTintColor: colors.muted, tabBarStyle: { height: 64, paddingTop: 5, paddingBottom: 8 }, tabBarLabelStyle: { fontWeight: '700' }, tabBarIcon: ({ color, focused, size }) => <Ionicons name={route.name === 'Home' ? (focused ? 'home' : 'home-outline') : route.name === 'Orders' ? (focused ? 'receipt' : 'receipt-outline') : (focused ? 'person' : 'person-outline')} color={color} size={size} /> })}><Tab.Screen name="Home" component={HomeScreen} options={({ navigation }) => ({ title: 'Sweet Cake', headerRight: () => <CartButton navigation={navigation.getParent()} /> })} /><Tab.Screen name="Orders" component={OrdersScreen} options={{ title: 'Đơn của tôi' }} /><Tab.Screen name="Profile" component={ProfileScreen} options={{ title: 'Tài khoản' }} /></Tab.Navigator>; }
export default function AppNavigator() { const { ready, session } = useApp(); if (!ready) return <View style={s.loading}><ActivityIndicator size="large" color={colors.primary} /></View>; if (!session) return <Stack.Navigator screenOptions={{ headerShown: false }}><Stack.Screen name="Login" component={LoginScreen} /></Stack.Navigator>; return <Stack.Navigator screenOptions={{ headerStyle: { backgroundColor: colors.surface }, headerTintColor: colors.primary, headerShadowVisible: false, headerTitleStyle: { fontWeight: '900' } }}><Stack.Screen name="Main" component={Tabs} options={{ headerShown: false }} /><Stack.Screen name="Product" component={ProductScreen} options={{ title: 'Chi tiết bánh' }} /><Stack.Screen name="Cart" component={CartScreen} options={{ title: 'Giỏ hàng' }} /><Stack.Screen name="Checkout" component={CheckoutScreen} options={{ title: 'Chọn thời gian nhận' }} /><Stack.Screen name="Payment" component={PaymentScreen} options={{ title: 'Thanh toán', gestureEnabled: false }} /><Stack.Screen name="OrderDetail" component={OrderDetailScreen} options={{ title: 'Theo dõi đơn hàng' }} /></Stack.Navigator>; }
const s = StyleSheet.create({ loading: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.cream }, cart: { marginRight: 17 }, badge: { position: 'absolute', right: -8, top: -7, minWidth: 17, height: 17, borderRadius: 9, backgroundColor: colors.danger, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 3 }, badgeText: { color: '#FFF', fontSize: 9, fontWeight: '900' } });
