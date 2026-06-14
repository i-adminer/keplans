import { redirect } from "next/navigation";

export default function TypoOtpRedirect() {
  redirect("/verify-otp");
}
