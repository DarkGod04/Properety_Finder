// src/app/utils/property.js
import axiosInstance from "../lib/axios";
import axios from "axios";
const API_URL = "http://127.0.0.1:8000";
import { useAuth, } from "../context/AuthContext";






// addCountry //
export const addCountry = async(countryName , code) => {
        console.log('addCountry-countryName =', countryName );
        console.log('addCountry-code=', code);
    try {
        const response = await axiosInstance.post(
            "/property/create-country/",                  // endpoint
            {
                country_name:countryName ,                // data
                code:code 
            },
            {                          
                withCredentials:true,                     //  sending cookies
            },        
        )
        console.log("addCountry-response.data=",response.data)
        return response.data;
    

    } catch (e) {
        if (e) {
        // Throw full error object for the component to handle
        console.log('addCountry-e=',e)
        throw e;
        
        } else {
        throw { error: "Something went wrong." };
        }
    }
}



// getCountryCitiesList -- all cities list belong to one country //
export const getCountryCitiesList = async(selectedCountrySlug) => {
    try {
        const response = await axios.get(     
            `${API_URL}/property/${selectedCountrySlug}/cities/`,   // endpoint 
            { withCredentials:true },                           // sending cookies          
        )
        console.log("getCountryCitiesList-response.data=",response.data);
        return response.data;

    } catch (e) {
        if (e) {
        // Throw full error object for the component to handle
        console.log('getCountryCitiesList-e=',e)
        throw e;
        
        } else {
        throw { error: "Something went wrong." };
        }
    }
}


// getCountriesList -- all countries for main page  //
export const getCountriesList = async() => {
    try {
        const response = await axios.get(
            `${API_URL}/property/list-country/`,        // endpoint 
            { withCredentials:true },                  //  sending cookies          
        )
        console.log("getCountriesList-response.data=",response.data);
        return response.data;


    } catch (e) {
        if (e) {
        // Throw full error object for the component to handle
        console.log('getCountriesList-e=',e)
        throw e;
        
        } else {
        throw { error: "Something went wrong." };
        }
    }
}
    


// addCity //
export const addCity = async(selectedCountry, cityName) => {
        console.log('addCity-selectedCountry =', selectedCountry );
        console.log('addCity-cityName=', cityName);
    try {
        const response = await axiosInstance.post(
            "/property/create-city/",                  // endpoint
            {
                country:selectedCountry,               // data --"id of selected country",
                city_name:cityName                     // data --"city name",
            },                 
            {
                 withCredentials:true                  // sending cookies   
            },                         
        )
        console.log("addCity-response.data=",response.data)
        return response.data;
    
    } catch (e) {
        if (e) {
            // Throw full error object for the component to handle
            console.log('addCity-e=',e)
            throw e;
        
        } else {
            throw { error: "Something went wrong." };
        }
    }
}
    




// addMainTypeName //
export const addMainType = async(maintypeName) => {
        console.log('addMainType-maintypeName =', maintypeName );
    try {
        const response = await axiosInstance.post(
            "/property/create-main-type/",             // endpoint
            {
                maintype_name:maintypeName,               // data --"maintypeName",
            },                 
            {
                 withCredentials:true                  // sending cookies   
            },                         
        )
        console.log("addMainType-response.data=",response.data)
        return response.data;
    
    } catch (e) {
        if (e) {
            // Throw full error object for the component to handle
            console.log('addMainType-e=',e)
            throw e;
        
        } else {
            throw { error: "Something went wrong." };
        }
    }
}
    



// getMainTypesList //
export const getMainTypesList = async() => {
    try {
        const response = await axios.get(
            `${API_URL}/property/list-main-type/`,        // endpoint 
            { withCredentials:true },                  //  sending cookies          
        )
        console.log("getMainTypesList-response.data=",response.data);
        return response.data;


    } catch (e) {
        if (e) {
        // Throw full error object for the component to handle
        console.log('getMainTypesList-e=',e)
        throw e;
        
        } else {
        throw { error: "Something went wrong." };
        }
    }
}
    


// getMainTypeSubTypesList -- all Sub TypesList belong to one MainType //
export const getMainTypeSubTypesList = async(selectedMainType) => {
    try {
        const response = await axios.get(     
            `${API_URL}/property/${selectedMainType}/sub-types/`,   // endpoint 
            { withCredentials:true },                              // sending cookies          
        )
        console.log("getMainTypeSubTypesList-response.data=",response.data);
        return response.data;

    } catch (e) {
        if (e) {
        // Throw full error object for the component to handle
        console.log('getMainTypeSubTypesList-e=',e)
        throw e;
        
        } else {
        throw { error: "Something went wrong." };
        }
    }
}





// addSubType //
export const addSubType = async(selectedMaintype, subTypeName) => {
        console.log('addSubType-selectedMaintype =', selectedMaintype );
        console.log('addSubType-subTypeName=', subTypeName);
    try {
        const response = await axiosInstance.post(
            "/property/create-sub-types/",                  // endpoint
            {
                main_type   :selectedMaintype,               // data --"id of selected main type",
                subtype_name:subTypeName                     // data --"sub type name",
            },                 
            {
                 withCredentials:true                       // sending cookies   
            },                         
        )
        console.log("addSubType-response.data=",response.data)
        return response.data;
    
    } catch (e) {
        if (e) {
            // Throw full error object for the component to handle
            console.log('addCity-e=',e)
            throw e;
        
        } else {
            throw { error: "Something went wrong." };
        }
    }
}
    




// addPurpose //
export const addPurpose = async(purposeName) => {
        console.log('addPurpose-purposeName=', purposeName);
    try {
        const response = await axiosInstance.post(
            "/property/create-purpose/",                  // endpoint
            {
                purpose_name:purposeName                // data --"purpose_name",
            },                 
            {
                 withCredentials:true                  // sending cookies   
            },                         
        )
        console.log("addPurpose-response.data=",response.data)
        return response.data;
    
    } catch (e) {
        if (e) {
            // Throw full error object for the component to handle
            console.log('addPurpose-e=',e)
            throw e;
        
        } else {
            throw { error: "Something went wrong." };
        }
    }
}

 
// getPurposeList  //
export const getPurposeList = async() => {
    try {
        const response = await axios.get(
            `${API_URL}/property/list-purposes/`,        // endpoint 
            { withCredentials:true },                  //  sending cookies          
        )
        console.log("getPurposeList-response.data=",response.data);
        return response.data;


    } catch (e) {
        if (e) {
        // Throw full error object for the component to handle
        console.log('getPurposeList-e=',e)
        throw e;
        
        } else {
        throw { error: "Something went wrong." };
        }
    }
}





// addAmenity //
export const addAmenity = async(amenityName) => {
        console.log('addAmenity-countryName =', amenityName );
    try {
        const response = await axiosInstance.post(
            "/property/create-amenity/",                  // endpoint
            {
                amenity_name:amenityName ,                // data
            },
            {                          
                withCredentials:true,                     //  sending cookies
            },        
        )
        console.log("addAmenity-response.data=",response.data)
        return response.data;
    

    } catch (e) {
        if (e) {
        // Throw full error object for the component to handle
        console.log('addAmenity-e=',e)
        throw e;
        
        } else {
        throw { error: "Something went wrong." };
        }
    }
}


// getAmenitiesList //
export const getAmenitiesList = async() => {
    try {
        const response = await axios.get(
            `${API_URL}/property/list-amenity/`,        // endpoint 
            { withCredentials:true },                  //  sending cookies          
        )
        console.log("getAmenitiesList-response.data=",response.data);
        return response.data;


    } catch (e) {
        if (e) {
        // Throw full error object for the component to handle
        console.log('getAmenitiesList-e=',e)
        throw e;
        
        } else {
        throw { error: "Something went wrong." };
        }
    }
}



// ////////////////////////////////[ Property  ]////////////////////////////////////////////////

// addProperty -- only data without images //
export const addProperty = async(formData) => {
    try {
        const response = await axiosInstance.post(
            "/property/create-property-data/",             // endpoint
            formData ,                                     // data
            { withCredentials:true },                      // sending cookies -- since we use HTTP-only cookies              
                                             
        );
        console.log("addProperty-response.data=",response.data);
        return response.data;
    

    } catch (e) {
        if (e) {
        // Throw full error object for the component to handle
        console.log('addProperty-e=',e)
        throw e;
        
        } else {
        throw { error: "Something went wrong." };
        }
    }
};



// uploadPropertyImages -- upload images for a new property i created -- use proprty.id  //
export const uploadPropertyImages = async (propertyId:string, formData:FormData) => {
    try { 
        const response = await axiosInstance.post(
            `/property/${propertyId}/upload-images/`,                  // endpoint
            formData,                                                  // data as formData because there is a file inside the sending data
            {
                headers: { "Content-Type": "multipart/form-data" },    // since there is a file inside the sending data
                withCredentials: true,                                 // since you're using cookies
            }
        );
        console.log("uploadPropertyImages-response.data=",response.data);
        return response.data;
  

    } catch (e) {
        if (e) {
        // Throw full error object for the component to handle
        console.log('uploadPropertyImages-e=',e)
        throw e;
        
        } else {
        throw { error: "Something went wrong." };
        }
    }
};



// List all property in saudi arabia only 
 export const listPropertyByCountry  = async() => {
    try {
        const response = await axios.get(
            `${API_URL}/property/list-purposes/`,        // endpoint 
            { withCredentials:true },                  //  sending cookies          
        )
        console.log("getPurposeList-response.data=",response.data);
        return response.data;


    } catch (e) {
        if (e) {
        // Throw full error object for the component to handle
        console.log('getPurposeList-e=',e)
        throw e;
        
        } else {
        throw { error: "Something went wrong." };
        }
    }
}