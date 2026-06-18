CREATE TYPE "public"."delivery_status" AS ENUM('pending', 'processing', 'sent', 'delivered', 'failed');--> statement-breakpoint
CREATE TYPE "public"."document_status" AS ENUM('pending', 'ready', 'sent', 'failed');--> statement-breakpoint
CREATE TYPE "public"."order_status" AS ENUM('pending', 'payment_pending', 'payment_confirmed', 'processing', 'completed', 'canceled', 'refunded');--> statement-breakpoint
CREATE TYPE "public"."payment_method" AS ENUM('mpesa', 'card', 'bank_transfer', 'paypal');--> statement-breakpoint
CREATE TYPE "public"."payment_status" AS ENUM('pending', 'processing', 'completed', 'failed', 'refunded');--> statement-breakpoint
CREATE TYPE "public"."user_role" AS ENUM('customer', 'admin');--> statement-breakpoint
CREATE TABLE "cart_items" (
	"id" varchar(21) PRIMARY KEY NOT NULL,
	"user_id" varchar(21) NOT NULL,
	"plan_id" varchar(21) NOT NULL,
	"plan_type" varchar(50) NOT NULL,
	"selected_options" jsonb NOT NULL,
	"total_price" numeric(10, 2) NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "coupons" (
	"id" varchar(21) PRIMARY KEY NOT NULL,
	"code" varchar(50) NOT NULL,
	"discount_type" varchar(20) NOT NULL,
	"discount_value" numeric(10, 2) NOT NULL,
	"min_order_amount" numeric(10, 2),
	"max_discount" numeric(10, 2),
	"applicable_plans" jsonb,
	"usage_limit" integer,
	"usage_count" integer DEFAULT 0 NOT NULL,
	"per_customer_limit" integer DEFAULT 1 NOT NULL,
	"valid_from" timestamp NOT NULL,
	"valid_until" timestamp,
	"active" boolean DEFAULT true NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "coupons_code_unique" UNIQUE("code")
);
--> statement-breakpoint
CREATE TABLE "email_logs" (
	"id" varchar(21) PRIMARY KEY NOT NULL,
	"user_id" varchar(21),
	"email_type" varchar(50) NOT NULL,
	"to" varchar(255) NOT NULL,
	"subject" varchar(500) NOT NULL,
	"body" text NOT NULL,
	"status" varchar(20) DEFAULT 'sent' NOT NULL,
	"error" text,
	"sent_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "house_plans" (
	"id" varchar(21) PRIMARY KEY NOT NULL,
	"plan_number" varchar(50) NOT NULL,
	"name" varchar(255) NOT NULL,
	"slug" varchar(255) NOT NULL,
	"style" varchar(100) NOT NULL,
	"summary" text NOT NULL,
	"description" text NOT NULL,
	"bedrooms" integer NOT NULL,
	"baths" numeric(3, 1) NOT NULL,
	"floors" integer NOT NULL,
	"garages" integer DEFAULT 0 NOT NULL,
	"sqft" integer NOT NULL,
	"width" varchar(50),
	"depth" varchar(50),
	"height" varchar(50),
	"main_floor_area" integer,
	"basement_area" integer,
	"porch_area" integer,
	"base_price" numeric(10, 2) NOT NULL,
	"pdf_price" numeric(10, 2),
	"cad_price" numeric(10, 2),
	"unlimited_build_price" numeric(10, 2),
	"full_specs_and_features" text,
	"included_items_html" text,
	"badge" varchar(100),
	"featured" boolean DEFAULT false NOT NULL,
	"trending" boolean DEFAULT false NOT NULL,
	"top_rated" boolean DEFAULT false NOT NULL,
	"family_pick" boolean DEFAULT false NOT NULL,
	"published" boolean DEFAULT false NOT NULL,
	"views" integer DEFAULT 0 NOT NULL,
	"orders" integer DEFAULT 0 NOT NULL,
	"rating" numeric(3, 2) DEFAULT '0' NOT NULL,
	"review_count" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "house_plans_plan_number_unique" UNIQUE("plan_number"),
	CONSTRAINT "house_plans_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "messages" (
	"id" varchar(21) PRIMARY KEY NOT NULL,
	"customer_id" varchar(21) NOT NULL,
	"subject" varchar(500) NOT NULL,
	"parent_message_id" varchar(21),
	"content" text NOT NULL,
	"sender_type" varchar(20) NOT NULL,
	"sender_id" varchar(21) NOT NULL,
	"read" boolean DEFAULT false NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "order_documents" (
	"id" varchar(21) PRIMARY KEY NOT NULL,
	"order_item_id" varchar(21) NOT NULL,
	"plan_document_id" varchar(21) NOT NULL,
	"status" "document_status" DEFAULT 'pending' NOT NULL,
	"sent_at" timestamp,
	"download_count" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "order_items" (
	"id" varchar(21) PRIMARY KEY NOT NULL,
	"order_id" varchar(21) NOT NULL,
	"plan_id" varchar(21) NOT NULL,
	"plan_name" varchar(255) NOT NULL,
	"plan_number" varchar(50) NOT NULL,
	"plan_type" varchar(50) NOT NULL,
	"selected_options" jsonb NOT NULL,
	"base_price" numeric(10, 2) NOT NULL,
	"options_total" numeric(10, 2) DEFAULT '0' NOT NULL,
	"add_ons_total" numeric(10, 2) DEFAULT '0' NOT NULL,
	"item_total" numeric(10, 2) NOT NULL,
	"delivery_status" "delivery_status" DEFAULT 'pending' NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "orders" (
	"id" varchar(21) PRIMARY KEY NOT NULL,
	"order_number" varchar(50) NOT NULL,
	"customer_id" varchar(21) NOT NULL,
	"subtotal" numeric(10, 2) NOT NULL,
	"tax" numeric(10, 2) DEFAULT '0' NOT NULL,
	"fees" numeric(10, 2) DEFAULT '0' NOT NULL,
	"discount" numeric(10, 2) DEFAULT '0' NOT NULL,
	"total" numeric(10, 2) NOT NULL,
	"status" "order_status" DEFAULT 'pending' NOT NULL,
	"payment_status" "payment_status" DEFAULT 'pending' NOT NULL,
	"delivery_status" "delivery_status" DEFAULT 'pending' NOT NULL,
	"payment_method" "payment_method",
	"payment_reference" varchar(255),
	"delivery_email" varchar(255) NOT NULL,
	"customer_notes" text,
	"admin_notes" text,
	"coupon_code" varchar(50),
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"paid_at" timestamp,
	"delivered_at" timestamp,
	"completed_at" timestamp,
	"canceled_at" timestamp,
	CONSTRAINT "orders_order_number_unique" UNIQUE("order_number")
);
--> statement-breakpoint
CREATE TABLE "otp_codes" (
	"id" varchar(21) PRIMARY KEY NOT NULL,
	"user_id" varchar(21) NOT NULL,
	"code" varchar(6) NOT NULL,
	"purpose" varchar(50) NOT NULL,
	"expires_at" timestamp NOT NULL,
	"used" boolean DEFAULT false NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "payment_transactions" (
	"id" varchar(21) PRIMARY KEY NOT NULL,
	"order_id" varchar(21) NOT NULL,
	"amount" numeric(10, 2) NOT NULL,
	"currency" varchar(10) DEFAULT 'KES' NOT NULL,
	"payment_method" "payment_method" NOT NULL,
	"provider" varchar(50) NOT NULL,
	"provider_transaction_id" varchar(255),
	"provider_reference" varchar(255),
	"mpesa_receipt_number" varchar(100),
	"mpesa_phone_number" varchar(20),
	"status" "payment_status" DEFAULT 'pending' NOT NULL,
	"status_message" text,
	"provider_response" jsonb,
	"initiated_at" timestamp DEFAULT now() NOT NULL,
	"completed_at" timestamp,
	"failed_at" timestamp
);
--> statement-breakpoint
CREATE TABLE "plan_documents" (
	"id" varchar(21) PRIMARY KEY NOT NULL,
	"plan_id" varchar(21) NOT NULL,
	"document_type" varchar(50) NOT NULL,
	"file_name" varchar(255) NOT NULL,
	"cloudinary_public_id" varchar(255) NOT NULL,
	"cloudinary_url" varchar(500) NOT NULL,
	"file_size" integer NOT NULL,
	"mime_type" varchar(100) NOT NULL,
	"description" text,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "plan_faqs" (
	"id" varchar(21) PRIMARY KEY NOT NULL,
	"plan_id" varchar(21) NOT NULL,
	"question" varchar(500) NOT NULL,
	"answer" text NOT NULL,
	"sort_order" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "plan_images" (
	"id" varchar(21) PRIMARY KEY NOT NULL,
	"plan_id" varchar(21) NOT NULL,
	"cloudinary_public_id" varchar(255) NOT NULL,
	"cloudinary_url" varchar(500) NOT NULL,
	"category" varchar(50) NOT NULL,
	"caption" varchar(255),
	"sort_order" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "plan_options" (
	"id" varchar(21) PRIMARY KEY NOT NULL,
	"plan_id" varchar(21) NOT NULL,
	"option_type" varchar(50) NOT NULL,
	"label" varchar(255) NOT NULL,
	"price" numeric(10, 2) NOT NULL,
	"description" text,
	"sort_order" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" varchar(21) PRIMARY KEY NOT NULL,
	"email" varchar(255) NOT NULL,
	"password_hash" text NOT NULL,
	"role" "user_role" DEFAULT 'customer' NOT NULL,
	"first_name" varchar(100) NOT NULL,
	"last_name" varchar(100) NOT NULL,
	"phone" varchar(20),
	"address_street" varchar(255),
	"address_city" varchar(100),
	"address_state" varchar(100),
	"address_country" varchar(100) DEFAULT 'Kenya',
	"address_postal_code" varchar(20),
	"email_verified" boolean DEFAULT false NOT NULL,
	"email_verification_token" varchar(100),
	"email_verification_expires" timestamp,
	"phone_verified" boolean DEFAULT false NOT NULL,
	"reset_password_token" varchar(100),
	"reset_password_expires" timestamp,
	"total_orders" integer DEFAULT 0 NOT NULL,
	"total_spent" numeric(10, 2) DEFAULT '0' NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"last_login_at" timestamp,
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE "wishlist_items" (
	"id" varchar(21) PRIMARY KEY NOT NULL,
	"user_id" varchar(21) NOT NULL,
	"plan_id" varchar(21) NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "cart_items" ADD CONSTRAINT "cart_items_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "cart_items" ADD CONSTRAINT "cart_items_plan_id_house_plans_id_fk" FOREIGN KEY ("plan_id") REFERENCES "public"."house_plans"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "email_logs" ADD CONSTRAINT "email_logs_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "messages" ADD CONSTRAINT "messages_customer_id_users_id_fk" FOREIGN KEY ("customer_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "order_documents" ADD CONSTRAINT "order_documents_order_item_id_order_items_id_fk" FOREIGN KEY ("order_item_id") REFERENCES "public"."order_items"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "order_documents" ADD CONSTRAINT "order_documents_plan_document_id_plan_documents_id_fk" FOREIGN KEY ("plan_document_id") REFERENCES "public"."plan_documents"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "order_items" ADD CONSTRAINT "order_items_order_id_orders_id_fk" FOREIGN KEY ("order_id") REFERENCES "public"."orders"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "order_items" ADD CONSTRAINT "order_items_plan_id_house_plans_id_fk" FOREIGN KEY ("plan_id") REFERENCES "public"."house_plans"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "orders" ADD CONSTRAINT "orders_customer_id_users_id_fk" FOREIGN KEY ("customer_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "otp_codes" ADD CONSTRAINT "otp_codes_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "payment_transactions" ADD CONSTRAINT "payment_transactions_order_id_orders_id_fk" FOREIGN KEY ("order_id") REFERENCES "public"."orders"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "plan_documents" ADD CONSTRAINT "plan_documents_plan_id_house_plans_id_fk" FOREIGN KEY ("plan_id") REFERENCES "public"."house_plans"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "plan_faqs" ADD CONSTRAINT "plan_faqs_plan_id_house_plans_id_fk" FOREIGN KEY ("plan_id") REFERENCES "public"."house_plans"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "plan_images" ADD CONSTRAINT "plan_images_plan_id_house_plans_id_fk" FOREIGN KEY ("plan_id") REFERENCES "public"."house_plans"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "plan_options" ADD CONSTRAINT "plan_options_plan_id_house_plans_id_fk" FOREIGN KEY ("plan_id") REFERENCES "public"."house_plans"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "wishlist_items" ADD CONSTRAINT "wishlist_items_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "wishlist_items" ADD CONSTRAINT "wishlist_items_plan_id_house_plans_id_fk" FOREIGN KEY ("plan_id") REFERENCES "public"."house_plans"("id") ON DELETE cascade ON UPDATE no action;