"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Send, ArrowLeft, Mail, Phone, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { replyToMessage, markThreadAsRead } from "@/app/actions/messages";
import { useRouter } from "next/navigation";

interface MessageThread {
  id: string;
  sender: "customer" | "admin";
  senderName: string;
  content: string;
  timestamp: Date;
  read: boolean;
}

interface Message {
  id: string;
  customerName: string;
  customerEmail: string;
  customerPhone?: string | null;
  subject: string;
  preview: string;
  timestamp: Date;
  unread: boolean;
  unreadCount: number;
  threadCount: number;
  thread: MessageThread[];
}

interface MessagesInboxProps {
  messages: Message[];
}

export default function MessagesInbox({ messages }: MessagesInboxProps) {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);
  const [replyText, setReplyText] = useState("");
  const [sending, setSending] = useState(false);

  const filteredMessages = messages.filter(
    (msg) =>
      msg.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      msg.customerEmail.toLowerCase().includes(searchQuery.toLowerCase()) ||
      msg.subject.toLowerCase().includes(searchQuery.toLowerCase())
  );

  function formatTimeAgo(date: Date) {
    const seconds = Math.floor((new Date().getTime() - new Date(date).getTime()) / 1000);
    if (seconds < 60) return `${seconds}s ago`;
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
    return `${Math.floor(seconds / 86400)}d ago`;
  }

  async function handleSelectMessage(msg: Message) {
    setSelectedMessage(msg);
    if (msg.unread) {
      await markThreadAsRead(msg.id);
      router.refresh();
    }
  }

  async function handleSendReply() {
    if (!selectedMessage || !replyText.trim()) {
      toast.error("Please enter a reply");
      return;
    }

    setSending(true);
    const result = await replyToMessage(selectedMessage.id, replyText);

    if (result.success) {
      toast.success("Reply sent successfully");
      setReplyText("");
      router.refresh();
    } else {
      toast.error(result.error || "Failed to send reply");
    }
    setSending(false);
  }

  return (
    <div className="grid md:grid-cols-[380px_1fr] gap-6 h-[calc(100vh-200px)]">
      {/* Messages List */}
      <div className="rounded-lg border border-border bg-card flex flex-col">
        <div className="p-4 border-b border-border">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search messages..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="h-10 pl-9"
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">
          {filteredMessages.length === 0 ? (
            <div className="p-8 text-center text-muted-foreground">
              <Mail className="size-12 mx-auto mb-3 opacity-50" />
              <p>No messages found</p>
            </div>
          ) : (
            filteredMessages.map((msg) => (
              <button
                key={msg.id}
                onClick={() => handleSelectMessage(msg)}
                className={`w-full text-left p-4 border-b border-border transition-colors hover:bg-muted/50 ${
                  selectedMessage?.id === msg.id ? "bg-muted" : ""
                } ${msg.unread ? "bg-blue-50 dark:bg-blue-950" : ""}`}
              >
                <div className="flex items-start justify-between gap-2 mb-1">
                  <div className="font-semibold text-sm line-clamp-1">
                    {msg.customerName}
                  </div>
                  {msg.unread && (
                    <span className="shrink-0 size-2 rounded-full bg-blue-600" />
                  )}
                </div>
                <div className="text-sm font-medium text-muted-foreground line-clamp-1 mb-1">
                  {msg.subject}
                </div>
                <div className="text-xs text-muted-foreground line-clamp-2 mb-2">
                  {msg.preview}
                </div>
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span>{formatTimeAgo(msg.timestamp)}</span>
                  {msg.threadCount > 1 && (
                    <span className="text-blue-600">
                      {msg.threadCount} messages
                    </span>
                  )}
                </div>
              </button>
            ))
          )}
        </div>
      </div>

      {/* Message Detail */}
      <div className="rounded-lg border border-border bg-card flex flex-col">
        {!selectedMessage ? (
          <div className="flex-1 flex items-center justify-center text-muted-foreground">
            <div className="text-center">
              <Mail className="size-16 mx-auto mb-4 opacity-30" />
              <p>Select a message to view</p>
            </div>
          </div>
        ) : (
          <>
            {/* Header */}
            <div className="p-6 border-b border-border">
              <div className="flex items-start justify-between gap-4 mb-4">
                <button
                  onClick={() => setSelectedMessage(null)}
                  className="md:hidden p-2 hover:bg-muted rounded-full"
                >
                  <ArrowLeft className="size-5" />
                </button>
                <div className="flex-1">
                  <h2 className="text-xl font-semibold mb-1">
                    {selectedMessage.subject}
                  </h2>
                  <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-2">
                      <Mail className="size-4" />
                      <span>{selectedMessage.customerEmail}</span>
                    </div>
                    {selectedMessage.customerPhone && (
                      <div className="flex items-center gap-2">
                        <Phone className="size-4" />
                        <span>{selectedMessage.customerPhone}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Thread */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {selectedMessage.thread.map((msg, idx) => (
                <div
                  key={msg.id}
                  className={`${
                    msg.sender === "admin"
                      ? "ml-8 bg-blue-50 dark:bg-blue-950"
                      : "mr-8 bg-muted/50"
                  } p-4 rounded-lg`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-semibold text-sm">
                      {msg.senderName}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {formatTimeAgo(msg.timestamp)}
                    </span>
                  </div>
                  <div className="text-sm whitespace-pre-wrap">{msg.content}</div>
                </div>
              ))}
            </div>

            {/* Reply Box */}
            <div className="p-6 border-t border-border">
              <div className="space-y-3">
                <textarea
                  placeholder="Type your reply..."
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  rows={4}
                  className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-primary"
                />
                <div className="flex justify-end">
                  <Button onClick={handleSendReply} disabled={sending || !replyText.trim()}>
                    {sending ? (
                      <>
                        <Loader2 className="size-4 mr-2 animate-spin" />
                        Sending...
                      </>
                    ) : (
                      <>
                        <Send className="size-4 mr-2" />
                        Send Reply
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
