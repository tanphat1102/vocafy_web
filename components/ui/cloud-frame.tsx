"use client";

import { cn } from "@/lib/utils";
import { type ReactNode } from "react";

interface CloudFrameProps {
  children: ReactNode;
  className?: string;
}

export function CloudFrame({ children, className }: CloudFrameProps) {
  return (
    <div className={cn("relative", className)}>
      {/* Cloud shape container */}
      <div className="relative">
        {/* Main cloud bubbles */}
        <div className="absolute -top-8 left-1/4 w-20 h-20 bg-white dark:bg-gray-800 rounded-full blur-sm opacity-80" />
        <div className="absolute -top-12 left-1/3 w-28 h-28 bg-white dark:bg-gray-800 rounded-full blur-sm opacity-80" />
        <div className="absolute -top-8 left-1/2 w-24 h-24 bg-white dark:bg-gray-800 rounded-full blur-sm opacity-80" />
        <div className="absolute -top-10 right-1/3 w-26 h-26 bg-white dark:bg-gray-800 rounded-full blur-sm opacity-80" />
        <div className="absolute -top-6 right-1/4 w-20 h-20 bg-white dark:bg-gray-800 rounded-full blur-sm opacity-80" />
        
        {/* Side bubbles */}
        <div className="absolute top-1/4 -left-6 w-16 h-16 bg-white dark:bg-gray-800 rounded-full blur-sm opacity-60" />
        <div className="absolute top-1/2 -left-8 w-20 h-20 bg-white dark:bg-gray-800 rounded-full blur-sm opacity-60" />
        <div className="absolute top-1/4 -right-6 w-16 h-16 bg-white dark:bg-gray-800 rounded-full blur-sm opacity-60" />
        <div className="absolute top-1/2 -right-8 w-20 h-20 bg-white dark:bg-gray-800 rounded-full blur-sm opacity-60" />
        
        {/* Bottom bubbles */}
        <div className="absolute -bottom-6 left-1/4 w-18 h-18 bg-white dark:bg-gray-800 rounded-full blur-sm opacity-70" />
        <div className="absolute -bottom-8 left-1/2 w-24 h-24 bg-white dark:bg-gray-800 rounded-full blur-sm opacity-70" />
        <div className="absolute -bottom-6 right-1/4 w-18 h-18 bg-white dark:bg-gray-800 rounded-full blur-sm opacity-70" />
        
        {/* Main content container */}
        <div className="relative bg-white dark:bg-gray-800 rounded-3xl shadow-2xl overflow-hidden">
          {children}
        </div>
      </div>
    </div>
  );
}

interface CircleImageFrameProps {
  src?: string;
  alt?: string;
  className?: string;
  children?: ReactNode;
}

export function CircleImageFrame({
  src,
  alt,
  className,
  children,
}: CircleImageFrameProps) {
  const placeholderText = alt || src || "";

  return (
    <div className={cn("relative flex justify-center items-end gap-4 py-8", className)}>
      {/* Circle frames for images */}
      <div className="w-32 h-32 md:w-40 md:h-40 rounded-full overflow-hidden border-4 border-white dark:border-gray-700 shadow-xl bg-gradient-to-br from-indigo-100 to-blue-100 dark:from-gray-700 dark:to-gray-600 -rotate-6 hover:rotate-0 transition-transform duration-500">
        {children || (
          <div className="w-full h-full flex items-center justify-center">
            <span className="text-4xl">{placeholderText || "📚"}</span>
          </div>
        )}
      </div>
      <div className="w-36 h-36 md:w-48 md:h-48 rounded-full overflow-hidden border-4 border-white dark:border-gray-700 shadow-xl bg-gradient-to-br from-purple-100 to-pink-100 dark:from-gray-700 dark:to-gray-600 hover:scale-105 transition-transform duration-500">
        {children || (
          <div className="w-full h-full flex items-center justify-center">
            <span className="text-5xl">{placeholderText || "🎓"}</span>
          </div>
        )}
      </div>
      <div className="w-28 h-28 md:w-36 md:h-36 rounded-full overflow-hidden border-4 border-white dark:border-gray-700 shadow-xl bg-gradient-to-br from-emerald-100 to-teal-100 dark:from-gray-700 dark:to-gray-600 rotate-6 hover:rotate-0 transition-transform duration-500">
        {children || (
          <div className="w-full h-full flex items-center justify-center">
            <span className="text-3xl">{placeholderText || "✨"}</span>
          </div>
        )}
      </div>
      <div className="w-32 h-32 md:w-44 md:h-44 rounded-full overflow-hidden border-4 border-white dark:border-gray-700 shadow-xl bg-gradient-to-br from-amber-100 to-orange-100 dark:from-gray-700 dark:to-gray-600 -rotate-3 hover:rotate-0 transition-transform duration-500">
        {children || (
          <div className="w-full h-full flex items-center justify-center">
            <span className="text-4xl">{placeholderText || "🚀"}</span>
          </div>
        )}
      </div>
    </div>
  );
}

interface AlternatingSectionProps {
  title: string;
  description: string;
  imageContent?: ReactNode;
  badge?: string;
  badgeIcon?: ReactNode;
  isReversed?: boolean;
  bgColor?: "white" | "gray" | "indigo" | "blue" | "emerald" | "purple";
  children?: ReactNode;
}

const bgColorClasses = {
  white: "bg-white dark:bg-gray-900",
  gray: "bg-gray-50 dark:bg-gray-800",
  indigo: "bg-indigo-50 dark:bg-indigo-950/30",
  blue: "bg-blue-50 dark:bg-blue-950/30",
  emerald: "bg-emerald-50 dark:bg-emerald-950/30",
  purple: "bg-purple-50 dark:bg-purple-950/30",
};

export function AlternatingSection({
  title,
  description,
  imageContent,
  badge,
  badgeIcon,
  isReversed = false,
  bgColor = "white",
  children,
}: AlternatingSectionProps) {
  return (
    <section className={cn("py-16 md:py-24 transition-colors duration-500", bgColorClasses[bgColor])}>
      <div className="container mx-auto px-4">
        <div className={cn(
          "grid md:grid-cols-2 gap-12 items-center",
          isReversed && "md:flex-row-reverse"
        )}>
          {/* Text Content */}
          <div className={cn("space-y-6", isReversed && "md:order-2")}>
            {badge && (
              <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-100 dark:bg-indigo-900/50 text-indigo-600 dark:text-indigo-300 text-sm font-medium">
                {badgeIcon}
                {badge}
              </span>
            )}
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold leading-tight dark:text-white">
              {title}
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300 leading-relaxed">
              {description}
            </p>
            {children}
          </div>

          {/* Image Content */}
          <div className={cn("relative", isReversed && "md:order-1")}>
            {imageContent || (
              <div className="aspect-video bg-gradient-to-br from-indigo-400 via-purple-400 to-pink-400 rounded-2xl shadow-xl flex items-center justify-center">
                <span className="text-6xl">📖</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
