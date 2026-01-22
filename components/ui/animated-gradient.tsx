"use client";

import { cn } from "@/lib/utils";
import { type ReactNode } from "react";

interface AnimatedGradientProps {
  children?: ReactNode;
  className?: string;
}

export function AnimatedGradient({ children, className }: AnimatedGradientProps) {
  return (
    <div className={cn("relative", className)}>
      <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 animate-gradient-x opacity-20 blur-3xl" />
      {children}
    </div>
  );
}

interface GlowingBorderProps {
  children: ReactNode;
  className?: string;
  glowColor?: string;
}

export function GlowingBorder({ 
  children, 
  className,
  glowColor = "from-indigo-500 via-purple-500 to-pink-500" 
}: GlowingBorderProps) {
  return (
    <div className={cn("relative group", className)}>
      <div className={cn(
        "absolute -inset-0.5 bg-gradient-to-r rounded-2xl opacity-0 group-hover:opacity-75 blur transition-all duration-500",
        glowColor
      )} />
      <div className="relative bg-white rounded-2xl">
        {children}
      </div>
    </div>
  );
}

interface PulsingDotProps {
  className?: string;
  color?: string;
}

export function PulsingDot({ className, color = "bg-indigo-500" }: PulsingDotProps) {
  return (
    <span className={cn("relative flex h-3 w-3", className)}>
      <span className={cn(
        "animate-ping absolute inline-flex h-full w-full rounded-full opacity-75",
        color
      )} />
      <span className={cn(
        "relative inline-flex rounded-full h-3 w-3",
        color
      )} />
    </span>
  );
}

interface TypewriterTextProps {
  text: string;
  className?: string;
  speed?: number;
}

export function TypewriterText({ text, className, speed = 100 }: TypewriterTextProps) {
  return (
    <span 
      className={cn("inline-block", className)}
      style={{
        animation: `typing ${text.length * speed}ms steps(${text.length}), blink-caret 750ms step-end infinite`,
        overflow: "hidden",
        whiteSpace: "nowrap",
        borderRight: "3px solid",
      }}
    >
      {text}
    </span>
  );
}
