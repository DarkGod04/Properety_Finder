"use client";

import React from "react";
import PropertyCard from "./PropertyCard";

type Property = {
    id: string;
    title: string;
    price: number;
    currency: string;
    area: number;
    bedrooms: number;
    bathrooms: number;
    city: string;
    mainImageUrl: string;
};

type Props = {
  properties: Property[];
};

export default function PropertiesListPage({ properties }: Props) {
  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Properties for Sale</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {properties.map((prop) => (
              <PropertyCard 
                  key={prop.id} 
                  property={prop} 
              />
        ))}
      </div>
    </div>
  );
}
