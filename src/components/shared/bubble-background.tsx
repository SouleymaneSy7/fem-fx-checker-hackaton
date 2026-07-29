"use client";

import { motion, useMotionValue, useSpring } from "motion/react";
import * as React from "react";

import { cn } from "@/lib/utils";
import type { BubbleBackgroundPropsType } from "@/types";

function BubbleBackground({
  ref,
  className,
  children,
  interactive = false,
  transition = { stiffness: 100, damping: 20 },
  colors = {
    first: "18,113,255",
    second: "221,74,255",
    third: "0,220,255",
    fourth: "200,50,50",
    fifth: "180,180,50",
    sixth: "140,100,255",
  },
  ...delegatedProps
}: BubbleBackgroundPropsType) {
  const containerRef = React.useRef<HTMLDivElement>(null);
  React.useImperativeHandle(ref, () => containerRef.current as HTMLDivElement);

  // Unique per mount so two BubbleBackground instances on the same page
  // never collide on a hardcoded "goo" id — url(#goo) would otherwise
  // always resolve to whichever <filter> happens to come first in the
  // DOM (same fix already applied to liquid-wave.tsx's clipPath).
  const gooFilterId = React.useId();

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const springX = useSpring(mouseX, transition);
  const springY = useSpring(mouseY, transition);

  const rectRef = React.useRef<DOMRect | null>(null);
  const rafIdRef = React.useRef<number | null>(null);

  React.useLayoutEffect(() => {
    const updateRect = () => {
      if (containerRef.current) {
        rectRef.current = containerRef.current.getBoundingClientRect();
      }
    };

    updateRect();

    const el = containerRef.current;
    const resizeObserver = new ResizeObserver(updateRect);
    if (el) resizeObserver.observe(el);

    window.addEventListener("resize", updateRect);
    window.addEventListener("scroll", updateRect, { passive: true });

    return () => {
      resizeObserver.disconnect();
      window.removeEventListener("resize", updateRect);
      window.removeEventListener("scroll", updateRect);
    };
  }, []);

  React.useEffect(() => {
    if (!interactive) return;

    const el = containerRef.current;
    if (!el) return;

    const handleMouseMove = (event: MouseEvent) => {
      const rect = rectRef.current;
      if (!rect) return;
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;

      if (rafIdRef.current != null) cancelAnimationFrame(rafIdRef.current);
      rafIdRef.current = requestAnimationFrame(() => {
        mouseX.set(event.clientX - centerX);
        mouseY.set(event.clientY - centerY);
      });
    };

    el.addEventListener("mousemove", handleMouseMove as EventListener, {
      passive: true,
    });

    return () => {
      el.removeEventListener("mousemove", handleMouseMove as EventListener);
      if (rafIdRef.current != null) cancelAnimationFrame(rafIdRef.current);
    };
  }, [interactive, mouseX, mouseY]);

  return (
    <div
      ref={containerRef}
      data-slot="bubble-background"
      className={cn(
        "relative size-full overflow-hidden bg-linear-to-br from-violet-900 to-blue-900",
        "dark:bg-none dark:bg-primary-accent",
        className,
      )}
      {...delegatedProps}
    >
      <style>
        {`
            :root {
              --first-color: ${colors.first};
              --second-color: ${colors.second};
              --third-color: ${colors.third};
              --fourth-color: ${colors.fourth};
              --fifth-color: ${colors.fifth};
              --sixth-color: ${colors.sixth};
            }
          `}
      </style>

      {/* biome-ignore lint/a11y/noSvgWithoutTitle: invisible filter definitions only (0×0, no visible content) — nothing here for assistive tech to announce */}
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="absolute top-0 left-0 h-0 w-0"
      >
        <defs>
          <filter id={gooFilterId}>
            <feGaussianBlur
              in="SourceGraphic"
              stdDeviation="16"
              result="blur"
            />
            <feColorMatrix
              in="blur"
              mode="matrix"
              values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 18 -8"
              result="goo"
            />
            <feBlend in="SourceGraphic" in2="goo" />
          </filter>
        </defs>
      </svg>

      <div
        className="absolute inset-0"
        style={{ filter: `url(#${gooFilterId}) blur(40px)` }}
      >
        <motion.div
          className="absolute top-[10%] left-[10%] size-[80%] rounded-full bg-[radial-gradient(circle_at_center,rgba(var(--first-color),0.8)_0%,rgba(var(--first-color),0)_50%)] mix-blend-hard-light"
          animate={{ y: [-50, 50, -50] }}
          transition={{ duration: 30, ease: "easeInOut", repeat: Infinity }}
          style={{ transform: "translateZ(0)", willChange: "transform" }}
        />

        <motion.div
          className="absolute inset-0 flex origin-[calc(50%-400px)] items-center justify-center"
          animate={{ rotate: 360 }}
          transition={{
            duration: 20,
            ease: "linear",
            repeat: Infinity,
            repeatType: "loop",
          }}
          style={{ transform: "translateZ(0)", willChange: "transform" }}
        >
          <div className="top-[10%] left-[10%] size-[80%] rounded-full bg-[radial-gradient(circle_at_center,rgba(var(--second-color),0.8)_0%,rgba(var(--second-color),0)_50%)] mix-blend-hard-light" />
        </motion.div>

        <motion.div
          className="absolute inset-0 flex origin-[calc(50%+400px)] items-center justify-center"
          animate={{ rotate: 360 }}
          transition={{ duration: 40, ease: "linear", repeat: Infinity }}
          style={{ transform: "translateZ(0)", willChange: "transform" }}
        >
          <div className="absolute top-[calc(50%+200px)] left-[calc(50%-500px)] size-[80%] rounded-full bg-[radial-gradient(circle_at_center,rgba(var(--third-color),0.8)_0%,rgba(var(--third-color),0)_50%)] mix-blend-hard-light" />
        </motion.div>

        <motion.div
          className="absolute top-[10%] left-[10%] size-[80%] rounded-full bg-[radial-gradient(circle_at_center,rgba(var(--fourth-color),0.8)_0%,rgba(var(--fourth-color),0)_50%)] opacity-70 mix-blend-hard-light"
          animate={{ x: [-50, 50, -50] }}
          transition={{ duration: 40, ease: "easeInOut", repeat: Infinity }}
          style={{ transform: "translateZ(0)", willChange: "transform" }}
        />

        <motion.div
          className="absolute inset-0 flex origin-[calc(50%_-_800px)_calc(50%_+_200px)] items-center justify-center"
          animate={{ rotate: 360 }}
          transition={{ duration: 20, ease: "linear", repeat: Infinity }}
          style={{ transform: "translateZ(0)", willChange: "transform" }}
        >
          <div className="absolute top-[calc(50%-80%)] left-[calc(50%-80%)] size-[160%] rounded-full bg-[radial-gradient(circle_at_center,rgba(var(--fifth-color),0.8)_0%,rgba(var(--fifth-color),0)_50%)] mix-blend-hard-light" />
        </motion.div>

        {interactive && (
          <motion.div
            className="absolute size-full rounded-full bg-[radial-gradient(circle_at_center,rgba(var(--sixth-color),0.8)_0%,rgba(var(--sixth-color),0)_50%)] opacity-70 mix-blend-hard-light"
            style={{
              x: springX,
              y: springY,
              transform: "translateZ(0)",
              willChange: "transform",
            }}
          />
        )}
      </div>

      {children}
    </div>
  );
}

export { BubbleBackground, type BubbleBackgroundPropsType };
