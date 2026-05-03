// src/app/sa/(dynamic_pages)/saved-properties/page.tsx
"use client";


import { useEffect, useState } from "react";
import axiosInstance from "../../lib/axios";
import Loading from "../../components/loading/Loading";
import PropertyCard from "../(properties_pages)/components/PropertyCard";
import { useAuth } from "../../context/AuthContext";
import { useRouter } from "next/navigation";


interface Property {
  id: string;
  title: string;
  price: number;
  city?: string;
}

export default function SavedPropertiesPage() {
  const router = useRouter();
  const { user, loading } = useAuth();
  const [properties, setProperties] = useState<Property[]>([]);
  // const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  
  useEffect(() => {
    if (!loading && !user) {
      router.push("/sa/login");
    }
  }, [user, loading, router]);



  useEffect(() => {
    const fetchSavedProperties = async () => {
        try {
          const res = await axiosInstance.get(
          "/property/properties-liked",
          { withCredentials:true }, 
          )
          setProperties(res.data.results); // ✅ IMPORTANT
        } catch (err) {
          setError("Failed to load saved properties");
        };
    };
    fetchSavedProperties();
  }, []);




  if (loading) {
    return (
      <div className="text-center mt-20">
        <Loading />
      </div>
    );
  }



  return (
    <section className="min-h-screen p-6 mt-20">
      <h1 className="text-2xl  mb-6">
        Properties you liked ({properties.length})
      </h1>

      {properties.length === 0 ? (
        <p className="text-gray-500">No saved properties yet.</p>
      ) : (
        <div className="space-y-6 my-8">
                {properties.map((property) => (
                        <PropertyCard 
                            key={property.id} 
                            property={property}
                            className="space-y-6 my-8" 
                        />
                ))}
        </div>
      )}
    </section>
  );
}