"use client";

import { useMemo } from "react";
import { cn } from "@/lib/utils";
import { useHydrated } from "@/lib/use-hydrated";

const DEFAULT_COLORS = ["bg-indigo-400/20", "bg-blue-400/20", "bg-purple-400/20", "bg-emerald-400/20"];

interface FloatingElement {
  id: number;
  size: number;
  x: number;
  y: number;
  duration: number;
  delay: number;
  color: string;
}

interface FloatingElementsProps {
  className?: string;
  count?: number;
  colors?: string[];
}

function pseudoRandom(seed: number) {
  const value = Math.sin(seed) * 10000;
  return value - Math.floor(value);
}

export function FloatingElements({
  className,
  count = 6,
  colors,
}: FloatingElementsProps) {
  const isClient = useHydrated();

  const elements = useMemo<FloatingElement[]>(() => {
    const colorArray = colors ?? DEFAULT_COLORS;
    return Array.from({ length: count }, (_, i) => ({
      id: i,
      size: pseudoRandom(i * 7.17 + count) * 60 + 20,
      x: pseudoRandom(i * 11.23 + count) * 100,
      y: pseudoRandom(i * 13.37 + count) * 100,
      duration: pseudoRandom(i * 17.41 + count) * 10 + 15,
      delay: pseudoRandom(i * 19.61 + count) * 5,
      color: colorArray[
        Math.floor(pseudoRandom(i * 23.17 + count) * colorArray.length)
      ],
    }));
  }, [count, colors]);

  if (!isClient) {
    return <div className={cn("absolute inset-0 overflow-hidden pointer-events-none", className)} />;
  }

  return (
    <div className={cn("absolute inset-0 overflow-hidden pointer-events-none", className)}>
      {elements.map((el) => (
        <div
          key={el.id}
          className={cn(
            "absolute rounded-full blur-xl animate-float",
            el.color
          )}
          style={{
            width: el.size,
            height: el.size,
            left: `${el.x}%`,
            top: `${el.y}%`,
            animationDuration: `${el.duration}s`,
            animationDelay: `${el.delay}s`,
          }}
        />
      ))}
    </div>
  );
}

interface Particle {
  id: number;
  x: number;
  y: number;
  size: number;
  duration: number;
  delay: number;
}

interface ParticleFieldProps {
  className?: string;
  particleCount?: number;
}

export function ParticleField({ className, particleCount = 30 }: ParticleFieldProps) {
  const isClient = useHydrated();

  const particles = useMemo<Particle[]>(() => {
    return Array.from({ length: particleCount }, (_, i) => ({
      id: i,
      x: pseudoRandom(i * 3.31 + particleCount) * 100,
      y: pseudoRandom(i * 5.29 + particleCount) * 100,
      size: pseudoRandom(i * 7.07 + particleCount) * 4 + 1,
      duration: pseudoRandom(i * 9.91 + particleCount) * 20 + 10,
      delay: pseudoRandom(i * 11.11 + particleCount) * 10,
    }));
  }, [particleCount]);

  if (!isClient) {
    return <div className={cn("absolute inset-0 overflow-hidden pointer-events-none", className)} />;
  }

  return (
    <div className={cn("absolute inset-0 overflow-hidden pointer-events-none", className)}>
      {particles.map((p) => (
        <div
          key={p.id}
          className="absolute bg-white/30 rounded-full animate-twinkle"
          style={{
            width: p.size,
            height: p.size,
            left: `${p.x}%`,
            top: `${p.y}%`,
            animationDuration: `${p.duration}s`,
            animationDelay: `${p.delay}s`,
          }}
        />
      ))}
    </div>
  );
}
