import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export const dynamic = 'force-dynamic';

export default function GlobalNotFound() {
  return (
    <div className="bg-cream dark:bg-cream/10 h-screen w-screen flex justify-center items-center">
      <div className="flex flex-col justify-center items-center">
        <div>
          <span className="font-semibold">A flower for your effort...</span>
          <img src={"/imgs/a_flower.png"} alt="flower" className="h-60" />
        </div>
        <h2 className="text-5xl font-bold font-realce text-destructive">
          404: Not Found
        </h2>
        <p>Could not find requested resource</p>
        <Link
          href="/"
          className="flex gap-2 items-center justify-center bg-white text-primary p-3 mt-3 rounded-md hover:p-2 cursor-pointer transition-all"
        >
          <ArrowLeft className="size-5" />
          Go Home
        </Link>
      </div>
    </div>
  );
}
