// src/app/sa/(dynamic_pages)/residential-properties-for-rent/page.js
import DynamicPropertiesClient from "../components/DynamicPropertiesClient";

export default function ResidentialRentPage() {
  return ( 
          <DynamicPropertiesClient 
              maintypeSlug="residential" 
              purposeSlug="rent" 
          />
        );
};
