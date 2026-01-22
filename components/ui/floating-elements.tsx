"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

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

export function FloatingElements({
  className,
  count = 6,
  colors,
}: FloatingElementsProps) {
  const [elements, setElements] = useState<FloatingElement[]>([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const colorArray = colors ?? DEFAULT_COLORS;
    const generated = Array.from({ length: count }, (_, i) => ({
      id: i,
      size: Math.random() * 60 + 20,
      x: Math.random() * 100,
      y: Math.random() * 100,
      duration: Math.random() * 10 + 15,
      delay: Math.random() * 5,
      color: colorArray[Math.floor(Math.random() * colorArray.length)],
    }));
    setElements(generated);
    setMounted(true);
  }, [count, colors]);

  if (!mounted) {
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
  const [particles, setParticles] = useState<Particle[]>([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const generated = Array.from({ length: particleCount }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 4 + 1,
      duration: Math.random() * 20 + 10,
      delay: Math.random() * 10,
    }));
    setParticles(generated);
    setMounted(true);
  }, [particleCount]);

  if (!mounted) {
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
