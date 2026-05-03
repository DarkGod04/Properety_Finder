//  app/(dynamic_pages)/serNewPassword/page.tsx

'use client'

import {  useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import axios from 'axios';
// react-toastify@
import notify from "../../../../common/useNotification"
import { ToastContainer, toast } from 'react-toastify';




export default function SetNewPassword() {
 
    const { uid, token } = useParams(); // ✅ now available from URL
    const router = useRouter();
    
    console.log('uid=', uid);
    console.log('token=', token);
 

    const [password, setPassword] = useState("");
    const [password2, setPassword2] = useState("");
    const [message, setMessage] = useState("");

    
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
       


        //  check password is not empty
        if (!password || !password2) {
          notify("Please fill both fields!", "warning");
          return;
        }

        //  check password is identical to password2
        if (password !== password2 ) {
          notify("Passwords do not match!", "error")
          return;
        }

        console.log('password=', password);
        console.log('password2=', password2);

        
        try { await axios.patch("http://127.0.0.1:8000/users/set-new-password/", 
              {
                uidb64: uid,
                token: token,
                password: password,
                confirm_password: password2,
              },
              {
                withCredentials:false, // avoid sending cookies
                headers: {
                    Authorization: undefined, // explicitly remove auth headers if present
                },

              },
            );

            notify("Password reset successful!", "success");
            setMessage("Password reset successful ✅");

            setTimeout(() => {
                router.push("/sa/notePasswordResetComplete"); // redirect to login after reset
            }, 2000);


        } catch(e) {
                if (e) {
                    // Throw full error object for the component to handle
                    console.log('SetNewPassword-e=',e)
                    notify("Failed to reset password", "error");
                    setMessage("❌ Failed to reset password");
                    throw e;
                
                } else {
                    throw { error: "Something went wrong." };
                }     
        }
    };


    return (
    <section className="min-h-screen bg-[#F2F2F2] flex flex-col justify-center items-center px-4 py-8">
      <ToastContainer position="top-center" autoClose={3000} />
      <h1 className="p-4 text-center text-xl">{message}</h1>
      
      <div className="text-gray-600 font-bold text-2xl sm:text-3xl my-3 text-center">
        <h1>
            Set a new password 
        </h1>
      </div>
      <form
        noValidate
        onSubmit={handleSubmit}
        className="bg-[#B6B09F] p-6 sm:p-8 rounded-lg w-full max-w-md space-y-4"
      >
        <div className="flex flex-col">
          <label>New Password</label>
          <input
            type="password"
            placeholder="Enter your password"
            className="p-2 rounded bg-gray-100 text-gray-600"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        <div className="flex flex-col">
          <label>Confirm Password</label>
          <input
            type="password"
            placeholder="Enter your password again"
            className="p-2 rounded bg-gray-100 text-gray-600"
            value={password2}
            onChange={(e) => setPassword2(e.target.value)}
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
    </section>
    );
}