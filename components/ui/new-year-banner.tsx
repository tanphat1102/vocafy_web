"use client";

import { useState } from "react";
import { X, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

export function NewYearBanner() {
  const [isVisible, setIsVisible] = useState(true);

  // Generate confetti pieces once using lazy initialization
  const [confetti] = useState(() =>
    Array.from({ length: 30 }, (_, i) => ({
      id: i,
      left: Math.random() * 100,
      delay: Math.random() * 2,
      duration: 3 + Math.random() * 2,
    })),
  );

  if (!isVisible) return null;

  return (
    <div className="relative overflow-hidden bg-linear-to-r from-red-600 via-yellow-500 to-red-600 dark:from-red-700 dark:via-yellow-600 dark:to-red-700">
      {/* Confetti Animation */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {confetti.map((piece) => (
          <div
            key={piece.id}
            className="absolute w-2 h-2 animate-confetti-fall"
            style={{
              left: `${piece.left}%`,
              top: "-10px",
              animationDelay: `${piece.delay}s`,
              animationDuration: `${piece.duration}s`,
              backgroundColor:
                piece.id % 3 === 0
                  ? "#fbbf24"
                  : piece.id % 3 === 1
                    ? "#ef4444"
                    : "#f97316",
            }}
          />
        ))}
      </div>

      {/* Sparkles floating effect */}
      <div className="absolute inset-0 opacity-30">
        {[...Array(8)].map((_, i) => (
          <Sparkles
            key={i}
            className="absolute animate-float text-yellow-200"
            style={{
              left: `${i * 12 + 5}%`,
              top: `${20 + (i % 3) * 20}%`,
              animationDelay: `${i * 0.3}s`,
            }}
          />
        ))}
      </div>

      <div className="container mx-auto px-4 py-4 sm:py-6 relative">
        <div className="flex items-center justify-between gap-4">
          <div className="flex-1 text-center">
            <div className="flex items-center justify-center gap-2 sm:gap-3 flex-wrap">
              <span className="text-2xl sm:text-3xl md:text-4xl animate-bounce">
                🎉
              </span>
              <h2 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold text-white drop-shadow-lg">
                Chúc Mừng Năm Mới 2026!
              </h2>
              <span
                className="text-2xl sm:text-3xl md:text-4xl animate-bounce"
                style={{ animationDelay: "0.2s" }}
              >
                🎊
              </span>
            </div>
            <p className="mt-2 text-sm sm:text-base md:text-lg text-yellow-50 font-medium drop-shadow">
              🐴 Năm Con Ngựa - Vạn Sự Như Ý, Học Tập Tiến Bộ! 🌟
            </p>
          </div>

          {/* Close button */}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsVisible(false)}
            className="text-white hover:bg-white/20 shrink-0 h-8 w-8 sm:h-10 sm:w-10"
            aria-label="Đóng banner"
          >
            <X className="h-4 w-4 sm:h-5 sm:w-5" />
          </Button>
        </div>
      </div>

      {/* Bottom wave effect */}
      <div className="absolute bottom-0 left-0 right-0 h-4 bg-linear-to-t from-background/20 to-transparent" />

      <style jsx>{`
        @keyframes confetti-fall {
          0% {
            transform: translateY(0) rotateZ(0deg);
            opacity: 1;
          }
          100% {
            transform: translateY(100vh) rotateZ(360deg);
            opacity: 0;
          }
        }

        @keyframes float {
          0%,
          100% {
            transform: translateY(0px) scale(1);
          }
          50% {
            transform: translateY(-20px) scale(1.1);
          }
        }

        .animate-confetti-fall {
          animation: confetti-fall linear infinite;
        }

        .animate-float {
          animation: float 3s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}
