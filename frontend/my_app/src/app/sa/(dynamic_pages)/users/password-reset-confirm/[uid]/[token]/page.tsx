// app/(dynamic_pages)/users/password-reset-confirm/[uid]/[token]/page.tsx

'use client'
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import axios from 'axios';

import { useRouter } from 'next/navigation'

// react-toastify@
import notify from "../../../../../common/useNotification"
import { ToastContainer, toast } from 'react-toastify';


export default function PasswordResetConfirm() {
        const params = useParams();
        const uid = params?.uid;
        const token = params?.token;


        // data inserted in fields
        console.log('uid=', uid);
        console.log('token=', token);
    

        const [message, setMessage] = useState('');
        const router = useRouter();

    
        useEffect(() => {
            if (uid && token) {
            axios
                .get(`http://127.0.0.1:8000/users/password-reset-confirm/${uid}/${token}/`)
                
                .then(() => {
                    setMessage('✅ Link valid. Redirecting to set a new password...');
                    notify("Link is valid, please set a new password", "success");
                    
                    // Redirect to set password page with uid + token
                    setTimeout(() => {
                        router.push(`/sa/setNewPassword/${uid}/${token}`);
                    }, 8000);         
                })

                .catch(() => {
                    setMessage('❌ Invalid or expired confirmation link!');
                    notify("Invalid or expired link!", "error");
                });

            }
        }, [uid, token, router]);


  
        return (
            <section className="min-h-screen bg-[#F2F2F2] flex flex-col justify-center items-center px-4 py-8">
                <ToastContainer position="top-center" autoClose={3000} />
                <h1 className="p-4 text-center text-xl">{message}</h1>
            </section>
        );
}