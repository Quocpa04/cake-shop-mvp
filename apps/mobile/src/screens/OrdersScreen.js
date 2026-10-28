import React, { useCallback, useState } from 'react';
import { FlatList, Pressable, RefreshControl, StyleSheet, Text, View } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { api } from '../api';
import { Empty, Loading } from '../components/UI';
import { useApp } from '../context/AppContext';
import { colors, money } from '../theme';
const labels = { PENDING_PAYMENT: 'Chờ thanh toán', CONFIRMED: 'Đã nhận đơn', IN_PRODUCTION: 'Đang làm bánh', READY: 'Đã làm xong', CANCELLED: 'Đã hủy' };
export default function OrdersScreen({ navigation }) {
  const { token } = useApp(); const [orders, setOrders] = useState([]), [loading, setLoading] = useState(true), [refreshing, setRefreshing] = useState(false);
  const load = useCallback(async (refresh = false) => { try { refresh ? setRefreshing(true) : setLoading(true); const result = await api('/orders', { token }); setOrders(result.orders); } finally { setLoading(false); setRefreshing(false); } }, [token]);
  useFocusEffect(useCallback(() => { load(); }, [load]));
  if (loading) return <Loading text="Đang tải đơn hàng…" />;
  return <FlatList data={orders} keyExtractor={(item) => item.id} contentContainerStyle={s.content} refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => load(true)} />} renderItem={({ item }) => <Pressable onPress={() => navigation.navigate('OrderDetail', { orderId: item.id })} style={s.card}><View style={s.top}><Text style={s.code}>#{item.code}</Text><Text style={[s.status, { color: item.status === 'CANCELLED' ? colors.danger : colors.success }]}>{labels[item.status] || item.status}</Text></View><Text style={s.items}>{item.lines.map((line) => `${line.quantity}× ${line.productName} ${line.size}`).join('\n')}</Text><View style={s.bottom}><Text style={s.time}>{item.receiveDate} · {item.receiveTime}</Text><Text style={s.total}>{money(item.total)}</Text></View></Pressable>} ListEmptyComponent={<Empty title="Chưa có đơn hàng" message="Đơn bánh của bạn sẽ xuất hiện tại đây." />} />;
}
const s = StyleSheet.create({ content: { padding: 16, gap: 12, backgroundColor: colors.cream, flexGrow: 1 }, card: { backgroundColor: colors.surface, borderRadius: 17, padding: 15, borderWidth: 1, borderColor: colors.border }, top: { flexDirection: 'row', justifyContent: 'space-between' }, code: { color: colors.text, fontWeight: '900' }, status: { fontWeight: '900', fontSize: 12 }, items: { color: colors.muted, lineHeight: 20, marginVertical: 10 }, bottom: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }, time: { color: colors.muted, fontSize: 12 }, total: { color: colors.primary, fontWeight: '900' } });
