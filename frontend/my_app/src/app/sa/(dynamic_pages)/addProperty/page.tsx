"use client";

import { useAuth } from "../../context/AuthContext";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { getMainTypesList, getCountriesList, getPurposeList, getAmenitiesList,
       getCountryCitiesList, getMainTypeSubTypesList , addProperty } from "../../utils/property";

import axiosInstance from "../../lib/axios";

import Loading from "../../components/loading/Loading";
// react-toastify
import notify from "../../common/useNotification"
import { ToastContainer, toast } from 'react-toastify';

export default function AddProperty() {
    const { user, loading } = useAuth();
    const router = useRouter();

    // models.ForeignKey --- current user  -- from useAuth()
    // const [owner,setOwner] = useState("")    // "owner"

    // models.CharField
    const [title,setTitle] = useState("")                   // "title"
    const [area,setArea] = useState("")                     // "Area"
    const [district,setDistrict] = useState("")             // "district"
    const [plotNumber ,setPlotNumber ] = useState("")       // "plot_number"
    const [landNumber,setLandNumber] = useState("")         // "land_number"
    const [addressDetail,setAddressDetail] = useState("")   // "address_detail"
    const [currency,setCurrency] = useState("")            // "currency"
    // FACADE_CHOICES = [("north", "North"), ("south", "South"), ("east", "East"), ("west", "West"),]
    const [facade,setFacade] = useState("")                // "facade"
    // FURNISHING_CHOICES = [("furnished", "Furnished"),("unfurnished", "Unfurnished"),("partly", "Partly Furnished"),]
    const [furnishing,setFurnishing ] = useState("")    // "furnishing"

    // models.BooleanField
    const [isOccupied,setIsOccupied] = useState("")     // "is_occupied"

    // models.TextField
    const [description,setDescription] = useState("")    // "description"

    //  models.IntegerField
    const [bedrooms,setBedrooms] = useState("")         // "bedrooms"
    const [bathrooms,setBathrooms] = useState("")       // "bathrooms"
    const [propertyAge,setPropertyAge] = useState("")   // "property_age"

    // models.DecimalField
    const [latitude,setLatitude] = useState("")           // "latitude"
    const [longitude,setLongitude] = useState("")         // "longitude"
    const [propertySize,setPropertySize] = useState("")   // "property_size"
    const [plotLength,setPlotLength] = useState("")       // "plot_length"
    const [plotWidth,setPlotWidth] = useState("")         // "plot_width"
    const [streetWidth,setStreetWidth] = useState("")     // "street_width"
    const [price,setPrice] = useState("")                  // "price"

    // models.DateField
    const [availableFrom,setAvailableFrom] = useState("")        // "available_from"

    // models.ForeignKey
    const [countryList,setCountryList] = useState([]);
        const [selectedCountrySlug,setSelectedCountrySlug] = useState("")
        const [selectedCountryId,setSelectedCountryId] = useState("")
        // useState(                    // "country"
        //                                                         {
        //                                                             id:"",
        //                                                             country_name: "",
        //                                                             code:"",
        //                                                             country_slug: "",
        //                                                         })

    const [cityList,setCityList] = useState([]);
    const [selectedCity,setSelectedCity] = useState("")                           // "city"

    const [mainTypesList,setMainTypeList] = useState([]);
    const [selectedMainType,setSelectedMainType] = useState("")                    // "pmain_type"

    const [subTypeList,setSubTypeList] = useState([]);
    const [selectedSubType,setSelectedSubType] = useState("")                      // "psub_type"

    const [purposeList,setPurposeList] = useState([]);
    const [purpose,setPurpose] = useState("")                      // "purpose"


    // models.ManyToManyField
    const [amenitiesList,setAmenitiesList] = useState([]);
    const [amenities,setAmenities] = useState([])                  // "amenities"


    const [newPropertyId,setNewPropertyId]= useState("")      // new property id


    useEffect(() => {
        console.log("AddProperty-loading=",loading)
        console.log("AddProperty-user=",user)

        if (!loading && !user) {
            router.push("/sa/login");
        }

        if (!loading && user && ( user.role === "buyer") ){
                console.log('role=', user.role)
                toast.error( "You have no permission to reach this page");
                router.push("/sa/myDashboard");
        }

        // if (!loading && user && ( user.role === "admin" || user.role === "developer" || user.role === "broker" || user.role === "agent") ){
        //         setOwner(user.id)
        // }
    }, [user, loading, router]);



    useEffect(() => {
        // getCountriesList
        const fetchCountryList = async () => {
            try {
                const data = await getCountriesList();
                setCountryList(data);             // ✅ save country list
                console.log("countryList=", countryList);
                notify("The Main Types List is now get successfully", "success");

            } catch (error: any) {
                notify("Failed to get country List", "error");
                console.log("getCountryList-error =", error);
            }
        };
        fetchCountryList();

        // getMainTypesList
        const fetchMainTypesList = async () => {
                try {
                    const data = await getMainTypesList();
                    setMainTypeList(data);             // ✅ save the main type list
                    notify("The Main Types List is now get successfully", "success");

                } catch (error: any) {
                    notify("Failed to get Main Types List", "error");
                    console.log("getMainTypesList-error =", error);
                }
        };
        fetchMainTypesList();


        // getPurposeList
        const fetchPurposeList = async () => {
                try {
                    const data = await getPurposeList();
                    setPurposeList(data);             // ✅ save purpose list
                    notify("The purpose List is now get successfully", "success");

                } catch (error: any) {
                    notify("Failed to get Purpose List", "error");
                    console.log("getPurposeList-error =", error);
                }
        };
        fetchPurposeList();


        // getAmenitiesList
        const fetchAmenitiesList = async () => {
                try {
                    const data = await getAmenitiesList();
                    setAmenitiesList(data);             // ✅ save Amenities List
                    notify("The Amenities List is now get successfully", "success");

                } catch (error: any) {
                    notify("Failed to get Amenities List", "error");
                    console.log("getAmenitiesList-error =", error);
                }
        };
        fetchAmenitiesList ();

    }, []);




    console.log("selectedCountrySlug=",selectedCountrySlug)


    // getCountryCitiesList - send id of selected country to get cities list
    useEffect(() => {
        // getCountryCitiesList
        if(selectedCountrySlug){
            setCityList([])
            const fetchCityListForSelectedCountry = async (selectedCountrySlug) => {
                console.log("fetchCityListForSelectedCountry-selectedCountry",selectedCountrySlug)
                    try {
                        const data = await getCountryCitiesList(selectedCountrySlug);
                        setCityList(data);             // ✅ save the result city list
                        notify("The cities List belong to selected country is now get successfully", "success");

                    } catch (error: any) {
                        notify("Failed to get cities List belong to selected country", "error");
                        console.log(" fetchCityListForSelectedCountry-error =", error);
                    }
            };
        fetchCityListForSelectedCountry(selectedCountrySlug);
        }
    }, [selectedCountrySlug]);




    // getMainTypeSubTypesList - send id of selected MainType to get SubTypes list
    useEffect(() => {
        // getMainTypeSubTypesList
        if(selectedMainType){
            setSubTypeList([])
            const fetchSubTypesListForSelectedMainType = async (selectedMainType) => {
                console.log("fetchSubTypesListForSelectedMainType-selectedMainType",selectedMainType)
                    try {
                        const data = await getMainTypeSubTypesList(selectedMainType);
                        console.log("fetchSubTypesListForSelectedMainType-selectedMainType",data)
                        setSubTypeList(data);             // ✅ save the result SubType List
                        notify("SubType List belong to selected MainType is now get successfully", "success");

                    } catch (error: any) {
                        notify("Failed to get SubType List belong to selected MainType", "error");
                        console.log("fetchSubTypesListForSelectedMainType -error =", error);
                    }
            };
        fetchSubTypesListForSelectedMainType(selectedMainType);
        }
    }, [selectedMainType]);




    //  onChange
    ///////////////  FORM FIELDS  --- parse data from form field
    const onChangeTitle = (e) => {
        setTitle(e.target.value);
        console.log("onChangeTitle =", e.target.value);
    };
    const onChangeDescription = (e) => {
        setDescription(e.target.value)
        console.log('onChangeDescription =', e.target.value)
    };
    const onChangeSelectedMainType= (e) => {
        setSelectedMainType(e.target.value)
        console.log('onChangeSelectedMainType=', e.target.value)
    };
    const onChangeSelectedSubType= (e) => {
        setSelectedSubType(e.target.value)
        console.log('onChangeSelectedSubType=', e.target.value)
    };
    const onChangePurpose= (e) => {
        setPurpose(e.target.value)
        console.log('onChangePurpose =', e.target.value)
    };



    const onChangeSelectedCountry = (e) => {
        const newSlug = e.target.value;
        setSelectedCountrySlug(newSlug); // update state

        // use the current value directly
        const foundCountry = countryList.find(
            (country) => country.country_slug === newSlug
        );

            if (foundCountry) {
                setSelectedCountryId(foundCountry.id);
                console.log("onChangeSelectedCountry-Id=", foundCountry.id);
            } else {
                console.log("No country found for slug:", newSlug);
            }

        console.log("onChangeSelectedCountry-Slug=", newSlug);
        };




    const onChangeSelectedCity= (e) => {
        setSelectedCity(e.target.value)
        console.log('onChangeSelectedCity=', e.target.value)
    };
    const onChangeArea = (e) => {
        setArea(e.target.value)
        console.log('onChangeArea =', e.target.value)
    };
    const onChangeDistrict = (e) => {
        setDistrict(e.target.value);
        console.log("onChangeDistrict =", e.target.value);
    };
    const onChangePlotNumber = (e) => {
        setPlotNumber(e.target.value)
        console.log('onChangePlotNumber =', e.target.value)
    };
    const onChangeLandNumber = (e) => {
        setLandNumber(e.target.value);
        console.log("onChangeLandNumber =", e.target.value);
    };
    const onChangeAddressDetail = (e) => {
        setAddressDetail(e.target.value)
        console.log('onChangeAddressDetail =', e.target.value)
    };
    const onChangeLatitude= (e) => {
        setLatitude(e.target.value)
        console.log('onChangeLatitude =', e.target.value)
    };
    const onChangeLongitude= (e) => {
        setLongitude(e.target.value)
        console.log('onChangeLongitude =', e.target.value)
    };
    const onChangePrice= (e) => {
        setPrice(e.target.value)
        console.log('onChangePrice=', e.target.value)
    };
    const onChangeCurrency = (e) => {
        setCurrency(e.target.value);
        console.log("onChangeCurrency =", e.target.value);
    };
    const onChangePropertyAge= (e) => {
        setPropertyAge(e.target.value)
        console.log('onChangePropertyAge =', e.target.value)
    };
    const onChangePropertySize= (e) => {
        setPropertySize(e.target.value)
        console.log('onChangePropertySize =', e.target.value)
    };
    const onChangePlotLength= (e) => {
        setPlotLength(e.target.value)
        console.log('onChangePlotLength =', e.target.value)
    };
    const onChangePlotWidth= (e) => {
        setPlotWidth(e.target.value)
        console.log('onChangePlotWidth =', e.target.value)
    };
    const onChangeBedrooms = (e) => {
        setBedrooms(e.target.value)
        console.log('onChangeBedrooms =', e.target.value)
    };
    const onChangeBathrooms= (e) => {
        setBathrooms(e.target.value)
        console.log('onChangeBathrooms =', e.target.value)
    };
    const onChangeFacade = (e) => {
        setFacade(e.target.value)
        console.log('onChangeFacade =', e.target.value)
    };
    const onChangeStreetWidth= (e) => {
        setStreetWidth(e.target.value)
        console.log('onChangeStreetWidth =', e.target.value)
    };
    const onChangeFurnishing = (e) => {
        setFurnishing(e.target.value);
        console.log("onChangeFurnishing =", e.target.value);
    };
    const onChangeIsOccupied = (e) => {
        setIsOccupied(e.target.value)
        console.log('onChangeIsOccupied =', e.target.value)
    };
    const onChangeAvailableFrom= (e) => {
        setAvailableFrom(e.target.value)
        console.log('onChangeAvailableFrom =', e.target.value)
    };


    const onChangeAmenities= (e) => {
        setAmenities(e.target.value)
        console.log('onChangeAmenities =', e.target.value)
    };


    if (loading) {
        return (
        <div className="text-center mt-20">
            <Loading />
        </div>
        );
    }

    // While checking auth, avoid flicker
    if (!user) {
       return null; // Redirect handled already
    }


    //////  SUBMIT ////////////
    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log('submiting');
        console.log('selectedCountrySlug=', selectedCountrySlug);
        console.log('selectedCountryId=', selectedCountryId);
        console.log('selectedMainType=', selectedMainType);
        console.log('selectedSubType=', selectedSubType);
        console.log('purpose=', purpose);

        if (!loading && !user){
            router.push('/sa/login');
        }

        if (!title || !area || !district || !plotNumber || !landNumber || !addressDetail || !currency || !facade || !bedrooms || !bathrooms
           || !furnishing || !isOccupied || !description || !latitude || !propertyAge|| !longitude || !propertySize || !plotLength
           || !plotWidth || !streetWidth || !price || !availableFrom || !selectedCountryId || !selectedCity || !selectedMainType
           || !selectedSubType || !purpose || !amenities){
                    notify("Please fill the form fields !","warning");
                    return;
        }


        // Create FormData object
        // When uploading files in React with Axios, you must use FormData and not JSON.
        const formData = new FormData();
        // formData.append("owner",owner);
        formData.append("title",title);
        formData.append("area",area);
        formData.append("district",district);
        formData.append("plot_number", plotNumber );
        formData.append("land_number", landNumber);
        formData.append("address_detail", addressDetail);
        formData.append("currency", currency);
        formData.append("facade", facade );
        formData.append("furnishing", furnishing );
        formData.append("is_occupied", isOccupied);
        formData.append("bedrooms", bedrooms);
        formData.append("bathrooms", bathrooms);
        formData.append("property_age", propertyAge);
        formData.append("description", description  );
        formData.append("latitude", latitude);
        formData.append("longitude", longitude);
        formData.append("property_size", propertySize);
        formData.append("plot_length", plotLength  );
        formData.append("plot_width", plotWidth);
        formData.append("street_width", streetWidth);
        formData.append("price", price);
        formData.append("available_from", availableFrom);
        //  important note :
        //  this "country_id" "city_id" "pmain_type_id" "psub_type_id" "purpose_id" "amenities_ids"
        // not found PropertyModel in database , they are write only fields comes from PropertySerializer only to insert data
        formData.append("country_id", selectedCountryId);
        formData.append("city_id", selectedCity);
        formData.append("pmain_type_id", selectedMainType);
        formData.append("psub_type_id", selectedSubType);
        formData.append("purpose_id", purpose);
        amenities.forEach(id => formData.append("amenities_ids", id));  // multiple -- many to many relationship


        console.log('formData=', formData);
        console.log('formData.selectedCountryId=', formData.get('country'));
        console.log('formData.city=', formData.get('city'));
        console.log('formData.selectedMainType=', formData.get('pmain_type'));
        console.log('formData.psub_type=', formData.get('psub_type'));
        console.log('formData.purpose=', formData.get('purpose'));


        // addProperty - axios //
        try {
            const newProperty = await addProperty(formData); // ✅ This returns response.data from backend
            console.log("newProperty=", newProperty);

            const propertyId = newProperty.id; // ✅ Access ID safely
            console.log("propertyId=", propertyId );
            setNewPropertyId(propertyId);

            notify("The Property has been added successfully", "success");

            // Example navigation to image form
            router.push(`/sa/addProperty/images/${propertyId}`);
            // http://localhost:3000/addProperty/images/2723a133-a26f-4e79-94b7-d4e1c9924658


        } catch (error: any) {
            console.log("addPurpose error =", error);
            if (error.response && error.response.data) {
                    const errors = error.response.data;

                    Object.entries(errors).forEach(([field, messages]) => {
                    if (Array.isArray(messages)) {
                        messages.forEach((msg) => notify(`${field}: ${msg}`, "error"));
                    } else {
                        notify(`${field}: ${messages}`, "error");
                    }
                    });

            } else {
                    notify("Something went wrong, please try again.", "error");
            }
        }
    }


    return (
        <>
        <section className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 py-8 px-4 sm:px-6 lg:px-8">
            <div className="max-w-5xl mx-auto">
                {/* Header with Breadcrumb */}
                <nav className="mb-6" aria-label="Breadcrumb">
                    <ol className="inline-flex items-center space-x-1 md:space-x-2 rtl:space-x-reverse">
                        <li className="inline-flex items-center">
                            <Link href="/" className="inline-flex items-center text-sm font-medium text-slate-600 hover:text-indigo-600 transition-colors">
                                <svg className="w-4 h-4 mr-2" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
                                <path d="m19.707 9.293-2-2-7-7a1 1 0 0 0-1.414 0l-7 7-2 2a1 1 0 0 0 1.414 1.414L2 10.414V18a2 2 0 0 0 2 2h3a1 1 0 0 0 1-1v-4a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v4a1 1 0 0 0 1 1h3a2 2 0 0 0 2-2v-7.586l.293.293a1 1 0 0 0 1.414-1.414Z"/>
                                </svg>
                                Home
                            </Link>
                        </li>
                        <li>
                            <div className="flex items-center">
                                <svg className="rtl:rotate-180 w-3 h-3 text-slate-400 mx-1" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 6 10">
                                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 9 4-4-4-4"/>
                                </svg>
                                <Link href="/sa/myDashboard" className="ml-1 text-sm font-medium text-slate-600 hover:text-indigo-600 md:ml-2 transition-colors">My Dashboard</Link>
                            </div>
                        </li>
                        <li aria-current="page">
                            <div className="flex items-center">
                                <svg className="rtl:rotate-180 w-3 h-3 text-slate-400 mx-1" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 6 10">
                                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 9 4-4-4-4"/>
                                </svg>
                                <span className="ml-1 text-sm font-medium text-indigo-600 md:ml-2">Add Property</span>
                            </div>
                        </li>
                    </ol>
                </nav>

                {/* Main Card */}
                <div className="bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden">
                    {/* Card Header */}
                    <div className="bg-gradient-to-r from-indigo-600 via-indigo-700 to-purple-700 px-8 py-6">
                        <h1 className="text-2xl md:text-3xl font-bold text-white">Add New Property</h1>
                        <p className="text-indigo-100 mt-1 text-sm">Fill in the details below to list your property</p>
                    </div>

                    <form onSubmit={handleSubmit} className="p-6 md:p-8 space-y-8">
                        <ToastContainer position="top-center" autoClose={3000} />

                        {/* Basic Information Section */}
                        <div className="space-y-6">
                            <div className="flex items-center gap-2 mb-4">
                                <div className="w-8 h-8 bg-indigo-100 rounded-lg flex items-center justify-center">
                                    <svg className="w-4 h-4 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                                    </svg>
                                </div>
                                <h2 className="text-lg font-semibold text-slate-800">Basic Information</h2>
                            </div>

                            {/* Title */}
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1.5">Title <span className="text-red-500">*</span></label>
                                <input
                                    name="title"
                                    value={title}
                                    onChange={onChangeTitle}
                                    className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all bg-white text-slate-900 placeholder-slate-400"
                                    placeholder="Enter property title"
                                />
                            </div>

                            {/* Description - Fixed with textarea */}
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1.5">Description <span className="text-red-500">*</span></label>
                                <textarea
                                    name="description"
                                    value={description}
                                    onChange={onChangeDescription}
                                    rows={6}
                                    className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all bg-white text-slate-900 placeholder-slate-400 resize-y min-h-[150px]"
                                    placeholder="Describe your property in detail..."
                                />
                            </div>

                            {/* Main Type & Sub Type */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1.5">Main Type <span className="text-red-500">*</span></label>
                                    <select
                                        value={selectedMainType}
                                        onChange={onChangeSelectedMainType}
                                        className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all bg-white text-slate-900 appearance-none cursor-pointer"
                                    >
                                        <option value="">Select a Main Type</option>
                                        {mainTypesList.map((mtobj) => (
                                            <option key={mtobj.id} value={mtobj.id}>
                                                {mtobj.maintype_label}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1.5">Sub Type <span className="text-red-500">*</span></label>
                                    <select
                                        value={selectedSubType}
                                        onChange={onChangeSelectedSubType}
                                        className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all bg-white text-slate-900 appearance-none cursor-pointer"
                                    >
                                        <option value="">Select a Sub Type</option>
                                        {subTypeList.map((stobj) => (
                                            <option key={stobj.id} value={stobj.id}>
                                                {stobj.subtype_name}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            {/* Purpose */}
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1.5">Purpose <span className="text-red-500">*</span></label>
                                <select
                                    value={purpose}
                                    onChange={onChangePurpose}
                                    className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all bg-white text-slate-900 appearance-none cursor-pointer"
                                >
                                    <option value="">Select Purpose</option>
                                    {purposeList.map((purposeobj) => (
                                        <option key={purposeobj.id} value={purposeobj.id}>
                                            {purposeobj.purpose_name}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        <hr className="border-slate-200" />

                        {/* Location Section */}
                        <div className="space-y-6">
                            <div className="flex items-center gap-2 mb-4">
                                <div className="w-8 h-8 bg-emerald-100 rounded-lg flex items-center justify-center">
                                    <svg className="w-4 h-4 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/>
                                    </svg>
                                </div>
                                <h2 className="text-lg font-semibold text-slate-800">Location Details</h2>
                            </div>

                            {/* Country & City */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1.5">Country <span className="text-red-500">*</span></label>
                                    <select
                                        value={selectedCountrySlug}
                                        onChange={onChangeSelectedCountry}
                                        className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all bg-white text-slate-900 appearance-none cursor-pointer"
                                    >
                                        <option value="">Select a Country</option>
                                        {countryList.map((co) => (
                                            <option key={co.id} value={co.country_slug}>
                                                {co.country_name} ({co.code})
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1.5">City <span className="text-red-500">*</span></label>
                                    <select
                                        value={selectedCity}
                                        onChange={onChangeSelectedCity}
                                        className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all bg-white text-slate-900 appearance-none cursor-pointer"
                                    >
                                        <option value="">Select City</option>
                                        {cityList.map((ci) => (
                                            <option key={ci.id} value={ci.id}>
                                                {ci.city_name}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            {/* Area & District */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1.5">Area <span className="text-red-500">*</span></label>
                                    <input
                                        name="area"
                                        value={area}
                                        onChange={onChangeArea}
                                        className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all bg-white text-slate-900 placeholder-slate-400"
                                        placeholder="Enter area"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1.5">District <span className="text-red-500">*</span></label>
                                    <input
                                        name="district"
                                        value={district}
                                        onChange={onChangeDistrict}
                                        className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all bg-white text-slate-900 placeholder-slate-400"
                                        placeholder="Enter district"
                                    />
                                </div>
                            </div>

                            {/* Plot Number & Land Number */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1.5">Plot Number <span className="text-red-500">*</span></label>
                                    <input
                                        name="plotNumber"
                                        value={plotNumber}
                                        onChange={onChangePlotNumber}
                                        className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all bg-white text-slate-900 placeholder-slate-400"
                                        placeholder="Enter plot number"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1.5">Land Number <span className="text-red-500">*</span></label>
                                    <input
                                        name="landNumber"
                                        value={landNumber}
                                        onChange={onChangeLandNumber}
                                        className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all bg-white text-slate-900 placeholder-slate-400"
                                        placeholder="Enter land number"
                                    />
                                </div>
                            </div>

                            {/* Address Detail */}
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1.5">Address Detail <span className="text-red-500">*</span></label>
                                <input
                                    name="addressDetail"
                                    value={addressDetail}
                                    onChange={onChangeAddressDetail}
                                    className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all bg-white text-slate-900 placeholder-slate-400"
                                    placeholder="Enter detailed address"
                                />
                            </div>

                            {/* Latitude & Longitude */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1.5">Latitude <span className="text-red-500">*</span></label>
                                    <input
                                        name="latitude"
                                        value={latitude}
                                        onChange={onChangeLatitude}
                                        className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all bg-white text-slate-900 placeholder-slate-400"
                                        placeholder="Enter latitude"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1.5">Longitude <span className="text-red-500">*</span></label>
                                    <input
                                        name="longitude"
                                        value={longitude}
                                        onChange={onChangeLongitude}
                                        className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all bg-white text-slate-900 placeholder-slate-400"
                                        placeholder="Enter longitude"
                                    />
                                </div>
                            </div>
                        </div>

                        <hr className="border-slate-200" />

                        {/* Property Details Section */}
                        <div className="space-y-6">
                            <div className="flex items-center gap-2 mb-4">
                                <div className="w-8 h-8 bg-amber-100 rounded-lg flex items-center justify-center">
                                    <svg className="w-4 h-4 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-4 0h4"/>
                                    </svg>
                                </div>
                                <h2 className="text-lg font-semibold text-slate-800">Property Details</h2>
                            </div>

                            {/* Price & Currency */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1.5">Price <span className="text-red-500">*</span></label>
                                    <input
                                        name="price"
                                        value={price}
                                        onChange={onChangePrice}
                                        type="number"
                                        className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all bg-white text-slate-900 placeholder-slate-400"
                                        placeholder="Enter price"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1.5">Currency <span className="text-red-500">*</span></label>
                                    <input
                                        name="currency"
                                        value={currency}
                                        onChange={onChangeCurrency}
                                        className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all bg-white text-slate-900 placeholder-slate-400"
                                        placeholder="e.g. USD, EUR, SAR"
                                    />
                                </div>
                            </div>

                            {/* Property Age & Property Size */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1.5">Property Age (years) <span className="text-red-500">*</span></label>
                                    <input
                                        name="propertyAge"
                                        value={propertyAge}
                                        onChange={onChangePropertyAge}
                                        type="number"
                                        className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all bg-white text-slate-900 placeholder-slate-400"
                                        placeholder="Enter property age"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1.5">Property Size (sqm) <span className="text-red-500">*</span></label>
                                    <input
                                        name="propertySize"
                                        value={propertySize}
                                        onChange={onChangePropertySize}
                                        type="number"
                                        className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all bg-white text-slate-900 placeholder-slate-400"
                                        placeholder="Enter property size"
                                    />
                                </div>
                            </div>

                            {/* Plot Length & Plot Width */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1.5">Plot Length (meters) <span className="text-red-500">*</span></label>
                                    <input
                                        name="plotLength"
                                        value={plotLength}
                                        onChange={onChangePlotLength}
                                        type="number"
                                        className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all bg-white text-slate-900 placeholder-slate-400"
                                        placeholder="Enter plot length"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1.5">Plot Width (meters) <span className="text-red-500">*</span></label>
                                    <input
                                        name="plotWidth"
                                        value={plotWidth}
                                        onChange={onChangePlotWidth}
                                        type="number"
                                        className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all bg-white text-slate-900 placeholder-slate-400"
                                        placeholder="Enter plot width"
                                    />
                                </div>
                            </div>

                            {/* Bedrooms & Bathrooms */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1.5">Bedrooms <span className="text-red-500">*</span></label>
                                    <input
                                        name="bedrooms"
                                        value={bedrooms}
                                        onChange={onChangeBedrooms}
                                        type="number"
                                        className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all bg-white text-slate-900 placeholder-slate-400"
                                        placeholder="Number of bedrooms"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1.5">Bathrooms <span className="text-red-500">*</span></label>
                                    <input
                                        name="bathrooms"
                                        value={bathrooms}
                                        onChange={onChangeBathrooms}
                                        type="number"
                                        className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all bg-white text-slate-900 placeholder-slate-400"
                                        placeholder="Number of bathrooms"
                                    />
                                </div>
                            </div>

                            {/* Facade & Street Width */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1.5">Facade <span className="text-red-500">*</span></label>
                                    <select
                                        name="facade"
                                        value={facade}
                                        onChange={onChangeFacade}
                                        className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all bg-white text-slate-900 appearance-none cursor-pointer"
                                    >
                                        <option value="">Select Facade Direction</option>
                                        <option value="north">North</option>
                                        <option value="south">South</option>
                                        <option value="east">East</option>
                                        <option value="west">West</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1.5">Street Width (meters) <span className="text-red-500">*</span></label>
                                    <input
                                        name="streetWidth"
                                        value={streetWidth}
                                        onChange={onChangeStreetWidth}
                                        type="number"
                                        className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all bg-white text-slate-900 placeholder-slate-400"
                                        placeholder="Enter street width"
                                    />
                                </div>
                            </div>

                            {/* Furnishing & Is Occupied */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1.5">Furnishing <span className="text-red-500">*</span></label>
                                    <select
                                        name="furnishing"
                                        value={furnishing}
                                        onChange={onChangeFurnishing}
                                        className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all bg-white text-slate-900 appearance-none cursor-pointer"
                                    >
                                        <option value="">Select Furnishing</option>
                                        <option value="furnished">Furnished</option>
                                        <option value="unfurnished">Unfurnished</option>
                                        <option value="partly">Partly Furnished</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1.5">Is Occupied? <span className="text-red-500">*</span></label>
                                    <select
                                        name="isOccupied"
                                        value={isOccupied}
                                        onChange={onChangeIsOccupied}
                                        className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all bg-white text-slate-900 appearance-none cursor-pointer"
                                    >
                                        <option value="">Select Occupancy</option>
                                        <option value="true">Occupied</option>
                                        <option value="false">Not Occupied</option>
                                    </select>
                                </div>
                            </div>

                            {/* Available From */}
                            <div className="max-w-md">
                                <label className="block text-sm font-medium text-slate-700 mb-1.5">Available From <span className="text-red-500">*</span></label>
                                <input
                                    type="date"
                                    name="availableFrom"
                                    value={availableFrom}
                                    onChange={onChangeAvailableFrom}
                                    className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all bg-white text-slate-900"
                                />
                            </div>
                        </div>

                        <hr className="border-slate-200" />

                        {/* Amenities Section */}
                        <div className="space-y-6">
                            <div className="flex items-center gap-2 mb-4">
                                <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                                    <svg className="w-4 h-4 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"/>
                                    </svg>
                                </div>
                                <h2 className="text-lg font-semibold text-slate-800">Amenities</h2>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1.5">Select Amenities</label>
                                <select
                                    multiple
                                    value={amenities}
                                    className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all bg-white text-slate-900 cursor-pointer min-h-[120px]"
                                    onChange={(e) =>
                                        setAmenities([...e.target.selectedOptions].map(o => o.value))
                                    }
                                >
                                    {amenitiesList.map((amenityobj) => (
                                        <option key={amenityobj.id} value={amenityobj.id} className="px-2 py-1">
                                            {amenityobj.amenity_name}
                                        </option>
                                    ))}
                                </select>
                                <p className="mt-1.5 text-xs text-slate-500">Hold Ctrl (Cmd on Mac) to select multiple amenities</p>
                            </div>
                        </div>

                        {/* Submit Button */}
                        <div className="pt-4">
                            <button
                                type="submit"
                                className="w-full py-4 px-6 rounded-xl bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800 text-white font-semibold text-lg shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200"
                            >
                                Add Property
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </section>
        </>
    );
}
