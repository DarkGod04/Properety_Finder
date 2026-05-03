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
                        <svg 
                            className="w-20 h-20 text-green-500"
                            viewBox="0 0 32 32" 
                            enable-background="new 0 0 32 32" 
                            id="_x3C_Layer_x3E_"
                            version="1.1" xmlSpace="preserve" 
                            xmlns="http://www.w3.org/2000/svg"
                            xmlnsXlink="http://www.w3.org/1999/xlink" 
                            fill="#00ff6e" 
                            stroke="#00ff6e"
                        >
                            <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
                            <g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g>
                                <g id="SVGRepo_iconCarrier"> 
                                    <g id="message_x2C__letter_x2C__mail_x2C__tick_x2C__e-mail_x2C__check"> 
                                        <g id="XMLID_2986_"> 
                                            <g id="XMLID_3882_"> 
                                                <line fill="none" id="XMLID_4293_" stroke="#00ff7b" strokeLinecap="round" strokeLinejoin="round" stroke-miterlimit="10" x1="26.5" x2="26.5" y1="15.8" y2="1.5"></line>
                                                <polyline fill="none" id="XMLID_4292_" points=" 26.5,1.5 5.5,1.5 5.5,15.8 " stroke="#00ff7b" strokeLinecap="round" strokeLinejoin="round" stroke-miterlimit="10"></polyline>
                                                <polyline fill="none" id="XMLID_4234_" points=" 21,20.111 29.5,13.5 29.5,30.5 2.5,30.5 2.5,13.5 11.054,20.153 " stroke="#00ff7b" strokeLinecap="round" strokeLinejoin="round" stroke-miterlimit="10"></polyline> 
                                                <polyline fill="none" id="XMLID_4233_" points=" 2.5,29 16,19.5 29.5,29 " stroke="#00ff7b" strokeLinecap="round" strokeLinejoin="round" stroke-miterlimit="10"></polyline> 
                                                <line fill="none" id="XMLID_4232_" stroke="#00ff7b" strokeLinecap="round" strokeLinejoin="round" stroke-miterlimit="10" x1="26.495" x2="29.5" y1="11.052" y2="13.5"></line>
                                                <line fill="none" id="XMLID_3935_" stroke="#00ff7b" strokeLinecap="round" strokeLinejoin="round" stroke-miterlimit="10" x1="2.5" x2="5.5" y1="13.5" y2="11.056"></line> 
                                                <path d=" M20.972,9.48c0.018,0.171,0.027,0.344,0.027,0.52c0,2.762-2.239,5-5,5s-5-2.238-5-5c0-2.761,2.239-5,5-5 c0.92,0,1.781,0.249,2.522,0.682" fill="none" id="XMLID_3934_" stroke="#00ff7b" strokeLinecap="round" strokeLinejoin="round" stroke-miterlimit="10"></path> 
                                                <polyline fill="none" id="XMLID_3883_" points=" 20.79,6.481 15.999,11.272 13.69,8.965 " stroke="#00ff7b" strokeLinecap="round" strokeLinejoin="round" stroke-miterlimit="10"></polyline>
                                            </g>
                                        </g>
                                        <g id="XMLID_2976_"> <g id="XMLID_2977_"> 
                                            <line fill="none" id="XMLID_2985_" stroke="#00c951" strokeLinecap="round" strokeLinejoin="round" stroke-miterlimit="5" x1="26.5" x2="26.5" y1="15.8" y2="1.5"></line>
                                            <polyline fill="none" id="XMLID_2984_" points=" 26.5,1.5 5.5,1.5 5.5,15.8 " stroke="#00c951" strokeLinecap="round" strokeLinejoin="round" stroke-miterlimit="5"></polyline>
                                            <polyline fill="none" id="XMLID_2983_" points=" 21,20.111 29.5,13.5 29.5,30.5 2.5,30.5 2.5,13.5 11.054,20.153 " stroke="#00c951" strokeLinecap="round" strokeLinejoin="round" stroke-miterlimit="5"></polyline> 
                                            <polyline fill="none" id="XMLID_2982_" points=" 2.5,29 16,19.5 29.5,29 " stroke="#00c951" strokeLinecap="round" strokeLinejoin="round" stroke-miterlimit="5"></polyline>
                                            <line fill="none" id="XMLID_2981_" stroke="#00c951" strokeLinecap="round" strokeLinejoin="round" stroke-miterlimit="5" x1="26.495" x2="29.5" y1="11.052" y2="13.5"></line>
                                            <line fill="none" id="XMLID_2980_" stroke="#00c951" strokeLinecap="round" strokeLinejoin="round" stroke-miterlimit="5" x1="2.5" x2="5.5" y1="13.5" y2="11.056"></line> 
                                            <path d=" M20.972,9.48c0.018,0.171,0.027,0.344,0.027,0.52c0,2.762-2.239,5-5,5s-5-2.238-5-5c0-2.761,2.239-5,5-5 c0.92,0,1.781,0.249,2.522,0.682" fill="none" id="XMLID_2979_" stroke="#00c951" strokeLinecap="round" strokeLinejoin="round" stroke-miterlimit="5"></path> 
                                            <polyline fill="none" id="XMLID_2978_" points=" 20.79,6.481 15.999,11.272 13.69,8.965 " stroke="#00c951" strokeLinecap="round" strokeLinejoin="round" stroke-miterlimit="5"></polyline> 
                                        </g> 
                                        </g>
                                    </g> 
                                </g>
                        </svg>
                        
                        <h3 className="my-2 ml-3 text-lg text-gray-800">Check your email</h3>
                    </div>

                    <p className="my-2 text-gray-600">
                        We’ve sent you a link to reset your password.  
                        Please open your inbox and click the link to continue.
                    </p>
                </div>
            </div>
        </section>
    );
}
