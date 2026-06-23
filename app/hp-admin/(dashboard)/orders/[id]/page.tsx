import { Button } from "@/components/ui/button";
import { ArrowLeft, Mail, Phone, CheckCircle2, XCircle, Clock, Package } from "lucide-react";
import Link from "next/link";
import { getOrderById } from "@/app/actions/orders";
import { notFound } from "next/navigation";

export default async function OrderDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const result = await getOrderById(id);
  
  if (!result.success) {
    return (
      <div className="space-y-6">
        <Button variant="outline" size="sm" asChild>
          <Link href="/hp-admin/orders">
            <ArrowLeft className="size-4 mr-2" />
            Back to Orders
          </Link>
        </Button>
        <div className="rounded-lg border border-border bg-card p-8 text-center">
          <h2 className="text-xl font-semibold mb-2">Order Not Found</h2>
          <p className="text-muted-foreground mb-4">
            {result.error || "The order you're looking for doesn't exist."}
          </p>
          <p className="text-sm text-muted-foreground">Order ID: {id}</p>
        </div>
      </div>
    );
  }

  const order = result.order;
  const customer = order.customer;

  const getStatusIcon = () => {
    switch (order.status) {
      case "completed":
      case "payment_confirmed":
        return <CheckCircle2 className="size-16 text-green-600" />;
      case "canceled":
      case "refunded":
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
      case "payment_confirmed":
        return "text-green-600 dark:text-green-400";
      case "processing":
        return "text-blue-600 dark:text-blue-400";
      case "pending":
      case "payment_pending":
        return "text-orange-600 dark:text-orange-400";
      case "canceled":
      case "refunded":
        return "text-red-600 dark:text-red-400";
      default:
        return "text-muted-foreground";
    }
  };

  const formatDate = (date: Date | null) => {
    if (!date) return "N/A";
    return new Date(date).toLocaleString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
      hour: "numeric",
      minute: "2-digit",
    });
  };

  return (
    <div className="space-y-6">
      <Button variant="outline" size="sm" asChild>
        <Link href="/hp-admin/orders">
          <ArrowLeft className="size-4 mr-2" />
          Back to Orders
        </Link>
      </Button>

      <div className="mx-auto max-w-3xl">
        <div className="rounded-2xl border border-border bg-card overflow-hidden">
          {/* Header */}
          <div className="border-b border-border bg-muted/30 px-8 py-12 text-center">
            <div className="flex justify-center mb-6">{getStatusIcon()}</div>
            <h1 className={`text-3xl font-semibold mb-2 ${getStatusColor()}`}>
              {order.status === "completed" || order.status === "payment_confirmed"
                ? "Order Completed"
                : order.status === "processing"
                ? "Order Processing"
                : order.status === "pending" || order.status === "payment_pending"
                ? "Payment Pending"
                : "Order Canceled"}
            </h1>
            <p className="text-muted-foreground text-lg">{order.orderNumber}</p>
          </div>

          {/* Body */}
          <div className="px-8 py-8 space-y-8">
            {/* Customer Info */}
            <div className="text-center space-y-2">
              <h2 className="text-2xl font-semibold">
                {customer.firstName} {customer.lastName}
              </h2>
              <div className="flex items-center justify-center gap-2 text-muted-foreground">
                <Mail className="size-4" />
                <span>{customer.email}</span>
              </div>
              {customer.phone && (
                <div className="flex items-center justify-center gap-2 text-muted-foreground">
                  <Phone className="size-4" />
                  <span>{customer.phone}</span>
                </div>
              )}
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
                    <p className="font-semibold text-lg">
                      KSh {Number(item.itemTotal).toLocaleString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <div className="border-t border-border" />

            {/* Pricing */}
            <div className="space-y-3">
              <div className="flex justify-between text-muted-foreground">
                <span>Subtotal</span>
                <span>KSh {Number(order.subtotal).toLocaleString()}</span>
              </div>
              <div className="border-t border-border pt-3">
                <div className="flex justify-between text-xl font-semibold">
                  <span>Total</span>
                  <span>KSh {Number(order.total).toLocaleString()}</span>
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
                  <p className="font-medium">{order.paymentMethod || "N/A"}</p>
                </div>
                <div className="text-center">
                  <p className="text-muted-foreground mb-1">Status</p>
                  <p
                    className={`font-medium ${
                      order.paymentStatus === "completed"
                        ? "text-green-600 dark:text-green-400"
                        : "text-orange-600 dark:text-orange-400"
                    }`}
                  >
                    {order.paymentStatus === "completed" ? "Paid" : "Pending"}
                  </p>
                </div>
                {order.paymentReference && (
                  <div className="col-span-2 text-center">
                    <p className="text-muted-foreground mb-1">Reference</p>
                    <p className="font-medium font-mono">{order.paymentReference}</p>
                  </div>
                )}
              </div>
            </div>

            {/* Documents */}
            {order.items.some((item) => item.plan?.documents?.length > 0) && (
              <>
                <div className="border-t border-border" />
                <div className="space-y-3">
                  <h3 className="font-semibold text-center">Plan Documents</h3>
                  <div className="space-y-2">
                    {order.items.map((item) =>
                      item.plan?.documents?.map((doc) => (
                        <div key={doc.id} className="rounded-lg bg-muted/30 p-4">
                          <p className="font-medium mb-1">{doc.fileName}</p>
                          <p className="text-xs text-muted-foreground">
                            {doc.documentType.toUpperCase()} • {(doc.fileSize / 1024 / 1024).toFixed(2)} MB
                          </p>
                        </div>
                      ))
                    )}
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
                  <p className="font-medium">{formatDate(order.createdAt)}</p>
                </div>
                {order.paidAt && (
                  <div className="text-center">
                    <p className="text-muted-foreground mb-1">Payment Received</p>
                    <p className="font-medium">{formatDate(order.paidAt)}</p>
                  </div>
                )}
                {order.completedAt && (
                  <div className="text-center">
                    <p className="text-muted-foreground mb-1">Completed</p>
                    <p className="font-medium">{formatDate(order.completedAt)}</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
