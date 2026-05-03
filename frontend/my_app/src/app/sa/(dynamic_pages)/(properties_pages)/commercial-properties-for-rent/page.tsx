// src/app/sa/(dynamic_pages)/commercial-properties-for-rent/page.js
import DynamicPropertiesClient from "../components/DynamicPropertiesClient";

export default function CommercialRentPage() {
  return( 
        <DynamicPropertiesClient 
            maintypeSlug="commercial" 
            purposeSlug="rent" 
        />
            
  );
}
