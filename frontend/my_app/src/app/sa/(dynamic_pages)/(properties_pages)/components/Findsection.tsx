// (dynamic_pages)/(properities_pages)/components/Findsection.tsx
"use client";
import axios from "axios";
import React, { useState, useEffect, useRef } from "react";
import { FiChevronDown } from "react-icons/fi";
import { useRouter } from "next/navigation";


export default function Findsection({purpose, mainType}) {
  const countrySlug = process.env.NEXT_PUBLIC_COUNTRY_SLUG;
  const [activeRadioButton, setActiveRadioButton] = useState<string | null>("");
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
 
  // Toggle menu open/close
  const toggleMenu = (menu: string) => {
    setActiveMenu((prev) => (prev === menu ? null : menu));
  };


  


  // city
  const [cityList, setCityList] = useState([]);
  // const cityList =["khobar","dammam","jeddah"]
  const [selectedCity, setSelectedCity] = useState({
                                                     id:"",
                                                     city_name: "All Cities",
                                                   })
  // Fetch dynamic cityList
  useEffect(() => {
  const fetchCityList= async () => {
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/property/${countrySlug}/cities/`,
        { withCredentials: true }
      );

      setCityList(response.data || []);
      console.log("fetchCityList-cityList=",response.data)

    } catch (error) {
      console.error("❌ Error fetchCityList:", error);
    }
  };
  fetchCityList();
  },  [] );


  const handleCitiesOptions = (option) => {
      setSelectedCity(
                        {
                                id: option.id, 
                          city_name: option.city_name 
                        });
                        console.log("selectedCity.city_name=", selectedCity.city_name)
      setActiveMenu(null); // close dropdown after selecting
  };
    
    


  
  
  
  //  main type
  // for label on button at start --  ex. Buy residential
  const [maintypePurpose, setMaintypePurpose] = useState<string | null>("");
  
  //  FOR maintypePurpose -- Button label at start
  useEffect(() => {
      if (purpose === "sale" && mainType === "residential"){
          setActiveRadioButton("Buy residential")
          setMaintypePurpose("Buy residential")
      }
      if (purpose === "sale" && mainType === "commercial"){
          setActiveRadioButton("Buy commercial")
          setMaintypePurpose("Buy commercial")
      }
      if (purpose === "rent" && mainType === "residential"){
          setActiveRadioButton("Rent residential")
          setMaintypePurpose("Rent residential")
      }
      if (purpose === "rent" && mainType === "commercial"){
          setActiveRadioButton("Rent commercial")
          setMaintypePurpose("Rent commercial")
      }
  },  [] );


  //  if select one of options of main type list
  const [maintypeSelected, setMaintypeSelected] = useState<string | null>(mainType);

  const router = useRouter();

  const handleMaintypePurposeOptions = (option) => {
    setMaintypePurpose(option);
    setActiveRadioButton(option);
    setActiveMenu(null); // close dropdown

    // Determine slugs from option text
    const [puropse, type] = option.toLowerCase().split(" "); // e.g. ["buy", "residential"]

    const purposeSlug = puropse === "buy" ? "sale" : "rent"; // sale or rent
    const maintypeSlug = type;                               // residential or commercial
    setMaintypeSelected(type)
    // Navigate to the proper URL
    router.push(`/sa/${maintypeSlug}-properties-for-${purposeSlug}`);
  };





  // Fetch subtypes based on selected main type and purpose -- matches backend URL pattern
  useEffect(() => {
  // Only fetch when we have valid maintypeSelected, countrySlug and purpose
  if (!maintypeSelected || !countrySlug || !purpose) {
    return;
  }
  const fetchSubTypesList = async () => {
    try {
      const response = await axios.get(
         `${process.env.NEXT_PUBLIC_API_URL}/property/${countrySlug}/${maintypeSelected}-for-${purpose}/subtypes/`,
        { withCredentials: true }
      );
      setSubtypesList(response.data || []);
      console.log("fetchSubTypesList-subTypesList=",response.data);
    } catch (error) {
      console.error("❌ Error fetching subtypes:", error);
    }
  };
  fetchSubTypesList();
}, [maintypeSelected, countrySlug, purpose]);


//  subtypes based on selected maintype (residential/commercial)-- using select and options way 
  const [subtypesList, setSubtypesList] = useState([]);
  const [selectedSubtype, setSelectedSubtype] = useState({
                                                          id: "",
                                                          subtype_name: "Property type",
                                                        });
  console.log("selectedSubtype=",selectedSubtype);



  const handleSelectSubtypeOptions = (option) => {
      setSelectedSubtype({
                            id: option.id, 
                            subtype_name: option.subtype_name, 
                          });
                        console.log("selectedSubtype.subtype_name=", selectedSubtype.subtype_name)
  
      setActiveMenu(null); // close dropdown after selecting
  };









  // Beds & Baths
  const [studio,setStudio]= useState("");
  const [beds,setBeds]= useState("");
  const [baths,setBaths]= useState("");
  
  const handleStudio = (optionName: string) => {
    setStudio(optionName);
  };
  const handleBedsNumbers = (optionName: string) => {
    setBeds(optionName);
  };
  const handleBathsNumbers = (optionName: string) => {
    setBaths(optionName);
  };
  
  



  // price 
  // min price 
  const [selectedMinPrice,setSelectedMinPrice]= useState("Min. Price");
  const onChangeMinPrice = (e)=>{
    setSelectedMinPrice(e.target.value)
    console.log("onChangeMinPrice=",e.target.value)
  }
  // max price 
  const [selectedMaxPrice,setSelectedMaxPrice]= useState("Max. Price");
  const onChangeMaxPrice = (e)=>{
    setSelectedMaxPrice(e.target.value)
    console.log("onChangeMinPrice=",e.target.value)
  }


  // more 
  const [more,setMore]= useState("");
  const [activeMoreButton, setActiveMoreButton] = useState<string | null>("More");
  const handleMoreButton = (buttonName: string) => {
    setMore(buttonName);
  };

  // Furnishings
  // const f =  { 
  //             "Furnished": "furnished" ,
  //             "Unfurnished":"unfurnished",
  //             "Partly Furnished": "partly"
  //           }
  const [fur,setFur]= useState("");
  const handleFurnishingsOption = (option) =>{
      setFur(option)  
  };

  // Area
  // min Area 
  const [selectedMinArea,setSelectedMinArea]= useState("Min. Area");
  const onChangeMinArea = (e)=>{
    setSelectedMinArea(e.target.value)
    console.log("onChangeMinArea=",e.target.value)
  }
  // max Area 
  const [selectedMaxArea,setSelectedMaxArea]= useState("Max. Area");
  const onChangeMaxArea = (e)=>{
    setSelectedMaxArea(e.target.value)
    console.log("onChangeMinArea=",e.target.value)
  }

  
  // Amenities
  // const AmenitiesList = ["water","views","pool"]
  const [AmenitiesList,setAmenitiesList]= useState([]);
  const [selectedAmenities,setSelectedAmenities]= useState([]);
  
  const handleAmenitiesOptions = (amenityName) => {
      setSelectedAmenities((prev) => {
          // If amenity is already selected, remove it
          if (prev.includes(amenityName)) {
            return prev.filter((item) => item !== amenityName);
          }
          // Otherwise, add it
          return [...prev, amenityName];
          });
  };
  

   // Fetch dynamic fetchAmenitiesList
  useEffect(() => {
  const fetchAmenitiesList= async () => {
    try {

      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/property/list-amenity/`,
        { withCredentials: true }
      );

      setAmenitiesList(response.data || []);
      console.log("AmenitiesList=",AmenitiesList)

    } catch (error) {
      console.error("❌ Error fetchAmenitiesList:", error);
    }
  };
  fetchAmenitiesList();
},  [] );








  
  




const containerRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setActiveMenu(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);



  // Close dropdown on Escape
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setActiveMenu(null);
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, []);


  

 

//  search 
  // Handle search click — builds query like PropertyFinder
  const handleSearch = () => {
    const queryParams = new URLSearchParams();
    console.log("selectedCity=",selectedCity.city_name);
    console.log("maintypePurpose=",maintypePurpose);
    console.log("selectedSubtype=",selectedSubtype.subtype_name);
    console.log("studio=",studio);
    console.log("beds=",beds);
    console.log("baths=",baths);
    console.log("selectedMinPrice=",selectedMinPrice);
    console.log("selectedMaxPrice=",selectedMaxPrice);
    console.log("fur=",fur);
    console.log("selectedMinArea=",selectedMinArea);
    console.log("selectedMaxArea=",selectedMaxArea);
    console.log("selectedAmenities=",selectedAmenities);
    if (selectedCity.city_name && selectedCity.city_name !== "All Cities") {
        queryParams.append("selectedCity", selectedCity.city_name);
    }
    if (maintypePurpose) queryParams.append("type", maintypePurpose.includes("residential") ? "residential" : "commercial");
    if (maintypePurpose) queryParams.append("purpose", maintypePurpose.includes("Buy") ? "sale" : "rent");
    if (selectedSubtype.subtype_name && selectedSubtype.subtype_name !== "Property type") {
        queryParams.append("selectedSubtype", selectedSubtype.subtype_name);
    }
    if (studio) queryParams.append("beds","0");
    if (beds)queryParams.append("beds",beds);
    if (baths)queryParams.append("baths",baths);
    if (selectedMinPrice && selectedMinPrice !== "Min. Price") {
        queryParams.append("selectedMinPrice",selectedMinPrice);
    }
    if (selectedMaxPrice && selectedMaxPrice !== "Max. Price") {
        queryParams.append("selectedMaxPrice",selectedMaxPrice);
    }
    if (fur && fur === "Furnished"){
       queryParams.append("fur","furnished");
    };
    if (fur && fur === "Unfurnished"){
       queryParams.append("fur","unfurnished");
    };
    if (fur && fur === "Partly furnished"){
       queryParams.append("fur","partly");
    };
    if (selectedMinArea && selectedMinArea !== "Min. Area") {
        queryParams.append("selectedMinArea",selectedMinArea);
    }
    if (selectedMaxArea && selectedMaxArea !== "Max. Area") {
        queryParams.append("selectedMaxArea",selectedMaxArea);
    }

    if (Array.isArray(selectedAmenities) && selectedAmenities.length > 0) {
      selectedAmenities.forEach((a) => queryParams.append("amenities", a));
    }


    

    // Example of how it would look:
    // /search?purpose=buy&type=residential&subtype=apartment
    window.location.href = `/sa/search?${queryParams.toString()}`;
  };






  return (
    <section className="p-2 bg-red-600">
        {/* Main div container */}
        <div
          ref={containerRef}
          className="flex flex-wrap items-center gap-2 w-full bg-white justify-start md:justify-between p-2 rounded-lg"
        >
                {/* Search input */}
                {/* <div className="">
                  <input
                    type="text"
                    placeholder="City, community or building"
                    className="w-52 px-2 py-3 mx-1 bg-gray-500 text-gray-700 focus:outline-none"
                  />
                </div> */}


          
        

                {/* Filters */}

                {/*city */}
                <div className="relative bg-green-500">
                  <button
                    onClick={() => toggleMenu("cityMenu")}
                    aria-expanded={activeMenu === "cityMenu"}
                    className="capitalize cursor-pointer flex items-center px-6 py-3 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg focus:outline-none border border-gray-300"
                  >
                  {!selectedCity.id ? "All Cities": selectedCity.city_name}
                    <FiChevronDown
                      className={`ml-1 transition-transform duration-300 ${ activeMenu === "cityMenu" ? "rotate-180" : ""  }`}  
                    />
                  </button>

                  {activeMenu === "cityMenu" && (
                    <div className="absolute z-50 left-0 top-full bg-gray-100 border rounded-lg shadow-md w-32 sm:w-40 p-2">
                      {cityList.map(
                        (option) => (
                          <label
                            key={option.id}
                            className={`flex items-center gap-2 px-3 py-2 rounded-md cursor-pointer hover:bg-indigo-100 ${ selectedCity.city_name === option.city_name ? "bg-indigo-200" : "" }`}
                            onClick={() => handleCitiesOptions(option)}
                          >
                              <input
                                type="radio"
                                name="selectedCity"
                                checked={activeRadioButton === option.city_name}
                                onChange={() => handleCitiesOptions(option)}
                                className="hidden"
                              />
                              <span className="capitalize">{option.city_name}</span>
                          </label>
                        )
                      )}
                    </div>
                  )}
                </div>



                {/*Main type Purpose Menu */}
                <div className="relative">
                  <button
                    onClick={() => toggleMenu("maintypePurposeMenu")}
                    aria-expanded={activeMenu === "maintypePurposeMenu"}
                    className={`cursor-pointer flex items-center px-6 py-3 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg focus:outline-none ${activeRadioButton === maintypePurpose ? "border border-indigo-600 text-indigo-600":""}`}
                  >
                    {maintypePurpose}
                    <FiChevronDown
                      className={`ml-1 transition-transform duration-300 ${activeMenu === "maintypePurposeMenu" ? "rotate-180" : ""}`}
                    />
                  </button>

                  {activeMenu === "maintypePurposeMenu" && (
                    <div className="absolute z-50 left-0 top-full bg-gray-100 border rounded-lg shadow-md w-52 p-2">
                      {["Buy residential", "Rent residential", "Buy commercial", "Rent commercial"].map(
                        (option) => (
                          <label
                            key={option}
                            className={`flex items-center gap-2 px-3 py-2 rounded-md cursor-pointer hover:bg-indigo-100 ${ maintypePurpose === option ? "bg-indigo-200" : ""  }`}
                            onClick={() => handleMaintypePurposeOptions(option)}
                          >
                            <input
                              type="radio"
                              name="maintypePurpose"
                              checked={activeRadioButton === option}
                              onChange={() => handleMaintypePurposeOptions(option)}
                              className="hidden"
                            />
                            <span>{option}</span>
                          </label>
                        )
                      )}
                    </div>
                  )}
                </div>



                {/*subtypeMenu */}
                <div className="relative">
                  <button
                    onClick={() => toggleMenu("subtypeMenu")}
                    aria-expanded={activeMenu === "subtypeMenu"}
                    className="capitalize cursor-pointer flex items-center px-6 py-3 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg focus:outline-none border border-gray-300"
                  >
                  {!selectedSubtype.id ? "Property type": selectedSubtype.subtype_name}
                    <FiChevronDown
                      className={`ml-1 transition-transform duration-300 ${ activeMenu === "subtypeMenu" ? "rotate-180" : ""  }`}  
                    />
                  </button>

                  {activeMenu === "subtypeMenu" && (
                    <div className="absolute z-50 left-0 top-full bg-gray-100 border rounded-lg shadow-md w-32 p-2">
                      {subtypesList.map(
                        (option) => (
                          <label
                            key={option.id}
                            className={`flex items-center gap-2 px-3 py-2 rounded-md cursor-pointer hover:bg-indigo-100 ${ selectedSubtype.subtype_name === option.subtype_name ? "bg-indigo-200" : "" }`}
                            onClick={() => handleSelectSubtypeOptions(option)}
                          >
                            <input
                              type="radio"
                              name="selectedSubtype"
                              checked={activeRadioButton === option.subtype_name }
                              onChange={() => handleSelectSubtypeOptions(option)}
                              className="hidden"
                            />
                            <span className="capitalize">{option.subtype_name}</span>
                          </label>
                        )
                      )}
                    </div>
                  )}
                </div>




                
                {/* Beds & Baths */}
                <div className="relative">
                  <button
                    onClick={() => toggleMenu("bedsBathsMenu")}
                    aria-expanded={activeMenu === "bedsBathsMenu"}
                    className="cursor-pointer flex items-center px-6 py-3 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg focus:outline-none border border-gray-300"
                  >
                    {studio},{beds}Beds, {baths}Baths
                    <FiChevronDown
                      className={`ml-1 transition-transform duration-300 ${
                        activeMenu === "bedsBathsMenu" ? "rotate-180" : ""
                      }`}
                    />
                  </button>

                  {activeMenu === "bedsBathsMenu" && (
                    <div className="absolute z-50 left-0 top-full bg-gray-100 border rounded-lg shadow-md w-[450px] h-[250px] p-2">
                      Bedrooms
                      <div className="flex p-2 mb-6">
                      {["studio"].map(
                        (option) => (
                          <label
                              key={option}
                              className={`flex items-center gap-2 px-3 py-2 rounded-md cursor-pointer hover:bg-indigo-100  ${studio === option ? "bg-indigo-200" : ""}`}
                              onClick={() => handleStudio(option)}
                          >
                              <input
                                type="radio"
                                name="studio"
                                checked={activeRadioButton === option}
                                onChange={() => handleStudio(option)}
                                className="hidden"
                              />
                              <span className="flex rounded rounded-full p-1">{option}</span>
                          </label>
                        )
                      )}
                      
                      
                    
                      {["1", "2", "3", "4", "5", "6", "7" ,"+7"].map(
                        (option) => (
                          <label
                              key={option}
                              className={`flex items-center gap-2 px-3 py-2 rounded-md cursor-pointer hover:bg-indigo-100  ${
                                beds === option ? "bg-indigo-200" : ""
                              }`}
                              onClick={() => handleBedsNumbers(option)}
                          >
                              <input
                                type="radio"
                                name="beds"
                                checked={activeRadioButton === option}
                                onChange={() => handleBedsNumbers(option)}
                                className="hidden"
                              />
                              <span className="flex rounded rounded-full p-1">{option}</span>
                          </label>
                        )
                      )}
                      </div>
                      Bathrooms
                      <div className="flex p-2 ">
                      {["1", "2", "3", "4", "5", "6", "7" ,"+7"].map(
                        (option) => (
                          <label
                              key={option}
                              className={`flex items-center gap-2 px-3 py-2 rounded-md cursor-pointer hover:bg-indigo-100 ${
                                baths === option ? "bg-indigo-200" : ""
                              }`}
                              onClick={() => handleBathsNumbers(option)}
                          >
                              <input
                                type="radio"
                                name="baths"
                                checked={activeRadioButton === option}
                                onChange={() => handleBathsNumbers(option)}
                                className="hidden"
                              />
                              <span className="flex rounded rounded-full p-1">{option}</span>
                          </label>
                        )
                      )}
                      </div>
                      <hr></hr>
                          <div className="mt-3 mb-1">Reset</div>
                    </div>
                  )}
                </div>




                {/* price */}
                <div className="relative">
                    <button
                      onClick={() => toggleMenu("priceMenu")}
                      aria-expanded={activeMenu === "priceMenu"}
                      className="cursor-pointer flex items-center px-6 py-3 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg focus:outline-none border border-gray-300"
                    >
                      { selectedMinPrice }-{selectedMaxPrice}
                      <FiChevronDown
                        className={`ml-1 transition-transform duration-300 ${
                          activeMenu === "priceMenu" ? "rotate-180" : ""
                        }`}
                      />
                    </button>

                    {activeMenu === "priceMenu" && (
                    <div className="flex absolute z-50 left-0 top-full bg-gray-100 border rounded-lg shadow-md w-[380px] h-[100px]  p-2">
                    
                              {/* Select a min price - max price from a prices list */}
                              <div className="md:w-full flex justify-between">
                                  <div>
                                      {/* <label className="block text-sm font-medium">Min. Price</label> */}
                                      <select
                                        value={selectedMinPrice}
                                        onChange={onChangeMinPrice}
                                        className="mt-2 p-3 w-full border rounded-lg relative z-50 bg-white"
                                      >
                                          <option value="">Min. Price (SAR)</option>
                                          <option value="200000">200000</option>
                                          <option value="300000">300000</option>
                                          <option value="400000">400000</option>
                                          <option value="500000">500000</option>
                                          <option value="600000">600000</option>
                                          <option value="700000">700000</option>
                                          <option value="800000">800000</option>
                                          <option value="900000">900000</option>
                                          <option value="1000000">1000000</option>
                                          <option value="1000000">2000000</option>
                                          <option value="1000000">3000000</option>
                                          <option value="1000000">4000000</option>
                                          <option value="1000000">5000000</option>
                                      </select>
                                  </div>

                                  <div>
                                      {/* <label className="block text-sm font-medium">Max. Price</label> */}
                                      <select
                                        value={selectedMaxPrice}
                                        onChange={onChangeMaxPrice}
                                        className="mt-2 p-3 w-full border rounded-lg relative z-50 bg-white"
                                      >
                                          <option value="">Max. Price (SAR)</option>
                                          <option value="200000">200000</option>
                                          <option value="300000">300000</option>
                                          <option value="400000">400000</option>
                                          <option value="500000">500000</option>
                                          <option value="600000">600000</option>
                                          <option value="700000">700000</option>
                                          <option value="800000">800000</option>
                                          <option value="900000">900000</option>
                                          <option value="1000000">1000000</option>
                                          <option value="1000000">2000000</option>
                                          <option value="1000000">3000000</option>
                                          <option value="1000000">4000000</option>
                                          <option value="1000000">5000000</option>
                                      </select>
                                  </div>
                              </div>
                    </div>
                  )}
                </div>



                {/* more*/}
                <div className="relative">
                        <button
                          onClick={() => toggleMenu("moreMenu")}
                          aria-expanded={activeMenu === "moreMenu"}
                          className="cursor-pointer flex items-center px-6 py-3 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg focus:outline-none border border-gray-300"
                        >
                          More
                          <FiChevronDown
                            className={`ml-1 transition-transform duration-300 ${activeMenu === "moreMenu" ? "rotate-180" : "" }`}
                          />
                        </button>

                        {activeMenu === "moreMenu" && (

                        //  <div className="flex absolute z-50 left-[-100px] top-full bg-gray-100 border rounded-lg shadow-md w-[200px] p-2"> */}
                        //  more modal  

                        <div className="fixed inset-0 z-40 min-h-full overflow-y-auto overflow-x-hidden transition flex items-center">
                            {/* overlay  */}
                            <div aria-hidden="true" className="fixed inset-0 w-full h-full bg-black/50 cursor-pointer">
                            </div>

                            {/* Modal  */}
                            <div className="relative cursor-pointer pointer-events-none transition my-auto p-4 w-[800px] mx-auto">
                                <div className="w-full py-2 bg-white cursor-default pointer-events-auto  relative rounded-xl">
                                    {/*  close button */}
                                    <button 
                                            onClick={() => toggleMenu("moreMenu")}
                                            aria-expanded={activeMenu === "moreMenu"} 
                                            type="button" 
                                            className="absolute top-2 right-2 rtl:right-auto rtl:left-2"
                                    >
                                            <svg xlinkTitle="Close" className="h-4 w-4 hover:rotate-180 transition-all ease-in-out duration-500 cursor-pointer text-gray-400"
                                              xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                                              <path fillRule="evenodd"
                                                d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                                                clipRule="evenodd"></path>
                                            </svg>
                                            <span className="sr-only">
                                              Close
                                            </span>
                                    </button>

                                    <div className="space-y-2 p-2">
                                        <div className="p-2 space-y-2">
                                            <h2 className="text-xl tracking-tight text-center"  id="page-action.heading">
                                              More Filters
                                            </h2>
                                            <hr></hr>
                                            <p className="text-gray-500 pt-2">Furnishing</p>
                                              <div className="flex">
                                                
                                                  {["Furnished", "Unfurnished", "Partly furnished"].map(
                                                    (option) => (
                                                      <label
                                                          key={option}
                                                          className={`flex items-center gap-2 px-3 py-2 rounded-md cursor-pointer hover:bg-indigo-100 ${ fur === option ? "bg-indigo-200" : "" }`}
                                                          onClick={() => handleFurnishingsOption(option)}
                                                      >
                                                          <input
                                                            type="radio"
                                                            name="furnishings"
                                                            checked={activeRadioButton === option}
                                                            onChange={() => handleFurnishingsOption(option)}
                                                            className="hidden"
                                                          />
                                                          <span className="flex p-1">{option}</span>
                                                      </label>
                                                    )
                                                  )}
                                              </div>

                                              <hr></hr>
                                              <p className="text-gray-500 pt-2"> Property Size (sqm)</p>
                                              {/* Select a min Area - max Area from a Area list */}
                                              <div className="md:w-full flex gap-3 pb-2">
                                                  <div>
                                                      {/* <label className="block text-sm font-medium">Min. Area</label> */}
                                                      <select
                                                        value={selectedMinArea}
                                                        onChange={onChangeMinArea}
                                                        className="mt-2 p-3 w-full border rounded-lg relative z-50 bg-white"
                                                      >
                                                          <option value="">From</option>
                                                          <option value="50">50</option>
                                                          <option value="200">200</option>
                                                          <option value="400">400</option>
                                                          <option value="600">600</option>
                                                          <option value="800">800</option>
                                                          <option value="1000">1000</option>
                                                          <option value="1500">1500</option>
                                                          <option value="2000">2000</option>
                                                          <option value="2500">2500</option>
                                                          <option value="3000">3000</option>
                                                          <option value="3500">3500</option>
                                                      </select>
                                                  </div>

                                                  <div>
                                                      {/* <label className="block text-sm font-medium">Max. Area</label> */}
                                                      <select
                                                        value={selectedMaxArea}
                                                        onChange={onChangeMaxArea}
                                                        className="mt-2 p-3 w-full border rounded-lg relative z-50 bg-white"
                                                      >
                                                          <option value="">To</option>
                                                          <option value="50">50</option>
                                                          <option value="200">200</option>
                                                          <option value="400">400</option>
                                                          <option value="600">600</option>
                                                          <option value="800">800</option>
                                                          <option value="1000">1000</option>
                                                          <option value="1500">1500</option>
                                                          <option value="2000">2000</option>
                                                          <option value="2500">2500</option>
                                                          <option value="3000">3000</option>
                                                          <option value="3500">3500</option>
                                                      </select>
                                                  </div>
                                              </div>

                                              <hr ></hr>
                                              <p className="text-gray-500 pt-2">Amenities</p>
                                              <div className="flex flex-wrap gap-2">
                                                {AmenitiesList.map((amenity) => (
                                                  <label
                                                    key={amenity.id}
                                                    className={`flex items-center gap-2 px-3 py-2 rounded-md cursor-pointer border ${
                                                      selectedAmenities.includes(amenity.amenity_name)
                                                        ? "bg-indigo-200 border-indigo-400"
                                                        : "border-gray-300"
                                                    }`}
                                                  >
                                                    <input
                                                      type="checkbox"
                                                      checked={selectedAmenities.includes(amenity.amenity_name)}
                                                      onChange={() => handleAmenitiesOptions(amenity.amenity_name)}
                                                      className="cursor-pointer"
                                                    />
                                                    <span className="capitalize">{amenity.amenity_name}</span>
                                                  </label>
                                                ))}
                                              </div>

                                              <hr></hr>
                                              <p className="text-gray-500 pt-2">Keywords</p>
                                              {/* Keywords */}
                                              <div className="">
                                                <input
                                                  type="text"
                                                  placeholder="Keywords: e.g. beach, chiller free"
                                                  className="rounded-2xl  w-full px-2 py-3 mx-1 bg-gray-100 text-gray-700 focus:outline-none"
                                                />
                                              </div>

                                              {/* Show filtering results button */}
                                              <button
                                                onClick={() => toggleMenu("moreMenu")}
                                                className="rounded-xl cursor-pointer px-4 py-3  bg-[#ea3934] text-white font-semibold hover:bg-[#97211e] transition"
                                              >
                                                Apply filter
                                              </button>
                                            


                                        </div>
                                    </div>

                                    
                                </div>
                            </div>
                        </div>

                // </div>
                )} 
                </div>



                {/* Find button */}
                <button
                  onClick={handleSearch}
                  className="cursor-pointer px-4 py-3  bg-[#ea3934] text-white font-semibold hover:bg-[#97211e] transition"
                >
                  Find
                </button>
          
        </div>
    </section>
  );
}
