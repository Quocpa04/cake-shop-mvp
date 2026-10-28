import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { api } from '../api';

const Context = createContext(null), SESSION_KEY = '@cake-shop/session', CART_KEY = '@cake-shop/cart';
export function AppProvider({ children }) {
  const [session, setSession] = useState(null), [cart, setCart] = useState([]), [ready, setReady] = useState(false);
  useEffect(() => { Promise.all([AsyncStorage.getItem(SESSION_KEY), AsyncStorage.getItem(CART_KEY)]).then(([savedSession, savedCart]) => { if (savedSession) setSession(JSON.parse(savedSession)); if (savedCart) setCart(JSON.parse(savedCart)); }).finally(() => setReady(true)); }, []);
  useEffect(() => { if (ready) AsyncStorage.setItem(CART_KEY, JSON.stringify(cart)); }, [cart, ready]);
  const login = async (phone, code, name) => { const result = await api('/auth/verify', { method: 'POST', body: JSON.stringify({ phone, code, name }) }); setSession(result); await AsyncStorage.setItem(SESSION_KEY, JSON.stringify(result)); };
  const logout = async () => { setSession(null); setCart([]); await AsyncStorage.multiRemove([SESSION_KEY, CART_KEY]); };
  const addToCart = (line) => setCart((items) => { const found = items.find((item) => item.key === line.key); return found ? items.map((item) => item.key === line.key ? { ...item, quantity: Math.min(10, item.quantity + line.quantity) } : item) : [...items, line]; });
  const updateQuantity = (key, quantity) => setCart((items) => quantity < 1 ? items.filter((item) => item.key !== key) : items.map((item) => item.key === key ? { ...item, quantity: Math.min(10, quantity) } : item));
  const value = useMemo(() => ({ ready, session, token: session?.token, user: session?.user, cart, login, logout, addToCart, updateQuantity, clearCart: () => setCart([]) }), [ready, session, cart]);
  return <Context.Provider value={value}>{children}</Context.Provider>;
}
export const useApp = () => useContext(Context);
