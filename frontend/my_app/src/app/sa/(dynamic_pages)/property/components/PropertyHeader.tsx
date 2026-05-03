import React from "react";
import type { Property } from "../types/property";
import Image from "next/image";
import { LiaBedSolid } from "react-icons/lia";
import { PiBathtub } from "react-icons/pi";
import { RxDimensions } from "react-icons/rx";
import { Phone, Mail, MessageCircle } from "lucide-react";
import Link from "next/link";



export default function PropertyHeader({ property }: { property: Property }) {
  
    console.log("PropertyHeader-property=",property)
    const apiURL = process.env.NEXT_PUBLIC_API_URL;
    const imageURL = property.owner?.profile?.profile_picture 
    ? `${apiURL}${property.owner?.profile?.profile_picture}`.replace(/\/+/, "/")
    : null;
    console.log("PropertyHeader-imageURL=",property.owner?.profile?.profile_picture)

  return (
    <div className="w-full bg-white rounded-lg shadow p-4 md:p-6 mt-6">
      <div className="grid md:grid-cols-3 gap-6">

        {/* ============================
             LEFT: PRICE + PROPERTY SPECS
        =============================== */}
        <div className="col-span-2 flex flex-col gap-4">

          {/* Price */}
          <div>
            <p className="text-3xl font-bold text-gray-900">
              {property.price} {property.currency || "SAR"}
            </p>
            <p className="text-sm text-gray-500 mt-1">
              {property?.psub_type?.[0]?.subtype_name}
            </p>
          </div>

          {/* Specs */}
          <div className="flex flex-wrap gap-5 text-gray-700 text-base">
            <div className="flex items-center gap-2">
              <LiaBedSolid className="text-xl" />
              <span>{property.bedrooms} Bedrooms</span>
            </div>

            <div className="flex items-center gap-2">
              <PiBathtub className="text-xl" />
              <span>{property.bathrooms} Bathrooms</span>
            </div>

            <div className="flex items-center gap-2">
              <RxDimensions className="text-xl" />
              <span>{property.property_size} sqm</span>
            </div>
          </div>

        </div>

        {/* ============================
             RIGHT: AGENT BOX
        =============================== */}
        <aside className="border rounded-2xl p-4 shadow-sm flex flex-col bg-gray-50">


           

                <h3 className="ont-semibold text-gray-900 text-lg mb-3">Provider</h3>

                {/* owner NAME */}
                <p className="text-gray-900 font-bold mt-1">
                    {property.owner?.full_name || "Not Provided"}
                </p>

                
            


          

          {/* Owner info */}
          <div className="flex flex-col items-center">
            <span className="text-sm font-medium text-gray-700">
              {property.owner?.first_name || "Property Owner"}
            </span>

            {property.owner?.profile?.profile_picture && (
              <Image
                src={imageURL}
                alt="Agent photo"
                width={80}
                height={80}
                className="rounded-full mt-2 object-cover"
              />
            )}
            </div>
            {/* Buttons */}
            {/* AGENT CONTACT BUTTONS */}
                <div className="mt-4 w-full space-y-3">

                    {/* CALL + WHATSAPP SIDE BY SIDE */}
                    <div className="flex gap-2 w-full">
                        
                        {/* CALL */}
                        <a
                            href={`tel:${property.owner?.profile?.phone_number || ""}`}
                            className="flex-1 flex items-center justify-center gap-1 p-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
                        >
                            <Phone size={18} />
                            Call
                        </a>

                        {/* WHATSAPP */}
                        <a
                            href={`https://wa.me/${property.owner?.profile?.phone_number|| ""}`}
                            className="flex-1 flex items-center justify-center gap-1 p-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition"
                        >
                            <MessageCircle size={18} />
                            WhatsApp
                        </a>
                    </div>

                    {/* EMAIL */}
                    <a
                        href={`mailto:${property.owner?.email || ""}`}
                        className="flex items-center justify-center gap-1 w-full py-2 border border-gray-300 rounded-lg hover:bg-gray-100 transition"
                    >
                        <Mail size={18} />
                        Email
                    </a>

                    {/* MESSAGE - In-App - Primary Button */}
                    <Link
                        href={`/sa/send-message?receiver=${property.owner?.id || ""}&name=${encodeURIComponent(property.owner?.full_name || "Owner")}&property=${property.id}&title=${encodeURIComponent(property.title || "")}`}
                        className="flex items-center justify-center gap-2 w-full py-3 px-4 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition font-medium shadow-md hover:shadow-lg"
                    >
                        <MessageCircle size={18} />
                        Message {property.owner?.full_name || "Owner"}
                    </Link>
                </div>
        </aside>

      </div>
    </div>
  );
}


