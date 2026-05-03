// components/PropertyGallery.tsx
import React, { useState } from "react";
import Image from "next/image";
import type { ImageObj } from "../types/property";
import { Camera } from "lucide-react";
import OnlyGallery from "./OnlyGallery";

export default function PropertyGallery({ images }: { images: ImageObj[] }) {
  const [openGallery, setOpenGallery] = useState(false);

  if (!images || images.length === 0)
    return (
      <div className="h-64 bg-gray-100 flex items-center justify-center">
        No images
      </div>
    );

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-2 relative bg-white">
      {/* Main Image */}
      <div className="col-span-1 md:col-span-2 relative">
        <Image
          width={1000}
          height={600}
          src={images[0].url}
          alt={images[0].alt || "property main"}
          className="w-full h-96 object-cover rounded-lg shadow"
        />

        {/* Camera icon with total images */}
        <button
          onClick={() => setOpenGallery(true)}
          className="absolute bottom-2 right-2 bg-black/60 text-white rounded-full px-3 py-1 flex items-center gap-1 text-sm"
        >
          <Camera size={16} />
          <span>{images.length}</span>
        </button>
      </div>

      {/* Side Images */}
      <div className="flex flex-col gap-2">
        {images.slice(1, 5).map((img) => (
          <Image
            key={img.id}
            width={1000}
            height={600}
            src={img.url}
            alt={img.alt || "property image"}
            className="w-full h-48 object-cover rounded-lg"
          />
        ))}
      </div>

        {/* OnlyGallery Modal */}
        {openGallery && (
            <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4">
                <div className="bg-white rounded-lg w-full max-w-5xl max-h-[90vh] overflow-y-auto relative p-4 shadow-xl">

                {/* Close button */}
                <button
                    onClick={() => setOpenGallery(false)}
                    className="absolute top-3 right-3 text-white bg-red-500 hover:bg-red-600 rounded-full px-3 py-1 z-50"
                >
                    Close
                </button>

                {/* Gallery */}
                <div className="pt-8">
                    <OnlyGallery images={images} />
                </div>

                </div>
            </div>
        )}

    </div>
  );
}
