"use client";


import { useAuth } from "../../../context/AuthContext";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { updateRequestUserProfile } from "../../../utils/auth";
import axiosInstance from "../../../lib/axios";

// react-toastify
import notify from "../../../common/useNotification"
import { ToastContainer, toast } from 'react-toastify';




export default function EditAdminProfile() {
    const { user, setUser, loading } = useAuth();
    const router = useRouter();

    // const [isSubmitting, setIsSubmitting] = useState(false);
    
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');  
    const [gender, setGender] = useState('');
    const [dob, setDob] = useState('');
    const [phone, setPhone] = useState('');
    const [country, setCountry] = useState('');
    const [address, setAddress] = useState('');
    
    // Profile Image Upload
    // preview - url
    const [preview, setPreview]   = useState<string | null>(null); // preview only - string url 
    //  actual -  file 
    const [ppicture, setPpicture] = useState<File | null>(null);  // actual file _ file
    

    useEffect(() => {
        console.log("EditProfile-loading=",loading)
        console.log("EditProfile-user=",user)
        
        if (!loading && !user) {
            router.push("/sa/login");
        }

        if (!loading && user){
            setFirstName(user.first_name);
            setLastName(user.last_name);
            setGender(user.gender);
            setDob(user.date_of_birth);
            setPhone(user.phone_number || "");
            setCountry(user.country || "");
            setAddress(user.address || "");
            
            // set the preview picture as url string
            if (user.profile_picture) {
              const backendURL = process.env.NEXT_PUBLIC_BACKEND_URL || "http://127.0.0.1:8000";       
              setPreview(`${backendURL}${user.profile_picture}`);
            } else {
              setPreview(null);
            }
            
            // console.log('firstName=', firstName)
            // console.log('lastName=', lastName)
            // console.log('gender=', gender)
            // console.log('dob=', dob)
            // console.log('phone=', phone)
            // console.log('country=', country)
            // console.log('address=', address)
            // console.log('preview=', preview)
            
        }
    }, [user, loading, router]);
    
    
    if (loading) {
       return <p className="text-center mt-20">Loading...</p>; // spinner/loader
    }

    // While checking auth, avoid flicker
    if (!user) {
       return null; // Redirect handled already
    }
 


    //  onChange
    ///////////////  FORM FIELDS  --- parse data from form field  
    // onChange firstName field
    const onChangeFirstName = (event) => {
      setFirstName(event.target.value)
      console.log('onChange firstName=', event.target.value)
    }
    // onChange lastName field
    const onChangeLastName = (event) => {
      setLastName(event.target.value)
      console.log('onChange lastName=', event.target.value)
    }
    // onChange gender field
    const onChangeGender = (event) => {
      setGender(event.target.value)
      console.log("onChange gender selected =", event.target.value)
    }
    // onChange date_of_birth field
    const onChangeDob = (event) => {
      setDob(event.target.value)
      console.log('onChange dob=', event.target.value)
    }
    // onChange phone_number field
    const onChangePhone = (event) => {
      setPhone(event.target.value)
      console.log('onChange phone=', event.target.value)
    }
    // onChange country field
    const onChangeCountry = (event) => {
      setCountry(event.target.value)
      console.log('onChange country=', event.target.value)
    }
    // onChange address field
    const onChangeAddress = (event) => {
      setAddress(event.target.value)
      console.log('onChange address=', event.target.value)
    }
    // onChange ppicture field -- actual file for submitting -- must be file 
    // onChange previewe field -- preview image -- must be url string
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
              const file = e.target.files[0];
              setPpicture(file);                             // actual file for submitting -- must be file 
              setPreview(URL.createObjectURL(file));         // preview image -- must be url string
        }
    };


    //////  SUBMIT ////////////
    ///////////////  after submit button clicked
    const handleSubmit = async (e) => {
          e.preventDefault();
          // //////////////////////  validate fields ////////////////////////
          
          if (!loading && !user){
            router.push('/sa/login');
          }
          if (!firstName) {      // if (firstName === "" || firstName === null) {
            notify("Please enter the First Name !","warning");
            // setIsSubmitting(false);
            return;
          }
          //  check lastName field is not empty
          if (!lastName) {
            notify("Please enter the Last Name !","warning");
            // setIsSubmitting(false);
            return;
          }
          //  check gender field is not empty
          if (!gender) {
            notify("Please enter gender !","warning");
            return;
          }
          //  check date of birth is not empty
          if (!dob) {
            notify("Please enter date of birth !","warning");
            return;
          }
          //  check phone is not empty
          if (!phone) {
            notify("Please enter phone !","warning");
            return;
          }
          //  check country is not empty
          if (!country) {
            notify("Please enter country !","warning");
            return;
          }
          //  check address is not empty
          if (!address) {
            notify("Please enter address !","warning");
            return;
          }

          // Create FormData object
          // When uploading files in React with Axios, you must use FormData and not JSON.
          const formData = new FormData();
          formData.append("first_name", firstName );
          formData.append("last_name", lastName);
          formData.append("gender", gender);
          formData.append("date_of_birth", dob);
          formData.append("phone_number", phone);
          formData.append("country", country);
          formData.append("address", address);
          // Only append if it's a File
          if (ppicture instanceof File) {
            formData.append("profile_picture", ppicture);
          }
                    
          // Log the values using the get method
          console.log('formData.first_name=', formData.get('first_name'));
          console.log('formData.last_name=', formData.get('last_name'));
          console.log('formData.gender=', formData.get('gender'));
          console.log('formData.date_of_birth=', formData.get('date_of_birth'));
          console.log('formData.phone_number=', formData.get('phone_number'));
          console.log('formData.country=', formData.get('country'));
          console.log('formData.address=', formData.get('address'));
          console.log('formData.profile_picture=', formData.get('profile_picture'));
          
    
    
          // axios api
          //When uploading files in React with Axios, you must use FormData and not JSON
          try { 
                // axios -success
                // 1. Update backend
                await updateRequestUserProfile(formData)
                
                 // 2. Refetch user profile
                const { data: updatedUser } = await axiosInstance.get(
                  "/users/request-user-profile/",       // endpoint
                  { withCredentials: true }             // include cookies
                );

                // 3. Update AuthContext
                setUser(updatedUser);
                
                notify("Profile updated successfully!", "success");
                
                // ✅ Delay for 3 seconds before redirecting
                setTimeout(() => {
                    router.push('/sa/myProfile/admin');
                }, 3000); // 3000 milliseconds = 3 seconds
          

          } catch (error: any) {
              console.log('updateRequestUserProfile error =', error);

              if (
                error?.phone_number &&
                Array.isArray(error.phone_number) &&
                error.phone_number[0].includes("The phone number entered is not valid.")
              ) {
                notify("The phone number entered is not valid.", "error");
              } else {
                Object.entries(error).forEach(([field, messages]) => {
                  if (Array.isArray(messages)) {
                    messages.forEach((msg) => notify(`${field}: ${msg}`, "error"));
                  } else {
                    notify(`${field}: ${messages}`, "error");
                  }
                });
              }
          }
    }

    return (
        <>
          <section className="py-10 min-h-screen bg-gray-100  flex items-center">

              <div className="lg:w-3/4 w-[95%] mx-auto bg-white dark:bg-gray-800/40 shadow-2xl rounded-2xl p-6 mt-5 mb-5">
                  
                  <nav className="flex pb-1" aria-label="Breadcrumb">
                    <ol className="inline-flex items-center space-x-1 md:space-x-2 rtl:space-x-reverse">
                      <li className="inline-flex items-center">
                        <Link href="/" className="inline-flex items-center text-sm font-medium text-gray-700 hover:text-blue-600 dark:text-gray-400 dark:hover:text-white">
                          <svg className="w-3 h-3 me-2.5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
                            <path d="m19.707 9.293-2-2-7-7a1 1 0 0 0-1.414 0l-7 7-2 2a1 1 0 0 0 1.414 1.414L2 10.414V18a2 2 0 0 0 2 2h3a1 1 0 0 0 1-1v-4a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v4a1 1 0 0 0 1 1h3a2 2 0 0 0 2-2v-7.586l.293.293a1 1 0 0 0 1.414-1.414Z"/>
                          </svg>
                          Home
                        </Link>
                      </li>
                      <li>
                        <div className="flex items-center">
                          <svg className="rtl:rotate-180 w-3 h-3 text-gray-400 mx-1" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 6 10">
                            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 9 4-4-4-4"/>
                          </svg>
                          <a href="/sa/myDashboard" className="ms-1 text-sm font-medium text-gray-700 hover:text-blue-600 md:ms-2 dark:text-gray-400 dark:hover:text-white">My Dashboard</a>
                        </div>
                      </li>
                      <li aria-current="page">
                        <div className="flex items-center">
                          <svg className="rtl:rotate-180 w-3 h-3 text-gray-400 mx-1" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 6 10">
                            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 9 4-4-4-4"/>
                          </svg>
                          <span className="ms-1 text-sm font-medium text-gray-500 md:ms-2 dark:text-gray-400">Edit Admin Profile</span>
                        </div>
                      </li>
                    </ol>
                  </nav> 

                  <hr className="text-gray-300"></hr>
                
                  <h1 className="text-3xl mb-2 dark:text-white mt-8">Edit 
                    <span className="text-[#c75a00] text-2xl">&nbsp;{user?.first_name}
                      <span>&apos;s</span>&nbsp;</span>&nbsp;Profile
                  </h1>
                 
                    
                    
                  
                  
                  
                  
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <ToastContainer position="top-center" autoClose={3000} />
                      
                      {/* Profile Image Upload */}
                      <div className="justify-items-center">
                          <div className="relative w-36 h-36 bg-gray-200 overflow-hidden flex items-center justify-center">
                                <div className="space-y-2"> 
                                  {preview && (
                                      // If user selected a new file → show preview
                                      <Image
                                          src={preview}
                                          alt="Profile Preview"
                                          fill
                                          className="w-24 h-24 object-cover"
                                      />
                                  )}
                                   {/* <input type="file" accept="image/*" onChange={handleFileChange} /> */}
                                </div>
                                 {/* Upload Button */}
                                  <label
                                    htmlFor="upload_profile"
                                    className="absolute -bottom-1 -right-1 bg-blue-500 hover:bg-blue-600 
                                            text-white p-2 rounded-full cursor-pointer shadow-md z-50"
                                  >
                                    <svg
                                      className="w-5 h-5"
                                      fill="none"
                                      stroke="currentColor"
                                      strokeWidth="2"
                                      viewBox="0 0 24 24"
                                    >
                                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                                    </svg>
                                  </label>
                                  <input
                                    type="file"
                                    id="upload_profile"
                                    accept="image/*"
                                    className="hidden"
                                    onChange={handleFileChange}
                                  />
                            </div>      
                       </div>              
                                  
                         

                      {/* firstName + lastName fields  */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                          <label className="block text-sm font-medium dark:text-gray-300">First Name</label>
                          <input
                              name="firstName"
                              value={firstName}
                              onChange={onChangeFirstName}
                              className="mt-2 p-3 w-full border rounded-lg dark:bg-gray-800 dark:border-gray-600 dark:text-gray-200"
                              placeholder="First Name"
                          />
                          </div>
                          <div>
                          <label className="block text-sm font-medium dark:text-gray-300">Last Name</label>
                          <input
                              name="lastName"
                              value={lastName}
                              onChange={onChangeLastName}
                              className="mt-2 p-3 w-full border rounded-lg dark:bg-gray-800 dark:border-gray-600 dark:text-gray-200"
                              placeholder="Last Name"
                          />
                          </div>
                      </div>

                      {/* Gender + DOB  fields */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium dark:text-gray-300">Gender</label>
                            <select
                                name="gender"
                                value={gender}
                                onChange={onChangeGender}
                                className="mt-2 w-full p-3 border rounded-lg dark:bg-gray-800 dark:border-gray-600 dark:text-gray-200"
                            >
                                <option value="">-- Select Gender --</option>
                                <option value="male">Male</option>
                                <option value="female">Female</option>
                            </select>
                          </div>

                          <div>
                            <label className="block text-sm font-medium dark:text-gray-300">Date of Birth</label>
                            <input
                                type="date"
                                name="dob"
                                value={dob}
                                onChange={onChangeDob}
                                className="mt-2 p-3 w-full border rounded-lg dark:bg-gray-800 dark:border-gray-600 dark:text-gray-200"
                            />
                          </div>
                      </div>

                      {/* Phone + Country  fields */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                          <label className="block text-sm font-medium dark:text-gray-300">Phone</label>
                          <input
                              name="phone"
                              value={phone}
                              onChange={onChangePhone}
                              className="mt-2 p-3 w-full border rounded-lg dark:bg-gray-800 dark:border-gray-600 dark:text-gray-200"
                              placeholder="Phone Number"
                          />
                          </div>
                          <div>
                          <label className="block text-sm font-medium dark:text-gray-300">Country</label>
                          <input
                              name="country"
                              value={country}
                              onChange={onChangeCountry}
                              className="mt-2 p-3 w-full border rounded-lg dark:bg-gray-800 dark:border-gray-600 dark:text-gray-200"
                              placeholder="Country"
                          />
                          </div>
                      </div>

                      {/* Address field */}
                      <div>
                          <label className="block text-sm font-medium dark:text-gray-300">Address</label>
                          <input
                          name="address"
                          value={address}
                          onChange={onChangeAddress}
                          className="mt-2 p-3 w-full border rounded-lg dark:bg-gray-800 dark:border-gray-600 dark:text-gray-200"
                          placeholder="Address"
                          />
                      </div>

                      {/* Submit */}
                      <button
                          type="submit"
                          className="w-full py-3 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-md"
                      >
                          Save Profile
                      </button>
                  </form>
              </div>
          </section>
        </>
    );
}