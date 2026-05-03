"use client";

import PropertyCard from "./PropertyCard";
import SubTypesCard from "./SubTypesCard";

interface PropertiesListProps {
  properties: any[];
  subtypes: any[];
}

export default function PropertiesList({ properties, subtypes }: PropertiesListProps) {
    console.log("PropertiesList-subtypes=",subtypes  )
    console.log("PropertiesList-properties=",properties  )
    return (
        <div>
            
                {/* Subtypes card */}
                <SubTypesCard 
                    subtypes={subtypes} 
                />


                {/* Properties */}
                {properties.length === 0 ? (
                        <p className="text-gray-500 mt-8">No properties found for the selected filters.</p>
                ) : (
                    <div className="flex flex-col gap-6 mt-4">
                        {properties.map((property) => (
                            <PropertyCard key={property.id} property={property} />
                        ))}
                    </div>
                )}
        </div>
  );
}
