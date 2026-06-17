"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import RichTextEditor from "@/components/admin/rich-text-editor";
import { Search, Send, ArrowLeft, Mail, Phone } from "lucide-react";

interface Message {
  id: string;
  customerName: string;
  customerEmail: string;
  subject: string;
  preview: string;
  timestamp: string;
  unread: boolean;
  thread: MessageThread[];
}

interface MessageThread {
  id: string;
  sender: "customer" | "admin";
  senderName: string;
  content: string;
  timestamp: string;
}

const dummyMessages: Message[] = [
  {
    id: "1",
    customerName: "James Kipchoge",
    customerEmail: "james@example.com",
    subject: "Question about plan modifications",
    preview:
      "Hi, I'm interested in the Kenya Court Modern plan but would like to...",
    timestamp: "2 min ago",
    unread: true,
    thread: [
      {
        id: "1-1",
        sender: "customer",
        senderName: "James Kipchoge",
        content:
          "Hi, I'm interested in the Kenya Court Modern plan but would like to modify the kitchen layout. Is this possible?",
        timestamp: "2 min ago",
      },
    ],
  },
  {
    id: "2",
    customerName: "Sarah Njeri",
    customerEmail: "sarah@example.com",
    subject: "Foundation options inquiry",
    preview:
      "Hello, I need clarification on the foundation options available...",
    timestamp: "1 hour ago",
    unread: true,
    thread: [
      {
        id: "2-1",
        sender: "customer",
        senderName: "Sarah Njeri",
        content:
          "Hello, I need clarification on the foundation options available for the Ridge View plan.",
        timestamp: "1 hour ago",
      },
    ],
  },
  {
    id: "3",
    customerName: "Tom Omondi",
    customerEmail: "tom@example.com",
    subject: "CAD files request",
    preview: "I purchased the PDF set but now need the CAD files...",
    timestamp: "3 hours ago",
    unread: false,
    thread: [
      {
        id: "3-1",
        sender: "customer",
        senderName: "Tom Omondi",
        content:
          "I purchased the PDF set but now need the CAD files. Can I upgrade?",
        timestamp: "5 hours ago",
      },
      {
        id: "3-2",
        sender: "admin",
        senderName: "KEPlans Admin",
        content:
          "Yes, you can upgrade to CAD files. The price difference is KSh 100,000. I'll send you a payment link.",
        timestamp: "3 hours ago",
      },
    ],
  },
];

export default function MessagesPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);
  const [replyContent, setReplyContent] = useState("");

  const filteredMessages = dummyMessages.filter(
    (msg) =>
      msg.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      msg.subject.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const handleSendReply = () => {
    if (!replyContent.trim()) return;
    console.log("Sending reply:", replyContent);
    alert("Reply sent via email!");
    setReplyContent("");
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Messages</h1>
        <p className="text-muted-foreground">
          Customer inquiries and communication
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-[400px_1fr]">
        {/* Inbox List */}
        <div className="rounded-lg border border-border bg-card">
          {/* Search */}
          <div className="border-b border-border p-4">
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

          {/* Messages List */}
          <div className="max-h-[calc(100vh-300px)] overflow-y-auto">
            {filteredMessages.map((message) => (
              <button
                key={message.id}
                onClick={() => setSelectedMessage(message)}
                className={`w-full border-b border-border p-4 text-left transition-colors hover:bg-muted/50 ${
                  selectedMessage?.id === message.id ? "bg-muted/50" : ""
                }`}
              >
                <div className="flex items-start justify-between gap-2 mb-1">
                  <p
                    className={`font-medium ${message.unread ? "font-semibold" : ""}`}
                  >
                    {message.customerName}
                  </p>
                  <span className="text-xs text-muted-foreground whitespace-nowrap">
                    {message.timestamp}
                  </span>
                </div>
                <p
                  className={`text-sm mb-1 ${message.unread ? "font-medium" : "text-muted-foreground"}`}
                >
                  {message.subject}
                </p>
                <p className="text-sm text-muted-foreground line-clamp-1">
                  {message.preview}
                </p>
                {message.unread && (
                  <div className="mt-2">
                    <span className="inline-flex size-2 rounded-full bg-blue-500" />
                  </div>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Conversation View */}
        <div className="rounded-lg border border-border bg-card">
          {!selectedMessage ? (
            <div className="flex h-[calc(100vh-300px)] items-center justify-center text-center p-8">
              <div>
                <Mail className="size-12 mx-auto mb-4 text-muted-foreground" />
                <h3 className="font-semibold mb-2">No message selected</h3>
                <p className="text-sm text-muted-foreground">
                  Select a message from the inbox to view the conversation
                </p>
              </div>
            </div>
          ) : (
            <div className="flex h-[calc(100vh-300px)] flex-col">
              {/* Header */}
              <div className="border-b border-border p-6">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSelectedMessage(null)}
                  className="mb-4 lg:hidden"
                >
                  <ArrowLeft className="size-4 mr-2" />
                  Back
                </Button>
                <h2 className="text-xl font-semibold mb-2">
                  {selectedMessage.subject}
                </h2>
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <Mail className="size-4" />
                    {selectedMessage.customerEmail}
                  </div>
                </div>
              </div>

              {/* Thread */}
              <div className="flex-1 overflow-y-auto p-6 space-y-6">
                {selectedMessage.thread.map((msg) => (
                  <div
                    key={msg.id}
                    className={`${
                      msg.sender === "admin"
                        ? "ml-auto max-w-[80%]"
                        : "mr-auto max-w-[80%]"
                    }`}
                  >
                    <div
                      className={`rounded-2xl p-4 ${
                        msg.sender === "admin"
                          ? "bg-green-500/10 text-background"
                          : "bg-muted"
                      }`}
                    >
                      <p
                        className={`text-sm font-medium mb-2 ${
                          msg.sender === "admin"
                            ? "text-foreground/70"
                            : "text-muted-foreground"
                        }`}
                      >
                        {msg.senderName}
                      </p>
                      <p className="text-sm text-foreground">{msg.content}</p>
                      <p
                        className={`text-xs mt-2 ${
                          msg.sender === "admin"
                            ? "text-foreground/50"
                            : "text-muted-foreground"
                        }`}
                      >
                        {msg.timestamp}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Reply Box */}
              <div className="border-t border-border p-6 space-y-4">
                <RichTextEditor
                  content={replyContent}
                  onChange={setReplyContent}
                  placeholder="Type your reply..."
                />
                <div className="flex justify-end gap-2">
                  <Button variant="outline" onClick={() => setReplyContent("")}>
                    Clear
                  </Button>
                  <Button onClick={handleSendReply}>
                    <Send className="size-4 mr-2" />
                    Send Reply
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
