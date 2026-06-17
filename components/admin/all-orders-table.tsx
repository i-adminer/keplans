"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Eye,
  ChevronLeft,
  ChevronRight,
  Search,
  X,
} from "lucide-react";

const ITEMS_PER_PAGE = 10;

interface Order {
  id: string;
  orderNumber: string;
  customer: string;
  email: string;
  plan: string;
  amount: number;
  status: "pending" | "completed" | "canceled" | "processing";
  paymentStatus: "pending" | "completed" | "failed";
  createdAt: string;
}

// Dummy data
const dummyOrders: Order[] = [
  { id: "1", orderNumber: "ORD-2045", customer: "John Kamau", email: "john@example.com", plan: "Kenya Court Modern", amount: 128000, status: "completed", paymentStatus: "completed", createdAt: "2024-06-15" },
  { id: "2", orderNumber: "ORD-2044", customer: "Mary Wanjiku", email: "mary@example.com", plan: "Ridge View Contemporary", amount: 184000, status: "pending", paymentStatus: "pending", createdAt: "2024-06-15" },
  { id: "3", orderNumber: "ORD-2043", customer: "Peter Ochieng", email: "peter@example.com", plan: "Nairobi Breeze Farmhouse", amount: 216000, status: "completed", paymentStatus: "completed", createdAt: "2024-06-14" },
  { id: "4", orderNumber: "ORD-2042", customer: "Grace Akinyi", email: "grace@example.com", plan: "Savanna Modern Villa", amount: 310000, status: "processing", paymentStatus: "completed", createdAt: "2024-06-14" },
  { id: "5", orderNumber: "ORD-2041", customer: "David Mwangi", email: "david@example.com", plan: "Lake View Traditional", amount: 175000, status: "canceled", paymentStatus: "failed", createdAt: "2024-06-13" },
  { id: "6", orderNumber: "ORD-2040", customer: "Sarah Njeri", email: "sarah@example.com", plan: "Coastal Breeze Villa", amount: 295000, status: "completed", paymentStatus: "completed", createdAt: "2024-06-13" },
  { id: "7", orderNumber: "ORD-2039", customer: "James Kipchoge", email: "james@example.com", plan: "Highland Modern", amount: 156000, status: "processing", paymentStatus: "completed", createdAt: "2024-06-12" },
  { id: "8", orderNumber: "ORD-2038", customer: "Lucy Wangari", email: "lucy@example.com", plan: "Urban Contemporary", amount: 198000, status: "completed", paymentStatus: "completed", createdAt: "2024-06-12" },
  { id: "9", orderNumber: "ORD-2037", customer: "Tom Omondi", email: "tom@example.com", plan: "Garden Villa", amount: 245000, status: "pending", paymentStatus: "pending", createdAt: "2024-06-11" },
  { id: "10", orderNumber: "ORD-2036", customer: "Jane Mutua", email: "jane@example.com", plan: "Sunset Farmhouse", amount: 189000, status: "completed", paymentStatus: "completed", createdAt: "2024-06-11" },
];

export default function AllOrdersTable() {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [paymentFilter, setPaymentFilter] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [orders] = useState<Order[]>(dummyOrders);

  // Filter logic
  const filteredOrders = useMemo(() => {
    return orders.filter((order) => {
      if (
        searchQuery &&
        !order.orderNumber.toLowerCase().includes(searchQuery.toLowerCase()) &&
        !order.customer.toLowerCase().includes(searchQuery.toLowerCase()) &&
        !order.email.toLowerCase().includes(searchQuery.toLowerCase())
      ) {
        return false;
      }

      if (statusFilter && order.status !== statusFilter) return false;
      if (paymentFilter && order.paymentStatus !== paymentFilter) return false;

      return true;
    });
  }, [orders, searchQuery, statusFilter, paymentFilter]);

  // Pagination
  const totalPages = Math.ceil(filteredOrders.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedOrders = filteredOrders.slice(
    startIndex,
    startIndex + ITEMS_PER_PAGE
  );

  const clearFilters = () => {
    setSearchQuery("");
    setStatusFilter("");
    setPaymentFilter("");
    setCurrentPage(1);
  };

  const hasActiveFilters = searchQuery || statusFilter || paymentFilter;

  const getStatusColor = (status: Order["status"]) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300";
      case "processing":
        return "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300";
      case "pending":
        return "bg-orange-100 text-orange-700 dark:bg-orange-900 dark:text-orange-300";
      case "canceled":
        return "bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300";
      default:
        return "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300";
    }
  };

  return (
    <div className="space-y-6">
      {/* Filters */}
      <div className="rounded-lg border border-border bg-card p-4">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="font-semibold">Filters</h3>
          {hasActiveFilters && (
            <Button
              variant="ghost"
              size="sm"
              onClick={clearFilters}
              className="h-8 text-xs"
            >
              <X className="size-3 mr-1" />
              Clear All
            </Button>
          )}
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {/* Search */}
          <div className="sm:col-span-2 lg:col-span-1">
            <label className="mb-2 block text-sm font-medium">Search</label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Order number, customer..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setCurrentPage(1);
                }}
                className="h-10 pl-9"
              />
            </div>
          </div>

          {/* Status */}
          <div>
            <label className="mb-2 block text-sm font-medium">
              Order Status
            </label>
            <select
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value);
                setCurrentPage(1);
              }}
              className="h-10 w-full rounded-lg border border-border bg-background px-3 text-sm"
            >
              <option value="">All Statuses</option>
              <option value="pending">Pending</option>
              <option value="processing">Processing</option>
              <option value="completed">Completed</option>
              <option value="canceled">Canceled</option>
            </select>
          </div>

          {/* Payment Status */}
          <div>
            <label className="mb-2 block text-sm font-medium">
              Payment Status
            </label>
            <select
              value={paymentFilter}
              onChange={(e) => {
                setPaymentFilter(e.target.value);
                setCurrentPage(1);
              }}
              className="h-10 w-full rounded-lg border border-border bg-background px-3 text-sm"
            >
              <option value="">All Payments</option>
              <option value="pending">Pending</option>
              <option value="completed">Completed</option>
              <option value="failed">Failed</option>
            </select>
          </div>
        </div>
      </div>

      {/* Results Count */}
      <div className="flex items-center justify-between text-sm text-muted-foreground">
        <div>
          Showing {startIndex + 1}-
          {Math.min(startIndex + ITEMS_PER_PAGE, filteredOrders.length)} of{" "}
          {filteredOrders.length} orders
        </div>
        <div>
          Page {currentPage} of {totalPages || 1}
        </div>
      </div>

      {/* Table */}
      <div className="rounded-lg border border-border bg-card">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="border-b border-border bg-muted/50">
              <tr>
                <th className="p-3 text-left text-sm font-medium">Order</th>
                <th className="hidden md:table-cell p-3 text-left text-sm font-medium">
                  Customer
                </th>
                <th className="hidden lg:table-cell p-3 text-left text-sm font-medium">
                  Plan
                </th>
                <th className="hidden sm:table-cell p-3 text-left text-sm font-medium">
                  Amount
                </th>
                <th className="p-3 text-left text-sm font-medium">Status</th>
                <th className="p-3 text-right text-sm font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginatedOrders.length === 0 ? (
                <tr>
                  <td
                    colSpan={6}
                    className="p-8 text-center text-muted-foreground"
                  >
                    No orders found. Try adjusting your filters.
                  </td>
                </tr>
              ) : (
                paginatedOrders.map((order) => (
                  <tr
                    key={order.id}
                    onClick={() =>
                      (window.location.href = `/hp-admin/orders/${order.id}`)
                    }
                    className="border-b border-border last:border-0 hover:bg-muted/50 cursor-pointer"
                  >
                    <td className="p-3">
                      <div>
                        <div className="font-medium">{order.orderNumber}</div>
                        <div className="text-xs text-muted-foreground">
                          {order.createdAt}
                        </div>
                      </div>
                    </td>
                    <td className="hidden md:table-cell p-3">
                      <div>
                        <div className="text-sm font-medium">
                          {order.customer}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {order.email}
                        </div>
                      </div>
                    </td>
                    <td className="hidden lg:table-cell p-3 text-sm">
                      {order.plan}
                    </td>
                    <td className="hidden sm:table-cell p-3 text-sm font-medium">
                      KSh {order.amount.toLocaleString()}
                    </td>
                    <td className="p-3">
                      <div className="flex flex-col gap-1">
                        <span
                          className={`inline-flex w-fit rounded-full px-2 py-1 text-xs font-medium ${getStatusColor(order.status)}`}
                        >
                          {order.status.charAt(0).toUpperCase() +
                            order.status.slice(1)}
                        </span>
                        <span
                          className={`inline-flex w-fit rounded-full px-2 py-1 text-xs font-medium ${
                            order.paymentStatus === "completed"
                              ? "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300"
                              : order.paymentStatus === "pending"
                              ? "bg-orange-100 text-orange-700 dark:bg-orange-900 dark:text-orange-300"
                              : "bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300"
                          }`}
                        >
                          {order.paymentStatus === "completed"
                            ? "Paid"
                            : order.paymentStatus === "pending"
                            ? "Unpaid"
                            : "Failed"}
                        </span>
                      </div>
                    </td>
                    <td className="p-3" onClick={(e) => e.stopPropagation()}>
                      <div className="flex items-center justify-end gap-2">
                        <Button variant="ghost" size="sm" asChild>
                          <Link href={`/hp-admin/orders/${order.id}`}>
                            <Eye className="size-4" />
                          </Link>
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            disabled={currentPage === 1}
          >
            <ChevronLeft className="size-4 mr-1" />
            Previous
          </Button>

          <div className="flex items-center gap-1">
            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              let pageNum;
              if (totalPages <= 5) {
                pageNum = i + 1;
              } else if (currentPage <= 3) {
                pageNum = i + 1;
              } else if (currentPage >= totalPages - 2) {
                pageNum = totalPages - 4 + i;
              } else {
                pageNum = currentPage - 2 + i;
              }

              return (
                <Button
                  key={pageNum}
                  variant={currentPage === pageNum ? "default" : "outline"}
                  size="sm"
                  onClick={() => setCurrentPage(pageNum)}
                  className="size-9 p-0"
                >
                  {pageNum}
                </Button>
              );
            })}
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
          >
            Next
            <ChevronRight className="size-4 ml-1" />
          </Button>
        </div>
      )}
    </div>
  );
}
