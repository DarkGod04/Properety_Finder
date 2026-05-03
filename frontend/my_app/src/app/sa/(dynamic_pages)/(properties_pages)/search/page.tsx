"use client";

import { useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import axios from "axios";
import Link from "next/link";
import Findsection from "../components/Findsection";
import PropertiesList from "../components/PropertiesList";
import Loading from "../../../components/loading/Loading";



export default function SearchPage() {
  return (
    <Suspense fallback={<Loading />}>
      <SearchContent />
    </Suspense>
  );
}

function SearchContent() {
  const countrySlug = process.env.NEXT_PUBLIC_COUNTRY_SLUG;
  const CountryName = process.env.NEXT_PUBLIC_COUNTRY_NAME;

  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(true);
  const [properties, setProperties] = useState([]);
  const [subtypes, setSubtypes] = useState([]);

  useEffect(() => {
    const queryString = searchParams.toString();

    
    //  fetch properies with fitering -- queryString
    const fetchProperties = async () => {
        try {
            const response = await axios.get(
              `${process.env.NEXT_PUBLIC_API_URL}/property/${countrySlug}/search/?${queryString}`,
              { withCredentials: true }
            );
            setProperties(response.data.results || []);
        
        } catch (error) {
            console.error("Error fetching properties:", error);
        
        } finally {
            setLoading(false);
        }
    };


    //  fetch fetchSubtypes with fitering -- queryString
    const fetchSubtypes = async () => {
        try {
          const response = await axios.get(
            `${process.env.NEXT_PUBLIC_API_URL}/property/${countrySlug}/subtypes/search/?${queryString}`,
            { withCredentials: true }
          );
          setSubtypes(response.data.results || []);
          
        
        } catch (error) {
            console.error("Error fetching subtypes:", error);
        }
    };

    fetchProperties();
    fetchSubtypes();
  }, [searchParams, countrySlug]);





  if (loading) return <Loading />;

  return (
    <main className="min-h-screen bg-gray-50">
      <section className="max-w-6xl mx-auto px-4 py-6">
       
        <Findsection
            mainType={searchParams.get("mainType") || "residential"}
            purpose={searchParams.get("purpose") || "sale"}
        />


        {/* Breadcrumb */}
        <nav className="flex pb-1 my-8" aria-label="Breadcrumb">
            <ol className="inline-flex items-center space-x-1 md:space-x-2 rtl:space-x-reverse">
                <li className="inline-flex items-center">
                    <Link href="/sa/" className="inline-flex items-center text-sm font-medium text-gray-700 hover:text-blue-600 dark:text-gray-400 dark:hover:text-white">
                        <svg className="w-3 h-3 me-2.5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
                            <path d="m19.707 9.293-2-2-7-7a1 1 0 0 0-1.414 0l-7 7-2 2a1 1 0 0 0 1.414 1.414L2 10.414V18a2 2 0 0 0 2 2h3a1 1 0 0 0 1-1v-4a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v4a1 1 0 0 0 1 1h3a2 2 0 0 0 2-2v-7.586l.293.293a1 1 0 0 0 1.414-1.414Z"/>
                        </svg>
                        Home
                    </Link>
                </li>
                <li aria-current="page">
                    <div className="flex items-center">
                        <svg className="rtl:rotate-180 w-3 h-3 text-gray-400 mx-1" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 6 10">
                            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 9 4-4-4-4"/>
                        </svg>
                        <span className="ms-1 text-sm font-medium text-gray-500 md:ms-2">
                            <span className="capitalize">{CountryName}</span> properties
                        </span>
                    </div>
                </li>
            </ol>
        </nav>



        {/* Use PropertiesList Component */}
          <PropertiesList 
              properties={properties} 
              subtypes={subtypes} 
          />
      </section>
    </main>
  );
}
