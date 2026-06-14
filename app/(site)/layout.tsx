import Footer from "@/components/home/footer";
import Navbar from "@/components/navbar/navbar";

export default function SiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="bg-backgroundt w-full">
      <Navbar />
      <main className="bg-background lg:w-[75%] mx-auto shadow-2xl border dark:border-primary">
        {children}
        <Footer />
      </main>
    </div>
  );
}
