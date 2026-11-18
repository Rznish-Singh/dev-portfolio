import { Footer } from "@/components/footer";

export default function WritingLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="mx-auto w-full max-w-2xl px-5 pb-24 pt-8 sm:pt-10 lg:pt-20">
      <main className="animate-fade-up">{children}</main>
      <Footer />
    </div>
  );
}