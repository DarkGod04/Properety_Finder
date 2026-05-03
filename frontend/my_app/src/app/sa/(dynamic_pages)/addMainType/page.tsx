"use client";


import { useAuth } from "../../context/AuthContext";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { getCountriesList} from "../../utils/property";
import { addMainType} from "../../utils/property";

import axiosInstance from "../../lib/axios";

import Loading from "../../components/loading/Loading";
// react-toastify
import notify from "../../common/useNotification"
import { ToastContainer, toast } from 'react-toastify';




export default function AddMainType() {
    const { user, loading } = useAuth();
    const router = useRouter();
    // Add cities form fields
    const [maintypeName, setMaintypeName] = useState('');
   
   
    
    
    useEffect(() => {
        console.log("AddMainType-loading=",loading)
        console.log("AddMainType-user=",user)
        
        if (!loading && !user) {
            router.push("/sa/login");
        }

        if (!loading && user && user.role !== "admin"){
                      console.log('role=', user.role)
                      toast.error( "You have no permission to reach this page"); 
                      router.push("/sa/myDashboard");
        }   
    }, [user, loading, router]);
    
    
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
 


    //  onChange
    ///////////////  FORM FIELDS  --- parse data from form field  
    const onChangeMaintypeName = (e) => {
        setMaintypeName(e.target.value)
        console.log('onChange MaintypeName=', e.target.value)
    }
    



    //////  SUBMIT ////////////
    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!loading && !user){
            router.push('/sa/login');
        }
        if (!maintypeName) {     
            notify("Please select the Main type name !","warning");
            return;
        }
         
        
        
        // axios api -- no need formData because no file 
        try { 
            // axios -success
            await addMainType(maintypeName)
            notify("The property main type( main Category ) has been add successfully", "success");
    
            
            // ✅ Delay for 3 seconds before redirecting  // 3000 milliseconds = 3 seconds
            setTimeout(() => {
                router.push('/sa/myDashboard');
            }, 3000); 
            
        }catch (error: any) {
            console.log("addMainType error =", error);
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
          <section className="py-1 min-h-screen bg-gray-100  flex items-center ">

              <div className=" mx-auto bg-white shadow-2xl rounded-2xl p-6 mt-5 mb-5">
                  
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
                          <span className="ms-1 text-sm font-medium text-gray-500 md:ms-2 dark:text-gray-400">Add Main Type</span>
                        </div>
                      </li>
                    </ol>
                  </nav> 

                  <hr className="text-gray-300"></hr>
                
                  


                  
                  <form onSubmit={handleSubmit} className="space-y-12">
                    <ToastContainer position="top-center" autoClose={3000} />
                      
                        {/* Main type name */}
                        {/* Select a main type for  from a dynamic counrty list */}
                        <div className="md:w-full">
                            <div>
                                <label className="block text-sm font-medium dark:text-gray-300">Main Type Name</label>
                          <select
                              name="mainType"
                              value={maintypeName}
                              onChange={onChangeMaintypeName}
                              className="mt-2 w-full p-3 border rounded-lg"
                          >
                              <option value="">-- Select the Main Type Name --</option>
                              <option value="residential_type">Residential</option>
                              <option value="commercial_type">Commercial</option>
                          </select>
                            </div>
                        </div>
                        

                        {/* Submit */}
                        <button
                            type="submit"
                            className="w-full py-3 rounded-lg bg-blue-600 hover:bg-blue-700 text-white shadow-md"
                        >
                            Add Type 
                        </button>
                  </form>
              </div>
          </section>
        </>
    );
}