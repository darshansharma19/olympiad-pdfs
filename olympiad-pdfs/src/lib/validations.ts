import { z } from 'zod';

// ─── Checkout / Order ─────────────────────────────────────────────

export const CreateOrderSchema = z.object({
  productId: z.string().uuid('Invalid product ID'),
  customerName: z.string().min(2, 'Name must be at least 2 characters').max(100),
  customerEmail: z.string().email('Please enter a valid email address'),
  customerMobile: z
    .string()
    .regex(/^[6-9]\d{9}$/, 'Please enter a valid 10-digit Indian mobile number'),
  couponCode: z.string().max(30).optional(),
});

export const VerifyPaymentSchema = z.object({
  razorpayOrderId: z.string().min(1),
  razorpayPaymentId: z.string().min(1),
  razorpaySignature: z.string().min(1),
  orderId: z.string().uuid(),
});

export const ValidateCouponSchema = z.object({
  code: z.string().min(1).max(30),
  productId: z.string().uuid(),
});

// ─── Admin: Product ───────────────────────────────────────────────

export const CreateProductSchema = z.object({
  name: z.string().min(3).max(200),
  slug: z
    .string()
    .regex(/^[a-z0-9-]+$/, 'Slug must be lowercase letters, numbers, and hyphens only')
    .min(3)
    .max(200),
  class: z.number().int().min(6).max(10).nullable(),
  subject: z.enum([
    'mathematics',
    'science',
    'english',
    'computer_science',
    'gk',
    'reasoning',
  ]),
  description: z.string().min(10).max(2000),
  paperCount: z.number().int().min(1),
  questionCount: z.number().int().min(1),
  price: z.number().int().min(100),        // min ₹1 in paise
  refPrice: z.number().int().min(100),
  pdfKey: z.string().min(1),
  coverImage: z.string().default(''),
  productType: z.enum(['INDIVIDUAL', 'SUBJECT_PACK', 'CLASS_BUNDLE', 'COMPLETE_BUNDLE']),
});

export const UpdateProductSchema = CreateProductSchema.partial().extend({
  status: z.enum(['ACTIVE', 'INACTIVE']).optional(),
});

// ─── Admin: Coupon ────────────────────────────────────────────────

export const CreateCouponSchema = z.object({
  code: z
    .string()
    .regex(/^[A-Z0-9_-]+$/, 'Coupon code must be uppercase letters, numbers, hyphens, underscores')
    .min(3)
    .max(30),
  type: z.enum(['PERCENTAGE', 'FIXED']),
  discount: z.number().int().min(1),
  expiresAt: z.string().datetime().optional().nullable(),
  usageLimit: z.number().int().min(1).optional().nullable(),
});

// ─── Types ────────────────────────────────────────────────────────

export type CreateOrderInput = z.infer<typeof CreateOrderSchema>;
export type VerifyPaymentInput = z.infer<typeof VerifyPaymentSchema>;
export type ValidateCouponInput = z.infer<typeof ValidateCouponSchema>;
export type CreateProductInput = z.infer<typeof CreateProductSchema>;
export type UpdateProductInput = z.infer<typeof UpdateProductSchema>;
export type CreateCouponInput = z.infer<typeof CreateCouponSchema>;
