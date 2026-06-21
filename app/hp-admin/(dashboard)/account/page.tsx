"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import ThemeSwitcher from "@/components/theme-switcher";
import { ArrowLeft, User, Shield } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import { getCurrentUser } from "@/app/actions/auth";
import { changePassword, requestOTP } from "@/app/actions/auth";

export default function AccountPage() {
  const [admin, setAdmin] = useState<{ firstName: string; lastName: string; email: string } | null>(null);
  const [loading, setLoading] = useState(true);
  const [showPasswordChange, setShowPasswordChange] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [otp, setOtp] = useState(["", "", "", ""]);
  const [otpSent, setOtpSent] = useState(false);
  const [sendingOtp, setSendingOtp] = useState(false);
  const [changingPassword, setChangingPassword] = useState(false);

  useEffect(() => {
    getCurrentUser().then((user) => {
      if (user) {
        setAdmin(user);
      }
      setLoading(false);
    });
  }, []);

  const handleOtpChange = (index: number, value: string) => {
    if (value.length > 1) return;
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    
    if (value && index < 3) {
      const nextInput = document.getElementById(`otp-${index + 1}`);
      nextInput?.focus();
    }
  };

  const handleRequestOtp = async () => {
    if (!currentPassword || !newPassword || !confirmPassword) {
      toast.error("Please fill in all password fields");
      return;
    }
    if (newPassword !== confirmPassword) {
      toast.error("New passwords don't match");
      return;
    }
    if (newPassword.length < 8) {
      toast.error("Password must be at least 8 characters");
      return;
    }

    setSendingOtp(true);
    const result = await requestOTP("password_change");
    if ("success" in result && result.success) {
      setOtpSent(true);
      toast.success("OTP sent to your email!");
    } else {
      toast.error("error" in result ? result.error : "Failed to send OTP");
    }
    setSendingOtp(false);
  };

  const handleChangePassword = async () => {
    const otpCode = otp.join("");
    if (otpCode.length !== 4) {
      toast.error("Please enter complete OTP");
      return;
    }

    setChangingPassword(true);
    const formData = new FormData();
    formData.append("currentPassword", currentPassword);
    formData.append("newPassword", newPassword);
    formData.append("otp", otpCode);

    const result = await changePassword(formData);
    
    if ("success" in result && result.success) {
      toast.success("Password changed successfully!");
      setShowPasswordChange(false);
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setOtp(["", "", "", ""]);
      setOtpSent(false);
    } else {
      toast.error("error" in result ? result.error : "Failed to change password");
    }
    setChangingPassword(false);
  };

  if (loading) {
    return <div className="flex justify-center p-8">Loading...</div>;
  }

  return (
    <div className="space-y-6">
      <Button variant="outline" size="sm" asChild>
        <Link href="/hp-admin">
          <ArrowLeft className="size-4 mr-2" />
          Back to Dashboard
        </Link>
      </Button>

      <div className="mx-auto max-w-2xl">
        <div className="rounded-xl border border-border bg-card overflow-hidden">
          {/* Header */}
          <div className="border-b border-border bg-muted/30 px-6 py-8 text-center">
            <div className="size-20 mx-auto mb-4 rounded-full bg-primary/10 flex items-center justify-center">
              <User className="size-10 text-foreground" />
            </div>
            <h1 className="text-2xl font-semibold mb-1">Account Settings</h1>
            <p className="text-muted-foreground">Manage your admin account</p>
          </div>

          {/* Body */}
          <div className="p-6 space-y-6">
            {/* Profile Info */}
            <div className="space-y-4">
              <h3 className="font-semibold flex items-center gap-2">
                <User className="size-4" />
                Profile Information
              </h3>
              <div className="space-y-3">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Name</label>
                  <Input 
                    value={admin ? `${admin.firstName} ${admin.lastName}` : ""} 
                    readOnly 
                    className="h-10" 
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Email</label>
                  <Input 
                    value={admin?.email || ""} 
                    readOnly 
                    className="h-10" 
                  />
                </div>
              </div>
            </div>

            <div className="border-t border-border" />

            {/* Theme */}
            <div className="space-y-4">
              <h3 className="font-semibold">Theme</h3>
              <div className="flex items-center justify-between">
                <p className="text-sm text-muted-foreground">Choose your preferred theme</p>
                <ThemeSwitcher />
              </div>
            </div>

            <div className="border-t border-border" />

            {/* Password */}
            <div className="space-y-4">
              <h3 className="font-semibold flex items-center gap-2">
                <Shield className="size-4" />
                Security
              </h3>
              
              {!showPasswordChange ? (
                <Button onClick={() => setShowPasswordChange(true)} className="w-full">
                  Change Password
                </Button>
              ) : (
                <div className="space-y-4 rounded-lg border border-border p-4">
                  <div className="space-y-3">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Current Password</label>
                      <Input
                        type="password"
                        value={currentPassword}
                        onChange={(e) => setCurrentPassword(e.target.value)}
                        className="h-10"
                        disabled={otpSent}
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">New Password</label>
                      <Input
                        type="password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        className="h-10"
                        disabled={otpSent}
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Confirm New Password</label>
                      <Input
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className="h-10"
                        disabled={otpSent}
                      />
                    </div>
                  </div>

                  {otpSent && (
                    <div className="space-y-3 pt-4 border-t border-border">
                      <label className="text-sm font-medium">Enter OTP (sent to your email)</label>
                      <div className="flex gap-2 justify-center">
                        {otp.map((digit, index) => (
                          <Input
                            key={index}
                            id={`otp-${index}`}
                            type="text"
                            inputMode="numeric"
                            maxLength={1}
                            value={digit}
                            onChange={(e) => handleOtpChange(index, e.target.value)}
                            className="h-12 w-12 text-center text-lg font-semibold"
                          />
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      onClick={() => {
                        setShowPasswordChange(false);
                        setCurrentPassword("");
                        setNewPassword("");
                        setConfirmPassword("");
                        setOtp(["", "", "", ""]);
                        setOtpSent(false);
                      }}
                      className="flex-1"
                    >
                      Cancel
                    </Button>
                    {!otpSent ? (
                      <Button onClick={handleRequestOtp} disabled={sendingOtp} className="flex-1">
                        {sendingOtp ? "Sending..." : "Send OTP"}
                      </Button>
                    ) : (
                      <Button 
                        onClick={handleChangePassword} 
                        disabled={changingPassword}
                        className="flex-1"
                      >
                        {changingPassword ? "Changing..." : "Change Password"}
                      </Button>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
