"use client";
import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { FiChevronDown, FiSearch } from "react-icons/fi";
import { Home, Building2, TrendingUp, Users } from "lucide-react";
import DynamicPropertiesClient from "../../(dynamic_pages)/(properties_pages)/components/DynamicPropertiesClient";

type PropertyCategory = "residential" | "commercial" | null;
type PurposeType = "sale" | "rent" | null;



export default function Findsection() {
  const router = useRouter();
  const [activeCategory, setActiveCategory] = useState<PropertyCategory>("residential");
  const [activePurpose, setActivePurpose] = useState<PurposeType>("sale");
  const [searchQuery, setSearchQuery] = useState("");
  const [showPurposeMenu, setShowPurposeMenu] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setShowPurposeMenu(false);
  }, [activeCategory]);

  // Close on click outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setShowPurposeMenu(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSearch = () => {
    if (!activeCategory || !activePurpose) return;
    const purposeSlug = activePurpose === "sale" ? "sale" : "rent";
    const categorySlug = activeCategory === "residential" ? "residential" : "commercial";
    router.push(`/sa/${categorySlug}-properties-for-${purposeSlug}${searchQuery ? `?q=${encodeURIComponent(searchQuery)}` : ""}`);
  };

  const purposeOptions =
    activeCategory === "residential"
      ? [
          { value: "sale", label: "Buy", icon: <Home className="w-4 h-4" /> },
          { value: "rent", label: "Rent", icon: <Building2 className="w-4 h-4" /> },
        ]
      : [
          { value: "sale", label: "Buy", icon: <TrendingUp className="w-4 h-4" /> },
          { value: "rent", label: "Rent", icon: <Building2 className="w-4 h-4" /> },
        ];

  return (
    <>
      {/* Hero Section */}
      <section className="relative min-h-[400px] sm:min-h-[500px] md:min-h-[600px] flex items-center justify-center overflow-hidden">
        {/* Background Image */}
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1600596542813-7f8c3a6b5c9?w=1920&q=80')",
          }}
        />
        {/* Multi-layer overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-indigo-900/90 via-indigo-800/75 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />

        {/* Content */}
        <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm px-3 py-1.5 sm:px-4 sm:py-2 rounded-full text-white/90 text-xs sm:text-sm mb-4 sm:mb-6">
            <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
            {new Date().toLocaleDateString("en-US", { month: "long", year: "numeric" })} - Top Properties
          </div>

          {/* Main Heading */}
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight mb-4">
            Find Your Perfect
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-amber-300 to-orange-300">
              Dream Property
            </span>
          </h1>

          <p className="text-lg md:text-xl text-white/80 mb-8 max-w-2xl">
            Discover residential and commercial properties for sale or rent. Your next home or investment is just a search away.
          </p>

          {/* Search Card */}
          <div
            ref={containerRef}
            className="bg-white rounded-2xl shadow-2xl p-4 sm:p-6 md:p-8 max-w-md sm:max-w-lg md:max-w-4xl mx-auto"
          >
            {/* Category Tabs */}
            <div className="flex flex-wrap gap-2 mb-6 sm:gap-4">
              {(["residential", "commercial"] as PropertyCategory[]).map((cat) => (
                <button
                  key={cat}
                  onClick={() => {
                    setActiveCategory(cat);
                    setShowPurposeMenu(false);
                  }}
                  role="tab"
                  aria-label={`Filter by ${cat}`}
                  className={`flex-1 min-w-[80px] md:min-w-[120px] min-h-[48px] flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-medium transition-all duration-300 ${
                    activeCategory === cat
                      ? "bg-indigo-600 text-white shadow-lg scale-[1.02]"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
                >
                  {cat === "residential" ? (
                    <Home className="w-4 h-4" />
                  ) : (
                    <Building2 className="w-4 h-4" />
                  )}
                  {cat?.charAt(0).toUpperCase() + cat?.slice(1)}
                </button>
              ))}
            </div>

            {/* Purpose Selection */}
            <div className="flex flex-wrap gap-2 mb-6 sm:gap-4">
              {purposeOptions.map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => setActivePurpose(opt.value as PurposeType)}
                  role="tab"
                  aria-label={`Purpose: ${opt.label}`}
                  className={`flex-1 min-w-[120px] min-h-[48px] flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-medium transition-all duration-300 ${
                    activePurpose === opt.value
                      ? "bg-indigo-50 text-indigo-700 border-2 border-indigo-600"
                      : "bg-gray-50 text-gray-600 border-2 border-transparent hover:bg-gray-100 hover:text-gray-700"
                  }`}
                >
                  {opt.icon}
                  {opt.label}
                </button>
              ))}
            </div>

            {/* Search Input & Button */}
            <div className="flex flex-wrap gap-3">
              <div className="flex-1 min-w-[0] relative">
                <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                  placeholder="Search by city, community, or building..."
                  className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none text-gray-900 placeholder-gray-400"
                />
              </div>
              <button
                onClick={handleSearch}
                className="flex-shrink-0 px-6 py-3 text-white font-medium bg-gradient-to-r from-indigo-600 to-indigo-700 rounded-xl hover:from-indigo-700 hover:to-indigo-800 transition-all duration-200 shadow-lg hover:shadow-xl whitespace-nowrap"
              >
                Search
              </button>
            </div>

            {/* Quick Links */}
            <div className="flex flex-wrap gap-4 sm:gap-6 mt-4 pt-4 border-t border-gray-100">
              <Link
                href="/sa/newProjects"
                className="flex items-center gap-2 text-sm font-medium text-gray-700 hover:text-indigo-600 transition-colors"
              >
                <TrendingUp className="w-4 h-4" />
                New Projects
              </Link>
              <Link
                href="/sa/findAgent"
                className="flex items-center gap-2 text-sm font-medium text-gray-700 hover:text-indigo-600 transition-colors"
              >
                <Users className="w-4 h-4" />
                Find Agent
              </Link>
            </div>


          </div>
        </div>
      </section>

      {/* Results Section (if applicable) */}
      {activeCategory && activePurpose && (
        <section className="bg-gray-50 py-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <DynamicPropertiesClient
              maintypeSlug={activeCategory}
              purposeSlug={activePurpose === "sale" ? "sale" : "rent"}
            />
          </div>
        </section>
      )}
    </>
  );
}
