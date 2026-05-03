// src/app/utils/auth.js
import axiosInstance from "../lib/axios";
import axios from "axios";
const API_URL = "http://127.0.0.1:8000";
import { useAuth, } from "../context/AuthContext";





 ////////////////////////// Axios api //////////////////////



// register //////////////////////////////////////////////////////////
export const registerUser = async(first_name: any, last_name: any, email: any, password: any, password2: any, role: any, token: any = null) => {
        console.log('auth-first_name=', first_name);
        console.log('auth-last_name=', last_name);
        console.log('auth-email=', email);
        console.log('auth-password=', password);
        console.log('auth-password2=', password2);
        console.log('auth-role=', role);
        console.log('auth-token=', token);
    try {
        const payload: any = { first_name, last_name, email, password, password2, role };
        if (token) {
            payload.token = token;
        }
        const response = await axios.post(`${API_URL}/users/register/`,
            payload,
            {
                withCredentials:false,                   // avoid sending cookies
                headers: {
                    Authorization: undefined,            // explicitly remove auth headers if present
                },
            },        
        )
        console.log(response.data)
        return response.data;
    

    } catch (e) {
        if (e) {
        // Throw full error object for the component to handle
        console.log('auth-e=',e)
        throw e;
        
        } else {
        throw { error: "Something went wrong." };
        }
    }
}
    
// submit join request ///////////////////////////////////////////////
export const submitJoinRequest = async (full_name, email, role_requested, job_title, experience_years) => {
    try {
        const response = await axios.post(`${API_URL}/users/join-request/submit/`, {
            full_name,
            email,
            role_requested,
            job_title,
            experience_years
        }, {
            withCredentials: false,
            headers: { Authorization: undefined },
        });
        return response.data;
    } catch (e) {
        throw e;
    }
}
    



// login ////////////////////////////////////////////////////


export const loginUser = async (email, password) => {
    try {
        const response = await axios.post(
            `${API_URL}/users/login/`,   //endpoint
            {email,password},            // data
            {withCredentials: true}      // allow saving cookies (important!) 
        );
        console.log("auth-loginUser-response.data=",response.data);
        return response.data;
    
    } catch (e) {
        console.log("auth-e=",e);
        if (e.response && e.response.data) {
        // Throw full error object for the component to handle
        throw e;
        } else {
        throw { error: "Something went wrong." };
        }
    } 
}
    




// resend-confirmation-email ////////////////////////////////
export const handleResendEmail = async (email) => {
    try {
        const response = await axios.post(
            `${API_URL}/users/resend-confirm-email/`,  // endpoint 
            {email},                                   // data
            { withCredentials: true }                  // include cookies if needed
            );
            console.log("handleResendEmail-response.data=",response.data);
            return response.data;
            
    } catch (e) {
        if (e) {
            console.log("handleResendEmail-e=",e);    
            // Throw full error object for the component to handle
            throw e;
        } else {
            throw { error: "Something went wrong." };
        }
    } 
};





// logout ////////////////////////////////////////////////////
export const logoutUser = async (setUser: (user: any) => void) => {
   
    try {
            const response = await axiosInstance.post(
            "/users/logout/",          //endpoint
            null,                      // no data with this post
            { withCredentials: true }  // include cookies if needed 
            );
            // Clear context state
            setUser(null);
            console.log("User logged out successfully!");
    
        } catch (err: any) {
            console.error("Logout failed:", err.response?.data || err.message);
            throw new Error("Logout failed!");
        }
};




// getUserInfo = request user info ///////////////////////////////////
export const getUserInfo = async () => {
    try {
        const response = await axiosInstance.get(
            "/users/request-user/",            // endpoint 
            {withCredentials: true}           // include cookies if needed
        )
        console.log("getUserInfo-response.data=",response.data);
        return response.data;
    }
    catch (e) {
        throw new Error("Getting user failed!");
    }
    
}





// update-request-user-profile ////////////////////////////////////////////////////
//When uploading files in React with Axios, you must use FormData and not JSON.
export const updateRequestUserProfile = async (formData) => {
    try {
            const response = await axiosInstance.put(
            "/users/update-request-user-profile/",                   // endpoint 
            formData,
            {
                withCredentials: true,                               // include cookies if needed
                headers: { "Content-Type": "multipart/form-data" },  
            }
            );
            console.log("updateRequestUserProfile-response.data=", response.data);
            return response.data;
    } catch (e: any) {
            console.log("updateRequestUserProfile-e.response.data=", e.response?.data);
            throw e.response?.data || { detail: "Unknown error occurred" };
    }
};







// PasswordResetRequest //////////////////////////////////////////////////////////
export const passwordResetRequest = async(email) => {
        console.log('auth-passwordResetRequest-email=', email);
        
    try {
        const response = await axios.post(
            `${API_URL}/users/password-reset-request/`, //endpoint
            {email},                                    // data with this post              
            {
                withCredentials:false,                  // avoid sending cookies
                headers: {
                    Authorization: undefined,           // explicitly remove auth headers if present
                },
            },        
        )  
        console.log(response.data)
        return response.data;
    

    } catch (e) {
        if (e) {
        // Throw full error object for the component to handle
        console.log('auth-passwordResetRequest-e=',e)
        throw e;
        
        } else {
        throw { error: "Something went wrong." };
        }
    }
}
 