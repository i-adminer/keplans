"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import ThemeSwitcher from "@/components/theme-switcher";
import { ArrowLeft, User, Mail, Shield } from "lucide-react";
import Link from "next/link";

export default function AccountPage() {
  const [showPasswordChange, setShowPasswordChange] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [otp, setOtp] = useState(["", "", "", ""]);
  const [otpSent, setOtpSent] = useState(false);

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

  const handleRequestOtp = () => {
    if (!currentPassword || !newPassword || !confirmPassword) {
      alert("Please fill in all password fields");
      return;
    }
    if (newPassword !== confirmPassword) {
      alert("New passwords don't match");
      return;
    }
    setOtpSent(true);
    alert("OTP sent to your email!");
  };

  const handleChangePassword = () => {
    const otpCode = otp.join("");
    if (otpCode.length !== 4) {
      alert("Please enter complete OTP");
      return;
    }
    console.log("Changing password with OTP:", otpCode);
    alert("Password changed successfully!");
    setShowPasswordChange(false);
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
    setOtp(["", "", "", ""]);
    setOtpSent(false);
  };

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
                  <Input value="Admin User" readOnly className="h-10" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Email</label>
                  <Input value="admin@keplans.com" readOnly className="h-10" />
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
                      <Button onClick={handleRequestOtp} className="flex-1">
                        Send OTP
                      </Button>
                    ) : (
                      <Button onClick={handleChangePassword} className="flex-1">
                        Change Password
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
