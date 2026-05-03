// src/app/sa/(dynamic_pages)/owned-properities/page.tsx
"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import axiosInstance from "../../../lib/axios";
import axios from "axios";
import Image from "next/image";
import PropertyCard from "../../(properties_pages)/components/PropertyCard";
import Loading from "../../../components/loading/Loading";
import Footer from "../../../components/footer/Footer";
import { Phone, Mail, MessageCircle, ExternalLink } from "lucide-react";



export default function OwnerPropertiesPage() {
  const params = useParams();
  const ownerId = params.ownerId as string;
  const [properties, setProperties] = useState<any[]>([]);
  const [ownerData, setOwnerData] = useState<OwnerData | null>(null);
  const [loading, setLoading] = useState(true);
  const apiUrl = process.env.NEXT_PUBLIC_API_URL ?? "http://127.0.0.1:8000";

 

  interface OwnerData {
      id?: string;
      first_name?: string;
      last_name?: string;
      email?: string;
      role? : string;
      full_name?: string;
      gender?: string;
      profile?: {
        profile_picture?: string;
        phone_number?: string | null;
        country?: string | null;
        address?: string | null;
      };
      phone_number?: string | null;
      country?: string | null;
      address?: string | null;
      date_of_birth?: string | null;
  }


   

  useEffect(() => {
        async function fetchOwnerProperties() {
          try {
            const res = await axios.get(
              // http://localhost:8000/GET              
              `${apiUrl}/property/sa/owner-properties/${ownerId}/`,
              { withCredentials:false }, 
            );
            console.log("fetchOwnerProperties-res.data.results =",res.data.results)
            console.log("fetchOwnerProperties-res.data.results[0].owner =",res.data.results?.[0]?.owner)
            const results = res.data.results || [];
            setProperties(results);
            setOwnerData(results[0]?.owner || null);
          
          } catch (err) {
            console.error("Error fetching owner properties:", err);
          
          } finally  {
            setLoading(false);
          }
        }
        fetchOwnerProperties();
  }, [apiUrl, ownerId]);






  if (loading) {
    return (
      <div className="mt-20 text-center">
        <Loading />
      </div>
    );
  }




  return (
    <section >
      <main className="container mx-auto mt-15 px-10 py-10">
        
        {ownerData && (
        <div className="p-6 flex items-center justify-center gap-20 bg-white mb-5 mt-5- mx-30">
            <div className="flex items-center">
                {ownerData.profile?.profile_picture && (
                              <Image
                                src={`${apiUrl}${ownerData.profile.profile_picture}`}
                                alt="Agent photo"
                                width={150}
                                height={150}
                                className="rounded-full mt-2 object-cover"
                              />
                )}
            </div>    
            <div className="ml-2 flex flex-col">
                <p className="text-xl text-gray-900 font-bold">{ownerData.full_name}  [{ownerData.role}]</p>
                <p>({properties.length}) properties</p> 
                <p className="text-lg text-gray-600">Address: {ownerData.profile?.address}-{ownerData.profile?.country}</p>
            </div> 
             <div className="mt-4 w-full space-y-3">

                    {/* CALL + WHATSAPP SIDE BY SIDE */}
                    <div className="flex gap-2 w-full">
                        
                        {/* CALL */}
                        <a
                            href={`tel:${ownerData?.profile?.phone_number || ""}`}
                            className="flex-1 flex items-center justify-center gap-1 p-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
                        >
                            <Phone size={18} />
                            Call
                        </a>

                        {/* WHATSAPP */}
                        <a
                            href={`https://wa.me/${ownerData?.profile?.phone_number|| ""}`}
                            className="flex-1 flex items-center justify-center gap-1 p-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition"
                        >
                            <MessageCircle size={18} />
                            WhatsApp
                        </a>
                    </div>
                    <div className="flex gap-2 w-full">
                        {/* EMAIL */}
                        <a
                            href={`mailto:${ownerData?.email || ""}`}
                            className="flex items-center justify-center gap-1 w-full py-2 border border-gray-300 rounded-lg hover:bg-gray-100 transition"
                        >
                            <Mail size={18} />
                            Email
                        </a>
                        <a
                            href="#"
                            className="flex items-center justify-center gap-1 w-full py-2 text-white border border-gray-300 rounded-lg bg-gray-600 hover:bg-gray-900 transition"
                        >
                            <ExternalLink  size={18} />
                             Share
                        </a>
                    </div>
                </div>
        </div>
        )}

        {properties.length === 0 ? (
          <p>No properties found for the owner <b>{ownerData?.full_name || "selected owner"} </b>.</p>
        ) : (
          <div className="flex flex-col gap-6">
            {properties.map((property) => (
              <PropertyCard key={property.id} property={property} />
            ))}
          </div>
        )}
     


      

                

                

      </main>
      <Footer />
    </section>
  );
}
