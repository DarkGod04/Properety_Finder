// src/app/sa/(dynamic_pages)/residential-properties-for-sale/page.js  -- SSR
import DynamicPropertiesClient from "../components/DynamicPropertiesClient";

export default function ResidentialSalePage() {
    return (
            <DynamicPropertiesClient 
                maintypeSlug="residential" 
                purposeSlug="sale" 
            />
    );
}
