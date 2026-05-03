"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "../../context/AuthContext";
import Loading from "../../components/loading/Loading";
import { FcLike  } from "react-icons/fc";
import { FaBuildingUser } from "react-icons/fa6";


export default function MyDashboard() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [profileLink, setProfileLink] = useState("");

  useEffect(() => {
    if (!loading && !user) {
      router.push("/sa/login");
    }

    if (!loading && user) {
      if (user.role === "admin") setProfileLink("/sa/editMyProfile/admin");
      if (user.role === "buyer") setProfileLink("/sa/editMyProfile/buyer");
      if (user.role === "developer") setProfileLink("/sa/editMyProfile/developer");
      if (user.role === "broker") setProfileLink("/sa/editMyProfile/broker");
      if (user.role === "agent") setProfileLink("/sa/editMyProfile/agent");
    }
  }, [user, loading, router]);



  if (loading) {
    return (
      <div className="text-center mt-20">
        <Loading />
      </div>
    );
  }

//   if (!user) return null;

  return (
    <section className="mx-auto mt-10 mb-20 max-w-6xl px-4 sm:px-6 lg:px-8">
        
        <h2 className="mb-12 text-center text-3xl font-semibold text-gray-900 dark:text-white">
            <span className="text-[#ef5e4e]">{user?.first_name}&apos;s</span>{" "}
            Dashboard
        </h2>
    
        <>
            <h2 className="text-center py-3 mt-8 text-2xl">User Managment</h2>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {/* Edit Profile */}
                <Link
                    href={profileLink}
                    className="group flex flex-col items-center rounded-2xl border border-gray-200 bg-white p-6 shadow-sm transition hover:shadow-lg dark:border-gray-700 dark:bg-gray-800"
                >
                <svg
                    className="h-20 w-20 text-[#ef5e4e] transition group-hover:scale-105"
                    fill="currentColor"
                    viewBox="0 0 512 512"
                >
                <svg version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" viewBox="0 0 512 512" xmlSpace="preserve" stroke="#c75a00"><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"> <g> <g> <g> <path d="M309.333,213.333h149.333c5.888,0,10.667-4.779,10.667-10.667S464.555,192,458.667,192H309.333 c-5.888,0-10.667,4.779-10.667,10.667S303.445,213.333,309.333,213.333z"></path> <path d="M458.667,21.333H53.333C23.915,21.333,0,45.269,0,74.667v362.667c0,29.397,23.915,53.333,53.333,53.333h405.333 c29.419,0,53.333-23.936,53.333-53.333V74.667C512,45.269,488.085,21.333,458.667,21.333z M138.667,64 c5.888,0,10.667,4.779,10.667,10.667s-4.779,10.667-10.667,10.667S128,80.555,128,74.667S132.779,64,138.667,64z M96,64 c5.888,0,10.667,4.779,10.667,10.667S101.888,85.333,96,85.333s-10.667-4.779-10.667-10.667S90.112,64,96,64z M53.333,64 C59.221,64,64,68.779,64,74.667s-4.779,10.667-10.667,10.667s-10.667-4.779-10.667-10.667S47.445,64,53.333,64z M490.667,437.333 c0,17.643-14.357,32-32,32H53.333c-17.643,0-32-14.357-32-32V128h469.333V437.333z"></path> <path d="M53.333,405.333h213.333c5.888,0,10.667-4.8,10.667-10.688c0-26.731-18.133-49.941-44.053-56.427l-32.021-8l-1.344-5.355 c8.32-9.173,14.208-20.885,16.661-33.045c5.696-2.944,9.813-8.533,10.667-15.253l2.304-18.56 c0.704-5.632-1.024-11.307-4.757-15.573c-1.152-1.323-2.453-2.453-3.883-3.435l0.533-11.328l1.941-1.941 c5.504-5.845,12.928-18.325,1.173-36.331c-5.547-8.533-17.067-18.731-40.149-18.731c-6.784,0-22.123,0-37.013,9.344 c-43.904,1.536-49.067,25.195-49.067,43.072c0,3.52,0.619,10.112,1.237,15.616c-1.579,1.003-3.051,2.24-4.288,3.669 c-3.797,4.309-5.547,10.005-4.821,15.659l2.304,18.56c0.875,6.955,5.291,12.715,11.797,15.552 c2.389,11.627,7.979,22.891,15.765,31.829l-1.557,6.272l-32.021,8c-25.941,6.464-44.075,29.675-44.075,56.427 C42.667,400.555,47.445,405.333,53.333,405.333z"></path> <path d="M309.333,405.333h85.333c5.888,0,10.667-4.779,10.667-10.667S400.555,384,394.667,384h-85.333 c-5.888,0-10.667,4.779-10.667,10.667S303.445,405.333,309.333,405.333z"></path> <path d="M309.333,277.333h149.333c5.888,0,10.667-4.779,10.667-10.667S464.555,256,458.667,256H309.333 c-5.888,0-10.667,4.779-10.667,10.667S303.445,277.333,309.333,277.333z"></path> <path d="M309.333,341.333h149.333c5.888,0,10.667-4.779,10.667-10.667S464.555,320,458.667,320H309.333 c-5.888,0-10.667,4.779-10.667,10.667S303.445,341.333,309.333,341.333z"></path> </g> </g> </g> </g></svg>    

                </svg>
                <h3 className="mt-4 text-xl">Edit Profile</h3>
                <p className="mt-2 text-sm text-gray-600 dark:text-gray-400 text-center">
                    Easily update your profile picture and personal information.
                </p>
                </Link>



                {/* Change Password */}
                <Link
                    href="/sa/changePassword"
                    className="group flex flex-col items-center rounded-2xl border border-gray-200 bg-white p-6 shadow-sm transition hover:shadow-lg dark:border-gray-700 dark:bg-gray-800"
                >
                    <svg
                        className="h-20 w-20 text-[#ef5e4e] transition group-hover:scale-105"
                        fill="currentColor"
                        viewBox="0 0 486.8 486.8"
                    >
                        <path d="M80,370.406c-1.9-3.3-6.2-4.4-9.5-2.5l-17.4,10.1v-20.1c0-3.8-3.1-6.9-6.9-6.9c-3.8,0-6.9,3.1-6.9,6.9v20.1l-17.4-10.1 c-3.3-1.9-7.6-0.8-9.5,2.5s-0.8,7.6,2.5,9.5l17.5,10.2l-17.5,10.2c-3.3,1.9-4.4,6.2-2.5,9.5s6.2,4.4,9.5,2.5l17.4-10.1v20.1 c0,3.8,3.1,6.9,6.9,6.9c3.8,0,6.9-3.1,6.9-6.9v-20.1l17.4,10.1c3.3,1.9,7.6,0.8,9.5-2.5s0.8-7.6-2.5-9.5l-17.5-10.2l17.5-10.2 C80.8,377.906,82,373.706,80,370.406z"></path> <path d="M143.9,409.706c1.9,3.3,6.2,4.4,9.5,2.5l17.4-10.1v20.1c0,3.8,3.1,6.9,6.9,6.9c3.8,0,6.9-3.1,6.9-6.9v-20.1l17.4,10.1 c3.3,1.9,7.6,0.8,9.5-2.5s0.8-7.6-2.5-9.5l-17.5-10.2l17.5-10.2c3.3-1.9,4.4-6.2,2.5-9.5s-6.2-4.4-9.5-2.5l-17.4,10.1v-20.1 c0-3.8-3.1-6.9-6.9-6.9c-3.8,0-6.9,3.1-6.9,6.9v20.1l-17.4-10c-3.3-1.9-7.6-0.8-9.5,2.5s-0.8,7.6,2.5,9.5l17.5,10.2l-17.5,10.1 C143.1,402.106,142,406.406,143.9,409.706z"></path> <path d="M131.5,462.106v12.2c0,2.9,2.4,5.3,5.3,5.3h81.9c2.9,0,5.3-2.4,5.3-5.3v-12.2c0-2.9-2.4-5.3-5.3-5.3h-81.9 C133.8,456.806,131.5,459.206,131.5,462.106z"></path> <path d="M331.1,121.106h-0.6v-27.2c0-47.3-38.7-87.5-85.9-86.7c-45.9,0.8-83.1,38.4-83.1,84.5v2.6c0,3.9,3.2,7.1,7.1,7.1h22.7 c3.9,0,7.1-3.2,7.1-7.1v-0.8c0-25.4,19.1-47.7,44.5-49.3c27.6-1.7,50.6,20.2,50.6,47.4v29.4h-70v0.1h-64.7 c-12,0.4-21.7,10.1-21.7,22.2v123c0,12.3,10,22.3,22.3,22.3H331c12.3,0,22.3-10,22.3-22.3v-122.9 C353.4,131.106,343.4,121.106,331.1,121.106z M258.5,210.406c-1.7,1.2-2.2,2.5-2.2,4.5c0.1,9,0.1,18,0,27.1l0,0 c0.2,3.8-1.7,7.4-5.1,9.1c-7.9,4-15.8-1.6-15.8-9.1c0,0,0,0,0-0.1c0-9,0-18.1,0-27.1c0-1.8-0.4-3.1-2-4.3 c-8.2-6-10.9-16.3-6.8-25.4c4-8.8,13.7-14,22.8-12.1c10.2,2,17.3,10.3,17.4,20.4C267.1,200.506,264.2,206.306,258.5,210.406z"></path> <path d="M262.9,462.106v12.2c0,2.9,2.4,5.3,5.3,5.3h81.9c2.9,0,5.3-2.4,5.3-5.3v-12.2c0-2.9-2.4-5.3-5.3-5.3h-81.9 C265.3,456.806,262.9,459.206,262.9,462.106z"></path> <path d="M275.3,409.706c1.9,3.3,6.2,4.4,9.5,2.5l17.4-10.1v20.1c0,3.8,3.1,6.9,6.9,6.9s6.9-3.1,6.9-6.9v-20.1l17.4,10.1 c3.3,1.9,7.6,0.8,9.5-2.5s0.8-7.6-2.5-9.5l-17.5-10.2l17.5-10.2c3.3-1.9,4.4-6.2,2.5-9.5s-6.2-4.4-9.5-2.5l-17.4,10.1v-20.1 c0-3.8-3.1-6.9-6.9-6.9s-6.9,3.1-6.9,6.9v20.1l-17.4-10.1c-3.3-1.9-7.6-0.8-9.5,2.5s-0.8,7.6,2.5,9.5l17.5,10.2l-17.5,10.2 C274.5,402.106,273.4,406.406,275.3,409.706z"></path> <path d="M481.5,456.806h-81.9c-2.9,0-5.3,2.4-5.3,5.3v12.2c0,2.9,2.4,5.3,5.3,5.3h81.9c2.9,0,5.3-2.4,5.3-5.3v-12.2 C486.8,459.206,484.4,456.806,481.5,456.806z"></path> <path d="M5.3,479.606h81.9c2.9,0,5.3-2.4,5.3-5.3v-12.2c0-2.9-2.4-5.3-5.3-5.3H5.3c-2.9,0-5.3,2.4-5.3,5.3v12.2 C0,477.206,2.4,479.606,5.3,479.606z"></path> <path d="M406.8,409.706c1.9,3.3,6.2,4.4,9.5,2.5l17.4-10.1v20.1c0,3.8,3.1,6.9,6.9,6.9s6.9-3.1,6.9-6.9v-20.1l17.4,10.1 c3.3,1.9,7.6,0.8,9.5-2.5s0.8-7.6-2.5-9.5l-17.5-10.2l17.5-10.2c3.3-1.9,4.4-6.2,2.5-9.5s-6.2-4.4-9.5-2.5l-17.4,10.1v-20.1 c0-3.8-3.1-6.9-6.9-6.9s-6.9,3.1-6.9,6.9v20.1l-17.4-10.1c-3.3-1.9-7.6-0.8-9.5,2.5s-0.8,7.6,2.5,9.5l17.5,10.2l-17.5,10.2 C406,402.106,404.8,406.406,406.8,409.706z"></path>
                    </svg>
                    <h3 className="mt-4 text-xl">Change Password</h3>
                    <p className="mt-2 text-sm text-gray-600 dark:text-gray-400 text-center">
                        Secure your account by changing your password anytime.
                    </p>
                </Link>



                {/* Saved Properties */}
                <Link
                    href="/sa/saved-properties"
                    className="group flex flex-col items-center rounded-2xl border border-gray-200 bg-white p-6 shadow-sm transition hover:shadow-lg dark:border-gray-700 dark:bg-gray-800"
                >
                    <FcLike className="h-20 w-20 text-[#ef5e4e] transition group-hover:scale-105"/>
                    <h3 className="mt-4 text-xl">Saved Properties</h3>
                    <p className="mt-2 text-sm text-gray-600 dark:text-gray-400 text-center">
                        Browse through properties and click the heart icon to save your favorites for easy access later.
                    </p>
                </Link>


                {/* My owned Properties */}
                <Link
                    href="/sa/my-properties"
                    className="group flex flex-col items-center rounded-2xl border border-gray-200 bg-white p-6 shadow-sm transition hover:shadow-lg dark:border-gray-700 dark:bg-gray-800"
                >
                    <FaBuildingUser  className="h-20 w-20 text-[#ef5e4e] transition group-hover:scale-105"/>
                    <h3 className="mt-4 text-xl">My Properties</h3>
                    <p className="mt-2 text-sm text-gray-600 dark:text-gray-400 text-center">
                        All properties add by you.
                    </p>
                </Link>





                {/* Role Management (Admin only) */}
                {user?.role === "admin" && (
                    <Link
                        href="/sa/roleLinks"
                        className="group flex flex-col items-center rounded-2xl border border-gray-200 bg-white p-6 shadow-sm transition hover:shadow-lg dark:border-gray-700 dark:bg-gray-800"
                    >
                        <svg
                            className="h-20 w-20 text-[#ef5e4e] transition group-hover:scale-105"
                            fill="currentColor"
                            viewBox="0 0 52 52"
                        >
                            <path d="M38.3,27.2A11.4,11.4,0,1,0,49.7,38.6,11.46,11.46,0,0,0,38.3,27.2Zm2,12.4a2.39,2.39,0,0,1-.9-.2l-4.3,4.3a1.39,1.39,0,0,1-.9.4,1,1,0,0,1-.9-.4,1.39,1.39,0,0,1,0-1.9l4.3-4.3a2.92,2.92,0,0,1-.2-.9,3.47,3.47,0,0,1,3.4-3.8,2.39,2.39,0,0,1,.9.2c.2,0,.2.2.1.3l-2,1.9a.28.28,0,0,0,0,.5L41.1,37a.38.38,0,0,0,.6,0l1.9-1.9c.1-.1.4-.1.4.1a3.71,3.71,0,0,1,.2.9A3.57,3.57,0,0,1,40.3,39.6Z"></path> <circle cx="21.7" cy="14.9" r="12.9"></circle> <path d="M25.2,49.8c2.2,0,1-1.5,1-1.5h0a15.44,15.44,0,0,1-3.4-9.7,15,15,0,0,1,1.4-6.4.77.77,0,0,1,.2-.3c.7-1.4-.7-1.5-.7-1.5h0a12.1,12.1,0,0,0-1.9-.1A19.69,19.69,0,0,0,2.4,47.1c0,1,.3,2.8,3.4,2.8H24.9C25.1,49.8,25.1,49.8,25.2,49.8Z"></path>
                        </svg>
                        <h3 className="mt-4 text-xl">Role Management</h3>
                        <p className="mt-2 text-sm text-gray-600 dark:text-gray-400 text-center">
                            Manage roles for users who add properties.
                        </p>
                    </Link>
                )}   
            </div>


            <br></br><br></br>


            <h2 className="text-center py-3 mt-8 text-2xl">Property Form Managment</h2>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                
                {user?.role === "admin" && (
                <>
                    <Link
                        href="/sa/addCountry"
                        className="group flex flex-col items-center rounded-2xl border border-gray-200 bg-white p-6 shadow-sm transition hover:shadow-lg dark:border-gray-700 dark:bg-gray-800"
                    >
                        <svg
                            className="h-20 w-20 text-[#ef5e4e] transition group-hover:scale-105"
                            fill="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <svg version="1.2" baseProfile="tiny" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" viewBox="-67 69 120 120" xmlSpace="preserve"><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M-7,70.7c-32.2,0-58.3,26.1-58.3,58.3s26.1,58.3,58.3,58.3s58.3-26.1,58.3-58.3S25.2,70.7-7,70.7z M-7,181.4 c-28.9,0-52.4-23.5-52.4-52.4c0-11.5,3.8-22.2,10.1-30.8c1.6-0.9,2.7-2.4,5-1.9c0,0.4,0.3,1.2,0.3,1.4c1.1-0.2,1.7-1.2,2-2.4 c1.7,1.7-0.1,4.4-0.7,6.1c5.9,0.8,3.9-3.3,4.7-6.8c0.7-3.1,6.1-4.4,5.2-8.3c-1.7-0.3-3.3,0.1-4.9,0.9c-0.1-0.2-0.1-0.4-0.1-0.7 c1.9-1.3,3.8-2.5,5.8-3.7c3.4-0.1,4.1,3,0.6,4.3c-1.2,3.9,3.5,1.7,4.7,1.2c1.4-0.7,1.2-0.9,3-1.2c1.6-0.3,2.8,0.2,4.2-0.6 c-1.3,4.2-6.6,4.2-8.9,7.4c-3.3,4.8,5.2,3.3,7.9,1.1c1.7-1.4,2.2-3.8,3.8-4.9c1.9-1.3,4.5-0.3,5-2.9c0.1-0.6-1.7-4.1-1.8-4.5 c-1-2.4-2.3-2.1,0-4.9c-0.6,0.1-1.2-0.1-1.8-0.1c0-0.2,0-0.4,0-0.7c2.8-0.4,5.6-0.8,8.6-0.8c2.7,0,5.4,0.2,8,0.6 c1.9,1.2,3.3,3.1,5.1,4.9c5.2,5.1-2.7,3.5-2.1,7.2c0.3,2.1,2.9,1,1.1,4.2c-1,1.8-3.4,2.1-3,4.3c-4.1,0.7-6.4-2.7-10.5-1.1 c-2,0.8-4.2,2-4.7,3.9c-0.7,3.3,2,3,4.1,4.7c1.8,1.4,1.6,1.4,1.1,4.4c-0.4,2.7-0.3,3.8-2.9,4.8c-1.2,0.4-2.8,0.2-3.9,0.9 c-0.3,0.2-0.7,1.8-1.2,2.2c-1.4,1-5.6,0.6-4.5,3.7c1.6,0.2,2.5-0.7,3.9-0.7c3-0.1,1.4,0.4,3.4,2c2.2,1.7,5.4,1.9,8.1,3 c1.3,0.6,2.2,1.6,3.8,1.4c0.4,2.5-1.7,3.1-3.7,3.7c-3,0.9-3.9,0.7-5.6-2c-2.2-3.3-2.7-2.3-6.9-2.8c-1.8-0.1-6.6-0.7-7.8-2.1 c-1.4-1.8,0.3-4.3,1.8-5.3c2.4-1.7,3-1.3,4.4-3.7c1.8-2.7,1.8-1.8,4.3-2.9c2.1-0.9,3.8-2.3,3.7-4.8c-1.4-0.3-2.1-1.6-2.1-2.9 l-2.5-0.9c0.2,1.1,3.5,9.4-1.2,7.1c-1.8-0.9,0-8.9-4.9-7.3c0.2,2.3-0.6,2.7-2.2,4c-2.3,2-2.4,0-1.7,3c0.6,2,2,1.7,1.2,4.3 c-0.4,1.7-2.9,1.8-0.7,4c-1.1,0.2-2.2,0.1-3.1-0.3c-2.7,2.7-1.2,3.5-2.3,6.9c-1.1,3.5-5.6,4.5-8,7c-4.1,4.3-5.2,15.4,0.6,18.6 c4.5,2.5,9,0.1,13.5,1.8c3,1.1,3.9,2.9,4.3,5.8c0.4,3.3,3.3,5.2,3.8,9.2c0.3,3.3,0.1,5.5,2.3,8.1c1.1,1.2,3.3,3.3,4.9,4 c2.7,1.1,3.5-0.1,5.8-1.2c0.8-0.3,2.1-0.6,2.9-0.9c2-1,1.1-0.2,2.2-1.9c1.1-1.6,1.6-3.5,3-5.1c1.9-1.9,2.5-2.5,3.5-5 c0.8-1.9,0.9-3.9,1.7-6c0.8-2,2.8-3.8,3.9-5.5c1.2-1.8,1.6-4.2,3-5.8c-1.8,0.1-5,0.8-6.8,0.2c-2-0.7-2.4-2.9-3.8-4.5 c-2.2-2.9-6.1-7.3-5.9-11.4c1.4-0.2,5.6,7.4,6.5,8.9c3,4.4,5,3.1,8.9,1.3c1.9-0.9,9.6-5.3,6.4-8.1c-2.1-1.8-10.5,2.9-9.6-2.3 c3.4-0.1,7.5-0.3,10.9-1c1.7-0.3,3-1.3,4.7-1.1c0.3,0,1,1.6,1.6,1.8c0.9,0.3,2.4,0,3.4,0c0.2,2.4,3.3,9.3,6.5,8.5 c0.2-5.3,0-10.2,1.3-15.3c1.3-0.2,2.7-0.1,4.1-0.1c0.1,1.3,0.1,2.7,0.1,4.1C45.4,157.9,21.9,181.4-7,181.4z"></path> </g></svg>
                        </svg>
                        <h3 className="mt-4 text-xl">Add Country</h3>
                        <p className="mt-2 text-sm text-gray-600 dark:text-gray-400 text-center">
                            Add new countries to the system for property listings.
                        </p>
                    </Link>

                    <Link
                        href="/sa/addCity"
                        className="group flex flex-col items-center rounded-2xl border border-gray-200 bg-white p-6 shadow-sm transition hover:shadow-lg dark:border-gray-700 dark:bg-gray-800"
                    >
                            <svg
                                className="h-20 w-20 text-[#ef5e4e] transition group-hover:scale-105"
                                fill="currentColor"
                                viewBox="0 0 24 24"
                            >
                            <svg  version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" viewBox="0 0 164 256" enableBackground="new 0 0 164 256" xmlSpace="preserve"><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M161.777,37.14c0-19.409-15.731-35.14-35.14-35.14c-19.409,0-35.14,15.731-35.14,35.14c0,4.87,1.01,10.729,2.781,14.953 c6.731,16.055,24.315,58.217,30.316,72.607c-14.107-12.36-32.92-19.342-53.163-17.996c-40.704,2.353-71.643,37.41-69.055,78.114 c2.47,40.586,37.528,71.408,78.231,69.055c40.704-2.47,71.643-37.527,68.938-78.231c-1.154-19.015-9.397-35.896-22-48.214 c4.463-10.692,24.22-58.024,31.452-75.272C160.766,47.931,161.777,42.01,161.777,37.14z M72.371,245.168 c-14.352-0.941-28.116-6.588-39.174-16.234c-13.058-11.529-20.705-27.528-21.881-44.703c-1.176-15.529,2.588-30.116,11.999-42.351 c0.353,3.176,2.117,5.647,2.117,7.882c0,8.823-0.706,14.117,4.941,21.058c2.235,2.588,3.059,6.823,4,10.117 c1.176,3.176,4.941,4.706,7.764,6.588c5.411,3.529,10.705,8.117,16.587,11.293c3.764,2.118,6,3.176,5.411,7.764 c-0.706,3.529-0.706,5.882-2.47,9.176c-0.353,1.176,2.588,7.176,3.529,7.882c3.059,2.47,5.882,4.941,9.058,7.176 C79.194,234.345,74.253,239.639,72.371,245.168z M132.956,192.348c0,0,3.764,1.176,6.823,0.353 c-2.235,11.529-7.294,21.999-15.293,31.057c-8.823,10-19.999,16.94-32.587,19.999c1.529-4.47,4.47-8.823,7.294-11.294 c2.47-2.235,5.411-6.235,6.588-9.176c1.176-3.176,2.588-5.882,4.47-8.823c2.235-4-6.941-9.646-9.999-10.588 c-6.823-2.47-11.882-5.882-17.764-9.646c-4.353-2.588-17.293,3.412-22.234,1.529c-6.588-2.47-8.823-4.47-14.705-8.235 c-6-4-4.353-12.47-4.706-18.705c4.47,0,10.705-1.882,13.999,1.529c0.941,1.176,4.47,5.882,6.588,4c2.235-2.353-1.176-8-1.882-9.294 c-2.118-4,3.764-6.235,6.823-9.176c3.765-4,11.882-10.588,10.941-13.058c-0.941-2.588-9.176-10-13.764-8.235 c-0.941,0-6.235,5.882-7.294,6.823c0-2.118-0.353-3.176-0.353-5.059c0-1.294-2.588-2.47-2.47-3.412 c0.235-2.235,5.882-6.588,7.176-8.235c-1.177-0.706-4.941-3.412-5.882-3.059c-2.47,1.294-5.412,2.235-8.117,3.412 c0-0.941-0.235-1.882-0.353-2.47c5.059-2.588,10.588-4.47,16.234-5.882l5.059,1.882l3.765,4l3.765,3.529 c0,0,2.235,0.941,3.176,0.941c1.177-0.235,4.706-4.941,4.706-4.941l-1.529-3.529l-0.235-3.176c10.117,0.941,19.646,4,28.116,9.176 c-1.294,0.235-3.176,0.353-4.941,0.941c-0.706-0.353-4.706,0.353-4.47,2.118c0.235,1.294,7.176,6.941,10.117,11.882 c3.059,5.059,11.529,8.235,13.058,13.999c1.529,6.588-0.941,15.058,0.235,22.94C124.486,184.23,132.956,192.348,132.956,192.348z M126.636,53.365c-8.822,0-15.975-7.153-15.975-15.975c0-8.823,7.153-15.975,15.975-15.975c8.823,0,15.975,7.153,15.975,15.975 C142.612,46.212,135.459,53.365,126.636,53.365z"></path> </g></svg></svg>
                            <h3 className="mt-4 text-xl">Add City</h3>
                            <p className="mt-2 text-sm text-gray-600 dark:text-gray-400 text-center">
                                Add new City to the seclected country.
                            </p>
                    </Link>

                    <Link
                        href="/sa/addMainType"
                        className="group flex flex-col items-center rounded-2xl border border-gray-200 bg-white p-6 shadow-sm transition hover:shadow-lg dark:border-gray-700 dark:bg-gray-800"
                    >
                            <svg
                                className="h-20 w-20 text-[#ef5e4e] transition group-hover:scale-105"
                                fill="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path d="M27,22.1414V18a2,2,0,0,0-2-2H17V12h2a2.0023,2.0023,0,0,0,2-2V4a2.0023,2.0023,0,0,0-2-2H13a2.002,2.002,0,0,0-2,2v6a2.002,2.002,0,0,0,2,2h2v4H7a2,2,0,0,0-2,2v4.1421a4,4,0,1,0,2,0V18h8v4.142a4,4,0,1,0,2,0V18h8v4.1414a4,4,0,1,0,2,0ZM13,4h6l.001,6H13ZM8,26a2,2,0,1,1-2-2A2.0023,2.0023,0,0,1,8,26Zm10,0a2,2,0,1,1-2-2A2.0027,2.0027,0,0,1,18,26Zm8,2a2,2,0,1,1,2-2A2.0023,2.0023,0,0,1,26,28Z"></path> 
                            </svg>
                            <h3 className="mt-4 text-xl">Add Main Type</h3>
                            <p className="mt-2 text-sm text-gray-600 dark:text-gray-400 text-center">
                                Add main type(Residential/Commercial).
                            </p>
                    </Link>

                    <Link
                        href="/sa/addSubType"
                        className="group flex flex-col items-center rounded-2xl border border-gray-200 bg-white p-6 shadow-sm transition hover:shadow-lg dark:border-gray-700 dark:bg-gray-800"
                    >
                            <svg
                                className="h-20 w-20 text-[#ef5e4e] transition group-hover:scale-105"
                                fill="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path d="M29,10H24v2h5v6H22v2h3v2.142a4,4,0,1,0,2,0V20h2a2.0027,2.0027,0,0,0,2-2V12A2.0023,2.0023,0,0,0,29,10ZM28,26a2,2,0,1,1-2-2A2.0027,2.0027,0,0,1,28,26Z"></path><path d="M19,6H14V8h5v6H12v2h3v6.142a4,4,0,1,0,2,0V16h2a2.0023,2.0023,0,0,0,2-2V8A2.0023,2.0023,0,0,0,19,6ZM18,26a2,2,0,1,1-2-2A2.0027,2.0027,0,0,1,18,26Z"></path><path d="M9,2H3A2.002,2.002,0,0,0,1,4v6a2.002,2.002,0,0,0,2,2H5V22.142a4,4,0,1,0,2,0V12H9a2.002,2.002,0,0,0,2-2V4A2.002,2.002,0,0,0,9,2ZM8,26a2,2,0,1,1-2-2A2.0023,2.0023,0,0,1,8,26ZM3,10V4H9l.0015,6Z"></path>
                            </svg>
                            <h3 className="mt-4 text-xl">Add Sub Type</h3>
                            <p className="mt-2 text-sm text-gray-600 dark:text-gray-400 text-center">
                                Add sub types for Residential and for Commerical.
                            </p>
                    </Link>

                    <Link
                        href="/sa/addPurpose"
                        className="group flex flex-col items-center rounded-2xl border border-gray-200 bg-white p-6 shadow-sm transition hover:shadow-lg dark:border-gray-700 dark:bg-gray-800"
                    >
                            <svg
                                className="h-20 w-20 text-[#ef5e4e] transition group-hover:scale-105"
                                fill="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <svg  id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" viewBox="0 0 496 496" xmlSpace="preserve"><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"> <g> <g> <g> <path d="M384.304,409.28c-6.04-2-12.712-1.416-18.28,1.632l-17.552,9.592l2.424-7.192c2.28-6.768,1.16-14.28-3.016-20.08 c-4.168-5.8-10.92-9.264-18.064-9.264c-9.152,0-17.256,5.488-20.656,13.992l-10.4,26.008h-24.688l-0.44-0.216l17.304-9.192 c10.416-5.528,15.488-17.72,12.064-29c-1.968-6.512-6.4-11.792-12.472-14.872c-6.08-3.08-12.944-3.52-19.368-1.28l-65.632,23.016 l-23.776,15.552h-53.576V392H0v104h128.168v-14.272l30.432,6.088l106.36,0.16l80.784-16.16l41.456-20.152 c11.168-5.512,15.888-18.72,10.76-30.072C395.32,415.784,390.344,411.304,384.304,409.28z M112.168,480H16v-72h64v56h16v-56 h16.168V480z M324.016,403.896c1.704-4.28,8.168-5.064,10.864-1.328c1.184,1.656,1.504,3.704,0.848,5.64l-5.304,15.76h-14.44 L324.016,403.896z M380.12,437.312l-38.544,19.016l-78.184,15.64H160.96l-32.792-6.56v-41.44h58.424l25.176-16.784l64.68-22.688 c2.272-0.784,4.688-0.64,6.832,0.456c2.144,1.088,3.704,2.952,4.4,5.248c1.2,3.976-0.576,8.272-4.256,10.224l-44.704,23.76 l31.56,15.784h75.936l27.48-15.016c1.728-0.952,3.696-1.112,5.536-0.496c1.856,0.624,3.336,1.952,4.144,3.728 C384.936,431.632,383.504,435.64,380.12,437.312z"></path> <path d="M330.664,24h-21.328L280,46V0H168v48h16v70l-40,30v20h24v184h304V168h24v-20L330.664,24z M184,16h80v16h-80V16z M277.336,48L264,58V48H277.336z M248,48v22l-48,36V48H248z M360,336h-80V216h80V336z M456,336h-80V200H264v136h-80V168h272V336z M165.336,152L314.664,40h10.672l149.328,112H165.336z"></path> <path d="M280,104c0,22.056,17.944,40,40,40c22.056,0,40-17.944,40-40c0-22.056-17.944-40-40-40C297.944,64,280,81.944,280,104z M344,104c0,13.232-10.768,24-24,24s-24-10.768-24-24s10.768-24,24-24S344,90.768,344,104z"></path> <rect x="328" y="264" width="16" height="16"></rect> </g> </g> </g> </g></svg>                            </svg>
                            <h3 className="mt-4 text-xl">Add Purpose</h3>
                            <p className="mt-2 text-sm text-gray-600 dark:text-gray-400 text-center">
                                Add Purpose for a property.
                            </p>
                    </Link>

                    <Link
                        href="/sa/addAmenity"
                        className="group flex flex-col items-center rounded-2xl border border-gray-200 bg-white p-6 shadow-sm transition hover:shadow-lg dark:border-gray-700 dark:bg-gray-800"
                    >
                            <svg
                                className="h-20 w-20 text-[#ef5e4e] transition group-hover:scale-105"
                                fill="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <svg  version="1.1" preserveAspectRatio="xMidYMid meet" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink"><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"> <title>list-outline-badged</title> <rect x="15" y="12" width="9" height="2"></rect><rect x="15" y="16" width="9" height="2" ></rect><rect x="15" y="20" width="9" height="2" className="clr-i-outline--badged clr-i-outline-path-3--badged"></rect><rect x="15" y="24" width="9" height="2" ></rect><rect x="11" y="8" width="2" height="2" ></rect><rect x="11" y="12" width="2" height="2" className="clr-i-outline--badged clr-i-outline-path-6--badged"></rect><rect x="11" y="16" width="2" height="2" ></rect><rect x="11" y="20" width="2" height="2" ></rect><rect x="11" y="24" width="2" height="2" ></rect><path d="M15,8v2h8.66a7.45,7.45,0,0,1-.89-2Z" ></path><path d="M28,13.22V32H8V4H22.78a7.45,7.45,0,0,1,.88-2H8A2,2,0,0,0,6,4V32a2,2,0,0,0,2,2H28a2,2,0,0,0,2-2V13.5A7.49,7.49,0,0,1,28,13.22Z"></path><circle cx="30" cy="6" r="5" ></circle> <rect x="0" y="0" width="36" height="36" fillOpacity="0"></rect> </g></svg>
                            </svg>
                            <h3 className="mt-4 text-xl">Add Amenity</h3>
                            <p className="mt-2 text-sm text-gray-600 dark:text-gray-400 text-center">
                                Add Amenity for a property.
                            </p>
                    </Link>
                </>
                )}
            </div>


            <h2 className="text-center py-3 mt-8 text-2xl">Add Property</h2>
            <div className="">
                
                {(user?.role === "admin" || user?.role === "developer" || user?.role === "broker" || user?.role === "agent") &&(
                <>
                    <Link
                        href="/sa/addProperty"
                        className="group flex flex-col items-center rounded-2xl border border-gray-200 bg-white p-6 shadow-sm transition hover:shadow-lg"
                    >
                        <svg
                            className="text-center h-40 w-40 text-[#ef5e4e] transition group-hover:scale-105"
                            fill="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"> <g id="add-company-16px" transform="translate(0.5 0.5)"> <path id="add-company-16px-2" data-name="add-company-16px" d="M12,15.5V13H9.5a.5.5,0,1,1,0-1H12V9.5a.5.5,0,1,1,1,0V12h2.5a.5.5,0,1,1,0,1H13v2.5a.5.5,0,0,1-1,0ZM6.7,16H0V1.5A1.525,1.525,0,0,1,1.545,0h7.21A1.526,1.526,0,0,1,10.3,1.5v6a.515.515,0,0,1-1.03,0v-6A.508.508,0,0,0,8.755,1H1.545a.509.509,0,0,0-.516.5V15H3.09V11.5a.509.509,0,0,1,.516-.5H6.7a.508.508,0,0,1,.515.5V15H8.755a.5.5,0,1,1,0,1ZM4.12,15H6.18V12H4.12ZM6.18,9V7H8.24V9ZM2.06,9V7H4.12V9ZM6.18,5V3H8.24V5ZM2.06,5V3H4.12V5Z" stroke="rgba(0,0,0,0)" strokeMiterlimit="10" strokeWidth="1"></path> </g> </g></svg>
                        </svg>
                        <h3 className="text-center text-xl">Add Property</h3>
                        <p className="mt-2 text-sm text-gray-600 dark:text-gray-400 text-center">
                            Add new property.
                        </p>
                    </Link>  
                </>
                )}
            </div>

        </>
        
      
    </section>
  );
}
