// ─── Enums ────────────────────────────────────────────────────────

export type ProductType = 'INDIVIDUAL' | 'SUBJECT_PACK' | 'CLASS_BUNDLE' | 'COMPLETE_BUNDLE';

export type SubjectSlug =
  | 'mathematics'
  | 'science'
  | 'english'
  | 'computer_science'
  | 'gk'
  | 'reasoning';

export type ClassNumber = 6 | 7 | 8 | 9 | 10;

export type PaymentStatus = 'PENDING' | 'PAID' | 'FAILED' | 'REFUNDED';
export type DeliveryStatus = 'PENDING' | 'SENT' | 'FAILED';
export type ProductStatus = 'ACTIVE' | 'INACTIVE';
export type CouponType = 'PERCENTAGE' | 'FIXED';

// ─── Domain Types ──────────────────────────────────────────────────

export interface Product {
  id: string;
  name: string;
  slug: string;
  class: ClassNumber | null;
  subject: SubjectSlug;
  description: string;
  paperCount: number;
  questionCount: number;
  /** Price in paise (₹99 = 9900) */
  price: number;
  /** Reference/original price in paise */
  refPrice: number;
  /** S3/R2 private object key */
  pdfKey: string;
  coverImage: string;
  productType: ProductType;
  status: ProductStatus;
  createdAt: Date;
  updatedAt: Date;
}

export interface Customer {
  id: string;
  name: string;
  email: string;
  mobile: string;
  createdAt: Date;
}

export interface Order {
  id: string;
  customerId: string;
  productId: string;
  couponId: string | null;
  /** Final amount paid in paise */
  amount: number;
  /** Discount applied in paise */
  discount: number;
  paymentStatus: PaymentStatus;
  deliveryStatus: DeliveryStatus;
  createdAt: Date;
}

export interface Payment {
  id: string;
  orderId: string;
  razorpayOrderId: string;
  razorpayPaymentId: string | null;
  razorpaySignature: string | null;
  amount: number;
  status: string;
  createdAt: Date;
}

export interface Coupon {
  id: string;
  code: string;
  type: CouponType;
  /** Percentage (0-100) or fixed amount in paise depending on type */
  discount: number;
  expiresAt: Date | null;
  usageLimit: number | null;
  usageCount: number;
  isActive: boolean;
}

export interface Download {
  id: string;
  orderId: string;
  productId: string;
  token: string;
  expiresAt: Date;
  downloadCount: number;
  maxDownloads: number;
}

// ─── API Request / Response Types ─────────────────────────────────

export interface CreateOrderRequest {
  productId: string;
  customerName: string;
  customerEmail: string;
  customerMobile: string;
  couponCode?: string;
}

export interface CreateOrderResponse {
  razorpayOrderId: string;
  amount: number;
  currency: string;
  orderId: string;
}

export interface VerifyPaymentRequest {
  razorpayOrderId: string;
  razorpayPaymentId: string;
  razorpaySignature: string;
  orderId: string;
}

export interface ValidateCouponRequest {
  code: string;
  productId: string;
}

export interface ValidateCouponResponse {
  valid: boolean;
  couponId?: string;
  discountType?: CouponType;
  discountValue?: number;
  finalPrice?: number;
  error?: string;
}

// ─── UI/Display Types ──────────────────────────────────────────────

/** Product with price pre-formatted for display */
export interface ProductDisplay extends Product {
  priceFormatted: string;
  refPriceFormatted: string;
  discountPercent: number;
}

export interface SubjectInfo {
  slug: SubjectSlug;
  label: string;
  tagline: string;
  icon: string;
}

export interface ClassInfo {
  number: ClassNumber;
  label: string;
}

// ─── API Error Type ────────────────────────────────────────────────

export interface ApiError {
  error: string;
  code?: string;
  details?: unknown;
}
