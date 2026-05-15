"use client";
import {
  motion,
  useScroll,
  useTransform,
  useReducedMotion,
} from "motion/react";
import Image from "next/image";
import { useRef } from "react";

interface ParallaxImageProps {
  src: string;
  alt: string;
  className?: string;
  speed?: number;
  priority?: boolean;
  fill?: boolean;
  width?: number;
  height?: number;
}

export function ParallaxImage({
  src,
  alt,
  className,
  speed = 0.3,
  priority,
  fill,
  width,
  height,
}: ParallaxImageProps) {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const yRaw = useTransform(scrollYProgress, [0, 1], ["0%", `${speed * 100}%`]);
  const y = reduced ? 0 : yRaw;

  return (
    <div ref={ref} className={`overflow-hidden ${className ?? ""}`}>
      <motion.div style={{ y }} className="h-full w-full">
        {fill ? (
          <Image src={src} alt={alt} fill priority={priority} className="object-cover" />
        ) : (
          <Image
            src={src}
            alt={alt}
            width={width ?? 1600}
            height={height ?? 900}
            priority={priority}
            className="h-full w-full object-cover"
          />
        )}
      </motion.div>
    </div>
  );
}
