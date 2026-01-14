import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";

export default function IntroductionLoading() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <Navbar />

      {/* Hero Skeleton */}
      <section className="container mx-auto px-4 py-16 md:py-20">
        <div className="text-center max-w-3xl mx-auto">
          <div className="h-6 w-32 rounded-full bg-muted animate-pulse mx-auto" />
          <div className="mt-4 h-12 w-3/4 rounded-md bg-muted animate-pulse mx-auto" />
          <div className="mt-4 h-5 w-2/3 rounded-md bg-muted animate-pulse mx-auto" />
        </div>
      </section>

      {/* Cards Skeleton */}
      <section className="container mx-auto px-4 pb-16 md:pb-24">
        <div className="grid grid-cols-1 gap-6">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="rounded-xl border bg-card p-6">
              <div className="h-6 w-48 rounded bg-muted animate-pulse" />
              <div className="mt-2 h-4 w-72 rounded bg-muted animate-pulse" />
              <div className="mt-6 space-y-2">
                <div className="h-3 w-full rounded bg-muted animate-pulse" />
                <div className="h-3 w-11/12 rounded bg-muted animate-pulse" />
                <div className="h-3 w-10/12 rounded bg-muted animate-pulse" />
              </div>
            </div>
          ))}
        </div>
      </section>

      <Footer />
    </div>
  );
}
