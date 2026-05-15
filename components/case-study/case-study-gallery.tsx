"use client";
import Image from "next/image";
import { AnimatePresence, motion } from "motion/react";
import { useState, useEffect } from "react";

interface CaseStudyGalleryProps {
  images: string[];
  title: string;
}

export function CaseStudyGallery({ images, title }: CaseStudyGalleryProps) {
  const [open, setOpen] = useState<number | null>(null);

  useEffect(() => {
    if (open === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(null);
      if (e.key === "ArrowRight") setOpen((i) => (i === null ? null : (i + 1) % images.length));
      if (e.key === "ArrowLeft") setOpen((i) => (i === null ? null : (i - 1 + images.length) % images.length));
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, images.length]);

  return (
    <section className="mt-24 px-6 md:px-16 lg:px-24">
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {images.map((src, i) => (
          <button
            key={src}
            onClick={() => setOpen(i)}
            data-cursor="hover"
            className="relative aspect-[4/3] overflow-hidden rounded-xl border border-fg-muted/10 bg-bg-muted"
          >
            <Image
              src={src}
              alt={`${title} screenshot ${i + 1}`}
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-cover transition-transform duration-700 hover:scale-105"
            />
          </button>
        ))}
      </div>

      <AnimatePresence>
        {open !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setOpen(null)}
            className="fixed inset-0 z-[80] flex items-center justify-center bg-bg/95 backdrop-blur-md p-6"
          >
            <motion.div
              initial={{ scale: 0.96, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.96, opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="relative max-h-[90vh] w-full max-w-6xl"
            >
              <Image
                src={images[open]}
                alt={`${title} screenshot ${open + 1}`}
                width={1920}
                height={1080}
                className="h-auto max-h-[90vh] w-full object-contain"
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
