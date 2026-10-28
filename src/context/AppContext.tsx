import React, { createContext, useContext, useEffect, useState } from 'react';
import {
  BRANCHES,
  INITIAL_COMPLAINTS,
  INITIAL_OCCASIONS,
  INITIAL_ORDERS,
  INITIAL_USER,
  VOUCHERS,
} from '../data/mockData';
import { StorageService } from '../services/storageService';
import {
  Branch,
  CartItem,
  ComplaintTicket,
  CustomCakeRequest,
  Order,
  OrderStatus,
  SpecialOccasion,
  UserProfile,
  UserRole,
  Voucher,
} from '../types';

interface AppContextType {
  // Cart
  cart: CartItem[];
  addToCart: (item: CartItem) => void;
  removeFromCart: (id: string) => void;
  updateQuantity: (id: string, delta: number) => void;
  clearCart: () => void;
  cartCount: number;
  cartSubtotal: number;

  // Orders
  orders: Order[];
  createOrder: (orderInfo: {
    receiveMethod: 'pickup' | 'delivery';
    receiveTime: string;
    isSecretGift: boolean;
    receiverName: string;
    receiverPhone: string;
    receiverAddress: string;
    paymentMethod: 'COD' | 'VNPAY_QR' | 'MOMO' | 'CARD';
    usePoints: boolean;
  }) => Order;
  cancelOrder: (orderId: string, reason: string) => void;
  advanceOrderStatus: (orderId: string) => void;

  // Custom Cakes
  customRequests: CustomCakeRequest[];
  submitCustomCake: (data: Omit<CustomCakeRequest, 'id' | 'createdAt' | 'status'>) => void;

  // Occasions
  occasions: SpecialOccasion[];
  addOccasion: (occ: Omit<SpecialOccasion, 'id'>) => void;
  deleteOccasion: (id: string) => void;

  // Complaints
  complaints: ComplaintTicket[];
  submitComplaint: (data: Omit<ComplaintTicket, 'id' | 'status' | 'createdAt'>) => void;

  // Voucher
  appliedVoucher: Voucher | null;
  applyVoucher: (code: string) => { success: boolean; message: string };
  removeVoucher: () => void;

  // Branch
  selectedBranch: Branch;
  setSelectedBranch: (branch: Branch) => void;

  // Role switching
  currentRole: UserRole;
  setCurrentRole: (role: UserRole) => void;
  updateOrderStatus: (orderId: string, status: OrderStatus, note?: string) => void;

  // User & Points
  user: UserProfile;

  // Favorites (MMA301 Task 3 with AsyncStorage)
  favorites: string[];
  toggleFavorite: (productId: string) => void;
  isFavorite: (productId: string) => boolean;
  removeFavorite: (productId: string) => void;
  clearAllFavorites: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentRole, setCurrentRole] = useState<UserRole>('CUSTOMER');
  const [cart, setCart] = useState<CartItem[]>([]);
  const [orders, setOrders] = useState<Order[]>(INITIAL_ORDERS);
  const [customRequests, setCustomRequests] = useState<CustomCakeRequest[]>([]);
  const [occasions, setOccasions] = useState<SpecialOccasion[]>(INITIAL_OCCASIONS);
  const [complaints, setComplaints] = useState<ComplaintTicket[]>(INITIAL_COMPLAINTS);
  const [appliedVoucher, setAppliedVoucher] = useState<Voucher | null>(null);
  const [selectedBranch, setSelectedBranch] = useState<Branch>(BRANCHES[0]);
  const [user, setUser] = useState<UserProfile>(INITIAL_USER);
  const [favorites, setFavorites] = useState<string[]>(['p1', 'p2']);

  const updateOrderStatus = (orderId: string, status: OrderStatus, note?: string) => {
    setOrders((prev) =>
      prev.map((ord) => {
        if (ord.id === orderId) {
          const titles: Record<OrderStatus, string> = {
            NEW: 'Đơn mới',
            PENDING_PAYMENT: 'Chờ thanh toán',
            CONFIRMED: 'Đã xác nhận đơn',
            QUOTING: 'Chờ báo giá',
            IN_PRODUCTION: 'Bếp bắt đầu sản xuất',
            READY: 'Bánh làm xong - Sẵn sàng giao',
            DELIVERING: 'Shipper đã lấy bánh và đang giao',
            COMPLETED: 'Giao hàng thành công',
            CANCELLED: 'Đã hủy đơn hàng',
            REFUNDED: 'Đã hoàn tiền',
            FAILED_DELIVERY: 'Giao thất bại',
          };
          return {
            ...ord,
            status,
            timelineLogs: [
              ...ord.timelineLogs,
              {
                status,
                title: titles[status] || status,
                description: note || `Trạng thái cập nhật bởi ${currentRole}`,
                time: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }),
              },
            ],
          };
        }
        return ord;
      })
    );
  };

  const addToCart = (item: CartItem) => {
    setCart((prev) => {
      const existing = prev.find(
        (i) =>
          i.productId === item.productId &&
          i.variant.id === item.variant.id &&
          i.messageOnCake === item.messageOnCake
      );
      if (existing) {
        return prev.map((i) =>
          i.id === existing.id ? { ...i, quantity: i.quantity + item.quantity } : i
        );
      }
      return [...prev, item];
    });
  };

  const removeFromCart = (id: string) => {
    setCart((prev) => prev.filter((i) => i.id !== id));
  };

  const updateQuantity = (id: string, delta: number) => {
    setCart((prev) =>
      prev
        .map((item) => {
          if (item.id === id) {
            const newQty = item.quantity + delta;
            return newQty > 0 ? { ...item, quantity: newQty } : null;
          }
          return item;
        })
        .filter(Boolean) as CartItem[]
    );
  };

  const clearCart = () => {
    setCart([]);
    setAppliedVoucher(null);
  };

  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  const cartSubtotal = cart.reduce((sum, item) => {
    const optionsTotal = item.selectedOptions.reduce((oSum, opt) => oSum + opt.price, 0);
    return sum + (item.variant.price + optionsTotal) * item.quantity;
  }, 0);

  const applyVoucher = (code: string) => {
    const voucher = VOUCHERS.find((v) => v.code.toUpperCase() === code.trim().toUpperCase());
    if (!voucher) {
      return { success: false, message: 'Mã giảm giá không tồn tại hoặc đã hết hạn.' };
    }
    if (cartSubtotal < voucher.minOrderValue) {
      return {
        success: false,
        message: `Đơn hàng tối thiểu phải từ ${voucher.minOrderValue.toLocaleString('vi-VN')}đ`,
      };
    }
    setAppliedVoucher(voucher);
    return { success: true, message: `Áp dụng thành công mã: ${voucher.code}` };
  };

  const removeVoucher = () => {
    setAppliedVoucher(null);
  };

  const createOrder = (orderInfo: {
    receiveMethod: 'pickup' | 'delivery';
    receiveTime: string;
    isSecretGift: boolean;
    receiverName: string;
    receiverPhone: string;
    receiverAddress: string;
    paymentMethod: 'COD' | 'VNPAY_QR' | 'MOMO' | 'CARD';
    usePoints: boolean;
  }): Order => {
    const deliveryFee = orderInfo.receiveMethod === 'delivery' ? 30000 : 0;
    let discount = 0;
    if (appliedVoucher) {
      if (appliedVoucher.discountType === 'percentage') {
        discount = Math.min((cartSubtotal * appliedVoucher.value) / 100, appliedVoucher.maxDiscount || Infinity);
      } else if (appliedVoucher.discountType === 'fixed') {
        discount = appliedVoucher.value;
      } else if (appliedVoucher.discountType === 'free_shipping') {
        discount = Math.min(deliveryFee, appliedVoucher.value);
      }
    }

    // BR: Max 50% discount with points, 1 point = 1000 VND
    let pointsUsed = 0;
    if (orderInfo.usePoints && user.points > 0) {
      const maxPointsDiscount = (cartSubtotal + deliveryFee - discount) * 0.5;
      const pointsValue = user.points * 1000;
      const actualDeduction = Math.min(pointsValue, maxPointsDiscount);
      pointsUsed = Math.floor(actualDeduction / 1000);
      discount += pointsUsed * 1000;
      setUser((prev) => ({ ...prev, points: prev.points - pointsUsed }));
    }

    const total = Math.max(0, cartSubtotal + deliveryFee - discount);
    const dateStr = new Date().toISOString().slice(2, 10).replace(/-/g, '');
    const rand5 = Math.floor(10000 + Math.random() * 90000);
    const code = `BK${dateStr}${rand5}`;

    const newOrder: Order = {
      id: `ord_${Date.now()}`,
      code,
      createdAt: 'Vừa xong',
      status: orderInfo.paymentMethod === 'COD' ? 'CONFIRMED' : 'CONFIRMED',
      items: cart.map((c) => ({
        variantId: c.variant.id,
        productName: c.productName,
        size: c.variant.size,
        quantity: c.quantity,
        price: c.variant.price,
        messageOnCake: c.messageOnCake,
        cakeTextColor: c.cakeTextColor,
        options: c.selectedOptions,
      })),
      subtotal: cartSubtotal,
      deliveryFee,
      discount,
      pointsUsed,
      total,
      branchName: selectedBranch.name,
      receiveMethod: orderInfo.receiveMethod,
      receiveTime: orderInfo.receiveTime,
      isSecretGift: orderInfo.isSecretGift,
      receiverName: orderInfo.receiverName,
      receiverPhone: orderInfo.receiverPhone,
      receiverAddress: orderInfo.receiverAddress,
      paymentMethod: orderInfo.paymentMethod,
      paymentStatus: 'PAID',
      otpCode: `${Math.floor(1000 + Math.random() * 9000)}`,
      timelineLogs: [
        {
          status: 'NEW',
          title: 'Đơn hàng mới tạo',
          description: 'Đơn hàng đã được gửi thành công đến Miette Bakery',
          time: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }),
        },
        {
          status: 'CONFIRMED',
          title: 'Đã xác nhận đơn',
          description: 'Hệ thống đã nhận thanh toán và xếp lịch sản xuất',
          time: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }),
        },
      ],
    };

    setOrders((prev) => [newOrder, ...prev]);
    clearCart();

    // Reward 1% points for customer
    const pointsEarned = Math.floor(total * 0.01 / 1000);
    if (pointsEarned > 0) {
      setUser((prev) => ({
        ...prev,
        points: prev.points + pointsEarned,
        totalSpent: prev.totalSpent + total,
      }));
    }

    return newOrder;
  };

  const cancelOrder = (orderId: string, reason: string) => {
    setOrders((prev) =>
      prev.map((ord) => {
        if (ord.id === orderId) {
          return {
            ...ord,
            status: 'CANCELLED',
            timelineLogs: [
              ...ord.timelineLogs,
              {
                status: 'CANCELLED',
                title: 'Đã hủy đơn hàng',
                description: `Lý do: ${reason}`,
                time: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }),
              },
            ],
          };
        }
        return ord;
      })
    );
  };

  const advanceOrderStatus = (orderId: string) => {
    const statusFlow: OrderStatus[] = [
      'NEW',
      'PENDING_PAYMENT',
      'CONFIRMED',
      'IN_PRODUCTION',
      'READY',
      'DELIVERING',
      'COMPLETED',
    ];

    setOrders((prev) =>
      prev.map((ord) => {
        if (ord.id === orderId) {
          const currentIndex = statusFlow.indexOf(ord.status);
          if (currentIndex >= 0 && currentIndex < statusFlow.length - 1) {
            const nextStatus = statusFlow[currentIndex + 1];
            const descriptions: Record<OrderStatus, { title: string; desc: string }> = {
              NEW: { title: 'Mới tạo', desc: 'Đơn hàng vừa đặt' },
              PENDING_PAYMENT: { title: 'Chờ thanh toán', desc: 'Đang đợi chuyển khoản' },
              CONFIRMED: { title: 'Đã xác nhận', desc: 'Bếp đã tiếp nhận đơn' },
              QUOTING: { title: 'Chờ báo giá', desc: 'Đang xử lý báo giá bánh' },
              IN_PRODUCTION: { title: 'Bếp đang làm bánh', desc: 'Bếp trưởng đang nướng cốt và phủ kem' },
              READY: { title: 'Bánh đã sẵn sàng', desc: 'Đóng gói xong, chờ shipper lấy hàng' },
              DELIVERING: { title: 'Đang giao hàng', desc: 'Shipper đang trên đường tới bạn' },
              COMPLETED: { title: 'Giao hàng thành công', desc: 'Khách đã nhận bánh an toàn' },
              CANCELLED: { title: 'Đã hủy', desc: 'Đơn hàng bị hủy' },
              REFUNDED: { title: 'Đã hoàn tiền', desc: 'Hoàn tiền thành công' },
              FAILED_DELIVERY: { title: 'Giao thất bại', desc: 'Không liên hệ được người nhận' },
            };
            const meta = descriptions[nextStatus];
            return {
              ...ord,
              status: nextStatus,
              timelineLogs: [
                ...ord.timelineLogs,
                {
                  status: nextStatus,
                  title: meta.title,
                  description: meta.desc,
                  time: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }),
                },
              ],
            };
          }
        }
        return ord;
      })
    );
  };

  const submitCustomCake = (data: Omit<CustomCakeRequest, 'id' | 'createdAt' | 'status'>) => {
    const newReq: CustomCakeRequest = {
      ...data,
      id: `req_${Date.now()}`,
      status: 'QUOTING',
      createdAt: 'Vừa xong',
    };
    setCustomRequests((prev) => [newReq, ...prev]);
  };

  const addOccasion = (occ: Omit<SpecialOccasion, 'id'>) => {
    const newOcc: SpecialOccasion = { ...occ, id: `occ_${Date.now()}` };
    setOccasions((prev) => [newOcc, ...prev]);
  };

  const deleteOccasion = (id: string) => {
    setOccasions((prev) => prev.filter((o) => o.id !== id));
  };

  const submitComplaint = (data: Omit<ComplaintTicket, 'id' | 'status' | 'createdAt'>) => {
    const newTicket: ComplaintTicket = {
      ...data,
      id: `TK-${Date.now().toString().slice(-6)}`,
      status: 'PENDING',
      createdAt: 'Vừa xong',
    };
    setComplaints((prev) => [newTicket, ...prev]);
  };

  // Load persisted favorites, cart, orders from AsyncStorage upon app start
  useEffect(() => {
    const initStorage = async () => {
      try {
        const storedFavs = await StorageService.getFavorites();
        if (storedFavs && storedFavs.length > 0) {
          setFavorites(storedFavs);
        } else {
          // Default initial favorites
          await StorageService.saveFavorites(['p1', 'p2']);
        }
      } catch (err) {
        console.warn('Error loading favorites from AsyncStorage:', err);
      }
    };
    initStorage();
  }, []);

  const toggleFavorite = (productId: string) => {
    setFavorites((prev) => {
      const updated = prev.includes(productId)
        ? prev.filter((id) => id !== productId)
        : [...prev, productId];
      StorageService.saveFavorites(updated);
      return updated;
    });
  };

  const removeFavorite = (productId: string) => {
    setFavorites((prev) => {
      const updated = prev.filter((id) => id !== productId);
      StorageService.saveFavorites(updated);
      return updated;
    });
  };

  const clearAllFavorites = () => {
    setFavorites([]);
    StorageService.clearAllFavorites();
  };

  const isFavorite = (productId: string) => favorites.includes(productId);

  return (
    <AppContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        cartCount,
        cartSubtotal,
        orders,
        createOrder,
        cancelOrder,
        advanceOrderStatus,
        customRequests,
        submitCustomCake,
        occasions,
        addOccasion,
        deleteOccasion,
        complaints,
        submitComplaint,
        appliedVoucher,
        applyVoucher,
        removeVoucher,
        selectedBranch,
        setSelectedBranch,
        currentRole,
        setCurrentRole,
        updateOrderStatus,
        user,
        favorites,
        toggleFavorite,
        isFavorite,
        removeFavorite,
        clearAllFavorites,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
