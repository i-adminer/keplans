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
  name: string;
  email: string;
  phone: string;
  totalOrders: number;
  totalSpent: number;
  joinedDate: string;
  lastOrder: string;
  status: "active" | "inactive";
}

const dummyCustomers: Customer[] = [
  { id: "1", name: "John Kamau", email: "john@example.com", phone: "+254712345678", totalOrders: 3, totalSpent: 456000, joinedDate: "Jan 2024", lastOrder: "June 15, 2024", status: "active" },
  { id: "2", name: "Mary Wanjiku", email: "mary@example.com", phone: "+254723456789", totalOrders: 1, totalSpent: 184000, joinedDate: "May 2024", lastOrder: "June 14, 2024", status: "active" },
  { id: "3", name: "Peter Ochieng", email: "peter@example.com", phone: "+254734567890", totalOrders: 2, totalSpent: 391000, joinedDate: "Mar 2024", lastOrder: "June 10, 2024", status: "active" },
  { id: "4", name: "Grace Akinyi", email: "grace@example.com", phone: "+254745678901", totalOrders: 1, totalSpent: 310000, joinedDate: "June 2024", lastOrder: "June 8, 2024", status: "active" },
  { id: "5", name: "David Mwangi", email: "david@example.com", phone: "+254756789012", totalOrders: 0, totalSpent: 0, joinedDate: "May 2024", lastOrder: "Never", status: "inactive" },
  { id: "6", name: "Sarah Njeri", email: "sarah@example.com", phone: "+254767890123", totalOrders: 2, totalSpent: 342000, joinedDate: "Feb 2024", lastOrder: "June 5, 2024", status: "active" },
  { id: "7", name: "James Kipchoge", email: "james@example.com", phone: "+254778901234", totalOrders: 4, totalSpent: 589000, joinedDate: "Jan 2024", lastOrder: "June 12, 2024", status: "active" },
  { id: "8", name: "Lucy Wangari", email: "lucy@example.com", phone: "+254789012345", totalOrders: 1, totalSpent: 198000, joinedDate: "Apr 2024", lastOrder: "June 3, 2024", status: "active" },
  { id: "9", name: "Tom Omondi", email: "tom@example.com", phone: "+254790123456", totalOrders: 3, totalSpent: 478000, joinedDate: "Mar 2024", lastOrder: "June 9, 2024", status: "active" },
  { id: "10", name: "Jane Mutua", email: "jane@example.com", phone: "+254701234567", totalOrders: 2, totalSpent: 367000, joinedDate: "Feb 2024", lastOrder: "June 7, 2024", status: "active" },
];

export default function CustomersPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [showMessageDialog, setShowMessageDialog] = useState(false);
  const [messageSubject, setMessageSubject] = useState("");
  const [messageContent, setMessageContent] = useState("");

  const filteredCustomers = dummyCustomers.filter((customer) =>
    customer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    customer.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalPages = Math.ceil(filteredCustomers.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedCustomers = filteredCustomers.slice(startIndex, startIndex + ITEMS_PER_PAGE);

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
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Customers</h1>
        <p className="text-muted-foreground">Registered customer accounts</p>
      </div>

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
              {paginatedCustomers.map((customer) => (
                <tr
                  key={customer.id}
                  onClick={() => setSelectedCustomer(customer)}
                  className="border-b border-border last:border-0 hover:bg-muted/50 cursor-pointer"
                >
                  <td className="p-3">
                    <div>
                      <div className="font-medium">{customer.name}</div>
                      <div className="text-xs text-muted-foreground">Joined {customer.joinedDate}</div>
                    </div>
                  </td>
                  <td className="hidden md:table-cell p-3 text-sm">
                    <div className="space-y-1">
                      <div>{customer.email}</div>
                      <div className="text-muted-foreground">{customer.phone}</div>
                    </div>
                  </td>
                  <td className="hidden sm:table-cell p-3 text-sm">{customer.totalOrders}</td>
                  <td className="hidden lg:table-cell p-3 text-sm font-medium">
                    KSh {customer.totalSpent.toLocaleString()}
                  </td>
                  <td className="p-3">
                    <span className={`inline-flex rounded-full px-2 py-1 text-xs font-medium ${
                      customer.status === "active"
                        ? "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300"
                        : "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300"
                    }`}>
                      {customer.status}
                    </span>
                  </td>
                  <td className="p-3" onClick={(e) => e.stopPropagation()}>
                    <Button variant="ghost" size="sm">
                      View
                    </Button>
                  </td>
                </tr>
              ))}
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

      {/* Customer Detail Dialog - Smaller on Mobile */}
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
              <h2 className="text-xl sm:text-2xl font-semibold mb-2">{selectedCustomer.name}</h2>
              <span className={`inline-flex rounded-full px-2 py-1 text-xs font-medium ${
                selectedCustomer.status === "active"
                  ? "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300"
                  : "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300"
              }`}>
                {selectedCustomer.status}
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
                  <span>{selectedCustomer.phone}</span>
                </div>
              </div>

              <div className="border-t border-border" />

              <div className="grid grid-cols-2 gap-4 text-center text-sm">
                <div>
                  <div className="text-2xl font-bold mb-1">{selectedCustomer.totalOrders}</div>
                  <p className="text-xs text-muted-foreground">Orders</p>
                </div>
                <div>
                  <div className="text-2xl font-bold mb-1">KSh {(selectedCustomer.totalSpent / 1000).toFixed(0)}K</div>
                  <p className="text-xs text-muted-foreground">Spent</p>
                </div>
              </div>

              <div className="border-t border-border" />

              <div className="grid grid-cols-2 gap-4 text-center text-sm">
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Joined</p>
                  <p className="font-medium text-sm">{selectedCustomer.joinedDate}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Last Order</p>
                  <p className="font-medium text-sm">{selectedCustomer.lastOrder}</p>
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

      {/* Message Dialog - Smaller on Mobile */}
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
    </div>
  );
}
