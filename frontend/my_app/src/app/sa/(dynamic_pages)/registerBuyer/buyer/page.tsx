//  register.page.js

"use client"
import React from "react";
import { useState } from "react";
import { registerUser } from "../../../utils/auth";
import Link from 'next/link';
// react-toastify
import notify from "../../../common/useNotification"
import { ToastContainer, toast } from 'react-toastify';

import { useRouter } from 'next/navigation'


export default function BuyerRegister() {

    const [firstName, setFirstName] = useState("")
    const [lastName, setLastName]   = useState("")
    const [email, setEmail]         = useState("")
    const [password, setPassword]   = useState("")
    const [password2, setPassword2] = useState("")
    const [role, setRole] = useState("buyer")
    
    const [isSubmitting, setIsSubmitting] = useState(false);
    const router = useRouter();



    const handleSubmit = async (e) => {
        
          e.preventDefault()
          setIsSubmitting(true);


          // //////////////////////  validate fields ////////////////////////
          //  check firstName  field is not empty
          if (firstName === "" ) {
            notify("Please enter the First Name !","warning");
            setIsSubmitting(false);
            return;
          }
          //  check lastName field is not empty
          if (lastName === "" ) {
            notify("Please enter the Last Name !","warning");
            setIsSubmitting(false);
            return;
          }
          //  check email field is not empty
          if (email === "" ) {
            notify("Please enter the Email!","warning");
            setIsSubmitting(false);
            return;
          }
          //  check password is not empty
          if (password === "" ) {
            notify("Please enter  Password !","warning");
            setIsSubmitting(false);
            return;
          }
          //  check password2 is not empty
          if (password2 === "" ) {
            notify("Please enter Confitrm Password !","warning");
            setIsSubmitting(false);
            return;
          }
          //  check password is identical to password2
          if (password !== password2 ) {
            notify("Please enter identical passwords !","warning")
            setIsSubmitting(false);
            return;
          }

          // data inserted in fields
          console.log('firstName=', firstName);
          console.log('lastName=', lastName);
          console.log('email=', email);
          console.log('password=', password);
          console.log('password2=', password2);
          console.log('role=', role);
          


          // axios api
          try { 
                // axios -success
                await registerUser(firstName, lastName, email, password, password2,role)
                notify("Thanks for signing up. Please check your email — a confirmation link has been sent.", "success");
          
                // ✅ Delay for 3 seconds before redirecting
                setTimeout(() => {
                    router.push('/sa/login');
                }, 5000); // 5000 milliseconds = 5 seconds
          


          } catch (error) {
                // axios - error
                console.log('registration error =', error);
                console.log('registration error.response.data =', error.response.data);

                // Show all validation errors from backend
                Object.entries(error.response.data).forEach(([field, messages]) => {
                        if (Array.isArray(messages)) {
                          messages.forEach((msg) => notify(`${field}: ${msg}`, "error"));
                        } else {
                          notify(`${field}: ${messages}`, "error");
                        }     
                });
          
          
          } finally {
                setIsSubmitting(false);
          }
    }


	  return (
      <>
      <section className="min-h-screen bg-[#F2F2F2] flex flex-col justify-center items-center px-4 py-8">
          <div className="text-gray-600 font-bold text-2xl sm:text-3xl my-3 text-center">
           Buyer Registration
          </div>

          <ToastContainer position="top-center" />

          <form
            noValidate
            onSubmit={handleSubmit}
            className="bg-[#B6B09F] p-6 sm:p-8 rounded-lg w-full max-w-md md:max-w-lg lg:max-w-xl space-y-4"
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex flex-col">
                <label className="mb-1 text-sm sm:text-base">First Name</label>
                <input
                  className="text-gray-600 bg-gray-100 p-2 rounded"
                  placeholder="Enter your first name"
                  type="text"
                  value={firstName}
                  required
                  onChange={(e) => setFirstName(e.target.value)}
                />
              </div>

              <div className="flex flex-col">
                <label className="mb-1 text-sm sm:text-base">Last Name</label>
                <input
                  className="text-gray-600 bg-gray-100 p-2 rounded"
                  placeholder="Enter your last name"
                  type="text"
                  value={lastName}
                  required
                  onChange={(e) => setLastName(e.target.value)}
                />
              </div>
            </div>

            <div className="flex flex-col">
              <label className="mb-1 text-sm sm:text-base">Email</label>
              <input
                className="text-gray-600 bg-gray-100 p-2 rounded"
                placeholder="Enter your email address"
                type="email"
                value={email}
                required
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className="flex flex-col">
              <label className="mb-1 text-sm sm:text-base">Password</label>
              <input
                className="text-gray-600 bg-gray-100 p-2 rounded"
                placeholder="Enter your password"
                type="password"
                value={password}
                required
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <div className="flex flex-col">
              <label className="mb-1 text-sm sm:text-base">Confirm Password</label>
              <input
                className="text-gray-600 bg-gray-100 p-2 rounded"
                placeholder="Enter your password again"
                type="password"
                value={password2}
                required
                onChange={(e) => setPassword2(e.target.value)}
              />
            </div>

            <button
              disabled={isSubmitting}
              className="bg-gray-600 hover:bg-sky-700 text-white p-2 rounded transition-colors duration-200"
              type="submit"
            >
              {isSubmitting ? "Registering..." : "Register"}
            </button>

          </form>

           
           <div className="p-4 text-gray-600 text-xl">
                <p>Already have an account?
                    <Link href="/login">
                        <span className="no-underline text-blue-700 hover:underline hover:text-blue-600"> Log in</span>
                    </Link>
                </p>
            </div>

      </section>
      </>
	  );
}