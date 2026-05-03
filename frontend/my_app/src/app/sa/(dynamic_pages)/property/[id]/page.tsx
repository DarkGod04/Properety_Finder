// app/property/[id]/page.tsx

"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import type { Property } from "../types/property";
import PropertyGallery from "../components/PropertyGallery";
import PropertyHeader from "../components/PropertyHeader";
import PropertyDetails from "../components/PropertyDetails";
import { useParams } from "next/navigation";
import Loading from "../../../components/loading/Loading";
import Footer from "../../../components/footer/Footer"



export default function PropertyPage() {
    const params = useParams();
        const id = params?.id;
        // console.log("PropertyPage-params=",params)
        // console.log("PropertyPage-id=",id)
    
    // const { id } = useParams<{ id: string }>(); // 👈  can use this way to get id from URL
   
    
    const countrySlug = process.env.NEXT_PUBLIC_COUNTRY_SLUG;
    const [property, setProperty] = useState<Property | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);


    useEffect(() => {
        let cancelled = false;
        

        //  🔹 Fetch property
        async function fetchProperty() {
            setLoading(true);
            setError(null);
            try {
                const res = await axios.get(
                    `${process.env.NEXT_PUBLIC_API_URL}/property/property-details-${id}/`,
                    { withCredentials: true }
                );


                const apiURL = process.env.NEXT_PUBLIC_API_URL;      // e.g., http://127.0.0.1:8000
                // 🔥 Transform images to match frontend type
                const transformedImages = res.data.images?.map((img: any) => ({
                    id: img.id,
                    url: `${apiURL}${img.images}`,  // prepend backend URL    // backend gives "images" => make it "url"
                    alt: property?.title || "property image"
                })) || [];

                const transformedProperty = {
                    ...res.data,
                    images: transformedImages
                };

                if (!cancelled) setProperty(transformedProperty);

            } catch (err: any) {
                setError(err?.response?.data?.detail || err.message || 'Failed to load');
            } finally {
                if (!cancelled) setLoading(false);
            }
        }

        fetchProperty();
        
        
        return () => { cancelled = true; };
    }, [id]);


    
    
    // ⏳ Loading
    if (loading)
        return (
            <div className="text-center mt-20">
                <Loading />
            </div>
        );


    if (error) 
        return (<div className="p-6 text-red-600">{error}</div>);
    if (!property) 
        return (<div className="p-6">Property not found</div>);


    return (
        <section>
        <main className="container mx-auto px-20">
            <PropertyGallery images={property.images} />
            <PropertyHeader property={property} />
            <PropertyDetails property={property} />
        </main>
            {/* <Footer/> */}
        </section>
    );
}
