// app/page.tsx
"use client";
import Link from "next/link";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { getCountriesList } from "../app/sa/utils/property";



export default function HomePage() {
  const [countryList, setCountryList] = useState([]);
  
  
  // const countries = [
  //   { country_name: "Saudi Arabia"        , country_slug: "sa" , code: "🇸🇦" },
  //   { country_name: "United Arab Emirates", country_slug: "uae", code: "🇦🇪" },
  //   { country_name: "Egypt"               , country_slug: "eg" , code: "🇪🇬" },
  // ];

  
  
  useEffect(() => {
        const fetchCountries = async () => {
                try {
                    const data = await getCountriesList();
                    console.log("getCountriesList-error =", data);
                    setCountryList(data);   // ✅ save the list

                } catch (error: any) {
                    console.log("getCountriesList-error =", error);
                }
        };
        fetchCountries();
  }, []);





  return (
    <section className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-white to-gray-100 px-6 py-16">
      {/* Title */}
      <motion.h1
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-4xl font-extrabold text-gray-800 mb-4 text-center"
      >
        Welcome to{" "}
        <span className="text-indigo-600">Property Finder Global</span>
      </motion.h1>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.6 }}
        className="text-gray-600 text-center max-w-xl mb-10"
      >
        Choose your country below to explore real estate listings, properties
        for sale, and rental opportunities.
      </motion.p>

      {/* Country cards */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.6 }}
        className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 w-full max-w-5xl"
      >
        {countryList.map((country, index) => (
          <motion.div
            key={country.id}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.98 }}
            transition={{ type: "spring", stiffness: 200 }}
          >
            <Link
              href={`/${country.country_slug}`}
              className="block bg-white shadow-md rounded-2xl border border-gray-100 p-8 text-center hover:shadow-xl transition-all duration-300"
            >
              <span className="text-6xl">{country.code}</span>
              <h2 className="mt-4 text-xl font-semibold text-gray-800">
                {country.country_name}
              </h2>
              <p className="text-gray-500 mt-2">Explore properties in {country.country_name}</p>
            </Link>
          </motion.div>
        ))}
      </motion.div>

      {/* Footer */}
      <motion.footer
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
        className="mt-16 text-gray-500 text-sm"
      >
        © {new Date().getFullYear()} Property Finder Global. All rights reserved.
      </motion.footer>
    </section>
  );
}
