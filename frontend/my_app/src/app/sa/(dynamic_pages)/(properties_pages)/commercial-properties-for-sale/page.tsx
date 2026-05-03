// src/app/sa/(dynamic_pages)/commercial-properties-for-sale/page.js
import DynamicPropertiesClient from "../components/DynamicPropertiesClient";


export default function CommercialSalePage() {
  return( 
          <DynamicPropertiesClient 
              maintypeSlug="commercial" 
              purposeSlug="sale" 
          />   
        );
}
