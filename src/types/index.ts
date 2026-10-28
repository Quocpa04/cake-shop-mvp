export type UserRole =
  | 'GUEST'             // Khách vãng lai (Guest)
  | 'CUSTOMER'          // Khách hàng (Customer)
  | 'ADMIN'             // Chủ cửa hàng / Admin
  | 'STORE_MANAGER'     // Quản lý cửa hàng
  | 'CASHIER_SUPPORT'   // Nhân viên thu ngân / CSKH
  | 'KITCHEN'           // Thợ bánh (Bếp)
  | 'SHIPPER';          // Shipper

export type OrderStatus =
  | 'NEW'
  | 'PENDING_PAYMENT'
  | 'CONFIRMED'
  | 'QUOTING'
  | 'IN_PRODUCTION'
  | 'READY'
  | 'DELIVERING'
  | 'COMPLETED'
  | 'CANCELLED'
  | 'REFUNDED'
  | 'FAILED_DELIVERY';

export interface Allergen {
  id: string;
  name: string;
  icon: string;
}

export interface ProductVariant {
  id: string;
  size: string; // e.g. "14cm (2-4 người)", "18cm (6-8 người)", "22cm (10-12 người)"
  price: number;
  sku: string;
}

export interface ProductOption {
  id: string;
  name: string;
  price: number;
  type: 'candle' | 'card' | 'knife' | 'gift_box' | 'other';
}

export interface ProductReview {
  id: string;
  userName: string;
  userAvatar?: string;
  rating: number; // 1 to 5
  date: string;
  comment: string;
  verifiedPurchase?: boolean;
}

export interface Product {
  id: string;
  categoryId: string;
  name: string;
  subtitle: string;
  description: string;
  image: string;
  variants: ProductVariant[];
  allergens: string[];
  leadTimeHours: number;
  isCustom?: boolean;
  isBestSeller?: boolean;
  isNew?: boolean;
  rating: number;
  reviewCount: number;
  storageInstructions: string;
  // MMA301 Rubric properties:
  brand?: string;
  percentOff?: number; // e.g. 0.15 (displayed as -15%)
  originalPrice?: number;
  gender?: boolean; // true = Nữ/Unisex, false = Nam (hiển thị biểu tượng phái mạnh theo đề bài)
  reviews?: ProductReview[];
  ratingBreakdown?: {
    5: number;
    4: number;
    3: number;
    2: number;
    1: number;
  };
}

export interface Category {
  id: string;
  name: string;
  icon: string;
}

export interface CartItem {
  id: string;
  productId: string;
  productName: string;
  image: string;
  variant: ProductVariant;
  quantity: number;
  messageOnCake?: string;
  cakeTextColor?: string;
  cardMessage?: string;
  selectedOptions: ProductOption[];
  notes?: string;
}

export interface OrderItem {
  variantId: string;
  productName: string;
  size: string;
  quantity: number;
  price: number;
  messageOnCake?: string;
  cakeTextColor?: string;
  options: ProductOption[];
}

export interface Order {
  id: string;
  code: string; // BK + yyMMdd + 5 digits
  createdAt: string;
  status: OrderStatus;
  items: OrderItem[];
  subtotal: number;
  deliveryFee: number;
  discount: number;
  pointsUsed: number;
  total: number;
  branchName: string;
  receiveMethod: 'pickup' | 'delivery';
  receiveTime: string;
  isSecretGift: boolean;
  receiverName: string;
  receiverPhone: string;
  receiverAddress: string;
  paymentMethod: 'COD' | 'VNPAY_QR' | 'MOMO' | 'CARD';
  paymentStatus: 'PAID' | 'UNPAID';
  otpCode?: string;
  timelineLogs: {
    status: OrderStatus;
    title: string;
    description: string;
    time: string;
  }[];
}

export interface CustomCakeRequest {
  id: string;
  baseFlavor: string;
  filling: string;
  creamType: string;
  size: string;
  tiers: number;
  themeColor: string;
  message: string;
  notes: string;
  images: string[];
  status: 'QUOTING' | 'WAITING_DEPOSIT' | 'CONFIRMED' | 'IN_PRODUCTION' | 'COMPLETED';
  quotePrice?: number;
  depositAmount?: number;
  createdAt: string;
}

export interface SpecialOccasion {
  id: string;
  title: string;
  personName: string;
  relationship: string;
  date: string; // "DD/MM"
  remindDaysBefore: number; // 3 or 7 days
}

export interface ComplaintTicket {
  id: string;
  orderCode: string;
  issueType: 'damaged_cake' | 'wrong_text' | 'late_delivery' | 'wrong_flavor' | 'other';
  description: string;
  status: 'PENDING' | 'PROCESSING' | 'RESOLVED' | 'REFUNDED';
  photoUri?: string;
  resolutionNote?: string;
  createdAt: string;
}

export type MembershipTier = 'Đồng' | 'Bạc' | 'Vàng' | 'Kim cương';

export interface UserProfile {
  id: string;
  name: string;
  phone: string;
  email: string;
  tier: MembershipTier;
  points: number;
  totalSpent: number;
  defaultAddress: string;
  avatar: string;
}

export interface Voucher {
  id: string;
  code: string;
  title: string;
  description: string;
  discountType: 'percentage' | 'fixed' | 'free_shipping';
  value: number;
  minOrderValue: number;
  maxDiscount?: number;
  expiresAt: string;
}

export interface Branch {
  id: string;
  name: string;
  address: string;
  distanceKm: number;
  phone: string;
  openHours: string;
}
