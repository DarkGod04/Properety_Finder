"use client";

import { useAuth } from "../../../context/AuthContext";
import { useState, useEffect } from "react";
import Image from "next/image";

import { useRouter } from "next/navigation";
import { updateRequestUserProfile } from "../../../utils/auth";

// react-toastify
import notify from "../../../common/useNotification"
import { ToastContainer, toast } from 'react-toastify';
import { moveMessagePortToContext } from "worker_threads";
import Link from "next/link";




export default function MyAdminProfile() {
    const { user, loading } = useAuth();
    
    const router = useRouter();
    
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [role, setRole] = useState('');  
    const [gender, setGender] = useState('');
    const [dob, setDob] = useState('');
    const [phone, setPhone] = useState('');
    const [country, setCountry] = useState('');
    const [address, setAddress] = useState('');
    
    // Profile Image for current user
    const [ppicture, setPpicture] = useState<string | File | null>(null);
    // const [preview, setPreview]   = useState<string | null>(null);
    
    

    // If no user, redirect to /login
    useEffect(() => {
        console.log("adminProfile-loading=",loading)
        console.log("adminProfile-user=",user)
        
        if (!loading && !user) {
            router.push("/sa/login");
        }
        if (!loading && user){
         
          setFirstName(user.first_name);
          setLastName(user.last_name);
          setRole(user.role);
          setGender(user.gender );
          setDob(user.date_of_birth);
          setPhone(user.phone_number || "None");
          setCountry(user.country || "None");
          setAddress(user.address || "None");
          setPpicture(user.profile_picture || "None");
        
          //  console.log('MyAdminProfile-useAuth-user=', user)
          // console.log('user=', user)
          // console.log('user.first_name=', user.first_name)
          // console.log('firstName=', firstName)
          // console.log('lastName=', lastName)
          // console.log('gender=', gender)
          // console.log('dob=', dob)
          // console.log('phone=', phone)
          // console.log('country=', country)
          // console.log('address=', address)
          // console.log('ppicture=', ppicture)
        }
      }, [user, loading, router]); // Add dependencies here

    
    if (loading) {
       return <p className="text-center mt-20">Loading...</p>; // spinner/loader
    }
        
    return (
        <>
            <section className="my-4 bg-gray-100 flex items-center">
                <div className="lg:w-3/4 w-[95%] mx-auto bg-white shadow-2xl rounded-2xl p-6">
                    <div className="flex place-content-end">
                      <Link href="/sa/editMyProfile/admin"
                         className="text-slate-800 hover:text-blue-600 text-sm bg-white hover:bg-slate-100 border border-slate-200 rounded-l-lg rounded-r-lg font-medium px-4 py-2 inline-flex space-x-1 items-center">
                        <span><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5"
                                stroke="currentColor" className="w-6 h-6">
                                <path strokeLinecap="round" strokeLinejoin="round"
                                    d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
                            </svg>
                        </span>
                        <span className="hidden md:inline-block">Edit</span>
                    </Link>
                    </div>
                    <h1 className="text-center text-2xl text-gray-900">
                        <span className="text-[#c75a00] text-2xl">{user?.first_name}
                        <span>&apos;s</span>&nbsp;</span>Profile
                    </h1>
                     <ToastContainer position="top-center" autoClose={3000} />
                  




                    <div className="bg-white py-5 sm:py-8">
                      <div className="max-w-7xl px-6 lg:px-8">
                        <div className="grid max-w-2xl grid-cols-1 gap-x-8 gap-y-16 sm:gap-y-20 lg:mx-0 lg:max-w-none lg:grid-cols-3">
                          
                          <div className="text-center justify-items-center">
                            <Image
                              src={
                                ppicture 
                                  ? `http://127.0.0.1:8000${ppicture}` 
                                  : "/profile_default.svg" // put a default image in /public
                              }
                              alt="Admin Profile Picture"
                              width={300}
                              height={300}
                              className="rounded-full object-cover"
                            />
                            
                            <div className="text-xl mt-3 text-gray-600 flex items-center justify-center gap-2">
                                {/* Gender Icon */}
                                {user?.gender && user.gender === "female"
                                ? (
                                      // Female SVG
                                      <svg
                                        height="30px"
                                        width="30px"
                                        xmlns="http://www.w3.org/2000/svg"
                                        viewBox="0 0 19.64 19.64"
                                        fill="#000000"
                                      >
                                        <path d="M16.888,11.323c-0.359-0.801-1.907-1.461-2.871-1.804c-0.501-1.162-0.557-2.492-0.514-3.426 l0.018,0.067l0.155-1.471c0.009-0.101,0.236-2.378-0.802-3.435l0.007-0.018l-0.137-0.121C11.903,0.374,10.934,0,9.861,0 C8.543,0,7.557,0.575,7.507,0.605c-2.04,1.314-1.517,4.05-1.493,4.166L6.052,4.96l0.055,0.005c0.066,0.394,0.402,2.685-0.4,4.554 c-0.705,0.294-1.395,0.504-1.418,0.513c-0.887,0.339-1.274,0.857-1.295,0.887c-1.248,1.845-1.402,5.795-1.407,5.977 c0.019,1.065,0.513,1.236,0.566,1.247c2.814,1.255,7.107,1.482,7.296,1.493c0.154,0.003,0.306,0.004,0.457,0.004l0,0 c4.281,0,7.317-1.253,7.483-1.326c0.548-0.346,0.607-0.655,0.611-0.728C18.338,14.668,16.946,11.46,16.888,11.323z M12.728,5.82 l-0.011,0.068c-0.174,1.415-1.855,3.815-2.908,3.815c-1.096,0-2.642-2.489-2.807-3.815l-0.01-0.067L6.955,5.767 C6.952,5.765,6.796,5.54,6.654,4.998C6.847,5.009,7.042,5.025,7.23,5.025l0,0c2.359,0,3.857-0.835,4.457-1.25 c0.178,0.4,0.564,1.011,1.334,1.339l0.014,0.007c-0.134,0.452-0.266,0.645-0.266,0.645L12.728,5.82z" />
                                      </svg>
                                ) : (
                                      // Male SVG
                                      <svg
                                        height="30px"
                                        width="30px"
                                        xmlns="http://www.w3.org/2000/svg"
                                        viewBox="0 0 512 512"
                                        fill="#000000"
                                      >
                                        <path d="M430.903,405.469c-10.649-18.154-27.114-29.081-42.961-36.375c-15.854-7.281-31.537-11.206-40.981-14.765 c-6.368-2.368-13.166-5.906-18.657-9.812v-25.012c-0.292-3.252-6.804-3.973-11.226-4.096c0-1.933,0-4.205,0-6.879 c10.002-11.138,24.386-28.38,30.284-55.732c2.062-0.926,4.103-1.973,6.069-3.348c4.892-3.375,9.043-8.274,12.554-14.942 c3.545-6.696,6.675-15.255,10.023-26.971c1.694-5.94,2.476-11.091,2.476-15.691c0.007-5.293-1.082-9.88-3.082-13.615 c-0.183-0.34-0.422-0.592-0.619-0.918c4.334-25.93,21.195-151.69-60.06-148.568c-19.16-20.902-67.932-47.03-121.929-10.451 C133.788,58.269,123.283,150.928,140,173.531c-1.265,1.334-2.449,2.892-3.408,4.708c-2.001,3.728-3.096,8.321-3.089,13.615 c0,4.593,0.789,9.75,2.483,15.69c4.478,15.595,8.526,25.665,13.759,33.048c2.619,3.674,5.593,6.62,8.831,8.859 c1.967,1.375,4.008,2.422,6.069,3.348c5.899,27.352,20.27,44.594,30.272,55.732c0,2.674,0,4.946,0,6.879 c-4.423,0.123-10.921,0.844-11.214,4.096v24.978c-0.864,0.626-1.722,1.259-2.64,1.851c-5.137,3.368-10.989,6.218-15.894,7.94 c-6.375,2.259-15.554,4.77-25.597,8.315c-15.071,5.341-32.354,13.037-46.193,26.849c-13.874,13.765-23.726,33.939-23.644,61.632 c0,3.518,0.156,7.172,0.476,10.941c0.204,2.361,1.035,4.314,2.034,5.974c1.912,3.102,4.504,5.511,7.757,7.961 c5.688,4.219,13.595,8.369,23.862,12.465c30.721,12.206,82.684,23.569,152.139,23.59c56.433-0.007,101.361-7.532,132.666-16.88 c15.663-4.688,27.904-9.798,36.694-14.861c4.41-2.545,7.954-5.062,10.758-7.797c1.402-1.375,2.626-2.803,3.64-4.477 c1-1.66,1.83-3.613,2.034-5.967c0.313-3.776,0.47-7.41,0.47-10.92C442.279,432.644,437.992,417.539,430.903,405.469z M256.003,492.513c-6.409,0-11.594-5.184-11.594-11.594s5.184-11.594,11.594-11.594c6.41,0,11.594,5.185,11.594,11.594 S262.413,492.513,256.003,492.513z M256.003,444.17c-6.409,0-11.594-5.192-11.594-11.594s5.184-11.594,11.594-11.594 c6.41,0,11.594,5.192,11.594,11.594S262.413,444.17,256.003,444.17z M256.003,395.834c-6.409,0-11.594-5.192-11.594-11.594 c0-6.402,5.184-11.594,11.594-11.594c6.41,0,11.594,5.192,11.594,11.594C267.598,390.642,262.413,395.834,256.003,395.834z M301.754,302.652v2.946c0,13.33,0,16.86,0,24.256c-10.553,2.844-24.005,5.287-40.09,5.764v18.14h-11.322v-18.14 c-16.091-0.477-29.55-2.926-40.102-5.77c0-7.39,0-10.928,0-24.25v-2.946l-1.967-2.184c-10.451-11.642-24.596-27.094-29.502-54.555 l-0.776-4.396l-4.191-1.49c-2.667-0.953-4.702-1.926-6.478-3.158c-2.62-1.851-5.001-4.375-7.77-9.546 c-2.742-5.15-5.654-12.833-8.832-23.991c-1.395-4.872-1.892-8.662-1.892-11.479c0.007-3.273,0.632-5.178,1.272-6.389 c0.966-1.756,2.15-2.504,3.661-3.11c0.014-0.007,0.027-0.007,0.041-0.013c12.329,11.431,28.536,44.974,28.536,44.974l-3.484-55.739 c0,0,76.641-17.418,128.897-66.19c17.418,17.418,27.87,87.092,27.87,87.092l3.484,24.386l16.016-35.116h0.054 c0.612,0,2.906,0.266,4.457,1.3c0.877,0.565,1.592,1.218,2.245,2.416c0.64,1.211,1.266,3.116,1.272,6.382 c0.007,2.824-0.497,6.614-1.885,11.492c-4.225,14.881-8.015,23.542-11.485,28.346c-1.742,2.429-3.334,3.946-5.103,5.185 c-1.776,1.232-3.81,2.204-6.478,3.158l-4.192,1.49l-0.775,4.396c-4.906,27.461-19.065,42.914-29.516,54.555L301.754,302.652z" />
                                      </svg>
                                )}
                                {/* Name */}
                                <span>
                                  {user?.first_name} {user?.last_name}
                                </span>
                            </div>
                            <h2 className="bg-green-500 text-white p-1 rounded-b-lg">
                                {user?.role}
                            </h2>
                      
                            {/* <p className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">All-in-one platform</p>
                            <p className="mt-6 text-base leading-7 text-gray-600">Lorem ipsum, dolor sit amet consectetur adipisicing elit. Maiores impedit perferendis suscipit eaque, iste dolor cupiditate blanditiis ratione.</p> */}
                        </div>




                          <dl className="col-span-2 grid grid-cols-1 gap-x-8 gap-y-10 text-base leading-7 text-gray-600 sm:grid-cols-2 lg:gap-y-16">
                            
                              <div className="relative pl-9">
                                <dt className="font-semibold text-gray-900">
                                  <svg className="absolute top-1 left-0 h-5 w-5 text-indigo-500" x-description="Heroicon name: mini/check" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                                    <path fillRule="evenodd" d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z" clipRule="evenodd"></path>
                                  </svg>
                                  First Name
                                </dt>
                                <dd className="mt-2">{user?.first_name}</dd>
                              </div>
                            
                               <div className="relative pl-9">
                                <dt className="font-semibold text-gray-900">
                                  <svg className="absolute top-1 left-0 h-5 w-5 text-indigo-500" x-description="Heroicon name: mini/check" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                                    <path fillRule="evenodd" d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z" clipRule="evenodd"></path>
                                  </svg>
                                  Last Name
                                </dt>
                                <dd className="mt-2">{user?.last_name}</dd>
                              </div>

                              <div className="relative pl-9">
                                <dt className="font-semibold text-gray-900">
                                  <svg className="absolute top-1 left-0 h-5 w-5 text-indigo-500" x-description="Heroicon name: mini/check" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                                    <path fillRule="evenodd" d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z" clipRule="evenodd"></path>
                                  </svg>
                                  Date of birth
                                </dt>
                                <dd className="mt-2">{user?.date_of_birth || "Not provided"}</dd>
                              </div>
                            
                              <div className="relative pl-9">
                                <dt className="font-semibold text-gray-900">
                                  <svg className="absolute top-1 left-0 h-5 w-5 text-indigo-500" x-description="Heroicon name: mini/check" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                                    <path fillRule="evenodd" d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z" clipRule="evenodd"></path>
                                  </svg>
                                  Email Address
                                </dt>
                                <dd className="mt-2">{user?.email}</dd>
                              </div>
                            
                              <div className="relative pl-9">
                                <dt className="font-semibold text-gray-900">
                                  <svg className="absolute top-1 left-0 h-5 w-5 text-indigo-500" x-description="Heroicon name: mini/check" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                                    <path fillRule="evenodd" d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z" clipRule="evenodd"></path>
                                  </svg>
                                  Phone Number
                                </dt>
                                <dd className="mt-2">{user?.phone_number || "Not provided"}</dd>
                              </div>
                            
                              <div className="relative pl-9">
                                <dt className="font-semibold text-gray-900">
                                  <svg className="absolute top-1 left-0 h-5 w-5 text-indigo-500" x-description="Heroicon name: mini/check" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                                    <path fillRule="evenodd" d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z" clipRule="evenodd"></path>
                                  </svg>
                                  Country
                                </dt>
                                <dd className="mt-2">{user?.country || "Not provided"}</dd>
                              </div>
                            
                              <div className="relative pl-9">
                                <dt className="font-semibold text-gray-900">
                                  <svg className="absolute top-1 left-0 h-5 w-5 text-indigo-500" x-description="Heroicon name: mini/check" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                                  <path fillRule="evenodd" d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z" clipRule="evenodd"></path>
                                  </svg>
                                  Address
                                </dt>
                                <dd className="mt-2">{user?.address || "Not provided"}</dd>
                              </div>
                            
                              {/* <div className="relative pl-9">
                                <dt className="font-semibold text-gray-900">
                                  <svg className="absolute top-1 left-0 h-5 w-5 text-indigo-500" x-description="Heroicon name: mini/check" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                                    <path fillRule="evenodd" d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z" clipRule="evenodd"></path>
                                  </svg>
                                  Reporting
                                </dt>
                                <dd className="mt-2">Eos laudantium repellat sed architecto earum unde incidunt. Illum sit dolores voluptatem.</dd>
                              </div>
                            
                              <div className="relative pl-9">
                                <dt className="font-semibold text-gray-900">
                                  <svg className="absolute top-1 left-0 h-5 w-5 text-indigo-500" x-description="Heroicon name: mini/check" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                                    <path fillRule="evenodd" d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z" clipRule="evenodd"></path>
                                  </svg>
                                  Mobile app
                                </dt>
                                <dd className="mt-2">Nulla est saepe accusamus nostrum est est. Fugit voluptatum omnis quidem voluptatem.</dd>
                              </div> */}
                            
                          </dl>
                        </div>
                      </div>
                    </div>







                </div>
            </section>
        </>
    );
}