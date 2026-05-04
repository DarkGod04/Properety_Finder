// context/AuthContext.tsx
"use client";


import { createContext, useContext, useEffect, useState } from 'react';
import axiosInstance from "@/app/sa/lib/axios";

const API_URL = "http://127.0.0.1:8000";



interface RequestUserProfileData {

    id?: string;
    first_name?: string;
    last_name?: string;
    email?: string;
    role? : string;
   
    gender?: string;
    profile_picture?: string;
    phone_number?: string | null;
    contact_email?: string | null;
    country?: string | null;
    address?: string | null;
    date_of_birth?: string | null;
    developer_name?: string | null;
    broker_name?: string | null;
    agent_name?: string | null;
    bio?: string | null;
    website?: string | null;
    twitter?: string | null;
}

interface AuthContextType {
  user: RequestUserProfileData | null;
  setUser: (user: RequestUserProfileData | null) => void;
  loading: boolean;
}


const AuthContext = createContext<AuthContextType>({
  user: null,
  setUser: () => {},
  loading: true,
});


export const useAuth = () => useContext(AuthContext);



export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
      const [user, setUser] = useState<RequestUserProfileData | null>(null);
      const [loading, setLoading] = useState(true);


      // fetch user on load (if cookie exists)
      useEffect(() => {
          const RequestUserProfileData = async () => {
              try {
                  const res = await axiosInstance.get(`${API_URL}/users/request-user-profile/`, 
                      {
                          withCredentials: true, // IMPORTANT to include cookies 
                      }
                  );
                  // console.log('RequestUserProfileData-res=', res);
                  console.log('RequestUserProfileData-res.data=', res.data);
                  setUser(res.data); // assume backend returns user info
            
              } catch (err) {
                  console.log('RequestUserProfileData-error=',err);
                  setUser(null); // not logged in
              
              } finally {
                  setLoading(false); // ✅ important
              }
          };

          RequestUserProfileData();
          
      }, []);


      return (
          <AuthContext.Provider value={{ user, setUser, loading }}>
              {children}
          </AuthContext.Provider>
      );
};
