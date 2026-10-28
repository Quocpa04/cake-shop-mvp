import React, { useState } from 'react';
import { Alert, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { api } from '../api';
import { Button } from '../components/UI';
import { useApp } from '../context/AppContext';
import { colors, money } from '../theme';

export default function PaymentScreen({ route, navigation }) {
  const { token, clearCart } = useApp(), { order, payment, qrPayload } = route.params, [busy, setBusy] = useState(false);
  const pay = async () => { try { setBusy(true); const result = await api(`/payments/${payment.id}/simulate-success`, { token, method: 'POST' }); clearCart(); navigation.replace('OrderDetail', { orderId: result.order.id, justPaid: true }); } catch (error) { Alert.alert('Thanh toán thất bại', error.message); } finally { setBusy(false); } };
  return <View style={s.screen}><View style={s.icon}><Ionicons name="qr-code" size={92} color={colors.primaryDark} /></View><Text style={s.title}>QR thanh toán Sandbox</Text><Text style={s.amount}>{money(order.total)}</Text><View style={s.qr}><Text style={s.qrText}>{qrPayload}</Text></View><Text style={s.note}>Đây là cổng thanh toán mô phỏng phục vụ demo. Không phát sinh giao dịch thật.</Text><Button disabled={busy} title={busy ? 'Đang xác nhận…' : 'Mô phỏng thanh toán thành công'} onPress={pay} /><Button variant="secondary" title="Thanh toán sau" onPress={() => navigation.navigate('Main', { screen: 'Orders' })} /></View>;
}
const s = StyleSheet.create({ screen: { flex: 1, backgroundColor: colors.cream, padding: 22, alignItems: 'stretch', justifyContent: 'center', gap: 14 }, icon: { alignSelf: 'center', width: 150, height: 150, backgroundColor: colors.surface, borderRadius: 22, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: colors.border }, title: { textAlign: 'center', color: colors.text, fontSize: 22, fontWeight: '900' }, amount: { textAlign: 'center', color: colors.primary, fontSize: 29, fontWeight: '900' }, qr: { backgroundColor: colors.surface, borderRadius: 13, borderWidth: 1, borderColor: colors.border, padding: 12 }, qrText: { color: colors.muted, textAlign: 'center', fontSize: 11 }, note: { color: colors.muted, textAlign: 'center', lineHeight: 20, marginBottom: 8 } });
