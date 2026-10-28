import React, { useState } from 'react';
import { Alert, KeyboardAvoidingView, Platform, StyleSheet, Text, View } from 'react-native';
import { api } from '../api';
import { useApp } from '../context/AppContext';
import { Button, Field } from '../components/UI';
import { colors } from '../theme';

export default function LoginScreen() {
  const { login } = useApp(); const [phone, setPhone] = useState('0912345678'), [name, setName] = useState('Khách Demo'), [code, setCode] = useState(''), [sent, setSent] = useState(false), [busy, setBusy] = useState(false);
  const requestOtp = async () => { try { setBusy(true); const result = await api('/auth/otp', { method: 'POST', body: JSON.stringify({ phone }) }); setSent(true); setCode(result.developmentOtp || ''); Alert.alert('OTP sandbox', `Mã demo: ${result.developmentOtp}`); } catch (error) { Alert.alert('Không gửi được OTP', error.message); } finally { setBusy(false); } };
  const verify = async () => { try { setBusy(true); await login(phone, code, name); } catch (error) { Alert.alert('Đăng nhập thất bại', error.message); } finally { setBusy(false); } };
  return <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={s.screen}><View style={s.logo}><Text style={s.logoText}>SC</Text></View><Text style={s.title}>Sweet Cake</Text><Text style={s.subtitle}>Một chiếc bánh, một khoảnh khắc đáng nhớ.</Text><View style={s.form}><Field label="Họ và tên" value={name} onChangeText={setName} placeholder="Tên của bạn" /><Field label="Số điện thoại" value={phone} onChangeText={setPhone} keyboardType="phone-pad" maxLength={10} />{sent && <Field label="Mã OTP" value={code} onChangeText={setCode} keyboardType="number-pad" maxLength={6} />}<Button disabled={busy} title={sent ? 'Xác nhận và đăng nhập' : 'Nhận mã OTP'} onPress={sent ? verify : requestOtp} />{sent && <Button variant="secondary" disabled={busy} title="Gửi lại mã" onPress={requestOtp} />}</View><Text style={s.hint}>Bản demo sử dụng OTP 123456. Không gửi SMS thật.</Text></KeyboardAvoidingView>;
}
const s = StyleSheet.create({ screen: { flex: 1, backgroundColor: colors.cream, padding: 24, justifyContent: 'center' }, logo: { alignSelf: 'center', width: 84, height: 84, borderRadius: 42, backgroundColor: colors.primary, alignItems: 'center', justifyContent: 'center' }, logoText: { color: '#FFF', fontWeight: '900', fontSize: 28 }, title: { color: colors.primaryDark, textAlign: 'center', fontSize: 34, fontWeight: '900', marginTop: 18 }, subtitle: { color: colors.muted, textAlign: 'center', marginTop: 7 }, form: { gap: 14, marginTop: 34 }, hint: { color: colors.muted, textAlign: 'center', fontSize: 12, marginTop: 20 } });
