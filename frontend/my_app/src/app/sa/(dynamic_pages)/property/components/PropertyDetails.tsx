import React from "react";
import type { Property } from "../types/property";
import { amenityIcons } from "../utils/amenityIcons";
import { LiaBedSolid } from "react-icons/lia";
import { PiBathtub } from "react-icons/pi";
import { RxDimensions } from "react-icons/rx";
import { Phone, Mail, MessageCircle } from "lucide-react";
import { BsBuildings } from "react-icons/bs";
import { SlGrid } from "react-icons/sl";
import { SlLocationPin } from "react-icons/sl";
import { HiOutlineDocumentText } from "react-icons/hi";
import { BsBuildingGear } from "react-icons/bs";
import { GiMultiDirections } from "react-icons/gi";
import { AiOutlineColumnWidth } from "react-icons/ai";
import { MdOutlineEventAvailable } from "react-icons/md";
import Image from "next/image";
import { GoArrowRight } from "react-icons/go";
import Link from "next/link";
import { GrLocation } from "react-icons/gr";



export default function PropertyDetails({ property }: { property: Property }) {
    
    const apiURL = process.env.NEXT_PUBLIC_API_URL;
    const imageURL = property.owner?.profile?.profile_picture 
    ?`${apiURL}${property.owner?.profile?.profile_picture}`.replace(/\/+/, "/")
    : null;
    console.log("PropertyDetails-imageURL=",property.owner?.profile?.profile_picture) 
    
    
    return (
        <div className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* LEFT SIDE — MAIN DETAILS */}
            <div className="lg:col-span-2 space-y-8">

                {/* TITLE */}
                <div className="bg-white p-2"> 
                    <h1 className="text-2xl font-bold text-gray-900">{property.title}</h1>
                    <p className="text-gray-500 mt-1">{property.pmain_type.maintype_label} {property.psub_type.subtype_name}</p>
                    <p className="text-gray-500 mt-1">{property.area} Area-{property.district} District</p>
                    <p className="text-gray-500 mt-1">{property.address_detail}</p>
                </div>


                <hr className="text-gray-300"></hr>

                {/* DESCRIPTION */}
                <h2 className="text-2xl font-semibold mb-2">Description</h2>
                <div className="bg-white p-2">
                    <p className="text-gray-700 leading-relaxed">
                        {property.description || "No description available."}
                    </p>
                </div>
                

                <hr className="text-gray-300"></hr>


                {/* Property details */}

                <h2 className="text-2xl font-semibold mb-2">Property details</h2>
                <div className="bg-white p-2">
                    
                    <div className="flex gap-[400px] w-full">
                        <div>
                            <table className="w-full">
                                <tbody>
                                    <tr >
                                        <td className="text-lg flex px-3 py-4 font-normal text-gray-900"><BsBuildings className="text-2xl mr-3 font-light" />Property Type</td>
                                        <td className="px-3 py-4 text-lg text-gray-900 font-semibold">{property.psub_type.subtype_name}</td>
                                    
                                        <td className="ml-[100px] text-lg flex px-3 py-4 font-normal text-gray-900"><RxDimensions className="text-2xl mr-3 font-light" />Property Size</td>
                                        <td className="px-3 py-4 text-lg text-gray-900 font-semibold">{property.property_size} m²</td>
                                    </tr>
                                    <tr>
                                        <td className="text-lg flex px-3 py-4 font-normal text-gray-900"><LiaBedSolid className="text-2xl mr-3 font-light" />Bedrooms</td>
                                        <td className="px-3 py-4 text-lg text-gray-900 font-semibold">{property.bedrooms}</td>
                                   
                                        <td className="ml-[100px]  text-lg flex px-3 py-4 font-normal text-gray-900"><PiBathtub className="text-2xl mr-3 font-light" />Bathrooms</td>
                                        <td className="px-3 py-4 text-lg text-gray-900 font-semibold">{property.bathrooms}</td>
                                    </tr>
                                    <tr>
                                        <td className="text-lg flex px-3 py-4 font-normal text-gray-900"><RxDimensions className="text-2xl mr-3 font-light" />Plot length</td>
                                        <td className="px-3 py-4 text-lg text-gray-900 font-semibold">{property.plot_length} m</td>
                                    
                                        <td className="ml-[100px] text-lg flex px-3 py-4 font-normal text-gray-900"><RxDimensions className="text-2xl mr-3 font-light" />Plot width</td>
                                        <td className="px-3 py-4 text-lg text-gray-900 font-semibold">{property.plot_width} m</td>
                                    </tr>
                                    <tr>
                                        <td className="text-lg flex px-3 py-4 font-normal text-gray-900"><AiOutlineColumnWidth className="text-2xl mr-3 font-light" />Street width</td>
                                        <td className="px-3 py-4 text-lg text-gray-900 font-semibold">{property.street_width} m</td>
                                    
                                        <td className="ml-[100px] text-lg flex px-3 py-4 font-normal text-gray-900"><GiMultiDirections className="text-2xl mr-3 font-light" />Facade</td>
                                        <td className="px-3 py-4 text-lg text-gray-900 font-semibold">{property.facade}</td>
                                    </tr>
                                    <tr>
                                        <td className="text-lg flex px-3 py-4 font-normal text-gray-900"><BsBuildingGear className="text-2xl mr-3 font-light" />Property age</td>
                                        <td className="px-3 py-4 text-lg text-gray-900 font-semibold">{property.property_age}  yrs</td>
                                    
                                        <td className="ml-[100px] text-lg flex px-3 py-4 font-normal text-gray-900"><SlGrid className="text-2xl mr-3 font-light" />Category</td>
                                        <td className="px-3 py-4 text-lg text-gray-900 font-semibold">{property.category}</td>
                                    </tr>
                                    <tr>
                                        <td className="text-lg flex px-3 py-4 font-normal text-gray-900"><SlLocationPin  className="text-2xl mr-3 font-light" />City</td>
                                        <td className="px-3 py-4 text-lg text-gray-900 font-semibold">{property.city.city_name}</td>
                                    
                                        <td className="ml-[100px] text-lg flex px-3 py-4 font-normal text-gray-900"><SlLocationPin  className="text-2xl mr-3 font-light" />Area</td>
                                        <td className="px-3 py-4 text-lg text-gray-900 font-semibold">{property.area}</td>
                                    </tr>
                                    <tr>
                                        <td className="text-lg flex px-3 py-4 font-normal text-gray-900"><SlLocationPin  className="text-2xl mr-3 font-light" />District</td>
                                        <td className="px-3 py-4 text-lg text-gray-900 font-semibold">{property.district}</td>
                                    
                                        <td className="ml-[100px] text-lg flex px-3 py-4 font-normal text-gray-900"><HiOutlineDocumentText className="text-2xl mr-3 font-light" />Plot Number</td>
                                        <td className="px-3 py-4 text-lg text-gray-900 font-semibold">{property.plot_number}</td>
                                    </tr>
                                    <tr>
                                        <td className="text-lg flex px-3 py-4 font-normal text-gray-900"><HiOutlineDocumentText className="text-2xl mr-3 font-light" />Land Number</td>
                                        <td className="px-3 py-4 text-lg text-gray-900 font-semibold">{property.land_number}</td>
                                    
                                        <td className="ml-[100px] text-lg flex px-3 py-4 font-normal text-gray-900"><MdOutlineEventAvailable className="text-2xl mr-3 font-light" />Available from</td>
                                        <td className="px-3 py-4 text-lg text-gray-900 font-semibold">{property.available_from}</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                       
                    </div>
                </div>

                <hr className="text-gray-300"></hr>

            

                {/* AMENITIES */}
                <h2 className="text-2xl font-semibold mb-2">Amenities</h2>
                <div className="bg-white p-2">
                {property.amenities && property.amenities.length > 0 ? (
                    <ul className="grid grid-cols-2 sm:grid-cols-3 gap-2 mt-2">
                    {property.amenities.map((item) => (
                        <li
                            key={item.id}
                            className="flex items-center gap-2 text-gray-700 p-2"
                        >
                                {/* ICON */}
                                {amenityIcons[item.amenity_name] ?? (
                                    <span className="text-lg">•</span> // fallback icon
                                )}

                                {/* TEXT */}
                                <span>{item.amenity_name}</span>
                        </li>
                    ))}
                    </ul>
                ) : (
                    <p className="text-gray-500">No amenities listed.</p>
                )}
                </div>


                <hr className="text-gray-300"></hr>

                <h2 className="text-2xl font-semibold mb-2">Location</h2>
                <div className="bg-white p-2 mb-0">
                    <p className="text-gray-700">
                        {property.address_detail || "No location available."}
                    </p>  
                </div>
                <p className="text-gray-500 text-sm font-light"> * Address as per title deed</p>
                       
                
                <hr className="text-gray-300"></hr>
                

                {/* map-preview */}
                <div className="mb-10 relative">
                    <Image
                              width={1000}
                              height={600}
                              src="/map-preview.jpg"
                              alt="map preview"
                              className=""
                    />
                    {/* absolute position card */}
                    <Link
                    href={`https://www.google.com/maps?q=${property.latitude},${property.longitude}`}
                    target="_blank"
                    >
                    <div className="z-50 absolute bottom-6 left-8 bg-white h-35 w-165 rounded-2xl content-center p-4">
                        <div className="flex justify-between">
                            <div className="flex items-center font-semibold">
                               <span><GrLocation className="mr-2 font-light text-2xl"/></span>{property.district}, {property.area}, {property.city.city_name}
                            </div>
                            <div className="flex items-center hover:bg-indigo-100 p-2 rounded text-[#3c3280] font-semibold">
                                view on map<span className="ml-2">  <GoArrowRight /></span> 
                            </div>
                        </div>    
                    </div>
                    </Link>
                </div>


                <hr className="text-gray-300"></hr>

                <h2 className="text-2xl font-semibold mb-2">Provided by</h2>

                <div className="p-6 flex items-center justify-between bg-gray-200 mb-30">
                    <div className="flex items-center">
                        {property.owner?.profile?.profile_picture && (
                                      <Image
                                        src={imageURL}
                                        alt="Agent photo"
                                        width={80}
                                        height={80}
                                        className="rounded-full mt-2 object-cover"
                                      />
                        )}
                        <div className="ml-2 flex flex-col">
                            <div className="text-xl text-gray-900 font-bold">{property.owner.full_name}</div>
                            <div className="text-lg text-gray-600">{property.owner.email}</div>
                        </div>
                    </div>
                    <button className="cursor-pointer h-20 px-3 text-md font-bold text-blue-400 border border-blue-400 rounded-full hover:bg-blue-100">
                        See agency properties (8)
                    </button>
                </div>

            </div>

        </div>
    );
}
