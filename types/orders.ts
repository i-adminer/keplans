/**
 * KEPLANS ORDER MANAGEMENT SYSTEM
 * Complete data structure for database implementation
 */

// ============================================================================
// ORDER STATUS & PAYMENT
// ============================================================================

export type OrderStatus = 
  | "pending"           // Order created, awaiting payment
  | "payment_pending"   // Payment initiated
  | "payment_confirmed" // Payment confirmed
  | "processing"        // Order being processed
  | "completed"         // Order fulfilled, documents sent
  | "canceled"          // Order canceled
  | "refunded";         // Payment refunded

export type PaymentStatus = 
  | "pending"
  | "processing"
  | "completed"
  | "failed"
  | "refunded";

export type PaymentMethod = 
  | "mpesa"
  | "card"
  | "bank_transfer"
  | "paypal";

export type DeliveryMethod = 
  | "email"             // Email delivery of digital files
  | "download"          // Direct download link
  | "physical";         // Physical prints (if applicable)

// ============================================================================
// ORDER STRUCTURE
// ============================================================================

export interface Order {
  // Core Order Info
  id: string;                    // Unique order ID (e.g., ORD-2045)
  orderNumber: string;           // Human-readable order number
  customerId: string;            // Reference to customer
  
  // Order Details
  items: OrderItem[];            // Array of plan items purchased
  subtotal: number;              // Total before tax/fees (KES)
  tax: number;                   // Tax amount (KES)
  fees: number;                  // Processing fees (KES)
  discount: number;              // Discount amount (KES)
  total: number;                 // Final total (KES)
  
  // Status & Tracking
  status: OrderStatus;
  paymentStatus: PaymentStatus;
  deliveryStatus: DeliveryStatus;
  
  // Payment Info
  paymentMethod: PaymentMethod;
  paymentReference: string;      // Transaction reference (M-Pesa code, etc.)
  paidAt: Date | null;
  
  // Delivery Info
  deliveryMethod: DeliveryMethod;
  deliveryEmail: string;         // Email for document delivery
  deliveredAt: Date | null;
  
  // Timestamps
  createdAt: Date;
  updatedAt: Date;
  completedAt: Date | null;
  canceledAt: Date | null;
  
  // Additional Info
  notes: string;                 // Customer notes
  adminNotes: string;            // Internal admin notes
  couponCode: string | null;     // Applied coupon code
}

// ============================================================================
// ORDER ITEMS
// ============================================================================

export interface OrderItem {
  id: string;                    // Unique item ID
  orderId: string;               // Reference to parent order
  
  // Plan Info
  planId: string;                // Reference to house plan
  planName: string;              // Plan name at time of purchase
  planNumber: string;            // Plan number (e.g., 1064-280)
  
  // Selected Options
  planType: PlanType;            // PDF, CAD, etc.
  foundationType: string | null; // Selected foundation option
  framingType: string | null;    // Selected framing option
  addOns: string[];              // Array of selected add-on IDs
  
  // Pricing
  basePrice: number;             // Base plan price (KES)
  optionsTotal: number;          // Total for options (KES)
  addOnsTotal: number;           // Total for add-ons (KES)
  itemTotal: number;             // Total for this item (KES)
  
  // Delivery
  documents: OrderDocument[];    // Documents to be delivered
  deliveryStatus: DeliveryStatus;
  
  // Timestamps
  createdAt: Date;
  updatedAt: Date;
}

export type PlanType = 
  | "pdf"                // PDF set
  | "cad"                // CAD files
  | "revit"              // Revit files
  | "reproducible"       // Reproducible set
  | "unlimited_build";   // Unlimited build license

export type DeliveryStatus = 
  | "pending"
  | "processing"
  | "sent"
  | "delivered"
  | "failed";

// ============================================================================
// ORDER DOCUMENTS (Files to be sent to customer)
// ============================================================================

export interface OrderDocument {
  id: string;
  orderItemId: string;           // Reference to order item
  
  // Document Info
  documentType: DocumentType;
  fileName: string;
  fileSize: number;              // In bytes
  fileUrl: string;               // S3/Cloud storage URL
  mimeType: string;
  
  // Status
  status: "pending" | "ready" | "sent" | "failed";
  sentAt: Date | null;
  downloadCount: number;         // Track how many times downloaded
  
  // Timestamps
  createdAt: Date;
  updatedAt: Date;
}

export type DocumentType = 
  | "pdf_set"
  | "cad_files"
  | "revit_files"
  | "sketchup_files"
  | "3d_model"
  | "material_list"
  | "electrical_plans"
  | "plumbing_plans"
  | "structural_plans"
  | "construction_notes";

// ============================================================================
// CUSTOMER STRUCTURE
// ============================================================================

export interface Customer {
  id: string;
  
  // Personal Info
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  
  // Address (optional)
  address: CustomerAddress | null;
  
  // Account Info
  passwordHash: string;          // Hashed password
  emailVerified: boolean;
  phoneVerified: boolean;
  
  // Stats
  totalOrders: number;
  totalSpent: number;            // KES
  
  // Timestamps
  createdAt: Date;
  updatedAt: Date;
  lastLoginAt: Date | null;
}

export interface CustomerAddress {
  street: string;
  city: string;
  state: string;
  country: string;
  postalCode: string;
}

// ============================================================================
// PAYMENT TRANSACTION STRUCTURE
// ============================================================================

export interface PaymentTransaction {
  id: string;
  orderId: string;               // Reference to order
  
  // Payment Details
  amount: number;                // KES
  currency: string;              // "KES"
  paymentMethod: PaymentMethod;
  
  // Provider Info (M-Pesa, Stripe, etc.)
  provider: string;              // "mpesa", "stripe", etc.
  providerTransactionId: string; // External transaction ID
  providerReference: string;     // M-Pesa code, etc.
  
  // Status
  status: PaymentStatus;
  statusMessage: string;
  
  // M-Pesa Specific
  mpesaReceiptNumber: string | null;
  mpesaPhoneNumber: string | null;
  
  // Timestamps
  initiatedAt: Date;
  completedAt: Date | null;
  failedAt: Date | null;
}

// ============================================================================
// ORDER ACTIVITY LOG (Audit Trail)
// ============================================================================

export interface OrderActivity {
  id: string;
  orderId: string;
  
  // Activity Info
  action: OrderAction;
  description: string;
  
  // Actor
  actorType: "customer" | "admin" | "system";
  actorId: string | null;        // User ID if applicable
  actorName: string;
  
  // Metadata
  metadata: Record<string, any>; // Additional data (JSON)
  
  // Timestamp
  createdAt: Date;
}

export type OrderAction = 
  | "order_created"
  | "payment_initiated"
  | "payment_completed"
  | "payment_failed"
  | "order_processing"
  | "documents_sent"
  | "order_completed"
  | "order_canceled"
  | "order_refunded"
  | "status_updated"
  | "note_added";

// ============================================================================
// EMAIL NOTIFICATIONS
// ============================================================================

export interface EmailNotification {
  id: string;
  orderId: string;
  customerId: string;
  
  // Email Info
  emailType: EmailType;
  to: string;
  subject: string;
  body: string;                  // HTML content
  
  // Status
  status: "pending" | "sent" | "failed";
  sentAt: Date | null;
  failedReason: string | null;
  
  // Tracking
  openedAt: Date | null;
  clickedAt: Date | null;
  
  // Timestamps
  createdAt: Date;
  updatedAt: Date;
}

export type EmailType = 
  | "order_confirmation"
  | "payment_confirmation"
  | "documents_ready"
  | "order_completed"
  | "order_canceled"
  | "refund_processed";

// ============================================================================
// COUPON/DISCOUNT STRUCTURE
// ============================================================================

export interface Coupon {
  id: string;
  code: string;                  // Unique coupon code
  
  // Discount Info
  discountType: "percentage" | "fixed";
  discountValue: number;         // Percentage or KES amount
  
  // Restrictions
  minOrderAmount: number | null; // Minimum order amount (KES)
  maxDiscount: number | null;    // Max discount amount (KES)
  applicablePlans: string[];     // Empty = all plans
  
  // Usage Limits
  usageLimit: number | null;     // Total uses allowed
  usageCount: number;            // Times used
  perCustomerLimit: number;      // Uses per customer
  
  // Validity
  validFrom: Date;
  validUntil: Date | null;
  active: boolean;
  
  // Timestamps
  createdAt: Date;
  updatedAt: Date;
}

// ============================================================================
// DATABASE RELATIONSHIPS
// ============================================================================

/**
 * Database Schema Relationships:
 * 
 * Customer (1) ─────< (N) Order
 * Order (1) ─────< (N) OrderItem
 * Order (1) ─────< (N) PaymentTransaction
 * Order (1) ─────< (N) OrderActivity
 * Order (1) ─────< (N) EmailNotification
 * OrderItem (1) ─────< (N) OrderDocument
 * HousePlan (1) ─────< (N) OrderItem
 * Coupon (1) ─────< (N) Order
 */

// ============================================================================
// API ENDPOINTS STRUCTURE
// ============================================================================

/**
 * Recommended API Endpoints:
 * 
 * ORDERS:
 * POST   /api/orders                    - Create new order
 * GET    /api/orders                    - List orders (admin)
 * GET    /api/orders/:id                - Get order details
 * PATCH  /api/orders/:id                - Update order
 * DELETE /api/orders/:id                - Cancel order
 * POST   /api/orders/:id/complete       - Mark order complete
 * POST   /api/orders/:id/refund         - Refund order
 * GET    /api/orders/:id/documents      - Get order documents
 * POST   /api/orders/:id/resend         - Resend documents
 * 
 * PAYMENTS:
 * POST   /api/payments/initiate         - Initiate payment
 * POST   /api/payments/callback         - Payment webhook (M-Pesa)
 * GET    /api/payments/:id/status       - Check payment status
 * 
 * CUSTOMERS:
 * GET    /api/customers/orders          - Customer's orders
 * GET    /api/customers/me              - Current customer profile
 * 
 * ADMIN:
 * GET    /api/admin/orders              - All orders with filters
 * GET    /api/admin/orders/stats        - Order statistics
 * GET    /api/admin/customers           - All customers
 */

// ============================================================================
// EXAMPLE ORDER FLOW
// ============================================================================

/**
 * 1. Customer selects plan + options → Cart
 * 2. Customer proceeds to checkout
 * 3. POST /api/orders → Create order (status: pending)
 * 4. POST /api/payments/initiate → Initiate M-Pesa payment
 * 5. Customer completes payment on phone
 * 6. M-Pesa webhook → POST /api/payments/callback
 * 7. Update order (status: payment_confirmed, processing)
 * 8. Admin processes order
 * 9. Documents uploaded to S3
 * 10. Email sent with download links
 * 11. Update order (status: completed)
 */

export {};
