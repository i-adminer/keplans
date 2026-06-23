"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import RichTextEditor from "@/components/admin/rich-text-editor";
import { Search, Mail, Phone, Package, X, Send, ChevronLeft, ChevronRight } from "lucide-react";
import { toast } from "sonner";

const ITEMS_PER_PAGE = 10;

interface Customer {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string | null;
  createdAt: Date;
  lastLoginAt: Date | null;
  emailVerified: boolean;
  totalOrders: number;
  totalSpent: string;
  lastOrderDate: Date | null;
}

interface CustomersTableProps {
  customers: Customer[];
}

export default function CustomersTable({ customers }: CustomersTableProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [showMessageDialog, setShowMessageDialog] = useState(false);
  const [messageSubject, setMessageSubject] = useState("");
  const [messageContent, setMessageContent] = useState("");

  const filteredCustomers = customers.filter((customer) => {
    const fullName = `${customer.firstName} ${customer.lastName}`.toLowerCase();
    const query = searchQuery.toLowerCase();
    return fullName.includes(query) || customer.email.toLowerCase().includes(query);
  });

  const totalPages = Math.ceil(filteredCustomers.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedCustomers = filteredCustomers.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  const formatDate = (date: Date | null) => {
    if (!date) return "Never";
    return new Date(date).toLocaleDateString("en-US", { 
      month: "short", 
      day: "numeric", 
      year: "numeric" 
    });
  };

  const formatJoinDate = (date: Date) => {
    return new Date(date).toLocaleDateString("en-US", { 
      month: "short", 
      year: "numeric" 
    });
  };

  const handleSendMessage = () => {
    if (!messageSubject.trim() || !messageContent.trim()) {
      toast.error("Please fill in subject and message");
      return;
    }
    toast.success("Message sent via email!");
    setShowMessageDialog(false);
    setMessageSubject("");
    setMessageContent("");
  };

  return (
    <>
      {/* Search */}
      <div className="rounded-lg border border-border bg-card p-4">
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search customers..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setCurrentPage(1);
            }}
            className="h-10 pl-9"
          />
        </div>
      </div>

      {/* Table */}
      <div className="rounded-lg border border-border bg-card">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="border-b border-border bg-muted/50">
              <tr>
                <th className="p-3 text-left text-sm font-medium">Customer</th>
                <th className="hidden md:table-cell p-3 text-left text-sm font-medium">Contact</th>
                <th className="hidden sm:table-cell p-3 text-left text-sm font-medium">Orders</th>
                <th className="hidden lg:table-cell p-3 text-left text-sm font-medium">Total Spent</th>
                <th className="p-3 text-left text-sm font-medium">Status</th>
                <th className="p-3 text-right text-sm font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginatedCustomers.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-muted-foreground">
                    No customers found
                  </td>
                </tr>
              ) : (
                paginatedCustomers.map((customer) => (
                  <tr
                    key={customer.id}
                    onClick={() => setSelectedCustomer(customer)}
                    className="border-b border-border last:border-0 hover:bg-muted/50 cursor-pointer"
                  >
                    <td className="p-3">
                      <div>
                        <div className="font-medium">{customer.firstName} {customer.lastName}</div>
                        <div className="text-xs text-muted-foreground">Joined {formatJoinDate(customer.createdAt)}</div>
                      </div>
                    </td>
                    <td className="hidden md:table-cell p-3 text-sm">
                      <div className="space-y-1">
                        <div>{customer.email}</div>
                        <div className="text-muted-foreground">{customer.phone || "No phone"}</div>
                      </div>
                    </td>
                    <td className="hidden sm:table-cell p-3 text-sm">{customer.totalOrders}</td>
                    <td className="hidden lg:table-cell p-3 text-sm font-medium">
                      KSh {Number(customer.totalSpent).toLocaleString()}
                    </td>
                    <td className="p-3">
                      <span className={`inline-flex rounded-full px-2 py-1 text-xs font-medium ${
                        customer.totalOrders > 0
                          ? "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300"
                          : "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300"
                      }`}>
                        {customer.totalOrders > 0 ? "active" : "inactive"}
                      </span>
                    </td>
                    <td className="p-3" onClick={(e) => e.stopPropagation()}>
                      <Button variant="ghost" size="sm">
                        View
                      </Button>
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

      {/* Customer Detail Dialog */}
      {selectedCustomer && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="relative w-full max-w-lg rounded-xl border border-border bg-card shadow-2xl max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setSelectedCustomer(null)}
              className="absolute right-3 top-3 rounded-full p-1.5 hover:bg-muted"
            >
              <X className="size-4" />
            </button>

            <div className="border-b border-border p-4 sm:p-6 text-center">
              <h2 className="text-xl sm:text-2xl font-semibold mb-2">
                {selectedCustomer.firstName} {selectedCustomer.lastName}
              </h2>
              <span className={`inline-flex rounded-full px-2 py-1 text-xs font-medium ${
                selectedCustomer.totalOrders > 0
                  ? "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300"
                  : "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300"
              }`}>
                {selectedCustomer.totalOrders > 0 ? "active" : "inactive"}
              </span>
            </div>

            <div className="p-4 sm:p-6 space-y-4">
              <div className="space-y-2 text-sm text-center">
                <div className="flex items-center justify-center gap-2">
                  <Mail className="size-4 text-muted-foreground" />
                  <span>{selectedCustomer.email}</span>
                </div>
                <div className="flex items-center justify-center gap-2">
                  <Phone className="size-4 text-muted-foreground" />
                  <span>{selectedCustomer.phone || "No phone"}</span>
                </div>
              </div>

              <div className="border-t border-border" />

              <div className="grid grid-cols-2 gap-4 text-center text-sm">
                <div>
                  <div className="text-2xl font-bold mb-1">{selectedCustomer.totalOrders}</div>
                  <p className="text-xs text-muted-foreground">Orders</p>
                </div>
                <div>
                  <div className="text-2xl font-bold mb-1">
                    KSh {(Number(selectedCustomer.totalSpent) / 1000).toFixed(0)}K
                  </div>
                  <p className="text-xs text-muted-foreground">Spent</p>
                </div>
              </div>

              <div className="border-t border-border" />

              <div className="grid grid-cols-2 gap-4 text-center text-sm">
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Joined</p>
                  <p className="font-medium text-sm">{formatJoinDate(selectedCustomer.createdAt)}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Last Order</p>
                  <p className="font-medium text-sm">{formatDate(selectedCustomer.lastOrderDate)}</p>
                </div>
              </div>

              <div className="border-t border-border" />

              <div className="space-y-2">
                <Button
                  className="w-full"
                  onClick={() => setShowMessageDialog(true)}
                >
                  <Mail className="size-4 mr-2" />
                  Send Email
                </Button>
                <Button variant="outline" className="w-full">
                  <Package className="size-4 mr-2" />
                  View Orders
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Message Dialog */}
      {showMessageDialog && selectedCustomer && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 p-4">
          <div className="relative w-full max-w-2xl rounded-xl border border-border bg-card shadow-2xl max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => {
                setShowMessageDialog(false);
                setMessageSubject("");
                setMessageContent("");
              }}
              className="absolute right-3 top-3 rounded-full p-1.5 hover:bg-muted"
            >
              <X className="size-4" />
            </button>

            <div className="border-b border-border p-4 sm:p-6 text-center">
              <h2 className="text-lg sm:text-xl font-semibold mb-1">Send Email</h2>
              <p className="text-sm text-muted-foreground">To: {selectedCustomer.email}</p>
            </div>

            <div className="p-4 sm:p-6 space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Subject</label>
                <Input
                  placeholder="Email subject"
                  value={messageSubject}
                  onChange={(e) => setMessageSubject(e.target.value)}
                  className="h-10"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Message</label>
                <RichTextEditor
                  content={messageContent}
                  onChange={setMessageContent}
                  placeholder="Type your message..."
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <Button
                  variant="outline"
                  onClick={() => {
                    setShowMessageDialog(false);
                    setMessageSubject("");
                    setMessageContent("");
                  }}
                >
                  Cancel
                </Button>
                <Button onClick={handleSendMessage}>
                  <Send className="size-4 mr-2" />
                  Send
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
