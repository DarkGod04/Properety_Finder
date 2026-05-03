import Link from 'next/link';

export default function NoteCheckEmail() {
    return (
            // <section className="flex justify-center items-center h-screen bg-gray-100 dark:bg-gray-900">
            //     <div className="max-w-md w-full p-8 bg-white dark:bg-gray-800 rounded-2xl shadow-lg text-center">
            //         <div className="flex justify-center mb-4">
            //             <span className="text-5xl">📬</span>
            //         </div>
            //         <h2 className="text-2xl font-semibold text-gray-800 dark:text-white mb-3">
            //             Check your email
            //         </h2>
            //         <p className="text-gray-600 dark:text-gray-300">
            //             We’ve sent you a link to reset your password.  
            //             Please open your inbox and click the link to continue.
            //         </p>
            //     </div>
            // </section>
        <section className="flex justify-center items-center h-screen bg-gray-100 dark:bg-gray-900">
            <div className="relative max-w-sm">
                <span className="absolute top-0 left-0 w-full h-full mt-1 ml-1 bg-green-500 rounded-lg"></span>
                <div className="relative h-full p-3 bg-white border-2 border-green-500 rounded-lg">
                    <div className="flex items-center -mt-1">
                        {/* <span className="text-5xl">📬</span> */}
                        
                        <svg  className="w-20 h-20 text-green-500" fill="#00c951" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"> <g id="Change_password"> <path d="M464.4326,147.54a9.8985,9.8985,0,0,0-17.56,9.1406,214.2638,214.2638,0,0,1-38.7686,251.42c-83.8564,83.8476-220.3154,83.874-304.207-.0088a9.8957,9.8957,0,0,0-16.8926,7.0049v56.9a9.8965,9.8965,0,0,0,19.793,0v-34.55A234.9509,234.9509,0,0,0,464.4326,147.54Z"></path> <path d="M103.8965,103.9022c83.8828-83.874,220.3418-83.8652,304.207-.0088a9.8906,9.8906,0,0,0,16.8926-6.9961v-56.9a9.8965,9.8965,0,0,0-19.793,0v34.55C313.0234-1.3556,176.0547,3.7509,89.9043,89.9012A233.9561,233.9561,0,0,0,47.5674,364.454a9.8985,9.8985,0,0,0,17.56-9.1406A214.2485,214.2485,0,0,1,103.8965,103.9022Z"></path> <path d="M126.4009,254.5555v109.44a27.08,27.08,0,0,0,27,27H358.5991a27.077,27.077,0,0,0,27-27v-109.44a27.0777,27.0777,0,0,0-27-27H153.4009A27.0805,27.0805,0,0,0,126.4009,254.5555ZM328,288.13a21.1465,21.1465,0,1,1-21.1465,21.1464A21.1667,21.1667,0,0,1,328,288.13Zm-72,0a21.1465,21.1465,0,1,1-21.1465,21.1464A21.1667,21.1667,0,0,1,256,288.13Zm-72,0a21.1465,21.1465,0,1,1-21.1465,21.1464A21.1667,21.1667,0,0,1,184,288.13Z"></path> <path d="M343.6533,207.756V171.7538a87.6533,87.6533,0,0,0-175.3066,0V207.756H188.14V171.7538a67.86,67.86,0,0,1,135.7208,0V207.756Z"></path> </g> </g></svg>
                        <h3 className="my-2 ml-3 text-lg text-gray-800">Password reset complete</h3>
                    </div>

                    <p className="my-2 text-gray-600">
                        Your password has been reset. You may go ahead and   
                            <Link href="/login">
                                <span className="text-xl no-underline text-green-900 hover:underline hover:text-blue-600"> 
                                      &nbsp; login &nbsp;
                                </span>
                            </Link>
                        now.
                    </p>
                    
                </div>
            </div>
        </section>
    );
}
