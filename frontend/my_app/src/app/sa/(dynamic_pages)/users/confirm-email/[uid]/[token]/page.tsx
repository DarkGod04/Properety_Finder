// users\confirm-email\[uid]\[token]\page.tsx
'use client'

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import axios from 'axios';

import { useRouter } from 'next/navigation'

// react-toastify@
import notify from "../../../../../common/useNotification"
import { ToastContainer, toast } from 'react-toastify';




export default function ConfirmEmailPage() {
  const params = useParams();
  const uid = params?.uid;
  const token = params?.token;


    // data inserted in fields
    console.log('uid=', uid);
    console.log('token=', token);
 

  const [message, setMessage] = useState('Confirming your email...');
  const router = useRouter();


  useEffect(() => {
    if (uid && token) {
      // data inserted in fields
      console.log('uid=', uid);
      console.log('token=', token);
      axios
        .get(`http://127.0.0.1:8000/users/confirm-email/${uid}/${token}/`)
        .then(() => {
            setMessage('Your email has been confirmed successfully! You can now log in.✅');
            notify("Your email has been confirmed successfully!", "success");


            // ✅ Delay for 5 seconds before redirecting
            setTimeout(() => {
                router.push('/sa/login');
            }, 5000); // 5000 milliseconds = 5 seconds
            
        })


        .catch(() => {
          setMessage('Invalid or expired confirmation link.');
        });

    }
  }, [uid, token, router]);


  
  return (
      <>
        <section className="min-h-screen bg-[#F2F2F2] flex flex-col justify-center items-center px-4 py-8">
            <ToastContainer position="top-center" autoClose={3000} />
            <h1 className= " p-4 text-center text-3xl text-wrap">{message}</h1>
        </section>
      </>
  );
}
