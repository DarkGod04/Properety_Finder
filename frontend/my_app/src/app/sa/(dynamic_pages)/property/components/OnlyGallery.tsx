// components/OnlyGallery.tsx
"use client";
import React, { useState, useRef } from "react";
import Image from "next/image";
import type { ImageObj } from "../types/property";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface Props {
  images: ImageObj[];
}

export default function OnlyGallery({ images }: Props) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const thumbsRef = useRef<HTMLDivElement>(null);

  const scrollThumbs = (direction: "left" | "right") => {
    if (!thumbsRef.current) return;
    const scrollAmount = 150; // px per click
    if (direction === "left") thumbsRef.current.scrollBy({ left: -scrollAmount, behavior: "smooth" });
    else thumbsRef.current.scrollBy({ left: scrollAmount, behavior: "smooth" });
  };

  const nextImage = () => setCurrentIndex((prev) => (prev + 1) % images.length);
  const prevImage = () => setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);

  return (
    <div className="flex flex-col gap-4">
      {/* Large main image */}
      <div className="relative w-full h-[500px] md:h-[600px] rounded-lg overflow-hidden">
        <Image
          src={images[currentIndex].url}
          alt={images[currentIndex].alt || "property image"}
          fill
          className="object-cover"
        />
        {/* Main image arrows */}
        {images.length > 1 && (
          <>
            <button
              onClick={prevImage}
              className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/30 text-white p-2 rounded-full"
            >
              <ChevronLeft size={24} />
            </button>
            <button
              onClick={nextImage}
              className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/30 text-white p-2 rounded-full"
            >
              <ChevronRight size={24} />
            </button>
          </>
        )}
      </div>

      {/* Thumbnail scroll */}
      <div className="relative flex items-center gap-2">
        {/* Scroll arrows */}
        {images.length > 4 && (
          <>
            <button
              onClick={() => scrollThumbs("left")}
              className="absolute left-0 z-10 bg-white/70 rounded-full p-1 shadow"
            >
              <ChevronLeft size={20} />
            </button>
            <button
              onClick={() => scrollThumbs("right")}
              className="absolute right-0 z-10 bg-white/70 rounded-full p-1 shadow"
            >
              <ChevronRight size={20} />
            </button>
          </>
        )}

        <div
          ref={thumbsRef}
          className="flex overflow-x-auto gap-2 scrollbar-none py-2"
        >
          {images.map((img, idx) => (
            <div
              key={img.id}
              className={`flex-shrink-0 w-28 h-28 border rounded-lg overflow-hidden cursor-pointer ${
                idx === currentIndex ? "border-blue-500" : "border-gray-300"
              }`}
              onClick={() => setCurrentIndex(idx)}
            >
              <Image
                src={img.url}
                alt={img.alt || "thumbnail"}
                width={112}
                height={112}
                className="object-cover w-full h-full"
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
