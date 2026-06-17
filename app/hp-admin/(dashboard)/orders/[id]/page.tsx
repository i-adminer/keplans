"use client";

import { Button } from "@/components/ui/button";
import { ArrowLeft, Mail, Phone, CheckCircle2, XCircle, Clock, Package } from "lucide-react";
import Link from "next/link";

// Mock function - replace with real DB query
function getOrderById(id: string) {
  return {
    id,
    orderNumber: "ORD-2045",
    status: "completed",
    paymentStatus: "completed",
    createdAt: "June 15, 2024 at 10:30 AM",
    paidAt: "June 15, 2024 at 10:35 AM",
    completedAt: "June 15, 2024 at 2:20 PM",
    
    customer: {
      name: "John Kamau",
      email: "john@example.com",
      phone: "+254 712 345 678",
    },
    
    items: [
      {
        id: "1",
        planName: "Kenya Court Modern",
        planNumber: "1064-280",
        planType: "PDF Set",
        basePrice: 125000,
        options: [
          { name: "Slab Foundation", price: 0 },
          { name: "Wood Frame", price: 0 },
        ],
        addOns: [
          { name: "Material List", price: 3000 },
        ],
        itemTotal: 128000,
      },
    ],
    
    pricing: {
      subtotal: 128000,
      tax: 0,
      fees: 0,
      discount: 0,
      total: 128000,
    },
    
    payment: {
      method: "M-Pesa",
      reference: "QGH7K5M2P9",
      mpesaCode: "QGH7K5M2P9",
    },
    
    documents: [
      { name: "Complete PDF Set", status: "sent", sentAt: "June 15, 2024 at 2:20 PM" },
      { name: "Material List", status: "sent", sentAt: "June 15, 2024 at 2:20 PM" },
    ],
    
    notes: "Please send documents to alternate email: john.k@company.com",
    adminNotes: "Customer requested rush delivery",
  };
}

export default function OrderDetailPage({ params }: { params: { id: string } }) {
  const order = getOrderById(params.id);

  const getStatusIcon = () => {
    switch (order.status) {
      case "completed":
        return <CheckCircle2 className="size-16 text-green-600" />;
      case "canceled":
        return <XCircle className="size-16 text-red-600" />;
      case "processing":
        return <Package className="size-16 text-blue-600" />;
      default:
        return <Clock className="size-16 text-orange-600" />;
    }
  };

  const getStatusColor = () => {
    switch (order.status) {
      case "completed":
        return "text-green-600 dark:text-green-400";
      case "processing":
        return "text-blue-600 dark:text-blue-400";
      case "pending":
        return "text-orange-600 dark:text-orange-400";
      case "canceled":
        return "text-red-600 dark:text-red-400";
      default:
        return "text-muted-foreground";
    }
  };

  return (
    <div className="space-y-6">
      {/* Back Button */}
      <Button variant="outline" size="sm" asChild>
        <Link href="/hp-admin/orders">
          <ArrowLeft className="size-4 mr-2" />
          Back to Orders
        </Link>
      </Button>

      {/* Main Receipt Card */}
      <div className="mx-auto max-w-3xl">
        <div className="rounded-2xl border border-border bg-card overflow-hidden">
          {/* Header */}
          <div className="border-b border-border bg-muted/30 px-8 py-12 text-center">
            <div className="flex justify-center mb-6">
              {getStatusIcon()}
            </div>
            <h1 className={`text-3xl font-semibold mb-2 ${getStatusColor()}`}>
              {order.status === "completed" && "Order Completed"}
              {order.status === "processing" && "Order Processing"}
              {order.status === "pending" && "Payment Pending"}
              {order.status === "canceled" && "Order Canceled"}
            </h1>
            <p className="text-muted-foreground text-lg">{order.orderNumber}</p>
          </div>

          {/* Body */}
          <div className="px-8 py-8 space-y-8">
            {/* Customer Info */}
            <div className="text-center space-y-2">
              <h2 className="text-2xl font-semibold">{order.customer.name}</h2>
              <div className="flex items-center justify-center gap-2 text-muted-foreground">
                <Mail className="size-4" />
                <span>{order.customer.email}</span>
              </div>
              <div className="flex items-center justify-center gap-2 text-muted-foreground">
                <Phone className="size-4" />
                <span>{order.customer.phone}</span>
              </div>
            </div>

            <div className="border-t border-border" />

            {/* Order Items */}
            <div className="space-y-4">
              {order.items.map((item) => (
                <div key={item.id} className="space-y-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-semibold text-lg">{item.planName}</h3>
                      <p className="text-sm text-muted-foreground">Plan #{item.planNumber}</p>
                      <p className="text-sm text-muted-foreground">{item.planType}</p>
                    </div>
                    <p className="font-semibold text-lg">KSh {item.basePrice.toLocaleString()}</p>
                  </div>
                  
                  {item.options.length > 0 && (
                    <div className="pl-4 space-y-1">
                      {item.options.map((opt, i) => (
                        <div key={i} className="flex justify-between text-sm text-muted-foreground">
                          <span>{opt.name}</span>
                          {opt.price > 0 && <span>KSh {opt.price.toLocaleString()}</span>}
                        </div>
                      ))}
                    </div>
                  )}
                  
                  {item.addOns.length > 0 && (
                    <div className="pl-4 space-y-1">
                      {item.addOns.map((addon, i) => (
                        <div key={i} className="flex justify-between text-sm text-muted-foreground">
                          <span>{addon.name}</span>
                          <span>KSh {addon.price.toLocaleString()}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>

            <div className="border-t border-border" />

            {/* Pricing */}
            <div className="space-y-3">
              <div className="flex justify-between text-muted-foreground">
                <span>Subtotal</span>
                <span>KSh {order.pricing.subtotal.toLocaleString()}</span>
              </div>
              {order.pricing.tax > 0 && (
                <div className="flex justify-between text-muted-foreground">
                  <span>Tax</span>
                  <span>KSh {order.pricing.tax.toLocaleString()}</span>
                </div>
              )}
              {order.pricing.fees > 0 && (
                <div className="flex justify-between text-muted-foreground">
                  <span>Processing Fees</span>
                  <span>KSh {order.pricing.fees.toLocaleString()}</span>
                </div>
              )}
              {order.pricing.discount > 0 && (
                <div className="flex justify-between text-green-600">
                  <span>Discount</span>
                  <span>-KSh {order.pricing.discount.toLocaleString()}</span>
                </div>
              )}
              <div className="border-t border-border pt-3">
                <div className="flex justify-between text-xl font-semibold">
                  <span>Total</span>
                  <span>KSh {order.pricing.total.toLocaleString()}</span>
                </div>
              </div>
            </div>

            <div className="border-t border-border" />

            {/* Payment Info */}
            <div className="space-y-3">
              <h3 className="font-semibold text-center">Payment Information</h3>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="text-center">
                  <p className="text-muted-foreground mb-1">Method</p>
                  <p className="font-medium">{order.payment.method}</p>
                </div>
                <div className="text-center">
                  <p className="text-muted-foreground mb-1">Status</p>
                  <p className={`font-medium ${
                    order.paymentStatus === "completed"
                      ? "text-green-600 dark:text-green-400"
                      : "text-orange-600 dark:text-orange-400"
                  }`}>
                    {order.paymentStatus === "completed" ? "Paid" : "Pending"}
                  </p>
                </div>
                {order.payment.mpesaCode && (
                  <>
                    <div className="text-center">
                      <p className="text-muted-foreground mb-1">M-Pesa Code</p>
                      <p className="font-medium font-mono">{order.payment.mpesaCode}</p>
                    </div>
                    <div className="text-center">
                      <p className="text-muted-foreground mb-1">Reference</p>
                      <p className="font-medium font-mono">{order.payment.reference}</p>
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Documents */}
            {order.documents.length > 0 && (
              <>
                <div className="border-t border-border" />
                <div className="space-y-3">
                  <h3 className="font-semibold text-center">Documents</h3>
                  <div className="space-y-2">
                    {order.documents.map((doc, i) => (
                      <div key={i} className="rounded-lg bg-muted/30 p-4 text-center">
                        <p className="font-medium mb-1">{doc.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {doc.status === "sent" ? `Sent: ${doc.sentAt}` : "Pending"}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            )}

            {/* Timeline */}
            <div className="border-t border-border" />
            <div className="space-y-3">
              <h3 className="font-semibold text-center">Order Timeline</h3>
              <div className="grid gap-4 text-sm">
                <div className="text-center">
                  <p className="text-muted-foreground mb-1">Created</p>
                  <p className="font-medium">{order.createdAt}</p>
                </div>
                {order.paidAt && (
                  <div className="text-center">
                    <p className="text-muted-foreground mb-1">Payment Received</p>
                    <p className="font-medium">{order.paidAt}</p>
                  </div>
                )}
                {order.completedAt && (
                  <div className="text-center">
                    <p className="text-muted-foreground mb-1">Completed</p>
                    <p className="font-medium">{order.completedAt}</p>
                  </div>
                )}
              </div>
            </div>

            {/* Actions */}
            <div className="border-t border-border" />
            <div className="space-y-2">
              {order.status === "pending" && (
                <Button className="w-full" size="lg">Mark as Processing</Button>
              )}
              {order.status === "processing" && (
                <Button className="w-full" size="lg">Send Documents & Complete</Button>
              )}
              {order.status === "completed" && (
                <Button variant="outline" className="w-full" size="lg">Resend Documents</Button>
              )}
              {(order.status === "pending" || order.status === "processing") && (
                <Button variant="outline" className="w-full text-red-600 hover:text-red-600">Cancel Order</Button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
