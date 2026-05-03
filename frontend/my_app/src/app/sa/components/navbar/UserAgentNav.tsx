// src/app/components/navbar/UserNav.tsx
'use client';
import { logoutUser } from "../../utils/auth";
import { useRouter } from "next/navigation";
import { useState, useEffect, useRef } from "react";
import Image from 'next/image';
import MenuLink from "./MenuLink";
import { useAuth } from "../../context/AuthContext";
// import LogoutButton from "../LogoutButton";

// import useLoginModal from "@/app/hooks/useLoginModal";
// import useSignupModal from "@/app/hooks/useSignupModal";



const UserAgentNav = ({user}) => {
    
    const { setUser } = useAuth();
    const router = useRouter();
    // const loginModal = useLoginModal();
    // const signupModal = useSignupModal();
    const [isOpen, setIsOpen] = useState(false)
    const dropdownRef = useRef<HTMLDivElement>(null);


    const handleLogout = async () => {
        try {
            await logoutUser(setUser);
            console.log("user after logout=",user)     // reset context inside logoutUser
            setIsOpen(false);
            // router.push("/sa/login");      // redirect after logout
        } catch (err) {
            console.error("Usernav- error of handleLogout=",err);
        }
    };
    
    
    // Close dropdown when clicking outside
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    
    
    
    
    return (
        <div className="p-2 relative inline-block rounded-full" ref={dropdownRef}>
            <button 
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center"
            >
                        <svg fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
                        </svg>

                       
                                {/* <Image
                                    src={`http://127.0.0.1:8000${user?.profile_picture}`}
                                    alt="Profile"
                                    width={40}
                                    height={40}
                                    className="rounded-full"
                                />
                            ) : (  */}
                               <Image
                                    src={
                                    user 
                                        ? `http://127.0.0.1:8000${user?.profile_picture}` 
                                        : "/profile_default.svg" // put a default image in /public
                                    }
                                    alt="Profile Picture"
                                    width={40}
                                    height={40}
                                    className="rounded-full object-cover"
                                />
                       
            </button>

            {isOpen && (
                <div className="w-[220px] absolute top-[60px] right-0 bg-white border rounded-xl shadow-md flex flex-col cursor-pointer">
                    {user ? (
                        <>
                            <MenuLink
                                label='My Agent profile'
                                onClick={() => {
                                    router.push('/sa/myProfile/agent');
                                    setIsOpen(false);
                                }}
                            />

                            <MenuLink
                                label='My dashboard'
                                onClick={() => {
                                    router.push('/sa/myDashboard');
                                    setIsOpen(false);
                                }}
                            />

                            <MenuLink
                                label='My properties'
                                onClick={() => {
                                    router.push('/sa/myProperties');
                                    setIsOpen(false);
                                }}
                            />

                            <MenuLink
                                label='My favorites'
                                onClick={() => {
                                    router.push('/sa/myFavorites');
                                    setIsOpen(false);
                                }}
                            />

                            <MenuLink
                                label='My reservations'
                                onClick={() => { 
                                    router.push('/sa/myReservations');
                                    setIsOpen(false);
                                }}
                            />
                            
                            <MenuLink
                                label='Inbox'
                                onClick={() => {
                                    router.push('/sa/inbox');
                                    setIsOpen(false);
                                    
                                }}
                            />

                            <button 
                                onClick={handleLogout}
                                className="block w-full text-left px-4 py-2 hover:bg-gray-100"
                            >
                                Logout
                            </button>

                            
                        </>
                    ) : (
                        null
                    )}
                </div>
            )}
        </div>
    )
}

export default UserAgentNav;