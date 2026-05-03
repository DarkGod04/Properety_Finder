"use client";
import Image from "next/image";
import Link from "next/link";
import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { CiLocationOn } from "react-icons/ci";
import { LiaBedSolid } from "react-icons/lia";
import { PiBathtub } from "react-icons/pi";
import { RxDimensions } from "react-icons/rx";
import { FiPhone, FiMail, FiHeart, FiShare2, FiMoreVertical, FiFlag, FiMessageCircle } from "react-icons/fi";
import { useAuth } from "../../../context/AuthContext";
import axiosInstance from "../../../../sa/lib/axios";
import { useRouter } from "next/navigation";
import { formatDistanceToNow } from "date-fns";
 






const PLACEHOLDER_IMAGE = "/profile_default.svg";

function resolveCardImageUrls(images: unknown, apiBase: string | undefined): string[] {
  const list = Array.isArray(images) ? images : [];
  const base = apiBase?.replace(/\/$/, "") ?? "";

  return list
    .map((entry: { images?: string | null } | string | null | undefined) => {
      const path =
        typeof entry === "string" ? entry : entry?.images ?? null;
      if (!path || typeof path !== "string") return null;
      if (path.startsWith("http://") || path.startsWith("https://")) return path;
      return `${base}${path.startsWith("/") ? path : `/${path}`}`;
    })
    .filter((u): u is string => Boolean(u));
}

function resolveMediaUrl(
  path: string | null | undefined,
  apiBase: string | undefined
): string | null {
  if (!path || typeof path !== "string") return null;
  if (path.startsWith("http://") || path.startsWith("https://")) return path;
  const base = apiBase?.replace(/\/$/, "") ?? "";
  return `${base}${path.startsWith("/") ? path : `/${path}`}`;
}

export default function PropertyCard({ property }: any) {
  const { user } = useAuth();
  
  const [loading, setLoading] = useState(false);
  const countrySlug = process.env.NEXT_PUBLIC_COUNTRY_SLUG;
  const apiURL = process.env.NEXT_PUBLIC_API_URL;
  // console.log('apiURL=',apiURL)
  const [currentIndex, setCurrentIndex] = useState(0);
  const [menuOpen, setMenuOpen] = useState(false);

  const imageUrls = resolveCardImageUrls(property.images, apiURL);
  const displaySrc =
    imageUrls.length > 0 ? imageUrls[currentIndex % imageUrls.length] : PLACEHOLDER_IMAGE;

  const owner = property?.owner;
  const ownerAvatarUrl = resolveMediaUrl(owner?.profile?.profile_picture, apiURL);

  const touchStartX = useRef<number | null>(null);
  const touchEndX = useRef<number | null>(null);

  const nextImage = () => {
    if (imageUrls.length <= 1) return;
    setCurrentIndex((prev) => (prev + 1) % imageUrls.length);
  };
  const prevImage = () => {
    if (imageUrls.length <= 1) return;
    setCurrentIndex((prev) => (prev - 1 + imageUrls.length) % imageUrls.length);
  };

  const handleTouchStart = (e: React.TouchEvent) => (touchStartX.current = e.changedTouches[0].screenX);
  const handleTouchMove = (e: React.TouchEvent) => (touchEndX.current = e.changedTouches[0].screenX);
  
  const router = useRouter()
  const [liked, setLiked] = useState(property.is_liked);
  
  
  // useEffect(() => {
  //   if (!loading && !user) {
  //     router.push("/sa/login");
  //   }
  // }, [user, loading, router]);

  // if (loading) {
  //   return (
  //     <div className="text-center mt-20">
  //       <Loading />
  //     </div>
  //   );
  // }

  const handleTouchEnd = () => {
    if (touchStartX.current !== null && touchEndX.current !== null) {
      const deltaX = touchStartX.current - touchEndX.current;
      if (deltaX > 50) nextImage();
      else if (deltaX < -50) prevImage();
    }
    touchStartX.current = null;
    touchEndX.current = null;
  };

   
  

 

  const toggleLike = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (loading) return;

    setLoading(true);
    setLiked((prev) => !prev); // optimistic UI

    try {
        const response = await axiosInstance.post( 
          `/property/property-like/${property.id}/like/`,
          { withCredentials:true },                      // sending cookies -- since we use HTTP-only cookies                                   
        );
        console.log("toggleLike-response.data=",response.data);
        setLiked(response.data.liked);


    } catch (err) {
        setLiked((prev) => !prev); // rollback if error
        console.error(err);

    } finally {
        setLoading(false);
    }
  };

  // console.log('property.owner.profile.profile_picture=',property.owner.profile.profile_picture)
  // console.log('my image bakend url=',apiURL+property.owner.profile.profile_picture)






  return (
    <Link href={`/${countrySlug}/property/${property.id}`}>
        {/* <motion.div
          whileHover={{ scale: 1.02 }}
          transition={{ type: "spring", stiffness: 200, damping: 15 }}
          className="rounded-lg"
        > */}
        
          <div className="flex flex-col rounded-t-lg border border-gray-300 sm:flex-row bg-white shadow-md transition-all overflow-hidden hover:bg-[#f3f4f6]">
              
              {/* Left Side: Image */}
              <div
                className="relative w-full sm:w-2/5 h-60 sm:h-64 overflow-hidden"
                onTouchStart={handleTouchStart}
                onTouchMove={handleTouchMove}
                onTouchEnd={handleTouchEnd}
              >
                <Image
                  src={displaySrc}
                  alt={property.title}
                  fill
                  sizes="(max-width: 640px) 100vw, 40vw"
                  className="object-cover rounded-tl-lg"
                />

                {imageUrls.length > 1 && (
                  <>
                    {/* Left button - prevImage */}
                    <button
                      onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();  // Prevents the click event from reaching the parent <Link>
                                prevImage();
                              }}
                      className="absolute top-1/2 left-2 -translate-y-1/2 bg-black/40 hover:bg-black/60 text-white p-1 rounded-full"
                    >
                      <ChevronLeft size={18} />
                    </button>


                    {/* Right button - nextImage */}
                    <button
                        onClick={(e) => {
                                  e.preventDefault();
                                  e.stopPropagation();
                                  nextImage();
                                }}
                        className="absolute top-1/2 right-2 -translate-y-1/2 bg-black/40 hover:bg-black/60 text-white p-1 rounded-full"
                      >
                        <ChevronRight size={18} />
                    </button>
                  </>
                )}
                
                {/* Dots indicator */}
                {imageUrls.length > 1 && (
                  <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1">
                    {imageUrls.map((_, i) => (
                      <div
                        key={i}
                        className={`w-2 h-2 rounded-full ${
                          i === currentIndex ? "bg-white" : "bg-gray-400/60"
                        }`}
                      />
                    ))}
                  </div>
                )}
              </div>



              {/* Right Side: Info */}
              <div className="flex-1 p-5 flex flex-col justify-between">
                {/* Header */}
                <div className="flex justify-between items-start">
                  <div>
                    <h2 className="text-lg font-semibold text-gray-900">{property.title}</h2>
                    <p className="text-gray-500 text-sm flex items-center gap-1">
                      <CiLocationOn /> {property?.district}, {property?.city?.city_name}
                    </p>
                  </div>

                  {/* Owner info */}
                  <div className="flex flex-col items-end">
                    <span className="text-sm font-medium text-gray-700">
                      {owner?.first_name || "Property Owner"}
                    </span>

                    {ownerAvatarUrl && owner?.id && countrySlug && (
                      <Link
                        href={`/${countrySlug}/owned-properties/${owner.id}`}
                        onClick={(e) => e.stopPropagation()}
                      >
                        <Image
                          src={ownerAvatarUrl}
                          alt="Owner logo"
                          width={32}
                          height={32}
                          className="rounded-full mt-1"
                        />
                      </Link>
                    )}
                  </div>
                </div>

                {/* Property details */}
                <div className="flex flex-wrap gap-3 text-gray-600 mt-3">
                  <div className="flex items-center gap-1"><LiaBedSolid /> {property.bedrooms}</div>
                  <div className="flex items-center gap-1"><PiBathtub /> {property.bathrooms}</div>
                  <div className="flex items-center gap-1"><RxDimensions /> {property.property_size} sqm</div>
                </div>

                {/* Price */}
                <div className="mt-3">
                  <p className="text-2xl font-bold text-black">
                    {property.price} {property.currency || "SAR"}
                  </p>
                  <p className="text-sm text-gray-500">
                    {property.psub_type?.subtype_name}
                  </p>
                </div>
              
              </div>
          </div>    
          


          {/* Footer under image  */}
          <div className="rounded-b-lg bottom-0 left-0 right-0 bg-[#e5e7eb] text-gray-500 text-xs px-3 py-1 flex justify-between items-center">
              <span>
                Listed {property?.available_from
                  ? formatDistanceToNow(new Date(property.available_from), {
                      addSuffix: true,
                    })
                  : "—"}
              </span>

              
              
              <div className="flex gap-2 text-lg items-center">
                <button className="bg-white text-[#5842f6] text-center  border-1 border-[#5842f6] rounded-md flex items-center py-2 px-3"><FiPhone className="text-[#5842f6]"/><text className="ml-2 text-[#5842f6]">  Call</text></button>
                <button className="bg-white text-[#5842f6] text-center  border-1 border-[#5842f6] rounded-md flex items-center py-2 px-3"><FiMail  className="text-[#5842f6]"/><text className="ml-2 text-[#5842f6]"> Email</text></button>
                <button className="bg-white text-[#5842f6] text-center  border-1 border-[#5842f6] rounded-md flex items-center py-2 px-3"><FiMessageCircle className="text-[#5842f6]"/><text className="ml-2 text-[#5842f6]">Whatsapp</text></button>
                
                <text className="text-gray-500 items-center">|</text>

                {/* like button */}
                {user && (
                    <button
                        onClick={toggleLike}
                        className={`transition-colors ${liked ? "text-green-500" : "text-white" }`}
                      >
                        <FiHeart fill={liked ? "currentColor" : "none"} />
                    </button>
                )}


                {/* dots  */}
                <div className="relative">
                    <button 
                      className="bg-white text-[#5842f6] text-center border-1 border-[#5842f6] rounded-md flex items-center py-3 px-3"
                      onClick={() => setMenuOpen(!menuOpen)}
                    >
                        <FiMoreVertical className="text-[#5842f6]"/>
                    </button>

                    {menuOpen && (
                      <div className="absolute right-0 top-6 bg-white shadow-lg rounded-md border text-gray-700 text-sm w-32">
                        <button className="flex items-center gap-2 px-3 py-2 hover:bg-gray-100 w-full">
                          <FiShare2 /> Share
                        </button>
                        <button className="flex items-center gap-2 px-3 py-2 hover:bg-gray-100 w-full">
                          <FiFlag /> Report
                        </button>
                      </div>
                    )}
                </div>
              </div>
          </div>
            
        {/* </motion.div> */}
    
   </Link>
  );
}
