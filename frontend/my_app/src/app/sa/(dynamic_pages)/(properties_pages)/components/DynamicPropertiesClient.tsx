// /sa/(dynamic_pages)/(properties_pages)/components/DynamicPropertiesClient.tsx
"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import Loading from "../../../components/loading/Loading";
import PropertyCard from "./PropertyCard";
import Breadcrumb from "./Breadcrumb";
import SubTypesCard from "./SubTypesCard";
import Findsection from "./Findsection";
import Footer from "../../../components/footer/Footer";


export default function DynamicPropertiesClient({ maintypeSlug, purposeSlug }) {
  console.log("DynamicPropertiesClient-maintypeSlug=",maintypeSlug)
  console.log("DynamicPropertiesClient-purposeSlug=",purposeSlug)
  const countrySlug = process.env.NEXT_PUBLIC_COUNTRY_SLUG;
  const CountryName = process.env.NEXT_PUBLIC_COUNTRY_NAME;

  const [loading, setLoading] = useState(true);
  const [properties, setProperties] = useState([]);
  const [subtypes, setSubtypes] = useState([]);


    useEffect(() => {
        if (!countrySlug) {
            setLoading(false);
            return;
        }

        const fetchData = async () => {
            setLoading(true);
                try {
                    // 🔹 Fetch properties
                    const propRes = await axios.get(
                    `${process.env.NEXT_PUBLIC_API_URL}/property/${countrySlug}/${maintypeSlug}-for-${purposeSlug}/`,
                    { withCredentials: true }
                    );
                    setProperties(propRes.data.results || []);
                    console.log("Properties=",propRes.data.results)

                    // 🔹 Fetch subtypes for displaying SubTypesCard component 
                    console.log("countrySlug",countrySlug)
                    console.log("maintypeSlug",maintypeSlug)
                    console.log("purposeSlug",purposeSlug)
                    const subtypeRes = await axios.get(
                    `${process.env.NEXT_PUBLIC_API_URL}/property/${countrySlug}/${maintypeSlug}-for-${purposeSlug}/subtypes/`,
                    { withCredentials: true }
                    );
                    setSubtypes(subtypeRes.data || []);
                    console.log("Subtypes=", subtypeRes.data)
                
                } catch (error) {
                    console.error("❌ Error fetching data:", error);
                
                } finally {
                    setLoading(false);
                }
        };

    fetchData();
    }, [countrySlug, maintypeSlug, purposeSlug]);



    // ⏳ Loading
    if (loading)
        return (
            <div className="text-center mt-20">
                <Loading />
            </div>
        );



    // 🚫 No Data
    if (properties.length === 0)
        return (
            <main className="min-h-screen bg-gray-50">
                <section className="max-w-6xl mx-auto px-4">
                    <Findsection 
                        mainType={maintypeSlug} 
                        purpose={purposeSlug} 
                    />
                    <div className="text-center mt-10 p-8 bg-white rounded-lg shadow">
                        <p className="text-gray-600">
                            No {maintypeSlug} properties for {purposeSlug} found in {CountryName}.
                        </p>
                    </div>
                </section>
            </main>
        );



    // ✅ Success
    return (
            <main className="min-h-screen bg-white">
                <section className="max-w-6xl mx-auto px-4">
                    
                    
                    <Findsection 
                        mainType={maintypeSlug} 
                        purpose={purposeSlug} 
                    />
                 
                    

                    <Breadcrumb
                        maintypeSlug={maintypeSlug}
                        purposeSlug={purposeSlug}
                        CountryName={CountryName}
                    />

                    <h1 className="text-xl font-semibold mb-6">
                        <span className="capitalize">{maintypeSlug}</span> properties for{" "}
                        {purposeSlug} in {CountryName}
                    </h1>

                    <div className="text-sm text-gray-500 mb-3">
                        {properties.length} Properties found
                    </div>

                    <SubTypesCard 
                        subtypes={subtypes}
                    />

                    <div className="flex flex-col gap-10 mt-8">
                        {properties.map((property) => (
                            <PropertyCard 
                                key={property.id} 
                                property={property} 
                            />
                        ))}
                    </div>
                </section>
            </main>
    );
}
