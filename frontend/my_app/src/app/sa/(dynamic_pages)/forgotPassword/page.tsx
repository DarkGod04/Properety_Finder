// forgotPassword.page.js

"use client"
// react-toastify
import notify from "../../common/useNotification"
import { ToastContainer, toast } from 'react-toastify';
import Link from 'next/link';
import { useState } from "react";
import { useRouter } from 'next/navigation'
import { passwordResetRequest } from "../../utils/auth";





export default function Forgotpassword() {
    const [email, setEmail] = useState("")
    const [isSubmitting, setIsSubmitting] = useState(false);
    const router = useRouter();


    const handleSubmit = async(e)=> {
       e.preventDefault();
       setIsSubmitting(true);
       
        // //////////////////////  validate fields ////////////////////////
        //  check email field is not empty
        if (!email ) {
          notify("Please enter your email address!","warning");
          setIsSubmitting(false);
          return;
        } 

        // data inserted in fields
        console.log('email=', email);
    
        // axios api
          try { 
                // axios -success
                await passwordResetRequest(email)
                notify("The confirmation link is sent to your email successfully", "success");
                // ✅ Delay for 3 seconds before redirecting
                setTimeout(() => {
                    router.push('/sa/noteCheckEmail');
                }, 3000); // 5000 milliseconds = 5 seconds
          
         
            } catch (error) {
                // axios - error
                console.log('passwordResetRequest error =', error);
                console.log('passwordResetRequest error.response.data =', error.response.data);
                notify(error.response.data.message, "error");

          
          } finally {
                setIsSubmitting(false);
          }
    
    
    
    
    }


    return(
        <>
            
            <ToastContainer position="top-center" autoClose={10000}/>
            
            <section className="min-h-screen bg-[#F2F2F2] flex flex-col justify-center items-center px-4 py-8">
                <div className="text-gray-600 font-bold text-2xl sm:text-3xl my-3 text-center">
                    Forgot Password?
                </div>

                {/*  form  */}
                <form
                    noValidate
                    onSubmit={handleSubmit}
                    className="bg-[#B6B09F] p-6 sm:p-8 rounded-lg w-full max-w-md md:max-w-lg lg:max-w-xl space-y-4"
                >
                          
                    {/* email field  */}
                    <div className="flex flex-col">
                        <label className="mb-1 text-sm sm:text-base">Email</label>
                        <input
                            className="text-gray-600 bg-gray-100 p-2 rounded"
                            type="email"
                            placeholder="Enter your email address"
                            value={email}
                            required
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>


                    {/* . submit button  */}
                    <button
                        disabled={isSubmitting}
                        className="bg-gray-600 hover:bg-sky-700 text-white p-2 rounded transition-colors duration-200"
                        type="submit"
                    >
                        {isSubmitting ? "Submitting..." : "Reset Password"} 
                    </button>
                    
               
                </form>

                <div className="p-4 text-gray-600 text-base">
                    <p>Remember your password? 
                        <Link href="/login">
                            <span className="no-underline text-blue-700 hover:underline hover:text-blue-600"> Login</span>
                        </Link>
                    </p>
                    <p>Have a problem? 
                        <Link href="/contactUs">
                            <span className="no-underline text-blue-700 hover:underline hover:text-blue-600"> Contact us</span>
                        </Link>
                    </p>
                </div>
        </section>
            
           
            

        </>
    )
}
