import Image from "next/image";
import { motion } from "framer-motion";

type Property = {
  id: string;
  title: string;
  price: number;
  currency: string;
  area: number; // sqm
  bedrooms: number;
  bathrooms: number;
  city: string;
  mainImageUrl: string;
};

type Props = {
  property: Property;
};

export default function PropertyCard({ property }: Props) {
  return (
    <motion.div
      className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition"
      whileHover={{ scale: 1.02 }}
    >
      <div className="relative h-48 w-full">
        <Image
          src={property.mainImageUrl}
          alt={property.title}
          fill
          className="object-cover"
        />
        <div className="absolute top-3 left-3 bg-indigo-600 text-white text-sm font-semibold px-2 py-1 rounded">
          {property.currency} {property.price.toLocaleString()}
        </div>
      </div>

      <div className="p-4 space-y-2">
        <h3 className="text-lg font-medium text-gray-800 truncate">
          {property.title}
        </h3>
        <div className="flex items-center text-sm text-gray-600 space-x-4">
          <span>{property.bedrooms} bd</span>
          <span>{property.bathrooms} ba</span>
          <span>{property.area} m²</span>
        </div>
        <div className="text-sm text-gray-500">{property.city}</div>
        <div className="mt-3 flex space-x-2">
          <button className="flex-1 bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700 transition text-sm">
            Contact
          </button>
          <button className="flex-1 bg-gray-200 text-gray-700 py-2 rounded-lg hover:bg-gray-300 transition text-sm">
            Details
          </button>
        </div>
      </div>
    </motion.div>
  );
}
