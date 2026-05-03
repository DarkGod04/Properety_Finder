"use client";
import Image from "next/image";

export default function SubTypes({ sub }) {
  return (
    <div>
        <p className="text-gray-500 text-sm capitalize">
            {sub.subtype_name} ({sub.properties?.length || 0})
        </p>
    </div>
  );
}
