"use client";

import { useEffect, useRef, useState } from "react";

export { HeroCanvas } from "./hero-canvas";

export function AnimatedScoreBar({
  label,
  score,
  max,
  delay,
}: {
  label: string;
  score: number;
  max: number;
  delay: number;
}) {
  const [visible, setVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;
    let timer: number | undefined;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        timer = window.setTimeout(() => setVisible(true), delay);
        observer.disconnect();
      },
      { threshold: 0.1 }
    );
    observer.observe(element);
    return () => {
      observer.disconnect();
      if (timer !== undefined) window.clearTimeout(timer);
    };
  }, [delay]);

  return (
    <div ref={ref} className="mb-5 last:mb-0">
      <div className="mb-2 flex justify-between text-xs text-white/75">
        <span>{label}</span>
        <span className="font-mono text-white">
          {score}/{max}
        </span>
      </div>
      <div className="h-1.5 overflow-hidden rounded-full bg-white/10">
        <div
          className="h-full rounded-full bg-linear-to-r from-[#6C63D6] to-[#A480F2] transition-all duration-1000 ease-out"
          style={{ width: visible ? `${(score / max) * 100}%` : "0%" }}
        />
      </div>
    </div>
  );
}

export function ScrollReveal({
  children,
  className = "",
  delay = 0,
  direction = "up",
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  direction?: "up" | "down" | "left" | "right" | "none";
}) {
  const [visible, setVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1, rootMargin: "0px 0px -50px 0px" }
    );
    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  const transforms = {
    up: "translateY(36px)",
    down: "translateY(-36px)",
    left: "translateX(36px)",
    right: "translateX(-36px)",
    none: "none",
  };

  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translate(0, 0)" : transforms[direction],
        transition: `opacity 0.75s cubic-bezier(0.16, 1, 0.3, 1) ${delay}ms, transform 0.75s cubic-bezier(0.16, 1, 0.3, 1) ${delay}ms`,
      }}
    >
      {children}
    </div>
  );
}
