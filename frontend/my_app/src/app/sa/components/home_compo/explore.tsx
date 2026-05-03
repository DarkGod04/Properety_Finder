// src/app/components/home_compo/find.tsx
"use client";
import DynamicPropertiesClient from "../../(dynamic_pages)/(properties_pages)/components/DynamicPropertiesClient";
import React, { useState, useEffect, useRef } from "react";
import Link from 'next/link';
import Image from 'next/image';









export default function ExploreSection() {
    const [sectionName,setSectionName] = useState("Buysection")
    
    //  nav items in desktop size 
    const navPurboseItems = [
        { label: "Buy"},
        { label: "Rent"},
    ];
   

   const handleButtonClick = (label) =>{
        if (label === "Buy"){
            setSectionName("Buysection")
        }

        if (label === "Rent"){
            setSectionName("Rentsection")
        } 
   }
   
    


  return(
    <>
        <section className="bg-white px-10 mb-5">
            <h1 className="text-4xl py-6">Explore more</h1>
            
                {/* navbar  Buy/Rent  */}
        
                {/* Desktop Navbar */}
                <nav className="hidden md:block w-full px-8 text-gray-700 bg-white">
                    <div className="flex">
                        <ul className="flex items-center space-x-6 my-0 justify-between">
                                {navPurboseItems.map(( {label}) => (
                                    <li
                                        key={label}
                                        onClick={() => handleButtonClick(label)}
                                        className="text-gray-600 hover:text-gray-900 font-medium hover:bg-gray-200 py-5 mx-0 px-3 hover:cursor-pointer"
                                    >
                                        {label}
                                    </li>
                                ))}
                        </ul>
                    </div>
                </nav>

                {/*  BUY result page viewd */}
                {sectionName === "Buysection" && 
                    <div className="bg-white">
                                <DynamicPropertiesClient 
                                    maintypeSlug="residential" 
                                    purposeSlug="sale" 
                                />                   
                    </div> 
                }

                {/*  RENT result page viewd */}
                {sectionName === "Rentsection" && 
                    <div className="bg-white">
                                <DynamicPropertiesClient 
                                    maintypeSlug="residential" 
                                    purposeSlug="rent" 
                                />
                    </div> 
                }




                {/* Mobile Navbar */}
                <div className="md:hidden block w-full bg-white">
                    {/* row down */}
                    <div className="">
                        <nav className="flex text-wrap  gap-2  mx-0 my-0">
                            
                            {/* normal links type */}
                            {navPurboseItems.map(({ label  }) => (
                            <button
                                key={label}
                                className="text-gray-600 hover:text-gray-900 font-medium py-5 mx-0"
                            >
                                {label}
                            </button>
                            ))}
                        </nav>
                    </div>
                </div>


                
            
        </section>


        {/* join us section  */}
        {/* <section className="bg-[#2c255e] h-30 text-white px-8 flex items-center justify-between">
            <h2 className="text-2xl py-6">Looking to advertise a property? We can help.</h2>
            <button 
                className="flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-[#2c255e] bg-white hover:bg-gray-100 md:py-4 md:text-lg md:px-10 hover:cursor-pointer">
                List your property with us
            </button>
        </section> */}

    </>
  )
}