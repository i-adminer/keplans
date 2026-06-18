import { pgTable, text, varchar, integer, boolean, timestamp, decimal, jsonb, pgEnum } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

// ============================================================================
// ENUMS
// ============================================================================

export const userRoleEnum = pgEnum("user_role", ["customer", "admin"]);
export const orderStatusEnum = pgEnum("order_status", ["pending", "payment_pending", "payment_confirmed", "processing", "completed", "canceled", "refunded"]);
export const paymentStatusEnum = pgEnum("payment_status", ["pending", "processing", "completed", "failed", "refunded"]);
export const paymentMethodEnum = pgEnum("payment_method", ["mpesa", "card", "bank_transfer", "paypal"]);
export const deliveryStatusEnum = pgEnum("delivery_status", ["pending", "processing", "sent", "delivered", "failed"]);
export const documentStatusEnum = pgEnum("document_status", ["pending", "ready", "sent", "failed"]);

// ============================================================================
// USERS & AUTH
// ============================================================================

export const users = pgTable("users", {
  id: varchar("id", { length: 21 }).primaryKey(), // nanoid
  email: varchar("email", { length: 255 }).notNull().unique(),
  passwordHash: text("password_hash").notNull(),
  role: userRoleEnum("role").default("customer").notNull(),
  
  // Profile
  firstName: varchar("first_name", { length: 100 }).notNull(),
  lastName: varchar("last_name", { length: 100 }).notNull(),
  phone: varchar("phone", { length: 20 }),
  
  // Address (optional for customers)
  addressStreet: varchar("address_street", { length: 255 }),
  addressCity: varchar("address_city", { length: 100 }),
  addressState: varchar("address_state", { length: 100 }),
  addressCountry: varchar("address_country", { length: 100 }).default("Kenya"),
  addressPostalCode: varchar("address_postal_code", { length: 20 }),
  
  // Verification
  emailVerified: boolean("email_verified").default(false).notNull(),
  emailVerificationToken: varchar("email_verification_token", { length: 100 }),
  emailVerificationExpires: timestamp("email_verification_expires"),
  
  phoneVerified: boolean("phone_verified").default(false).notNull(),
  
  // Password Reset
  resetPasswordToken: varchar("reset_password_token", { length: 100 }),
  resetPasswordExpires: timestamp("reset_password_expires"),
  
  // Stats
  totalOrders: integer("total_orders").default(0).notNull(),
  totalSpent: decimal("total_spent", { precision: 10, scale: 2 }).default("0").notNull(),
  
  // Timestamps
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
  lastLoginAt: timestamp("last_login_at"),
});

// OTP for admin password changes and critical actions
export const otpCodes = pgTable("otp_codes", {
  id: varchar("id", { length: 21 }).primaryKey(),
  userId: varchar("user_id", { length: 21 }).notNull().references(() => users.id, { onDelete: "cascade" }),
  code: varchar("code", { length: 6 }).notNull(),
  purpose: varchar("purpose", { length: 50 }).notNull(), // "password_change", "email_verification"
  expiresAt: timestamp("expires_at").notNull(),
  used: boolean("used").default(false).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// ============================================================================
// HOUSE PLANS
// ============================================================================

export const housePlans = pgTable("house_plans", {
  id: varchar("id", { length: 21 }).primaryKey(),
  planNumber: varchar("plan_number", { length: 50 }).notNull().unique(),
  name: varchar("name", { length: 255 }).notNull(),
  slug: varchar("slug", { length: 255 }).notNull().unique(),
  
  // Basic Info
  style: varchar("style", { length: 100 }).notNull(),
  summary: text("summary").notNull(),
  description: text("description").notNull(),
  
  // Specifications
  bedrooms: integer("bedrooms").notNull(),
  baths: decimal("baths", { precision: 3, scale: 1 }).notNull(),
  floors: integer("floors").notNull(),
  garages: integer("garages").default(0).notNull(),
  sqft: integer("sqft").notNull(),
  
  // Dimensions
  width: varchar("width", { length: 50 }),
  depth: varchar("depth", { length: 50 }),
  height: varchar("height", { length: 50 }),
  mainFloorArea: integer("main_floor_area"),
  basementArea: integer("basement_area"),
  porchArea: integer("porch_area"),
  
  // Pricing
  basePrice: decimal("base_price", { precision: 10, scale: 2 }).notNull(),
  pdfPrice: decimal("pdf_price", { precision: 10, scale: 2 }),
  cadPrice: decimal("cad_price", { precision: 10, scale: 2 }),
  unlimitedBuildPrice: decimal("unlimited_build_price", { precision: 10, scale: 2 }),
  
  // Rich Content (HTML from Tiptap)
  fullSpecsAndFeatures: text("full_specs_and_features"),
  includedItemsHTML: text("included_items_html"),
  
  // Categories & Tags
  badge: varchar("badge", { length: 100 }),
  featured: boolean("featured").default(false).notNull(),
  trending: boolean("trending").default(false).notNull(),
  topRated: boolean("top_rated").default(false).notNull(),
  familyPick: boolean("family_pick").default(false).notNull(),
  
  // Status
  published: boolean("published").default(false).notNull(),
  
  // Stats
  views: integer("views").default(0).notNull(),
  orders: integer("orders").default(0).notNull(),
  rating: decimal("rating", { precision: 3, scale: 2 }).default("0").notNull(),
  reviewCount: integer("review_count").default(0).notNull(),
  
  // Timestamps
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Plan Images
export const planImages = pgTable("plan_images", {
  id: varchar("id", { length: 21 }).primaryKey(),
  planId: varchar("plan_id", { length: 21 }).notNull().references(() => housePlans.id, { onDelete: "cascade" }),
  cloudinaryPublicId: varchar("cloudinary_public_id", { length: 255 }).notNull(),
  cloudinaryUrl: varchar("cloudinary_url", { length: 500 }).notNull(),
  category: varchar("category", { length: 50 }).notNull(), // "exterior", "interior", "floor", "3d"
  caption: varchar("caption", { length: 255 }),
  sortOrder: integer("sort_order").default(0).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Plan Documents (for delivery after purchase)
export const planDocuments = pgTable("plan_documents", {
  id: varchar("id", { length: 21 }).primaryKey(),
  planId: varchar("plan_id", { length: 21 }).notNull().references(() => housePlans.id, { onDelete: "cascade" }),
  documentType: varchar("document_type", { length: 50 }).notNull(), // "pdf", "cad", "revit", etc.
  fileName: varchar("file_name", { length: 255 }).notNull(),
  cloudinaryPublicId: varchar("cloudinary_public_id", { length: 255 }).notNull(),
  cloudinaryUrl: varchar("cloudinary_url", { length: 500 }).notNull(),
  fileSize: integer("file_size").notNull(), // bytes
  mimeType: varchar("mime_type", { length: 100 }).notNull(),
  description: text("description"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Plan Options (foundation, framing, add-ons)
export const planOptions = pgTable("plan_options", {
  id: varchar("id", { length: 21 }).primaryKey(),
  planId: varchar("plan_id", { length: 21 }).notNull().references(() => housePlans.id, { onDelete: "cascade" }),
  optionType: varchar("option_type", { length: 50 }).notNull(), // "foundation", "framing", "addon"
  label: varchar("label", { length: 255 }).notNull(),
  price: decimal("price", { precision: 10, scale: 2 }).notNull(),
  description: text("description"),
  sortOrder: integer("sort_order").default(0).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// FAQs
export const planFaqs = pgTable("plan_faqs", {
  id: varchar("id", { length: 21 }).primaryKey(),
  planId: varchar("plan_id", { length: 21 }).notNull().references(() => housePlans.id, { onDelete: "cascade" }),
  question: varchar("question", { length: 500 }).notNull(),
  answer: text("answer").notNull(),
  sortOrder: integer("sort_order").default(0).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// ============================================================================
// CART & WISHLIST
// ============================================================================

export const cartItems = pgTable("cart_items", {
  id: varchar("id", { length: 21 }).primaryKey(),
  userId: varchar("user_id", { length: 21 }).notNull().references(() => users.id, { onDelete: "cascade" }),
  planId: varchar("plan_id", { length: 21 }).notNull().references(() => housePlans.id, { onDelete: "cascade" }),
  
  // Selected options
  planType: varchar("plan_type", { length: 50 }).notNull(), // "pdf", "cad", etc.
  selectedOptions: jsonb("selected_options").notNull(), // { foundation: "slab", framing: "wood", addOns: ["material-list"] }
  
  // Calculated price
  totalPrice: decimal("total_price", { precision: 10, scale: 2 }).notNull(),
  
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const wishlistItems = pgTable("wishlist_items", {
  id: varchar("id", { length: 21 }).primaryKey(),
  userId: varchar("user_id", { length: 21 }).notNull().references(() => users.id, { onDelete: "cascade" }),
  planId: varchar("plan_id", { length: 21 }).notNull().references(() => housePlans.id, { onDelete: "cascade" }),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// ============================================================================
// ORDERS
// ============================================================================

export const orders = pgTable("orders", {
  id: varchar("id", { length: 21 }).primaryKey(),
  orderNumber: varchar("order_number", { length: 50 }).notNull().unique(),
  customerId: varchar("customer_id", { length: 21 }).notNull().references(() => users.id),
  
  // Pricing
  subtotal: decimal("subtotal", { precision: 10, scale: 2 }).notNull(),
  tax: decimal("tax", { precision: 10, scale: 2 }).default("0").notNull(),
  fees: decimal("fees", { precision: 10, scale: 2 }).default("0").notNull(),
  discount: decimal("discount", { precision: 10, scale: 2 }).default("0").notNull(),
  total: decimal("total", { precision: 10, scale: 2 }).notNull(),
  
  // Status
  status: orderStatusEnum("status").default("pending").notNull(),
  paymentStatus: paymentStatusEnum("payment_status").default("pending").notNull(),
  deliveryStatus: deliveryStatusEnum("delivery_status").default("pending").notNull(),
  
  // Payment
  paymentMethod: paymentMethodEnum("payment_method"),
  paymentReference: varchar("payment_reference", { length: 255 }),
  
  // Delivery
  deliveryEmail: varchar("delivery_email", { length: 255 }).notNull(),
  
  // Notes
  customerNotes: text("customer_notes"),
  adminNotes: text("admin_notes"),
  
  // Coupon
  couponCode: varchar("coupon_code", { length: 50 }),
  
  // Timestamps
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
  paidAt: timestamp("paid_at"),
  deliveredAt: timestamp("delivered_at"),
  completedAt: timestamp("completed_at"),
  canceledAt: timestamp("canceled_at"),
});

export const orderItems = pgTable("order_items", {
  id: varchar("id", { length: 21 }).primaryKey(),
  orderId: varchar("order_id", { length: 21 }).notNull().references(() => orders.id, { onDelete: "cascade" }),
  planId: varchar("plan_id", { length: 21 }).notNull().references(() => housePlans.id),
  
  // Plan snapshot (in case plan changes later)
  planName: varchar("plan_name", { length: 255 }).notNull(),
  planNumber: varchar("plan_number", { length: 50 }).notNull(),
  
  // Selected options
  planType: varchar("plan_type", { length: 50 }).notNull(),
  selectedOptions: jsonb("selected_options").notNull(),
  
  // Pricing
  basePrice: decimal("base_price", { precision: 10, scale: 2 }).notNull(),
  optionsTotal: decimal("options_total", { precision: 10, scale: 2 }).default("0").notNull(),
  addOnsTotal: decimal("add_ons_total", { precision: 10, scale: 2 }).default("0").notNull(),
  itemTotal: decimal("item_total", { precision: 10, scale: 2 }).notNull(),
  
  // Delivery
  deliveryStatus: deliveryStatusEnum("delivery_status").default("pending").notNull(),
  
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Documents linked to order items (for delivery)
export const orderDocuments = pgTable("order_documents", {
  id: varchar("id", { length: 21 }).primaryKey(),
  orderItemId: varchar("order_item_id", { length: 21 }).notNull().references(() => orderItems.id, { onDelete: "cascade" }),
  planDocumentId: varchar("plan_document_id", { length: 21 }).notNull().references(() => planDocuments.id),
  
  status: documentStatusEnum("status").default("pending").notNull(),
  sentAt: timestamp("sent_at"),
  downloadCount: integer("download_count").default(0).notNull(),
  
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// ============================================================================
// PAYMENTS
// ============================================================================

export const paymentTransactions = pgTable("payment_transactions", {
  id: varchar("id", { length: 21 }).primaryKey(),
  orderId: varchar("order_id", { length: 21 }).notNull().references(() => orders.id),
  
  amount: decimal("amount", { precision: 10, scale: 2 }).notNull(),
  currency: varchar("currency", { length: 10 }).default("KES").notNull(),
  paymentMethod: paymentMethodEnum("payment_method").notNull(),
  
  // Provider info
  provider: varchar("provider", { length: 50 }).notNull(), // "mpesa", "stripe"
  providerTransactionId: varchar("provider_transaction_id", { length: 255 }),
  providerReference: varchar("provider_reference", { length: 255 }),
  
  // M-Pesa specific
  mpesaReceiptNumber: varchar("mpesa_receipt_number", { length: 100 }),
  mpesaPhoneNumber: varchar("mpesa_phone_number", { length: 20 }),
  
  // Status
  status: paymentStatusEnum("status").default("pending").notNull(),
  statusMessage: text("status_message"),
  
  // Raw response from provider
  providerResponse: jsonb("provider_response"),
  
  // Timestamps
  initiatedAt: timestamp("initiated_at").defaultNow().notNull(),
  completedAt: timestamp("completed_at"),
  failedAt: timestamp("failed_at"),
});

// ============================================================================
// MESSAGES
// ============================================================================

export const messages = pgTable("messages", {
  id: varchar("id", { length: 21 }).primaryKey(),
  customerId: varchar("customer_id", { length: 21 }).notNull().references(() => users.id),
  subject: varchar("subject", { length: 500 }).notNull(),
  
  // Thread info
  parentMessageId: varchar("parent_message_id", { length: 21 }),
  
  // Message content
  content: text("content").notNull(),
  senderType: varchar("sender_type", { length: 20 }).notNull(), // "customer", "admin"
  senderId: varchar("sender_id", { length: 21 }).notNull(),
  
  // Status
  read: boolean("read").default(false).notNull(),
  
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// ============================================================================
// COUPONS
// ============================================================================

export const coupons = pgTable("coupons", {
  id: varchar("id", { length: 21 }).primaryKey(),
  code: varchar("code", { length: 50 }).notNull().unique(),
  
  discountType: varchar("discount_type", { length: 20 }).notNull(), // "percentage", "fixed"
  discountValue: decimal("discount_value", { precision: 10, scale: 2 }).notNull(),
  
  // Restrictions
  minOrderAmount: decimal("min_order_amount", { precision: 10, scale: 2 }),
  maxDiscount: decimal("max_discount", { precision: 10, scale: 2 }),
  applicablePlans: jsonb("applicable_plans"), // array of plan IDs
  
  // Usage
  usageLimit: integer("usage_limit"),
  usageCount: integer("usage_count").default(0).notNull(),
  perCustomerLimit: integer("per_customer_limit").default(1).notNull(),
  
  // Validity
  validFrom: timestamp("valid_from").notNull(),
  validUntil: timestamp("valid_until"),
  active: boolean("active").default(true).notNull(),
  
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// ============================================================================
// EMAIL LOGS
// ============================================================================

export const emailLogs = pgTable("email_logs", {
  id: varchar("id", { length: 21 }).primaryKey(),
  userId: varchar("user_id", { length: 21 }).references(() => users.id),
  
  emailType: varchar("email_type", { length: 50 }).notNull(), // "welcome", "otp", "order_confirmation", etc.
  to: varchar("to", { length: 255 }).notNull(),
  subject: varchar("subject", { length: 500 }).notNull(),
  body: text("body").notNull(),
  
  status: varchar("status", { length: 20 }).default("sent").notNull(), // "sent", "failed"
  error: text("error"),
  
  sentAt: timestamp("sent_at").defaultNow().notNull(),
});

// ============================================================================
// RELATIONS
// ============================================================================

export const usersRelations = relations(users, ({ many }) => ({
  orders: many(orders),
  cartItems: many(cartItems),
  wishlistItems: many(wishlistItems),
  messages: many(messages),
  otpCodes: many(otpCodes),
}));

export const housePlansRelations = relations(housePlans, ({ many }) => ({
  images: many(planImages),
  documents: many(planDocuments),
  options: many(planOptions),
  faqs: many(planFaqs),
  cartItems: many(cartItems),
  wishlistItems: many(wishlistItems),
  orderItems: many(orderItems),
}));

export const ordersRelations = relations(orders, ({ one, many }) => ({
  customer: one(users, {
    fields: [orders.customerId],
    references: [users.id],
  }),
  items: many(orderItems),
  payments: many(paymentTransactions),
}));

export const orderItemsRelations = relations(orderItems, ({ one, many }) => ({
  order: one(orders, {
    fields: [orderItems.orderId],
    references: [orders.id],
  }),
  plan: one(housePlans, {
    fields: [orderItems.planId],
    references: [housePlans.id],
  }),
  documents: many(orderDocuments),
}));
