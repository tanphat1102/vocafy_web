import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";

export default function ContactLoading() {
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

      {/* Mentor Skeleton */}
      <section className="container mx-auto px-4 pb-12">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-full bg-muted animate-pulse" />
          <div className="h-8 w-48 rounded bg-muted animate-pulse" />
        </div>
        <div className="max-w-md mx-auto rounded-xl border p-6">
          <div className="w-24 h-24 rounded-full bg-muted animate-pulse mx-auto mb-4" />
          <div className="h-6 w-24 rounded bg-muted animate-pulse mx-auto mb-2" />
          <div className="h-5 w-32 rounded bg-muted animate-pulse mx-auto" />
        </div>
      </section>

      {/* Team Skeleton */}
      <section className="bg-white py-12">
        <div className="container mx-auto px-4">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-full bg-muted animate-pulse" />
            <div className="h-8 w-48 rounded bg-muted animate-pulse" />
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="rounded-xl border p-4">
                <div className="w-16 h-16 rounded-full bg-muted animate-pulse mx-auto mb-3" />
                <div className="h-4 w-20 rounded bg-muted animate-pulse mx-auto mb-2" />
                <div className="h-4 w-24 rounded bg-muted animate-pulse mx-auto" />
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
