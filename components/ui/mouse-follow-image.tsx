"use client";

import { useRef, useState, type ReactNode, type MouseEvent } from "react";
import { cn } from "@/lib/utils";

interface MouseFollowImageProps {
  children: ReactNode;
  className?: string;
  /** Intensity of the mouse follow effect (default: 20) */
  intensity?: number;
  /** Enable 3D rotation effect */
  rotate3D?: boolean;
  /** Enable scale on hover */
  scaleOnHover?: boolean;
  /** Enable glow effect on hover */
  glowEffect?: boolean;
}

export function MouseFollowImage({
  children,
  className,
  intensity = 20,
  rotate3D = true,
  scaleOnHover = true,
  glowEffect = true,
}: MouseFollowImageProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [transform, setTransform] = useState({
    rotateX: 0,
    rotateY: 0,
    translateX: 0,
    translateY: 0,
  });
  const [isHovering, setIsHovering] = useState(false);

  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;

    const rect = containerRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    const mouseX = e.clientX - centerX;
    const mouseY = e.clientY - centerY;

    // Calculate rotation based on mouse position
    const rotateX = rotate3D ? (-mouseY / rect.height) * intensity : 0;
    const rotateY = rotate3D ? (mouseX / rect.width) * intensity : 0;

    // Calculate translation (parallax effect)
    const translateX = (mouseX / rect.width) * (intensity / 2);
    const translateY = (mouseY / rect.height) * (intensity / 2);

    setTransform({ rotateX, rotateY, translateX, translateY });
  };

  const handleMouseEnter = () => {
    setIsHovering(true);
  };

  const handleMouseLeave = () => {
    setIsHovering(false);
    setTransform({ rotateX: 0, rotateY: 0, translateX: 0, translateY: 0 });
  };

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className={cn(
        "relative transition-all duration-300 ease-out",
        scaleOnHover && isHovering && "scale-[1.02]",
        className
      )}
      style={{
        transform: `perspective(1000px) rotateX(${transform.rotateX}deg) rotateY(${transform.rotateY}deg) translateX(${transform.translateX}px) translateY(${transform.translateY}px)`,
        transformStyle: "preserve-3d",
      }}
    >
      {/* Glow effect */}
      {glowEffect && isHovering && (
        <div
          className="absolute inset-0 rounded-2xl opacity-50 blur-xl transition-opacity duration-300"
          style={{
            background: `radial-gradient(circle at ${50 + transform.rotateY * 2}% ${50 - transform.rotateX * 2}%, rgba(99, 102, 241, 0.4), transparent 70%)`,
          }}
        />
      )}
      {children}
    </div>
  );
}
