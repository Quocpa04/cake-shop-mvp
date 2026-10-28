import { Platform } from 'react-native';
const fallback = Platform.OS === 'android' ? 'http://10.0.2.2:4000/api' : 'http://localhost:4000/api';
export const API_URL = process.env.EXPO_PUBLIC_API_URL || fallback;

export async function api(path, { token, ...options } = {}) {
  const response = await fetch(`${API_URL}${path}`, { ...options, headers: { 'Content-Type': 'application/json', ...(token ? { Authorization: `Bearer ${token}` } : {}), ...options.headers } });
  const body = await response.json().catch(() => ({}));
  if (!response.ok) { const error = new Error(body.error?.message || 'Không thể kết nối máy chủ'); error.code = body.error?.code; throw error; }
  return body;
}
