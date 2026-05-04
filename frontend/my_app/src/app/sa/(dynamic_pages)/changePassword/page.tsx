//  app/(dynamic_pages)/serNewPassword/page.tsx
'use client'

import {  useState ,useEffect} from 'react';
import {  useRouter } from 'next/navigation';
import axios from 'axios';
import Link from "next/link";
// react-toastify@
import notify from "../../common/useNotification"
import { ToastContainer, toast } from 'react-toastify';

import { useAuth } from "../../context/AuthContext";
import axiosInstance from "../../lib/axios";

// import { updateRequestUserProfile } from "../../utils/auth";



export default function ChangePassword() {
    const { user, loading } = useAuth();
    const router = useRouter();


    const [oldPassword, setOldPassword ] = useState("")
    const [newPassword, setNewPassword] = useState("");
    const [newPasswordConfirm, setNewPasswordConfirm] = useState("");
    const [message, setMessage] = useState("");
 

    // If no user, redirect to /login
    useEffect(() => {
        console.log("ChangePassword-user=",user)
        console.log("ChangePassword-loading=",loading)
        if (!loading && !user) {
            router.push("/sa/login");
        }
    }, [user, loading, router]);



    //  still loading ..
    if (loading) {
       return <p className="text-center mt-20">Loading...</p>; // spinner/loader
    }


    // While checking auth, avoid flicker
    if (!user) {
       return null; // Redirect handled already
    }

    
    // submit form 
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
       
        //  check password is not empty
        if (!oldPassword) {
          notify("Please fill your an old password field!", "warning");
          return;
        }

        //  check password is not empty
        if (!newPassword) {
          notify("Please fill a new password field!", "warning");
          return;
        }

        //  check password is not empty
        if (!newPasswordConfirm) {
          notify("Please fill the new password confirm field!", "warning");
          return;
        }

        //  check password is identical to password2
        if (newPassword !== newPasswordConfirm ) {
          notify("The new passwords fields do not match!", "error")
          return;
        }
        console.log('oldPassword=', oldPassword);
        console.log('newPassword=', newPassword);
        console.log('newPasswordConfirm=', newPasswordConfirm);

       
        


        // axios
        try { 
            const response = await axiosInstance.post(
                "/users/change-password/",     // endpoint  
                {                          
                    old_password: oldPassword, // data with this post
                    new_password: newPassword, // data with this post
                },
                {
                    withCredentials:true,    // include cookies if needed
                },
            );

            console.log("changePassword-response.data=",response.data);
            notify("Password successfully changed!", "success");
            setMessage("Password changed successful ✅");
            
            setTimeout(() => {
                router.push("/sa/login"); // redirect to login after change password
            }, 2000);
            return response.data;
        
        
        } catch (error) {
            if (error.response && error.response.data) {
                const errorData = error.response.data;

                // Loop through all errors and show them in notify
                Object.keys(errorData).forEach((field) => {
                const messages = errorData[field]; // usually an array of strings
                if (Array.isArray(messages)) {
                    messages.forEach((msg) => notify(msg, "error"));
                } else {
                    notify(messages, "error");
                }
                });
            } else {
                notify("Something went wrong!", "error");
            }

        }
    }
    return (
        <>
        <section>
            {/* Breadcrumb */}
            <div className="bg-white py-3 pl-2">
                <nav className="flex" aria-label="Breadcrumb">
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
                            <span className="ms-1 text-sm font-medium text-gray-500 md:ms-2 dark:text-gray-400">Change password</span>
                        </div>
                        </li>
                    </ol>
                </nav> 
            </div>

            <div className="min-h-screen bg-[#F2F2F2] flex flex-col justify-center items-center px-4 py-8">
                <ToastContainer position="top-center" autoClose={3000} />
                <h1 className="p-4 text-center text-xl">{message}</h1>
                
                <div className="text-gray-600 text-2xl sm:text-3xl my-3 text-center">
                    <h1>
                        Change your password
                    </h1>
                </div>
                {/* form */}
                <form
                    noValidate
                    onSubmit={handleSubmit}
                    className="bg-[#B6B09F] p-6 sm:p-8 rounded-lg w-full max-w-md space-y-4"
                >
                    <div className="flex flex-col">
                        <label>Old password</label>
                        <input
                            type="password"
                            placeholder="Enter your old password"
                            className="p-2 rounded bg-gray-100 text-gray-600"
                            value={oldPassword}
                            onChange={(e) =>  setOldPassword(e.target.value)}
                            required
                        />
                    </div>

                    <div className="flex flex-col">
                        <label>New password</label>
                        <input
                            type="password"
                            placeholder="Enter your new password"
                            className="p-2 rounded bg-gray-100 text-gray-600"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            required
                        />
                    </div>

                    <div className="flex flex-col">
                        <label>New password confirm</label>
                        <input
                            type="password"
                            placeholder="Enter your new password again"
                            className="p-2 rounded bg-gray-100 text-gray-600"
                            value={newPasswordConfirm}
                            onChange={(e) => setNewPasswordConfirm(e.target.value)}
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        className="bg-gray-600 hover:bg-sky-700 text-white p-2 rounded"
                    >
                        Submit
                    </button>
                </form>
            </div>
        </section>
        </>
    );
}