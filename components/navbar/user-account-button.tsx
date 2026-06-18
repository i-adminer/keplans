"use client";

import { User } from "lucide-react";
import Link from "next/link";
import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { signOut } from "@/app/actions/auth";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export default function UserAccountButton() {
  const [user, setUser] = useState<{ name: string; email: string } | null>(null);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const fetchUser = () => {
    fetch("/api/auth/me")
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => setUser(data))
      .catch(() => setUser(null));
  };

  useEffect(() => {
    fetchUser();
    
    // Refetch on page visibility (when user returns to tab)
    const handleVisibilityChange = () => {
      if (!document.hidden) {
        fetchUser();
      }
    };
    
    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => document.removeEventListener("visibilitychange", handleVisibilityChange);
  }, []);

  const handleSignOut = async () => {
    setLoading(true);
    setOpen(false); // Close dialog immediately
    
    try {
      await signOut();
      toast.success("Signed out successfully!");
      setUser(null);
      window.location.href = "/";
    } catch (error) {
      toast.error("Failed to sign out");
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <Link href="/signin" aria-label="Sign in">
        <User className="text-white cursor-pointer size-5 hover:text-gray-200 transition-colors" />
      </Link>
    );
  }

  return (
    <>
      <button onClick={() => setOpen(true)} aria-label="Account">
        <User className="text-white cursor-pointer size-5 hover:text-gray-200 transition-colors" />
      </button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Account</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <p className="text-sm text-muted-foreground">Name</p>
              <p className="font-medium">{user.name}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Email</p>
              <p className="font-medium">{user.email}</p>
            </div>
            <Button
              onClick={handleSignOut}
              disabled={loading}
              className="w-full"
              variant="outline"
            >
              {loading ? "Signing out..." : "Sign Out"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
